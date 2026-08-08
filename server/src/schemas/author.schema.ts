import { z } from 'zod';

export const authorSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  birthYear: z.number().nullable().optional(),
  deathYear: z.number().nullable().optional(),
  bioSummary: z.string().nullable().optional(),
  portraitImageUrl: z.string().nullable().optional(),
  denominationOrTradition: z.array(z.string()).nullable().optional(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
  bookCount: z.number().optional(),
});

export const listAuthorsQuerySchema = z.object({
  tradition: z.string().optional(),
  search: z.string().optional(),
});

export type Author = z.infer<typeof authorSchema>;
export type ListAuthorsQuery = z.infer<typeof listAuthorsQuerySchema>;
