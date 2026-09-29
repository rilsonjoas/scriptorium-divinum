import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { searchBooks } from '../db/queries.js';
import { onlyAvailable, withTextAvailable } from '../texts.js';
import { bookSchema, searchBooksQuerySchema } from '../schemas/book.schema.js';
import { errorResponseSchema } from '../schemas/response.schema.js';

const searchResponseJson = zodToJsonSchema(z.array(bookSchema), { $refStrategy: 'none' });
const errorJson = zodToJsonSchema(errorResponseSchema, { $refStrategy: 'none' });

export async function searchRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/search',
    {
      schema: {
        tags: ['busca'],
        summary: 'Busca full-text em português em obras e autores',
        querystring: zodToJsonSchema(searchBooksQuerySchema, { $refStrategy: 'none' }),
        response: { 200: searchResponseJson, 500: errorJson },
      },
    },
    async (request) => {
      const { q, limit } = searchBooksQuerySchema.parse(request.query);
      // Busca +limit para compensar o que onlyAvailable descarta (obra sem
      // leitura online não aparece na busca pública, 2026-09-29).
      const rows = await searchBooks(q, limit * 2);
      return onlyAvailable(rows.map(withTextAvailable)).slice(0, limit);
    },
  );
}
