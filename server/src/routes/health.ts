import type { FastifyInstance } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { db } from '../db/client.js';
import {
  healthResponseSchema,
  readyResponseSchema,
  errorResponseSchema,
} from '../schemas/response.schema.js';

const healthResponseJson = zodToJsonSchema(healthResponseSchema, { $refStrategy: 'none' });
const readyResponseJson = zodToJsonSchema(readyResponseSchema, { $refStrategy: 'none' });
const errorJson = zodToJsonSchema(errorResponseSchema, { $refStrategy: 'none' });

export async function healthRoutes(app: FastifyInstance) {
  // Liveness / General Health Check
  app.get(
    '/health',
    {
      schema: {
        tags: ['saude'],
        summary: 'Health check geral',
        response: { 200: healthResponseJson, 500: errorJson },
      },
    },
    async () => ({ status: 'ok' }),
  );

  // Liveness probe (Traefik / Uptime Kuma)
  app.get(
    '/health/live',
    {
      schema: {
        tags: ['saude'],
        summary: 'Liveness probe',
        response: { 200: healthResponseJson },
      },
    },
    async () => ({ status: 'live' }),
  );

  // Readiness probe — valida se o Postgres está respondendo
  app.get(
    '/health/ready',
    {
      schema: {
        tags: ['saude'],
        summary: 'Readiness probe (Postgres check)',
        response: { 200: readyResponseJson, 503: errorJson },
      },
    },
    async (_request, reply) => {
      try {
        await db.execute('SELECT 1');
        return { status: 'ready', database: 'connected' };
      } catch (err) {
        reply.status(503);
        return {
          error: 'database_unavailable',
          message: 'Postgres não respondeu ao check de integridade',
          details: { error: (err as Error).message },
        };
      }
    },
  );
}
