import { z } from 'zod';

const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

export const createAuthorSchema = z.object({
  slug: slugSchema.optional(),
  name: z.string().min(1),
  birthYear: z.number().int().optional(),
  deathYear: z.number().int().optional(),
  bioSummary: z.string().optional(),
  portraitImageUrl: z.string().optional(),
  denominationOrTradition: z.array(z.string()).optional(),
});

export const updateAuthorSchema = createAuthorSchema.partial();

export const createBookSchema = z.object({
  slug: slugSchema.optional(),
  title: z.string().min(1),
  originalTitle: z.string().optional(),
  authorId: z.string().uuid(),
  publicationYearOriginal: z.string().optional(),
  publicationYearTranslation: z.number().int().optional(),
  translator: z.string().optional(),
  language: z.string().min(1).default('Português'),
  originalLanguages: z.array(z.string()).optional(),
  description: z.string().min(1),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  coverImageUrl: z.string().optional(),
  onlineReadPath: z.string().optional(),
  featured: z.boolean().default(false),
});

export const updateBookSchema = createBookSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: slugSchema.optional(),
  description: z.string().optional(),
});

export const renameCategorySchema = z.object({
  oldName: z.string().min(1),
  newName: z.string().min(1),
  description: z.string().optional(),
});

export type CreateAuthorInput = z.infer<typeof createAuthorSchema>;
export type UpdateAuthorInput = z.infer<typeof updateAuthorSchema>;
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
