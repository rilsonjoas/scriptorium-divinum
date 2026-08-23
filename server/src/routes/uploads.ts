import path from 'node:path';
import crypto from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import type { FastifyInstance } from 'fastify';
import { requireAdmin } from '../plugins/auth.js';
import { env } from '../config.js';

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg']);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const UPLOAD_DIR =
  process.env.UPLOAD_DIR ?? path.join(path.dirname(env.TEXTS_DIR), 'data', 'uploads');

export async function uploadRoutes(app: FastifyInstance) {
  app.register(async (adminApp) => {
    adminApp.addHook('preHandler', requireAdmin);

    adminApp.post('/api/v1/admin/uploads', async (request, reply) => {
      const file = await request.file({
        limits: { fileSize: MAX_FILE_SIZE, files: 1 },
      });

      if (!file) {
        return reply.code(400).send({
          error: 'bad_request',
          message: 'Nenhum arquivo enviado. Use multipart/form-data com o campo "file".',
        });
      }

      const ext = path.extname(file.filename || '').toLowerCase();
      if (!ALLOWED_EXT.has(ext)) {
        return reply.code(400).send({
          error: 'bad_request',
          message: `Extensão não permitida (${ext || 'sem extensão'}). Use: ${[...ALLOWED_EXT].join(', ')}.`,
        });
      }

      if (!file.mimetype.startsWith('image/')) {
        return reply.code(400).send({
          error: 'bad_request',
          message: `Tipo de conteúdo não permitido (${file.mimetype}). Envie uma imagem.`,
        });
      }

      const buffer = await file.toBuffer();
      const dir = path.join(UPLOAD_DIR, 'covers');
      mkdirSync(dir, { recursive: true });
      const filename = `${crypto.randomUUID()}${ext}`;
      writeFileSync(path.join(dir, filename), buffer);

      return reply.code(201).send({ url: `/uploads/covers/${filename}` });
    });
  });
}
