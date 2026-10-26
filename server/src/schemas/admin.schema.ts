import { z } from 'zod';

// Teto de tamanho em todo array vindo do cliente (GHSA-mrhx-c7xc-m3w5, zod: array sem limite pode esgotar memória).
const LISTA_DE_TEXTOS_MAX = 200;
const LINKS_MAX = 100;
const SUMARIO_MAX = 5000;

const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

export const createAuthorSchema = z.object({
  slug: slugSchema.optional(),
  name: z.string().min(1),
  birthYear: z.number().int().optional(),
  deathYear: z.number().int().optional(),
  bioSummary: z.string().optional(),
  portraitImageUrl: z.string().optional(),
  denominationOrTradition: z.array(z.string()).max(LISTA_DE_TEXTOS_MAX).optional(),
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
  originalLanguages: z.array(z.string()).max(LISTA_DE_TEXTOS_MAX).optional(),
  description: z.string().min(1),
  categories: z.array(z.string()).max(LISTA_DE_TEXTOS_MAX).optional(),
  tags: z.array(z.string()).max(LISTA_DE_TEXTOS_MAX).optional(),
  coverImageUrl: z.string().optional(),
  onlineReadPath: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  translationIsAi: z.boolean().default(false),
  humanReviewApprovedAt: z.string().or(z.date()).nullable().optional(),
  licenseType: z.string().max(50).default('public-domain'),
  attributionText: z.string().optional(),
  downloadLinks: z
    .array(
      z.object({
        format: z.string().min(1).max(20),
        url: z.string().min(1).max(500),
        source: z.string().max(255).optional(),
        fileSize: z.number().int().positive().optional(),
      }),
    )
    .max(LINKS_MAX)
    .optional(),
  tableOfContents: z
    .array(
      z.object({
        title: z.string().min(1),
        anchor: z.string().optional(),
        level: z.number().int().default(1),
        orderIndex: z.number().int(),
      }),
    )
    .max(SUMARIO_MAX)
    .optional(),
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
