import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { listCategories } from '../db/queries.js';
import { categorySchema } from '../schemas/category.schema.js';
import { errorResponseSchema } from '../schemas/response.schema.js';

const categoriesResponseJson = zodToJsonSchema(z.array(categorySchema), {
  $refStrategy: 'none',
});
const errorJson = zodToJsonSchema(errorResponseSchema, { $refStrategy: 'none' });

export async function categoryRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/categories',
    {
      schema: {
        tags: ['categorias'],
        summary: 'Lista categorias teológicas agregadas com contagem de obras',
        response: { 200: categoriesResponseJson, 500: errorJson },
      },
    },
    async () => {
      return listCategories();
    },
  );
}
