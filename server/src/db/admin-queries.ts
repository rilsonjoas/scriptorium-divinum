import { eq, sql } from 'drizzle-orm';
import { db } from './client.js';
import { authors, books, categories } from './schema.js';
import type {
  CreateAuthorInput,
  UpdateAuthorInput,
  CreateBookInput,
  UpdateBookInput,
} from '../schemas/admin.schema.js';

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function createAuthor(data: CreateAuthorInput) {
  const slug = data.slug || slugify(data.name);
  const [row] = await db
    .insert(authors)
    .values({
      slug,
      name: data.name,
      birthYear: data.birthYear,
      deathYear: data.deathYear,
      bioSummary: data.bioSummary,
      portraitImageUrl: data.portraitImageUrl,
      denominationOrTradition: data.denominationOrTradition,
    })
    .returning();
  return row;
}

export async function updateAuthor(id: string, data: UpdateAuthorInput) {
  const [row] = await db
    .update(authors)
    .set({
      ...data,
      ...(data.slug ? { slug: data.slug } : {}),
      updatedAt: new Date(),
    })
    .where(eq(authors.id, id))
    .returning();
  return row;
}

export async function deleteAuthor(id: string): Promise<void> {
  await db.delete(authors).where(eq(authors.id, id));
}

export async function createBook(data: CreateBookInput) {
  const slug = data.slug || slugify(data.title);
  const [row] = await db
    .insert(books)
    .values({
      slug,
      title: data.title,
      originalTitle: data.originalTitle,
      authorId: data.authorId,
      publicationYearOriginal: data.publicationYearOriginal,
      publicationYearTranslation: data.publicationYearTranslation,
      translator: data.translator,
      language: data.language,
      originalLanguages: data.originalLanguages,
      description: data.description,
      categories: data.categories,
      tags: data.tags,
      coverImageUrl: data.coverImageUrl,
      onlineReadPath: data.onlineReadPath,
      featured: data.featured,
    })
    .returning();
  return row;
}

export async function updateBook(id: string, data: UpdateBookInput) {
  const [row] = await db
    .update(books)
    .set({
      ...data,
      ...(data.slug ? { slug: data.slug } : {}),
      updatedAt: new Date(),
    })
    .where(eq(books.id, id))
    .returning();
  return row;
}

export async function deleteBook(id: string): Promise<void> {
  await db.delete(books).where(eq(books.id, id));
}

export async function findCategoryByName(name: string) {
  const [row] = await db.select().from(categories).where(eq(categories.name, name)).limit(1);
  return row ?? undefined;
}

export async function createCategory(data: { name: string; slug: string; description?: string }) {
  const [row] = await db
    .insert(categories)
    .values(data)
    .returning();
  return row;
}

export async function renameCategory(
  oldName: string,
  newName: string,
  description?: string,
): Promise<void> {
  await db.execute(
    sql`
      UPDATE books
      SET categories = array_replace(categories, ${oldName}, ${newName}),
          updated_at = now()
      WHERE categories @> ARRAY[${oldName}]::text[]
    `,
  );
  await db
    .update(categories)
    .set({
      name: newName,
      slug: slugify(newName),
      ...(description !== undefined ? { description } : {}),
      updatedAt: new Date(),
    })
    .where(eq(categories.name, oldName));
}

export async function deleteCategory(name: string): Promise<void> {
  await db.execute(
    sql`
      UPDATE books
      SET categories = array_remove(categories, ${name}),
          updated_at = now()
      WHERE categories @> ARRAY[${name}]::text[]
    `,
  );
  await db.delete(categories).where(eq(categories.name, name));
}

export async function isCategoryInUse(name: string): Promise<boolean> {
  const [row] = await db.execute<{ exists: boolean }>(
    sql`SELECT EXISTS (SELECT 1 FROM books WHERE categories @> ARRAY[${name}]::text[]) AS exists`,
  );
  return row?.exists ?? false;
}
