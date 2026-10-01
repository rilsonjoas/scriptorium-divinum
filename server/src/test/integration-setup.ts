import { config as loadEnv } from 'dotenv';
import { pinTestEnv } from './test-env.js';

// O `.env` continua sendo lido, e é justamente por isso que o pinning importa:
// `pinTestEnv` sobrescreve o que veio de lá. Sem ler, não teríamos como
// descobrir o `TEST_DATABASE_URL` de quem configurou a suíte.
loadEnv();

const testUrl =
  process.env.TEST_DATABASE_URL ??
  process.env.DATABASE_URL ??
  'postgresql://scriptorium_test:scriptorium_test@localhost:5434/scriptorium_divinum_test';

pinTestEnv({ databaseUrl: testUrl });
