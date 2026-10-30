import type { FastifyInstance, FastifyError } from 'fastify';
import { z, ZodError } from 'zod';
import { isProduction } from '../config.js';
import { captureException } from '../lib/sentry.js';
import { UnauthorizedError } from './auth.js';

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} não encontrado(a)`);
    this.name = 'NotFoundError';
  }
}

/** Conflito de estado ou de versão (`409`): a citação mudou desde que foi aberta, ou a transição pedida
 *  não vale no estado atual. `atual` leva a linha como está agora, para a tela se atualizar. */
export class ConflictError extends Error {
  constructor(
    message: string,
    readonly atual?: unknown,
  ) {
    super(message);
    this.name = 'ConflictError';
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
      const { fieldErrors, formErrors } = z.flattenError(error);
      return reply.status(400).send({
        error: 'validation_error',
        message: 'Parâmetros inválidos',
        // erro na raiz (ex.: corpo ausente) não tem campo: sem isto `issues` saía vazio
        issues: Object.keys(fieldErrors).length > 0 ? fieldErrors : { corpo: formErrors },
        details: { issues: error.issues },
      });
    }

    // `Content-Type: application/json` com corpo vazio: o Fastify recusa antes de chegar na validação, com um código
    // próprio fora do formato do cluster.
    if ((error as FastifyError).code === 'FST_ERR_CTP_EMPTY_JSON_BODY') {
      return reply.status(400).send({
        error: 'validation_error',
        message: 'Parâmetros inválidos',
        issues: { corpo: ['O corpo da requisição é obrigatório'] },
        details: { issues: [{ path: [], message: 'O corpo da requisição é obrigatório' }] },
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

    if (error instanceof ConflictError) {
      return reply.status(409).send({
        error: 'conflict',
        message: error.message,
        ...(error.atual === undefined ? {} : { atual: error.atual }),
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
