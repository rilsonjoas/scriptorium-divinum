import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['src/**/*.integration.test.ts', 'node_modules', 'dist'],
    // Pinos de ambiente: sem isso, um teste unitário que leia `env` herda o
    // `.env` local e a suíte passa a depender da máquina. Ver src/test/test-env.ts.
    setupFiles: ['./src/test/unit-setup.ts'],
  },
});
