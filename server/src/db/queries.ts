import { and, desc, eq, sql, inArray, ilike } from 'drizzle-orm';
import { db } from './client.js';
import { authors, books, downloadLinks, tableOfContents } from './schema.js';
import type { ListAuthorsQuery } from '../schemas/author.schema.js';
import type { ListBooksQuery } from '../schemas/book.schema.js';

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
      bookCount: sql<number>`count(${books.id})::int`,
    })
    .from(authors)
    .leftJoin(books, eq(books.authorId, authors.id))
    .where(where)
    .groupBy(authors.id)
    .orderBy(authors.name);

  if (filters?.tradition) {
    return rows.filter((r) =>
      r.denominationOrTradition?.some((t) =>
        t.toLowerCase().includes(filters.tradition!.toLowerCase()),
      ),
    );
  }

  return rows;
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

export async function listBooks(filters: ListBooksQuery) {
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

    if (!author) return { items: [], total: 0 };
    conditions.push(eq(books.authorId, author.id));
  }

  if (filters.category) {
    conditions.push(sql`${books.categories} @> ARRAY[${filters.category}]::text[]`);
  }

  if (filters.tag) {
    conditions.push(sql`${books.tags} @> ARRAY[${filters.tag}]::text[]`);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [bookRows, countResult] = await Promise.all([
    db
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
        featured: books.featured,
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
      .orderBy(desc(books.featured), desc(books.createdAt))
      .limit(filters.limit)
      .offset((filters.page - 1) * filters.limit),
    db.select({ count: sql<number>`count(*)::int` }).from(books).where(where),
  ]);

  return {
    items: bookRows,
    total: countResult[0]?.count ?? 0,
  };
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
      featured: books.featured,
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
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    author: authorMap.get(r.author_id),
  }));
}

export async function listCategories() {
  const rows = await db.execute<{ category: string; count: number }>(
    sql`SELECT unnest(categories) as category, count(*)::int as count
        FROM books
        WHERE categories IS NOT NULL
        GROUP BY category
        ORDER BY count DESC, category ASC`,
  );

  return rows.map((r) => ({
    name: r.category,
    slug: r.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    bookCount: r.count,
  }));
}
