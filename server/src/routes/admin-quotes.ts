import type { FastifyInstance } from 'fastify';
import { requireAdmin } from '../plugins/auth.js';
import {
  createQuoteSchema,
  updateQuoteSchema,
  ocultarQuoteSchema,
  listAdminQuotesQuerySchema,
  quoteIdParamSchema,
} from '../schemas/admin-quotes.schema.js';
import {
  createQuote,
  updateQuote,
  ocultarQuote,
  reativarQuote,
  listAdminQuotes,
  listEventos,
} from '../db/admin-quotes.js';

// Respostas com `additionalProperties: true` para o Fastify não cortar campos. Corpo de erro único do cluster
// (plugins/error-handler.ts): `{error, message, issues?, details?}`; o 409 leva também `atual`.
const objetoJson = { type: 'object', additionalProperties: true } as const;
const erroJson = {
  type: 'object',
  properties: { error: { type: 'string' }, message: { type: 'string' } },
  required: ['error', 'message'],
  additionalProperties: true,
} as const;

const idParamJson = {
  type: 'object',
  properties: { id: { type: 'string', format: 'uuid' } },
  required: ['id'],
} as const;

/**
 * Painel de citações, F2 (docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md, seção 7).
 * Sem `DELETE`, de propósito: retirar é ocultar (R3). Os corpos não têm schema JSON do Fastify: o Ajv do Fastify
 * remove em silêncio os campos que não conhece, e aqui o Zod `.strict()` deve RECUSAR campo desconhecido (`id`, `status: 'oculta'`).
 */
export async function adminQuoteRoutes(app: FastifyInstance) {
  app.register(async (adminApp) => {
    adminApp.addHook('preHandler', requireAdmin);
    const adminId = (request: { adminSession?: { adminId: string } }) => request.adminSession!.adminId;

    adminApp.get(
      '/api/v1/admin/quotes',
      {
        schema: {
          tags: ['admin'],
          summary: 'Lista citações (todos os status) com contadores por status e por autor',
          response: { 200: objetoJson, 400: erroJson },
        },
      },
      async (request) => listAdminQuotes(listAdminQuotesQuerySchema.parse(request.query)),
    );

    adminApp.post(
      '/api/v1/admin/quotes',
      {
        schema: {
          tags: ['admin'],
          summary: 'Cria uma citação (rascunho ou ativa; ativa exige a fonte completa)',
          response: { 201: objetoJson, 400: erroJson },
        },
      },
      async (request, reply) => {
        const resultado = await createQuote(createQuoteSchema.parse(request.body), adminId(request));
        return reply.code(201).send(resultado);
      },
    );

    adminApp.patch(
      '/api/v1/admin/quotes/:id',
      {
        schema: {
          tags: ['admin'],
          summary: 'Edita uma citação; exige updatedAt e devolve 409 se ela mudou',
          params: idParamJson,
          response: { 200: objetoJson, 400: erroJson, 404: erroJson, 409: erroJson },
        },
      },
      async (request) => {
        const { id } = quoteIdParamSchema.parse(request.params);
        return updateQuote(id, updateQuoteSchema.parse(request.body), adminId(request));
      },
    );

    adminApp.post(
      '/api/v1/admin/quotes/:id/ocultar',
      {
        schema: {
          tags: ['admin'],
          summary: 'Oculta uma citação (motivo obrigatório); ela some da API pública',
          params: idParamJson,
          response: { 200: objetoJson, 400: erroJson, 404: erroJson, 409: erroJson },
        },
      },
      async (request) => {
        const { id } = quoteIdParamSchema.parse(request.params);
        const { motivo } = ocultarQuoteSchema.parse(request.body ?? {});
        return { quote: await ocultarQuote(id, motivo, adminId(request)) };
      },
    );

    adminApp.post(
      '/api/v1/admin/quotes/:id/reativar',
      {
        schema: {
          tags: ['admin'],
          summary: 'Reativa uma citação oculta (exige a obra em source)',
          params: idParamJson,
          response: { 200: objetoJson, 400: erroJson, 404: erroJson, 409: erroJson },
        },
      },
      async (request) => {
        const { id } = quoteIdParamSchema.parse(request.params);
        return { quote: await reativarQuote(id, adminId(request)) };
      },
    );

    adminApp.get(
      '/api/v1/admin/quotes/:id/eventos',
      {
        schema: {
          tags: ['admin'],
          summary: 'Histórico de uma citação, do mais recente ao mais antigo',
          params: idParamJson,
          response: { 200: objetoJson, 400: erroJson },
        },
      },
      async (request) => {
        const { id } = quoteIdParamSchema.parse(request.params);
        return { eventos: await listEventos(id) };
      },
    );
  });
}
