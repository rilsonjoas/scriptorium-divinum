import { and, desc, eq, sql, inArray, ilike } from 'drizzle-orm';
import { db } from './client.js';
import { authors, books, downloadLinks, tableOfContents } from './schema.js';
import type { ListAuthorsQuery } from '../schemas/author.schema.js';
import type { ListBooksQuery } from '../schemas/book.schema.js';

/**
 * Autores com a lista de `onlineReadPath` de cada livro (não agregado):
 * quem chama decide o `bookCount` depois de conferir no disco quais têm
 * texto de fato — isso não dá para fazer em SQL (2026-09-29, mesmo motivo
 * de `listBooks`).
 */
export async function listAuthors(filters?: ListAuthorsQuery) {
  const conditions = [];

  if (filters?.search) {
    conditions.push(ilike(authors.name, `%${filters.search}%`));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: authors.id,
      slug: authors.slug,
      name: authors.name,
      birthYear: authors.birthYear,
      deathYear: authors.deathYear,
      bioSummary: authors.bioSummary,
      portraitImageUrl: authors.portraitImageUrl,
      denominationOrTradition: authors.denominationOrTradition,
      createdAt: authors.createdAt,
      updatedAt: authors.updatedAt,
      bookId: books.id,
      bookOnlineReadPath: books.onlineReadPath,
    })
    .from(authors)
    .leftJoin(books, eq(books.authorId, authors.id))
    .where(where)
    .orderBy(authors.name);

  const byAuthor = new Map<
    string,
    Omit<(typeof rows)[number], 'bookId' | 'bookOnlineReadPath'> & { bookPaths: (string | null)[] }
  >();
  for (const { bookId, bookOnlineReadPath, ...author } of rows) {
    const existing = byAuthor.get(author.id);
    if (existing) {
      if (bookId) existing.bookPaths.push(bookOnlineReadPath);
    } else {
      byAuthor.set(author.id, { ...author, bookPaths: bookId ? [bookOnlineReadPath] : [] });
    }
  }
  const authorsList = [...byAuthor.values()];

  if (filters?.tradition) {
    return authorsList.filter((r) =>
      r.denominationOrTradition?.some((t) =>
        t.toLowerCase().includes(filters.tradition!.toLowerCase()),
      ),
    );
  }

  return authorsList;
}

export async function getAuthorBySlug(slug: string) {
  const [author] = await db
    .select()
    .from(authors)
    .where(eq(authors.slug, slug))
    .limit(1);

  if (!author) return undefined;

  const authorBooks = await db
    .select()
    .from(books)
    .where(eq(books.authorId, author.id))
    .orderBy(desc(books.createdAt));

  return { ...author, books: authorBooks };
}

/**
 * Todos os livros que batem com os filtros, sem paginar no SQL.
 *
 * A paginação fica por conta de quem chama (rota `/api/v1/books`), porque
 * ela precisa filtrar por `textAvailable` primeiro — e isso só existe no
 * disco, não no banco, então dá errado paginar antes de filtrar (a página 1
 * viria com menos itens que `limit`, ou nem toda obra sem texto sumiria da
 * página certa). O catálogo é pequeno (dezenas de obras): buscar tudo de
 * uma vez é barato.
 */
export async function listBooks(filters: Omit<ListBooksQuery, 'page' | 'limit'>) {
  const conditions = [];

  if (filters.featured !== undefined) {
    conditions.push(eq(books.featured, filters.featured));
  }

  if (filters.search) {
    conditions.push(ilike(books.title, `%${filters.search}%`));
  }

  if (filters.authorSlug) {
    const [author] = await db
      .select({ id: authors.id })
      .from(authors)
      .where(eq(authors.slug, filters.authorSlug))
      .limit(1);

    if (!author) return { items: [] };
    conditions.push(eq(books.authorId, author.id));
  }

  if (filters.category) {
    conditions.push(sql`${books.categories} @> ARRAY[${filters.category}]::text[]`);
  }

  if (filters.tag) {
    conditions.push(sql`${books.tags} @> ARRAY[${filters.tag}]::text[]`);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const bookRows = await db
    .select({
      id: books.id,
      slug: books.slug,
      title: books.title,
      originalTitle: books.originalTitle,
      authorId: books.authorId,
      publicationYearOriginal: books.publicationYearOriginal,
      publicationYearTranslation: books.publicationYearTranslation,
      translator: books.translator,
      language: books.language,
      originalLanguages: books.originalLanguages,
      description: books.description,
      categories: books.categories,
      tags: books.tags,
      coverImageUrl: books.coverImageUrl,
      onlineReadPath: books.onlineReadPath,
      relatedEditionSlug: books.relatedEditionSlug,
      featured: books.featured,
      published: books.published,
      translationIsAi: books.translationIsAi,
      humanReviewApprovedAt: books.humanReviewApprovedAt,
      licenseType: books.licenseType,
      attributionText: books.attributionText,
      createdAt: books.createdAt,
      updatedAt: books.updatedAt,
      author: {
        id: authors.id,
        slug: authors.slug,
        name: authors.name,
        birthYear: authors.birthYear,
        deathYear: authors.deathYear,
        bioSummary: authors.bioSummary,
        portraitImageUrl: authors.portraitImageUrl,
        denominationOrTradition: authors.denominationOrTradition,
      },
    })
    .from(books)
    .innerJoin(authors, eq(books.authorId, authors.id))
    .where(where)
    .orderBy(desc(books.featured), desc(books.createdAt));

  return { items: bookRows };
}

export async function getBookByIdOrSlug(idOrSlug: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    idOrSlug,
  );

  const condition = isUuid ? eq(books.id, idOrSlug) : eq(books.slug, idOrSlug);

  const [book] = await db
    .select({
      id: books.id,
      slug: books.slug,
      title: books.title,
      originalTitle: books.originalTitle,
      authorId: books.authorId,
      publicationYearOriginal: books.publicationYearOriginal,
      publicationYearTranslation: books.publicationYearTranslation,
      translator: books.translator,
      language: books.language,
      originalLanguages: books.originalLanguages,
      description: books.description,
      categories: books.categories,
      tags: books.tags,
      coverImageUrl: books.coverImageUrl,
      onlineReadPath: books.onlineReadPath,
      // Nome precisa estar na lista EXPLICITA de colunas: o drizzle
      // não devolve campo novo sozinho, e a consequence é silenciosa —
      // a coluna existe no banco, a API responde sem ela, e o frontend
      // mostra a obra como se nada tivesse sido feito. Foi exatamente o
      // que aconteceu com related_edition_slug em 2026-09-26.
      relatedEditionSlug: books.relatedEditionSlug,
      featured: books.featured,
      published: books.published,
      translationIsAi: books.translationIsAi,
      humanReviewApprovedAt: books.humanReviewApprovedAt,
      licenseType: books.licenseType,
      attributionText: books.attributionText,
      createdAt: books.createdAt,
      updatedAt: books.updatedAt,
      author: {
        id: authors.id,
        slug: authors.slug,
        name: authors.name,
        birthYear: authors.birthYear,
        deathYear: authors.deathYear,
        bioSummary: authors.bioSummary,
        portraitImageUrl: authors.portraitImageUrl,
        denominationOrTradition: authors.denominationOrTradition,
      },
    })
    .from(books)
    .innerJoin(authors, eq(books.authorId, authors.id))
    .where(condition)
    .limit(1);

  if (!book) return undefined;

  const [links, toc] = await Promise.all([
    db
      .select()
      .from(downloadLinks)
      .where(eq(downloadLinks.bookId, book.id)),
    db
      .select()
      .from(tableOfContents)
      .where(eq(tableOfContents.bookId, book.id))
      .orderBy(tableOfContents.orderIndex),
  ]);

  return {
    ...book,
    downloadLinks: links,
    tableOfContents: toc,
  };
}

export async function searchBooks(q: string, limit = 20) {
  const rows = await db.execute<{
    id: string;
    slug: string | null;
    title: string;
    original_title: string | null;
    author_id: string;
    publication_year_original: string | null;
    publication_year_translation: number | null;
    translator: string | null;
    language: string;
    original_languages: string[] | null;
    description: string;
    categories: string[] | null;
    tags: string[] | null;
    cover_image_url: string | null;
    online_read_path: string | null;
    featured: boolean;
    license_type: string | null;
    attribution_text: string | null;
    created_at: string;
    updated_at: string;
    rank: number;
  }>(
    sql`SELECT * FROM search_books(${q}) LIMIT ${limit}`,
  );

  if (rows.length === 0) return [];

  const authorIds = [...new Set(rows.map((r) => r.author_id))];
  const authorRows = await db
    .select()
    .from(authors)
    .where(inArray(authors.id, authorIds));

  const authorMap = new Map(authorRows.map((a) => [a.id, a]));

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    originalTitle: r.original_title,
    authorId: r.author_id,
    publicationYearOriginal: r.publication_year_original,
    publicationYearTranslation: r.publication_year_translation,
    translator: r.translator,
    language: r.language,
    originalLanguages: r.original_languages,
    description: r.description,
    categories: r.categories,
    tags: r.tags,
    coverImageUrl: r.cover_image_url,
    onlineReadPath: r.online_read_path,
    featured: r.featured,
    licenseType: r.license_type,
    attributionText: r.attribution_text,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    author: authorMap.get(r.author_id),
  }));
}

export async function listCategories() {
  const rows = await db.execute<{
    category: string;
    count: number;
    slug: string;
    description: string | null;
  }>(
    sql`SELECT c.name as category, count(*)::int as count, c.slug as slug, c.description as description
        FROM (SELECT unnest(categories) as category FROM books WHERE categories IS NOT NULL) sub
        INNER JOIN categories c ON c.name = sub.category
        GROUP BY c.name, c.slug, c.description
        ORDER BY count DESC, c.name ASC`,
  );

  return rows.map((r) => ({
    name: r.category,
    slug: r.slug,
    description: r.description ?? undefined,
    bookCount: r.count,
  }));
}
