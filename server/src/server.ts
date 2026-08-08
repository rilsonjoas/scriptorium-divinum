import { buildApp } from './app.js';
import { env } from './config.js';
import { closeDb } from './db/client.js';

async function start() {
  const app = await buildApp();

  const shutdown = async (signal: string) => {
    app.log.info({ signal }, 'Iniciando graceful shutdown...');
    try {
      await app.close();
      await closeDb();
      app.log.info('Servidor finalizado com sucesso.');
      process.exit(0);
    } catch (err) {
      app.log.error({ err }, 'Erro durante o graceful shutdown');
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`🚀 Scriptorium Divinum API rodando em http://${env.HOST}:${env.PORT}`);
    app.log.info(`📖 Documentação OpenAPI disponível em http://${env.HOST}:${env.PORT}/docs/json`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
