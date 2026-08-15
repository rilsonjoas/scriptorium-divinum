import { z } from 'zod';
import { authorSchema } from './author.schema.js';

export const downloadLinkSchema = z.object({
  id: z.string().uuid(),
  bookId: z.string().uuid(),
  format: z.string(),
  url: z.string(),
  source: z.string().nullable().optional(),
  fileSize: z.number().nullable().optional(),
});

export const tableOfContentsSchema = z.object({
  id: z.string().uuid(),
  bookId: z.string().uuid(),
  title: z.string(),
  anchor: z.string().nullable().optional(),
  level: z.number(),
  orderIndex: z.number(),
});

export const bookSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().nullable().optional(),
  title: z.string(),
  originalTitle: z.string().nullable().optional(),
  authorId: z.string().uuid(),
  publicationYearOriginal: z.string().nullable().optional(),
  publicationYearTranslation: z.number().nullable().optional(),
  translator: z.string().nullable().optional(),
  language: z.string(),
  originalLanguages: z.array(z.string()).nullable().optional(),
  description: z.string(),
  categories: z.array(z.string()).nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  coverImageUrl: z.string().nullable().optional(),
  onlineReadPath: z.string().nullable().optional(),
  textAvailable: z.boolean().optional(),
  featured: z.boolean(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
  author: authorSchema.optional(),
  downloadLinks: z.array(downloadLinkSchema).optional(),
  tableOfContents: z.array(tableOfContentsSchema).optional(),
});

export const listBooksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  authorSlug: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  featured: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  search: z.string().optional(),
});

export const searchBooksQuerySchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type Book = z.infer<typeof bookSchema>;
export type ListBooksQuery = z.infer<typeof listBooksQuerySchema>;
export type SearchBooksQuery = z.infer<typeof searchBooksQuerySchema>;
