import type { FastifyInstance, FastifyError } from 'fastify';
import { ZodError } from 'zod';
import { isProduction } from '../config.js';
import { captureException } from '../lib/sentry.js';
import { UnauthorizedError } from './auth.js';

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} não encontrado(a)`);
    this.name = 'NotFoundError';
  }
}

/** Mapa campo → mensagens a partir do erro de validação do Fastify (schema JSON da rota). */
function issuesDoFastify(validation: NonNullable<FastifyError['validation']>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const v of validation) {
    const campo = v.instancePath.replace(/^\//, '') || String(v.params?.missingProperty ?? 'parametros');
    (out[campo] ??= []).push(v.message ?? 'inválido');
  }
  return out;
}

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError | Error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'validation_error',
        message: 'Parâmetros inválidos',
        issues: error.flatten().fieldErrors,
        details: { issues: error.issues },
      });
    }

    // Validação do Fastify (schemas JSON das rotas, ex.: `?date=abc`): mesmo corpo do Zod, para quem
    // consome não precisar saber de qual camada veio o 400. Mesmo formato na Bíblia na Arte
    // (hetzner-infra/CONTRATOS-ENTRE-PROJETOS.md, seção 5).
    if ('validation' in error && error.validation) {
      return reply.status(400).send({
        error: 'validation_error',
        message: 'Parâmetros inválidos',
        issues: issuesDoFastify(error.validation),
        details: { issues: error.validation },
      });
    }

    if (error instanceof UnauthorizedError) {
      return reply.status(401).send({
        error: 'unauthorized',
        message: error.message,
      });
    }

    if (error instanceof NotFoundError) {
      return reply.status(404).send({
        error: 'not_found',
        message: error.message,
      });
    }

    const fastifyError = error as FastifyError;
    const statusCode = fastifyError.statusCode ?? 500;

    if (statusCode < 500) {
      return reply.status(statusCode).send({
        error: fastifyError.code ?? 'client_error',
        message: fastifyError.message,
      });
    }

    request.log.error(error);

    if (statusCode >= 500) {
      captureException(error, {
        url: request.url,
        method: request.method,
        params: request.params,
        query: request.query,
      });
    }

    return reply.status(statusCode).send({
      error: statusCode === 429 ? 'rate_limited' : 'internal_error',
      message:
        statusCode === 429
          ? 'Muitas requisições. Tente novamente em instantes.'
          : isProduction
            ? 'Erro interno do servidor'
            : error.message,
    });
  });
}
