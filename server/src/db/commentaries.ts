import { and, eq, asc } from 'drizzle-orm';
import { db } from './client.js';
import { biblicalCommentaries, books, authors } from './schema.js';
import type { ListCommentariesQuery, CommentaryItem } from '../schemas/commentary.schema.js';

export async function listCommentaries(filters?: ListCommentariesQuery): Promise<CommentaryItem[]> {
  const conditions = [];

  if (filters?.bibleBook) {
    conditions.push(eq(biblicalCommentaries.bibleBook, filters.bibleBook.toLowerCase().trim()));
  }

  if (filters?.chapter) {
    conditions.push(eq(biblicalCommentaries.chapter, filters.chapter));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const limit = filters?.limit ?? 50;

  const rows = await db
    .select({
      id: biblicalCommentaries.id,
      bibleBook: biblicalCommentaries.bibleBook,
      chapter: biblicalCommentaries.chapter,
      verseStart: biblicalCommentaries.verseStart,
      verseEnd: biblicalCommentaries.verseEnd,
      title: biblicalCommentaries.title,
      excerpt: biblicalCommentaries.excerpt,
      anchorUrl: biblicalCommentaries.anchorUrl,
      bookId: books.id,
      bookSlug: books.slug,
      bookTitle: books.title,
      authorName: authors.name,
    })
    .from(biblicalCommentaries)
    .innerJoin(books, eq(biblicalCommentaries.bookId, books.id))
    .leftJoin(authors, eq(books.authorId, authors.id))
    .where(where)
    .orderBy(
      asc(biblicalCommentaries.bibleBook),
      asc(biblicalCommentaries.chapter),
      asc(biblicalCommentaries.verseStart),
    )
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    bibleBook: r.bibleBook,
    chapter: r.chapter,
    verseStart: r.verseStart,
    verseEnd: r.verseEnd,
    title: r.title,
    excerpt: r.excerpt,
    anchorUrl: r.anchorUrl,
    book: {
      id: r.bookId,
      slug: r.bookSlug,
      title: r.bookTitle,
      authorName: r.authorName,
    },
  }));
}
