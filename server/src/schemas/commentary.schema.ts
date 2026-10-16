import { z } from 'zod';

export const listCommentariesQuerySchema = z.object({
  bibleBook: z.string().optional(),
  chapter: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50).optional(),
});

export type ListCommentariesQuery = z.infer<typeof listCommentariesQuerySchema>;

export const commentaryBookSummarySchema = z.object({
  id: z.string().uuid(),
  slug: z.string().nullable(),
  title: z.string(),
  authorName: z.string().nullable(),
});

export const commentaryItemSchema = z.object({
  id: z.string().uuid(),
  bibleBook: z.string(),
  chapter: z.number().int(),
  verseStart: z.number().int().nullable(),
  verseEnd: z.number().int().nullable(),
  title: z.string(),
  excerpt: z.string().nullable(),
  anchorUrl: z.string(),
  book: commentaryBookSummarySchema,
});

export type CommentaryItem = z.infer<typeof commentaryItemSchema>;
