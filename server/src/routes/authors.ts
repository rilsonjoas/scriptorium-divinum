import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { listAuthors, getAuthorBySlug } from '../db/queries.js';
import {
  authorSchema,
  listAuthorsQuerySchema,
} from '../schemas/author.schema.js';
import { errorResponseSchema } from '../schemas/response.schema.js';
import { NotFoundError } from '../plugins/error-handler.js';

const authorsListResponseJson = zodToJsonSchema(z.array(authorSchema), {
  $refStrategy: 'none',
});
const authorDetailResponseJson = zodToJsonSchema(
  authorSchema.extend({
    books: z.array(z.record(z.unknown())),
  }),
  { $refStrategy: 'none' },
);
const errorJson = zodToJsonSchema(errorResponseSchema, { $refStrategy: 'none' });

export async function authorRoutes(app: FastifyInstance) {
  // Listar autores
  app.get(
    '/api/v1/authors',
    {
      schema: {
        tags: ['autores'],
        summary: 'Lista todos os autores clássicos',
        querystring: zodToJsonSchema(listAuthorsQuerySchema, { $refStrategy: 'none' }),
        response: { 200: authorsListResponseJson, 500: errorJson },
      },
    },
    async (request) => {
      const query = listAuthorsQuerySchema.parse(request.query);
      return listAuthors(query);
    },
  );

  // Detalhes do autor por slug
  app.get(
    '/api/v1/authors/:slug',
    {
      schema: {
        tags: ['autores'],
        summary: 'Obtém detalhes do autor e suas obras',
        params: zodToJsonSchema(z.object({ slug: z.string() }), { $refStrategy: 'none' }),
        response: { 200: authorDetailResponseJson, 404: errorJson, 500: errorJson },
      },
    },
    async (request) => {
      const { slug } = z.object({ slug: z.string() }).parse(request.params);
      const author = await getAuthorBySlug(slug);
      if (!author) {
        throw new NotFoundError(`Autor '${slug}'`);
      }
      return author;
    },
  );
}
