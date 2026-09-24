import { z } from 'zod';

export const quoteSchema = z.object({
  id: z.string().uuid(),
  author: z.string(),
  text: z.string(),
  source: z.string().nullable().optional(),
  dominioPublico: z.boolean(),
  scriptoriumUrl: z.string().nullable().optional(),
  theme: z.string().nullable().optional(),
  /** CTA Amazon preenchido apenas para citações não-públicas (ADR 001). */
  affiliateUrl: z.string().nullable().optional(),
});

export const quoteDailyQuerySchema = z.object({
  /** 'YYYY-MM-DD' — sem ele, "hoje" em America/Sao_Paulo. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  /** Filtro de autor (ex.: "C. S. Lewis" no Gerador). */
  author: z.string().optional(),
});

export const quoteRandomQuerySchema = z.object({
  author: z.string().optional(),
});

export const quoteListQuerySchema = z.object({
  author: z.string().optional(),
});

export type Quote = z.infer<typeof quoteSchema>;
export type QuoteDailyQuery = z.infer<typeof quoteDailyQuerySchema>;
export type QuoteRandomQuery = z.infer<typeof quoteRandomQuerySchema>;
export type QuoteListQuery = z.infer<typeof quoteListQuerySchema>;