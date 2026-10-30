import { z } from 'zod';
import { isValidDateKey } from '../lib/date.js';

/** Tamanho máximo do texto de uma citação, em caracteres. */
export const TEXTO_MAX = 2000;

const texto = z.string().trim().min(1).max(TEXTO_MAX);
const autor = z.string().trim().min(1).max(255);
const urlHttp = z
  .string()
  .trim()
  .max(2000)
  .url()
  .refine((u) => /^https?:\/\//i.test(u), 'precisa ser http ou https');
const dataDoDia = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(isValidDateKey, 'data inexistente no calendário');

const camposEditaveis = {
  author: autor,
  text: texto,
  source: z.string().trim().max(500).nullable(),
  dominioPublico: z.boolean(),
  scriptoriumUrl: z.string().trim().max(500).nullable(),
  theme: z.string().trim().max(50).nullable(),
  fonteUrl: urlHttp.nullable(),
  verificadoEm: dataDoDia.nullable(),
};

/** Corpo de `POST /api/v1/admin/quotes`. `status` só pode nascer `rascunho` ou `ativa`. */
export const createQuoteSchema = z
  .object({
    author: camposEditaveis.author,
    text: camposEditaveis.text,
    source: camposEditaveis.source.optional(),
    dominioPublico: camposEditaveis.dominioPublico.default(false),
    scriptoriumUrl: camposEditaveis.scriptoriumUrl.optional(),
    theme: camposEditaveis.theme.optional(),
    fonteUrl: camposEditaveis.fonteUrl.optional(),
    verificadoEm: camposEditaveis.verificadoEm.optional(),
    status: z.enum(['rascunho', 'ativa']).default('rascunho'),
  })
  .strict();

/** Corpo de `PATCH /api/v1/admin/quotes/:id`. `updatedAt` é a versão que quem edita viu (concorrência
 *  otimista). `oculta` não entra: ocultar e reativar têm rota própria. */
export const updateQuoteSchema = z
  .object({
    author: camposEditaveis.author.optional(),
    text: camposEditaveis.text.optional(),
    source: camposEditaveis.source.optional(),
    dominioPublico: camposEditaveis.dominioPublico.optional(),
    scriptoriumUrl: camposEditaveis.scriptoriumUrl.optional(),
    theme: camposEditaveis.theme.optional(),
    fonteUrl: camposEditaveis.fonteUrl.optional(),
    verificadoEm: camposEditaveis.verificadoEm.optional(),
    status: z.enum(['rascunho', 'ativa']).optional(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export const ocultarQuoteSchema = z.object({ motivo: z.string().trim().min(3).max(1000) }).strict();

export const listAdminQuotesQuerySchema = z.object({
  status: z.enum(['rascunho', 'ativa', 'oculta']).optional(),
  author: z.string().optional(),
  q: z.string().optional(),
  semVerificacao: z
    .literal('true')
    .transform(() => true as const)
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export const quoteIdParamSchema = z.object({ id: z.string().uuid() });

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
export type ListAdminQuotesQuery = z.infer<typeof listAdminQuotesQuerySchema>;
