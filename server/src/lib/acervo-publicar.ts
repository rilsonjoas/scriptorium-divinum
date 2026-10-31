import type { Manifesto } from './acervo-manifesto.js';

/**
 * `acervo:publicar`: gera o seed que publica um texto do acervo e atualiza o manifesto,
 * para que publicar seja UM caminho só (e o PR mostre as duas coisas juntas).
 * Lógica pura (sem arquivo, sem banco): a leitura e a escrita ficam em scripts/acervo-publicar.ts.
 *
 * Não inventa metadado: título, autor e categorias são obrigatórios e vêm de quem publica.
 * O seed só INSERE (ON CONFLICT (slug) DO NOTHING), como os demais.
 */
export interface PedidoPublicar {
  /** nome do arquivo em server/texts, sem `.md` */
  arquivo: string;
  /** endereço da obra; padrão = o nome do arquivo */
  slug?: string | undefined;
  titulo: string;
  tituloOriginal?: string | undefined;
  autorSlug: string;
  autorNome: string;
  anoOriginal?: string | undefined;
  categorias: string[];
  tags?: string[] | undefined;
  descricao?: string | undefined;
  tradutor?: string | undefined;
  licenca?: string | undefined;
  atribuicao?: string | undefined;
  /** o autor atestou a revisão humana: grava human_review_approved_at */
  revisado?: boolean | undefined;
}

export const DESCRICAO_PADRAO = 'Texto integral em português, traduzido por inteligência artificial.';
export const TRADUTOR_PADRAO = 'Scriptorium Divinum (tradução por IA)';
export const LICENCA_PADRAO = 'cc-by-sa-4.0';
export const ATRIBUICAO_PADRAO =
  'Tradução gerada por IA a partir de obra em domínio público. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.';

const SLUG_VALIDO = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const slugDe = (p: PedidoPublicar) => p.slug ?? p.arquivo;
const texto = (s: string) => `'${s.replace(/'/g, "''")}'`;
const textoOuNulo = (s: string | undefined) => (s?.trim() ? texto(s.trim()) : 'NULL');
const lista = (itens: string[]) => (itens.length ? `ARRAY[${itens.map(texto).join(', ')}]` : 'ARRAY[]::text[]');
const umaLinha = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Erros que impedem de publicar (vazio = pode). `idioma: null` = o arquivo não existe. */
export function validarPedido(
  p: PedidoPublicar,
  ctx: { manifesto: Manifesto; idioma: 'Português' | 'Inglês' | null },
): string[] {
  if (ctx.idioma === null) return [`o arquivo server/texts/${p.arquivo}.md não existe`];
  const erros: string[] = [];
  const entrada = ctx.manifesto.arquivos[p.arquivo];
  if (!entrada) {
    erros.push('o arquivo não tem entrada no manifesto (server/texts/MANIFESTO.json): declare o estado antes');
  } else if (entrada.estado === 'publicada') {
    erros.push("o arquivo já está 'publicada' no manifesto");
  }
  const idioma = entrada?.idioma ?? ctx.idioma;
  if (idioma !== 'Português') erros.push('o texto não está em português: o site publica só em português');
  if (!p.titulo?.trim()) erros.push('título é obrigatório (--titulo)');
  if (!p.autorSlug?.trim() || !p.autorNome?.trim()) erros.push('autor é obrigatório: --autor-slug e --autor-nome');
  if (!p.categorias?.length) erros.push('ao menos uma categoria é obrigatória (--categorias "A,B")');
  if (!SLUG_VALIDO.test(slugDe(p))) erros.push(`slug inválido "${slugDe(p)}": use minúsculas, números e hífens`);
  return erros;
}

export function nomeDoSeed(p: PedidoPublicar, dataISO: string): string {
  return `add_${slugDe(p)}_${dataISO}.sql`;
}

export function gerarSeed(p: PedidoPublicar, dataISO: string): string {
  const slug = slugDe(p);
  const revisao = p.revisado ? '  human_review_approved_at,\n' : '';
  const revisaoValor = p.revisado ? '  NOW(),\n' : '';
  return `-- Publica '${umaLinha(p.titulo)}' (server/texts/${p.arquivo}.md).
-- Gerado por \`pnpm --filter server acervo:publicar\` em ${dataISO}.
-- Idempotente: só INSERE (ON CONFLICT (slug) DO NOTHING). Nada já publicado é alterado.
BEGIN;

INSERT INTO authors (slug, name)
VALUES (${texto(p.autorSlug)}, ${texto(p.autorNome)})
ON CONFLICT (slug) DO NOTHING;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  categories, tags, online_read_path,
  featured, published, translation_is_ai,
${revisao}  license_type, attribution_text
)
SELECT
  ${texto(p.titulo)},
  a.id,
  'Português',
  ${texto(p.descricao ?? DESCRICAO_PADRAO)},
  ${texto(slug)},
  ${textoOuNulo(p.tituloOriginal)},
  ${textoOuNulo(p.anoOriginal)},
  2026,
  ${texto(p.tradutor ?? TRADUTOR_PADRAO)},
  ${lista(p.categorias)},
  ${lista(p.tags ?? [])},
  ${texto(`/texts/${p.arquivo}.md`)},
  false,
  true,
  true,
${revisaoValor}  ${texto(p.licenca ?? LICENCA_PADRAO)},
  ${texto(p.atribuicao ?? ATRIBUICAO_PADRAO)}
FROM authors a
WHERE a.slug = ${texto(p.autorSlug)}
ON CONFLICT (slug) DO NOTHING;

COMMIT;
`;
}

/** Cópia do manifesto com o arquivo `publicada` (descarta motivo, dono e desde). */
export function marcarPublicada(m: Manifesto, arquivo: string): Manifesto {
  const antigo = m.arquivos[arquivo];
  const novo = { estado: 'publicada' as const, ...(antigo?.idioma ? { idioma: antigo.idioma } : {}) };
  return { ...m, arquivos: { ...m.arquivos, [arquivo]: novo } };
}
