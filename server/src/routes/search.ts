import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { searchBooks } from '../db/queries.js';
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
      return searchBooks(q, limit);
    },
  );
}
