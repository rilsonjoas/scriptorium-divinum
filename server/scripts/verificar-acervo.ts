/**
 * Verificador de saúde do acervo (docs/GERENCIAR-ACERVO.md).
 *
 * Cruza os arquivos de `server/texts/` com o banco e aponta o que deixaria o
 * site com cara de amador ou quebrado: texto em inglês dentro de obra em
 * português, lixo de digitalização, idioma errado, link para obra oculta,
 * autor com nome de título e assim por diante.
 *
 * Uso:
 *   pnpm --filter server acervo:verificar                 # só os arquivos
 *   DATABASE_URL=postgres://... pnpm --filter server acervo:verificar
 *
 * Saída 1 se houver ERRO em obra PUBLICADA (serve de portão antes do deploy).
 * AVISO e INFO nunca falham.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { grafiasDivergentes } from '../src/lib/quote-authors.js';

const TEXTS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../texts');

type Nivel = 'ERRO' | 'AVISO' | 'INFO';
interface Achado {
  nivel: Nivel;
  arquivo: string;
  mensagem: string;
  publicada?: boolean;
}

// ---------------------------------------------------------------- análise de arquivo
const EN = /\b(the|and|that|which|shall|with|was|were|have|has|his|her|their|from|this|these|thou|thee|hath|unto)\b/gi;
const PT = /\b(que|não|uma|para|com|como|mais|dos|das|pelo|pela|são|está|isso|também|seu|sua|ele|ela)\b/gi;
const ANUNCIO = /\b(48mo|32mo|18mo|12mo|8vo|Super Royal|Demy)\b/g;
const SUPERLATIVO = /obra-prima|inigual[aá]vel|incompar[aá]vel|insuper[aá]vel|magistral/gi;
const INDICE_NUMERICO = /^(\s*\d{1,3}\s+){12,}/;

const conta = (re: RegExp, s: string) => (s.match(re) ?? []).length;

export interface AnaliseTexto {
  palavras: number;
  idioma: 'Português' | 'Inglês';
  paragrafosIngles: number;
  palavrasIngles: number;
  titulos: number;
  anuncios: number;
  linhasIndice: number;
  marcadoresNota: number;
  paragrafosRepetidos: number;
  superlativosNoInicio: number;
  temFrontmatter: boolean;
}

export function analisarTexto(conteudo: string): AnaliseTexto {
  const m = conteudo.match(/^---\n([\s\S]*?)\n---\n/);
  const corpo = m ? conteudo.slice(m[0].length) : conteudo;
  const amostra = corpo.slice(0, 200_000);
  const idioma = conta(EN, amostra) > conta(PT, amostra) ? 'Inglês' : 'Português';
  const paragrafos = corpo.split(/\n\s*\n/).filter((p) => p.length > 100);
  const ingles = paragrafos.filter((p) => conta(EN, p) > 2 * conta(PT, p) + 3);
  const vistos = new Map<string, number>();
  for (const p of paragrafos) vistos.set(p.trim(), (vistos.get(p.trim()) ?? 0) + 1);
  return {
    palavras: corpo.split(/\s+/).filter(Boolean).length,
    idioma,
    paragrafosIngles: ingles.length,
    palavrasIngles: ingles.reduce((n, p) => n + p.split(/\s+/).length, 0),
    titulos: (corpo.match(/^#{1,3} /gm) ?? []).length,
    anuncios: conta(ANUNCIO, corpo),
    linhasIndice: corpo.split('\n').filter((l) => INDICE_NUMERICO.test(l)).length,
    marcadoresNota: conta(/\[\d{1,4}\]/g, corpo),
    paragrafosRepetidos: [...vistos.values()].filter((n) => n > 1).reduce((a, n) => a + n - 1, 0),
    superlativosNoInicio: conta(SUPERLATIVO, corpo.slice(0, 4000)),
    temFrontmatter: Boolean(m) || /^#\s*Proveni[êe]ncia/m.test(corpo),
  };
}

function achadosDoTexto(arquivo: string, a: AnaliseTexto, publicada: boolean | undefined): Achado[] {
  const out: Achado[] = [];
  const add = (nivel: Nivel, mensagem: string) => out.push({ nivel, arquivo, mensagem, publicada });
  const portugues = a.idioma === 'Português';
  const pctIngles = a.palavras ? (100 * a.palavrasIngles) / a.palavras : 0;
  if (portugues && pctIngles > 5) add('ERRO', `${pctIngles.toFixed(0)}% das palavras estão em inglês (${a.paragrafosIngles} parágrafos): tradução incompleta ou texto misturado`);
  else if (portugues && a.paragrafosIngles >= 3) add('AVISO', `${a.paragrafosIngles} parágrafos em inglês dentro de texto em português`);
  if (a.anuncios >= 3) add('AVISO', `${a.anuncios} marcas de catálogo/anúncio de editor (48mo, Super Royal...)`);
  if (a.linhasIndice > 0) add('AVISO', `${a.linhasIndice} linha(s) de números de página soltos`);
  if (a.marcadoresNota > 200) add('INFO', `${a.marcadoresNota} marcadores de nota de rodapé soltos ([123]); ligar à nota ou remover`);
  if (a.paragrafosRepetidos >= 5) add('AVISO', `${a.paragrafosRepetidos} parágrafos repetidos`);
  if (a.palavras > 20_000 && a.titulos <= 3) add('AVISO', `${a.palavras} palavras e só ${a.titulos} título(s): o sumário do leitor fica vazio`);
  if (a.superlativosNoInicio > 0) add('INFO', `tom promocional no ensaio de abertura (${a.superlativosNoInicio} superlativo(s) sem fonte)`);
  if (!a.temFrontmatter) add('AVISO', 'sem frontmatter nem bloco de proveniência');
  return out;
}

// ---------------------------------------------------------------- execução
async function main() {
  const achados: Achado[] = [];
  const arquivos = readdirSync(TEXTS_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md');
  const analises = new Map<string, AnaliseTexto>();
  for (const f of arquivos) analises.set(f, analisarTexto(readFileSync(path.join(TEXTS_DIR, f), 'utf-8')));

  const url = process.env.DATABASE_URL;
  const publicadaPorArquivo = new Map<string, boolean>();

  if (url) {
    const sql = postgres(url, { max: 1 });
    try {
      const livros = await sql<
        { slug: string; title: string; language: string | null; published: boolean; path: string | null; ai: boolean | null; attr: string | null; rel: string | null; autor: string | null }[]
      >`select b.slug, b.title, b.language, b.published, b.online_read_path as path, b.translation_is_ai as ai,
               b.attribution_text as attr, b.related_edition_slug as rel, a.name as autor
        from books b left join authors a on a.id = b.author_id`;
      const porSlug = new Map(livros.map((l) => [l.slug, l]));
      const porArquivo = new Map<string, string[]>();

      for (const l of livros) {
        const arq = l.path ? path.basename(l.path) : '';
        if (arq) {
          porArquivo.set(arq, [...(porArquivo.get(arq) ?? []), l.slug]);
          publicadaPorArquivo.set(arq, (publicadaPorArquivo.get(arq) ?? false) || l.published);
        }
        const add = (nivel: Nivel, mensagem: string) => achados.push({ nivel, arquivo: l.slug, mensagem, publicada: l.published });
        if (l.published && (!arq || !existsSync(path.join(TEXTS_DIR, arq)))) add('AVISO', 'publicada sem arquivo de texto (a API não a lista)');
        const an = arq ? analises.get(arq) : undefined;
        const idiomaBanco = l.language === 'English' ? 'Inglês' : l.language;
        if (l.language === 'English') add('INFO', 'rótulo de idioma "English": unificar para "Inglês"');
        if (an && idiomaBanco && idiomaBanco !== an.idioma && idiomaBanco !== 'Latim') {
          add('ERRO', `idioma no banco é "${l.language}" mas o texto está em ${an.idioma}`);
        }
        if (l.published && l.ai && !l.attr) add('ERRO', 'tradução por IA publicada sem texto de atribuição');
        if (l.ai && l.attr && /a partir de obra em domínio público/.test(l.attr)) {
          add('INFO', 'edição-fonte não nomeada na atribuição (auditar; ver docs/PROVENIENCIA-ACERVO.md)');
        }
        if (l.rel) {
          const alvo = porSlug.get(l.rel);
          if (!alvo) add('ERRO', `edição vinculada "${l.rel}" não existe`);
          else if (alvo.rel !== l.slug) add('AVISO', `vínculo não recíproco com "${l.rel}"`);
          else if (l.published && !alvo.published) add('INFO', `edição vinculada "${l.rel}" está oculta (a API esconde o botão)`);
        }
      }
      for (const [arq, slugs] of porArquivo) {
        if (slugs.length > 1) achados.push({ nivel: 'ERRO', arquivo: arq, mensagem: `servido por mais de uma obra: ${slugs.join(', ')}`, publicada: true });
      }
      for (const f of arquivos) {
        if (!porArquivo.has(f)) achados.push({ nivel: 'INFO', arquivo: f, mensagem: 'arquivo sem obra no catálogo (aguardando revisão ou sobra)' });
      }

      const autores = await sql<{ slug: string; name: string; n: number }[]>`
        select a.slug, a.name, count(b.id)::int as n from authors a left join books b on b.author_id = a.id group by a.slug, a.name`;
      for (const a of autores) {
        if (/^#|^\d+\.|^Cap[ií]tulo/i.test(a.name) || a.name.split(' ').length > 8) {
          achados.push({ nivel: 'ERRO', arquivo: `autor:${a.slug}`, mensagem: `nome de autor parece título ou cabeçalho: "${a.name}"`, publicada: true });
        }
        if (a.n === 0) achados.push({ nivel: 'INFO', arquivo: `autor:${a.slug}`, mensagem: 'autor sem nenhuma obra' });
      }

      // Só as citações ATIVAS entram nestes avisos (item oculto com link quebrado não é problema público).
      // `quotes.author` é texto livre: o mesmo autor escrito de dois jeitos (`C.S. Lewis` e `C. S. Lewis`)
      // vira dois autores na vitrine. O filtro da API já os une; aqui se aponta o dado a corrigir.
      const autoresDeCitacao = await sql<{ author: string }[]>`select distinct author from quotes where status = 'ativa'`;
      for (const g of grafiasDivergentes(autoresDeCitacao.map((r) => r.author))) {
        achados.push({ nivel: 'AVISO', arquivo: `citação-autor:${g.chave}`, mensagem: `mesmo autor escrito de jeitos diferentes nas citações: ${g.grafias.map((x) => `"${x}"`).join(', ')}`, publicada: true });
      }
      const [{ n: semVerificacao }] = await sql<{ n: number }[]>`select count(*)::int as n from quotes where status = 'ativa' and verificado_em is null`;
      if (semVerificacao > 0) {
        achados.push({ nivel: 'INFO', arquivo: 'citações', mensagem: `${semVerificacao} citação(ões) sem verificação de fonte registrada (verificado_em vazio; ver docs/PROTOCOLO-VERIFICACAO-DE-CITACOES.md)` });
      }

      const citacoes = await sql<{ url: string }[]>`select distinct scriptorium_url as url from quotes where status = 'ativa' and scriptorium_url is not null`;
      for (const c of citacoes) {
        const slug = c.url.replace(/\/$/, '').split('/').pop() ?? '';
        const l = porSlug.get(slug);
        if (!l) achados.push({ nivel: 'AVISO', arquivo: `citação→${slug}`, mensagem: 'link de citação para obra que não existe', publicada: true });
        else if (!l.published) achados.push({ nivel: 'AVISO', arquivo: `citação→${slug}`, mensagem: 'link de citação para obra oculta (404 no site)', publicada: true });
      }
    } finally {
      await sql.end();
    }
  } else {
    console.log('(sem DATABASE_URL: só a análise dos arquivos de texto)\n');
  }

  for (const [f, a] of analises) {
    const pub = url ? publicadaPorArquivo.get(f) ?? false : undefined;
    achados.push(...achadosDoTexto(f, a, pub));
  }

  // Erro em obra oculta não derruba o portão; em publicada (ou sem banco) sim.
  const bloqueantes = achados.filter((x) => x.nivel === 'ERRO' && x.publicada !== false);
  const ordem: Record<Nivel, number> = { ERRO: 0, AVISO: 1, INFO: 2 };
  achados.sort((x, y) => ordem[x.nivel] - ordem[y.nivel] || x.arquivo.localeCompare(y.arquivo));
  for (const x of achados) {
    const estado = x.publicada === undefined ? '' : x.publicada ? ' [publicada]' : ' [oculta]';
    console.log(`${x.nivel.padEnd(5)} ${x.arquivo}${estado}: ${x.mensagem}`);
  }
  const resumo = (n: Nivel) => achados.filter((x) => x.nivel === n).length;
  console.log(`\n${arquivos.length} textos | ${resumo('ERRO')} erro(s) (${bloqueantes.length} em obra publicada) | ${resumo('AVISO')} aviso(s) | ${resumo('INFO')} info`);
  if (bloqueantes.length > 0) {
    console.error('\nFalhou: há erro em obra publicada. Corrija, oculte a obra no painel, ou registre a exceção em docs/GERENCIAR-ACERVO.md.');
    process.exit(1);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((e) => {
    console.error(e);
    process.exit(2);
  });
}
