import type { FastifyInstance, FastifyError } from 'fastify';
import { ZodError } from 'zod';
import { isProduction } from '../config.js';
import { captureException } from '../lib/sentry.js';

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} não encontrado(a)`);
    this.name = 'NotFoundError';
  }
}

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError | Error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'validation_error',
        message: 'Parâmetros de entrada inválidos',
        details: { issues: error.issues },
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
