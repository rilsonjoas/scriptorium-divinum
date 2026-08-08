import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { listBooks, getBookByIdOrSlug } from '../db/queries.js';
import {
  bookSchema,
  listBooksQuerySchema,
} from '../schemas/book.schema.js';
import { errorResponseSchema } from '../schemas/response.schema.js';
import { NotFoundError } from '../plugins/error-handler.js';

const booksListResponseJson = zodToJsonSchema(
  z.object({
    items: z.array(bookSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
  { $refStrategy: 'none' },
);

const bookDetailResponseJson = zodToJsonSchema(bookSchema, { $refStrategy: 'none' });
const errorJson = zodToJsonSchema(errorResponseSchema, { $refStrategy: 'none' });

export async function bookRoutes(app: FastifyInstance) {
  // Listar livros com filtros e paginação
  app.get(
    '/api/v1/books',
    {
      schema: {
        tags: ['livros'],
        summary: 'Lista livros clássicos com filtros e paginação',
        querystring: zodToJsonSchema(listBooksQuerySchema, { $refStrategy: 'none' }),
        response: { 200: booksListResponseJson, 500: errorJson },
      },
    },
    async (request) => {
      const query = listBooksQuerySchema.parse(request.query);
      const { items, total } = await listBooks(query);
      return {
        items,
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit) || 1,
      };
    },
  );

  // Detalhes do livro por ID ou slug
  app.get(
    '/api/v1/books/:idOrSlug',
    {
      schema: {
        tags: ['livros'],
        summary: 'Obtém detalhes de um livro (com autor, links de download e sumário)',
        params: zodToJsonSchema(z.object({ idOrSlug: z.string() }), { $refStrategy: 'none' }),
        response: { 200: bookDetailResponseJson, 404: errorJson, 500: errorJson },
      },
    },
    async (request) => {
      const { idOrSlug } = z.object({ idOrSlug: z.string() }).parse(request.params);
      const book = await getBookByIdOrSlug(idOrSlug);
      if (!book) {
        throw new NotFoundError(`Livro '${idOrSlug}'`);
      }
      return book;
    },
  );
}
