import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { env } from '../config.js';
import { findAdminByEmail, findAdminById, createSession, deleteSessionByToken } from '../db/auth-queries.js';
import { verifyPassword } from '../lib/password.js';
import { requireAdmin } from '../plugins/auth.js';
import { errorResponseSchema } from '../schemas/response.schema.js';

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const adminResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
});

const loginResponseJson = zodToJsonSchema(
  z.object({ admin: adminResponseSchema }),
  { $refStrategy: 'none' },
);
const adminJson = zodToJsonSchema(adminResponseSchema, { $refStrategy: 'none' });
const errorJson = zodToJsonSchema(errorResponseSchema, { $refStrategy: 'none' });

function cookieOptions(maxAge: number) {
  return {
    path: '/',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge,
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  };
}

export async function authRoutes(app: FastifyInstance) {
  // Login do admin — cria sessão e seta cookie httpOnly
  app.post(
    '/api/v1/admin/login',
    {
      schema: {
        tags: ['auth'],
        summary: 'Autentica o administrador e cria sessão por cookie',
        body: zodToJsonSchema(loginBodySchema, { $refStrategy: 'none' }),
        response: { 200: loginResponseJson, 401: errorJson },
      },
    },
    async (request, reply) => {
      const { email, password } = loginBodySchema.parse(request.body);
      const admin = await findAdminByEmail(email.toLowerCase());

      if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
        return reply.status(401).send({
          error: 'invalid_credentials',
          message: 'E-mail ou senha inválidos',
        });
      }

      const token = await createSession(admin.id);
      reply.setCookie(env.ADMIN_COOKIE_NAME, token, cookieOptions(env.SESSION_TTL_DAYS * 24 * 60 * 60));

      return {
        admin: { id: admin.id, email: admin.email, name: admin.name },
      };
    },
  );

  // Logout — invalida a sessão no banco e limpa o cookie
  app.post(
    '/api/v1/admin/logout',
    {
      schema: {
        tags: ['auth'],
        summary: 'Encerra a sessão do administrador',
        response: { 204: { type: 'null' }, 200: { type: 'null' } },
      },
    },
    async (request, reply) => {
      const token = request.cookies[env.ADMIN_COOKIE_NAME];
      if (token) {
        await deleteSessionByToken(token);
      }
      reply.clearCookie(env.ADMIN_COOKIE_NAME, cookieOptions(0));
      reply.code(204);
    },
  );

  // Quem sou eu — valida o cookie e devolve os dados do admin logado
  app.get(
    '/api/v1/admin/me',
    {
      preHandler: requireAdmin,
      schema: {
        tags: ['auth'],
        summary: 'Retorna os dados do administrador autenticado',
        response: { 200: adminJson, 401: errorJson },
      },
    },
    async (request) => {
      const admin = await findAdminById(request.adminSession!.adminId);
      return { id: admin!.id, email: admin!.email, name: admin!.name };
    },
  );
}
