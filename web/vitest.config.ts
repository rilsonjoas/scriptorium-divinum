import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // O default de 5s é apertado para os testes que montam página
    // inteira com mocks de rede (LivroDetalhes, CitacaoDoDia, Reader):
    // passam isolados em ~3s, mas sob paralelismo local passam de 5s
    // e a suíte fica vermelha sem que nada tenha mudado. 15s dá folga
    // sem mascarar travamento real (o CI roda mais rápido, mas o mesmo
    // limite protege o contribuidor local).
    testTimeout: 15_000,
  },
});
