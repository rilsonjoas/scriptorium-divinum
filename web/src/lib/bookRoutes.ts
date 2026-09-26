/**
 * Rotas de obra — slug em vez de UUID.
 *
 * Bloco B (2026-09-25): os cards do catálogo, o hero, o header e o
 * admin apontavam para `/livros/<uuid>`, o que produz URLs que não
 * dizem nada e mudam se o banco for reescrito. A API já resolve por
 * slug **e** por id (verificado: `/api/v1/books/confissoes` → 200),
 * então a mudança é só de montagem de link.
 *
 * Regra: slug quando existe, id como último recurso (obra recém-criada
 * antes de o slug ser gerado, ou registro legado sem slug).
 */

type RouteableBook = { slug?: string | null; id: string };

export function bookPath(book: RouteableBook): string {
  return `/livros/${book.slug || book.id}`;
}

export function readPath(book: RouteableBook): string {
  return `/ler/${book.slug || book.id}`;
}

export function authorPath(slug: string | null | undefined, id?: string): string {
  return `/autores/${slug || id}`;
}
