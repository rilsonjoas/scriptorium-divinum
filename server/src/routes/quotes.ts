import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { getDailyQuote, getRandomQuote, listQuotes } from '../db/quotes.js';
import { dateKeyInTimeZone } from '../lib/date.js';
import {
  quoteSchema,
  quoteDailyQuerySchema,
  quoteRandomQuerySchema,
  quoteListQuerySchema,
} from '../schemas/quote.schema.js';
import { errorResponseSchema } from '../schemas/response.schema.js';
import { NotFoundError } from '../plugins/error-handler.js';

const quoteJson = zodToJsonSchema(quoteSchema, { $refStrategy: 'none' });
// /daily devolve o recurso anexado à sua data de referência (mesmo contrato
// do /versiculo-do-dia do Lecionário: consumidor usa o `date` da resposta).
const dailyQuoteJson = zodToJsonSchema(quoteSchema.extend({ date: z.string() }), {
  $refStrategy: 'none',
});
const quoteListJson = zodToJsonSchema(z.array(quoteSchema), { $refStrategy: 'none' });
const errorJson = zodToJsonSchema(errorResponseSchema, { $refStrategy: 'none' });

export async function quoteRoutes(app: FastifyInstance) {
  // Citação do dia — determinística por data (ADR 001, fonte única do cluster)
  app.get(
    '/api/v1/quotes/daily',
    {
      schema: {
        tags: ['citacoes'],
        summary: 'Citação do dia — mesma pra todo o cluster, determinística por data',
        querystring: zodToJsonSchema(quoteDailyQuerySchema, { $refStrategy: 'none' }),
        response: { 200: dailyQuoteJson, 404: errorJson, 500: errorJson },
      },
    },
    async (request) => {
      const { date, author } = quoteDailyQuerySchema.parse(request.query);
      const quote = await getDailyQuote(date, author);
      if (!quote) {
        throw new NotFoundError('Citação');
      }
      const dateKey = date ?? dateKeyInTimeZone(new Date());
      return { ...quote, date: dateKey };
    },
  );

  // Citação aleatória — sorteio no server (ORDER BY random()), padrão /artworks/random
  app.get(
    '/api/v1/quotes/random',
    {
      schema: {
        tags: ['citacoes'],
        summary: 'Citação aleatória do acervo (opcionalmente filtrada por autor)',
        querystring: zodToJsonSchema(quoteRandomQuerySchema, { $refStrategy: 'none' }),
        response: { 200: quoteJson, 404: errorJson, 500: errorJson },
      },
    },
    async (request) => {
      const { author } = quoteRandomQuerySchema.parse(request.query);
      const quote = await getRandomQuote(author);
      if (!quote) {
        throw new NotFoundError('Citação');
      }
      return quote;
    },
  );

  // Lista crua — usada pelo Gerador C.S. Lewis (author=Lewis) e sitemaps
  app.get(
    '/api/v1/quotes',
    {
      schema: {
        tags: ['citacoes'],
        summary: 'Lista citações (opcionalmente filtradas por autor)',
        querystring: zodToJsonSchema(quoteListQuerySchema, { $refStrategy: 'none' }),
        response: { 200: quoteListJson, 500: errorJson },
      },
    },
    async (request) => {
      const { author } = quoteListQuerySchema.parse(request.query);
      return listQuotes(author);
    },
  );
}