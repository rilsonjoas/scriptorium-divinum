import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import { env, isProduction } from './config.js';
import { initSentry } from './lib/sentry.js';
import { registerErrorHandler } from './plugins/error-handler.js';
import { registerAuthPlugin } from './plugins/auth.js';
import { healthRoutes } from './routes/health.js';
import { authorRoutes } from './routes/authors.js';
import { bookRoutes } from './routes/books.js';
import { categoryRoutes } from './routes/categories.js';
import { searchRoutes } from './routes/search.js';
import { authRoutes } from './routes/auth.js';
import { adminRoutes } from './routes/admin.js';

export async function buildApp() {
  initSentry();

  const app = Fastify({
    logger: isProduction
      ? true
      : {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true },
          },
        },
  });

  // Security Headers
  await app.register(helmet, {
    contentSecurityPolicy: isProduction,
    crossOriginEmbedderPolicy: false,
  });

  // Cookies assinados (sessão httpOnly do admin)
  await app.register(cookie, { secret: env.COOKIE_SECRET });

  // CORS — com credenciais, pois a sessão viaja em cookie entre subdomínios
  await app.register(cors, {
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(',').map((s) => s.trim()),
    methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Rate Limiting
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
  });

  // Swagger Documentation
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Scriptorium Divinum API',
        description: 'API pública para consulta de obras clássicas da teologia cristã',
        version: '1.0.0',
      },
      tags: [
        { name: 'saude', description: 'Health checks' },
        { name: 'livros', description: 'Catálogo de livros clássicos' },
        { name: 'autores', description: 'Autores e teólogos' },
        { name: 'categorias', description: 'Categorias e tradições' },
        { name: 'busca', description: 'Busca full-text' },
        { name: 'auth', description: 'Autenticação do administrador' },
        { name: 'admin', description: 'CRUD administrativo do catálogo' },
      ],
    },
  });

  // OpenAPI JSON endpoint
  app.get('/docs/json', async () => app.swagger());

  // Error Handler
  registerErrorHandler(app);

  // Guard de autenticação (requerido pelas rotas /api/v1/admin/*)
  registerAuthPlugin(app);

  // Routes
  await app.register(healthRoutes);
  await app.register(authorRoutes);
  await app.register(bookRoutes);
  await app.register(categoryRoutes);
  await app.register(searchRoutes);
  await app.register(authRoutes);
  await app.register(adminRoutes);

  return app;
}
