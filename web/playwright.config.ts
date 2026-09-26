import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright — usado só pela auditoria de acessibilidade (axe-core).
 *
 * Não há teste end-to-end de fluxo no projeto: a suíte de comportamento fica no
 * Vitest. O que motivou isto é o débito A11Y-01 do
 * `Padrão de Acessibilidade`: o ROADMAP afirmava "axe-core, 50/50, zero
 * violações" e **não existia suíte nenhuma** — o número era inventado.
 * A regra do padrão é literally: *só declaro o nível que o CI prova*.
 */
export default defineConfig({
  testDir: './e2e',
  // axe em página real é mais lento que um unitário
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // build de produção servido localmente: é o mesmo artefato que vai
    // para a VPS, então a auditoria roda sobre o que existe de fato
    command: 'pnpm build && pnpm preview --port 4173 --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
