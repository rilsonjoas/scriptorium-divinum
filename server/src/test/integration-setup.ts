import { config as loadEnv } from 'dotenv';

loadEnv();

const testUrl =
  process.env.TEST_DATABASE_URL ??
  process.env.DATABASE_URL ??
  'postgresql://scriptorium_test:scriptorium_test@localhost:5434/scriptorium_divinum_test';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = testUrl;
process.env.CORS_ORIGIN = '*';
