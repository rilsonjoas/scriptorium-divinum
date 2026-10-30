import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from '../lib/json-schema.js';
import { listCommentaries } from '../db/commentaries.js';
import {
  listCommentariesQuerySchema,
  commentaryItemSchema,
} from '../schemas/commentary.schema.js';
import { errorResponseSchema } from '../schemas/response.schema.js';

const commentaryListJson = zodToJsonSchema(z.array(commentaryItemSchema), {
  $refStrategy: 'none',
});
const errorJson = zodToJsonSchema(errorResponseSchema, { $refStrategy: 'none' });

export async function commentaryRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/commentaries',
    {
      schema: {
        tags: ['comentarios'],
        summary: 'Comentários e homilias bíblicas clássicas indexadas por livro e capítulo',
        querystring: zodToJsonSchema(listCommentariesQuerySchema, { $refStrategy: 'none' }),
        response: {
          200: commentaryListJson,
          400: errorJson,
          500: errorJson,
        },
      },
    },
    async (request) => {
      const filters = listCommentariesQuerySchema.parse(request.query);
      return await listCommentaries(filters);
    },
  );
}
