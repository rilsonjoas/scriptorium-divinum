import { expect, test, type Page, type Route } from '@playwright/test';
import { autor, categorias, livro, settings } from './fixtures';

/**
 * R5 (hetzner-infra/ROADMAP-CLUSTER.md): "API fora, o card some".
 *
 * Política do cluster (CONTRATOS-ENTRE-PROJETOS.md, 10.1): se a Citação do Dia (Scriptorium), a
 * Pintura do Dia (Bíblia na Arte) ou a Passagem do Dia (Lecionário) falham, o card some INTEIRO:
 * sem título solto, sem bloco vazio, sem erro de JavaScript, e a página continua usável. Nunca
 * conteúdo substituto. As três APIs são sempre simuladas, nunca as de produção.
 *
 * Roda no CI (ci.yml). O deploy.yml do Scriptorium não roda E2E.
 */

const CORS = { 'access-control-allow-origin': '*' };

const CITACAO = {
  id: '00000000-0000-0000-0000-000000000001',
  date: '2026-10-18',
  author: 'C. S. Lewis',
  text: 'Frase de teste do E2E.',
  dominioPublico: false,
  source: null,
  scriptoriumUrl: null,
  theme: null,
  affiliateUrl: null,
};

const PINTURA = {
  id: '00000000-0000-0000-0000-000000000002',
  title: 'Obra de teste do E2E',
  subtitle: null,
  artistOrDirector: 'Museu / Artista de Teste',
  year: '1900',
  imageUrl: null,
  description: 'Uma cena de teste. Outra frase.',
  sourceUrl: null,
  references: [{ book: 'Lucas', chapter: 10, verses: '34' }],
};

const VERSICULO = {
  date: '2026-10-18',
  liturgicalDay: { season: 'ordinary', color: 'green', dayName: 'Domingo' },
  verse: { type: 'gospel', reference: 'Lc 10,34', citation: 'Lucas 10:34', text: 'Versículo de teste do E2E.' },
  fallback: false,
  shifted: false,
};

type Cenario = 'ok' | 'recusada' | '503' | 'lenta';

async function simular(page: Page, cenario: Cenario) {
  // O resto do site (catálogo etc.) sempre responde, para a home de pé. Independe do ambiente: o build
  // pode apontar para localhost (VITE_API_URL) ou para produção, então cobrimos qualquer /api/v1/**.
  // No Playwright a rota registrada por último vence; esta, genérica, vai primeiro.
  const lista = { items: [], total: 0, page: 1, limit: 100, totalPages: 1 };
  await page.route('**/api/v1/**', (r) => r.fulfill({ json: lista }));
  await page.route('**/api/v1/admin/**', (r) => r.fulfill({ status: 401, json: { error: 'unauthorized' } }));
  await page.route('**/api/v1/books', (r) =>
    r.fulfill({ json: { items: [livro], total: 1, page: 1, limit: 100, totalPages: 1 } }),
  );
  await page.route('**/api/v1/settings', (r) => r.fulfill({ json: settings }));
  // /categories devolve uma LISTA (não o objeto paginado dos outros); o app chama .find nela.
  await page.route('**/api/v1/categories', (r) => r.fulfill({ json: categorias }));
  await page.route('**/api/v1/books?**', (r) =>
    r.fulfill({ json: { items: [livro], total: 1, page: 1, limit: 100, totalPages: 1 } }),
  );
  await page.route('**/api/v1/authors', (r) =>
    r.fulfill({ json: { items: [autor], total: 1, page: 1, limit: 100, totalPages: 1 } }),
  );

  // As três APIs "do dia", conforme o cenário.
  const alvos: Array<[RegExp, unknown]> = [
    [/api-scriptorium\.narniano\.com\/.*quotes\/daily|\/api\/v1\/quotes\/daily/, CITACAO],
    [/api-biblianaarte\.narniano\.com\/.*artworks\/daily/, PINTURA],
    [/lecionario\.narniano\.com\/api\/versiculo-do-dia/, VERSICULO],
  ];
  for (const [padrao, corpo] of alvos) {
    await page.route(padrao, async (route: Route) => {
      if (cenario === 'recusada') return route.abort('connectionrefused');
      if (cenario === '503') {
        return route.fulfill({ status: 503, headers: CORS, json: { error: 'indisponivel' } });
      }
      if (cenario === 'lenta') {
        // Responde CERTO, mas só depois do limite de 5 s do fetcher: sem o limite o card
        // apareceria aos 7 s; com o limite o fetch já foi abortado e o card não pode aparecer.
        await new Promise((r) => setTimeout(r, 7000));
        return route.fulfill({ status: 200, headers: CORS, json: corpo }).catch(() => undefined);
      }
      return route.fulfill({ status: 200, headers: CORS, json: corpo });
    });
  }
}

async function abrir(page: Page) {
  const errosDeJs: string[] = [];
  page.on('pageerror', (e) => errosDeJs.push(e.message));
  await page.goto('/');
  // A página em si precisa estar de pé: o que some é só o card.
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 15000 });
  return errosDeJs;
}

const titulo = (page: Page, texto: string) => page.getByRole('heading', { name: texto, exact: true });

const CARDS = ['Citação do Dia', 'Pintura do Dia', 'Passagem do Dia'];

test.describe('API fora: os cards "do dia" somem inteiros', () => {
  test('controle: com as APIs respondendo, os três cards aparecem', async ({ page }) => {
    await simular(page, 'ok');
    const erros = await abrir(page);
    for (const t of CARDS) await expect(titulo(page, t)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Frase de teste do E2E.')).toBeVisible();
    await expect(page.getByText('Obra de teste do E2E')).toBeVisible();
    expect(erros).toEqual([]);
  });

  for (const cenario of ['recusada', '503'] as const) {
    test(`API ${cenario === 'recusada' ? 'recusando a conexão' : 'respondendo 503'}: sem card, sem título solto, sem erro de JS`, async ({
      page,
    }) => {
      await simular(page, cenario);
      const erros = await abrir(page);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
      for (const t of CARDS) await expect(titulo(page, t)).toHaveCount(0);
      expect(erros).toEqual([]);
    });
  }

  test('API lenta (responde só depois do limite de tempo): sem card e a página continua usável', async ({
    page,
  }) => {
    await simular(page, 'lenta');
    const erros = await abrir(page);
    // As APIs respondem aos 7 s; o fetcher desistiu aos 5 s. Aos 8,5 s os cards seguem ausentes.
    await page.waitForTimeout(8500);
    for (const t of CARDS) await expect(titulo(page, t)).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    expect(erros).toEqual([]);
  });
});
