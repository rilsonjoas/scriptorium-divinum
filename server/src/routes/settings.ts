import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { getSettings, updateSettings } from '../db/settings-queries.js';
import { settingsSchema, updateSettingsSchema } from '../schemas/settings.schema.js';
import { errorResponseSchema } from '../schemas/response.schema.js';
import { requireAdmin } from '../plugins/auth.js';

const settingsResponseJson = zodToJsonSchema(settingsSchema, { $refStrategy: 'none' });
const errorJson = zodToJsonSchema(errorResponseSchema, { $refStrategy: 'none' });

export async function settingsRoutes(app: FastifyInstance) {
  // Público — o site lê nome/descrição/contato e os defaults de paginação
  app.get(
    '/api/v1/settings',
    {
      schema: {
        tags: ['configuracoes'],
        summary: 'Obtém as configurações públicas do site',
        response: { 200: settingsResponseJson, 500: errorJson },
      },
    },
    async () => getSettings(),
  );

  // Admin — atualiza as configurações persistidas
  app.register(async (adminApp) => {
    adminApp.addHook('preHandler', requireAdmin);

    adminApp.put(
      '/api/v1/admin/settings',
      {
        schema: {
          tags: ['admin'],
          summary: 'Atualiza as configurações do site',
          body: zodToJsonSchema(updateSettingsSchema, { $refStrategy: 'none' }),
          response: { 200: settingsResponseJson, 500: errorJson },
        },
      },
      async (request) => {
        const data = updateSettingsSchema.parse(request.body);
        return updateSettings(data);
      },
    );
  });
}
