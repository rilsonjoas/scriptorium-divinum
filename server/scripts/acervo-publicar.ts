/**
 * Publica um texto do acervo: gera o seed e atualiza o manifesto, num comando só.
 * (docs/GERENCIAR-ACERVO.md, "Manifesto do acervo"; DECISOES 2026-10-30, etapa 3.)
 *
 * Por padrão só MOSTRA o que faria (validação, qualidade, seed, mudança no manifesto).
 * Grava apenas com --gravar. Não inventa metadado: título, autor e categorias são seus.
 *
 *   pnpm --filter server acervo:publicar <arquivo-sem-.md> \
 *     --titulo "Título" --autor-slug anselmo-de-cantuaria --autor-nome "Santo Anselmo de Cantuária" \
 *     --categorias "Escolástica & Mística Medieval,Tratados & Sumas Teológicas" \
 *     [--titulo-original "..."] [--ano-original 1078] [--tags a,b] [--descricao "..."] \
 *     [--slug outro-slug] [--revisado] [--data AAAA-MM-DD] [--gravar]
 *
 * --revisado: o autor atesta que revisou o texto (grava human_review_approved_at).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { analisarTexto, achadosDoTexto } from './verificar-acervo.js';
import type { Manifesto } from '../src/lib/acervo-manifesto.js';
import { gerarSeed, marcarPublicada, nomeDoSeed, validarPedido, type PedidoPublicar } from '../src/lib/acervo-publicar.js';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEXTS = path.join(RAIZ, 'texts');
const SEEDS = path.join(RAIZ, 'src/db/seeds');
const lista = (s?: string) => (s ? s.split(',').map((x) => x.trim()).filter(Boolean) : []);

function main(): number {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      titulo: { type: 'string' }, 'titulo-original': { type: 'string' },
      'autor-slug': { type: 'string' }, 'autor-nome': { type: 'string' },
      'ano-original': { type: 'string' }, categorias: { type: 'string' }, tags: { type: 'string' },
      descricao: { type: 'string' }, slug: { type: 'string' }, tradutor: { type: 'string' },
      licenca: { type: 'string' }, atribuicao: { type: 'string' },
      revisado: { type: 'boolean' }, gravar: { type: 'boolean' }, data: { type: 'string' },
    },
  });
  const arquivo = (positionals[0] ?? '').replace(/\.md$/, '');
  if (!arquivo) {
    console.error('Uso: acervo:publicar <arquivo-sem-.md> --titulo ... --autor-slug ... --autor-nome ... --categorias "A,B" [--gravar]');
    return 2;
  }

  const pedido: PedidoPublicar = {
    arquivo,
    slug: values.slug,
    titulo: values.titulo ?? '',
    tituloOriginal: values['titulo-original'],
    autorSlug: values['autor-slug'] ?? '',
    autorNome: values['autor-nome'] ?? '',
    anoOriginal: values['ano-original'],
    categorias: lista(values.categorias),
    tags: lista(values.tags),
    descricao: values.descricao,
    tradutor: values.tradutor,
    licenca: values.licenca,
    atribuicao: values.atribuicao,
    revisado: values.revisado,
  };

  const caminhoTexto = path.join(TEXTS, `${arquivo}.md`);
  const caminhoManifesto = path.join(TEXTS, 'MANIFESTO.json');
  const manifesto = JSON.parse(readFileSync(caminhoManifesto, 'utf-8')) as Manifesto;
  const analise = existsSync(caminhoTexto) ? analisarTexto(readFileSync(caminhoTexto, 'utf-8')) : null;

  const erros = validarPedido(pedido, { manifesto, idioma: analise ? analise.idioma : null });
  const qualidade = analise ? achadosDoTexto(`${arquivo}.md`, analise, undefined) : [];
  for (const q of qualidade.filter((x) => x.nivel === 'ERRO')) erros.push(`qualidade do texto: ${q.mensagem}`);
  if (erros.length) {
    console.error('Não dá para publicar:\n' + erros.map((e) => `  - ${e}`).join('\n'));
    return 1;
  }

  const dataISO = values.data ?? new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
  const seed = gerarSeed(pedido, dataISO);
  const arquivoSeed = path.join(SEEDS, nomeDoSeed(pedido, dataISO));
  if (existsSync(arquivoSeed)) {
    console.error(`Já existe ${path.relative(RAIZ, arquivoSeed)}: apague-o ou use --data/--slug diferente.`);
    return 1;
  }

  console.log(`Texto: ${arquivo}.md | ${analise!.palavras} palavras | ${analise!.idioma}`);
  for (const q of qualidade) console.log(`  ${q.nivel}: ${q.mensagem}`);
  console.log(`\nManifesto: ${arquivo}: ${manifesto.arquivos[arquivo]!.estado} -> publicada`);
  console.log(`Seed: ${path.relative(RAIZ, arquivoSeed)}\n\n${seed}`);

  if (!values.gravar) {
    console.log('(simulação: nada foi gravado; repita com --gravar)');
    return 0;
  }
  writeFileSync(arquivoSeed, seed);
  writeFileSync(caminhoManifesto, JSON.stringify(marcarPublicada(manifesto, arquivo), null, 2) + '\n');
  console.log(`Gravado: ${path.relative(RAIZ, arquivoSeed)} e MANIFESTO.json.`);
  console.log('Próximo passo: valide o seed num Postgres de teste, abra o PR; o CI confere o manifesto e o deploy aplica o seed.');
  return 0;
}

process.exit(main());
