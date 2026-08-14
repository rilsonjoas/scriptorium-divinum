import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.integration.test.ts'],
    setupFiles: ['./src/test/integration-setup.ts'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    // Os arquivos compartilham o mesmo banco de teste — rodam em sequência
    fileParallelism: false,
  },
});
