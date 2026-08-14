import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getSessionByToken } from '../db/auth-queries.js';
import { env } from '../config.js';

export interface AdminSession {
  adminId: string;
  sessionId: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    adminSession?: AdminSession;
  }

  interface FastifyInstance {
    requireAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Não autenticado') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies[env.ADMIN_COOKIE_NAME];
  if (!token) {
    throw new UnauthorizedError();
  }

  const session = await getSessionByToken(token);
  if (!session) {
    reply.clearCookie(env.ADMIN_COOKIE_NAME, { path: '/' });
    throw new UnauthorizedError('Sessão inválida ou expirada');
  }

  request.adminSession = {
    adminId: session.adminId,
    sessionId: session.id,
  };
}

export function registerAuthPlugin(app: FastifyInstance) {
  app.decorate('requireAdmin', requireAdmin);
}
