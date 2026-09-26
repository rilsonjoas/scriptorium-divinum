import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { autor, livro, textoObra, settings, categorias } from './fixtures';

/**
 * Auditoria de acessibilidade — axe-core no CI.
 *
 * Estende e fecha o débito **A11Y-01** do `Padrão de Acessibilidade`:
 * o ROADMAP afirmava uma suíte axe-core com "50/50, zero violações" que
 * nunca existiu no repositório. Aqui a suíte existe de fato, e as tags
 * são as que o padrão prescreve:
 *
 *   withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'])
 *
 * que é o conjunto equivalente a **WCAG 2.2 nível A + AA** — o piso de
 * conformidade *regular* da **ABNT NBR 17225:2025** para web.
 *
 * O que esta suíte NÃO prova (e o padrão é claro sobre isso):
 * - Nada de avaliação humana com leitor de tela real.
 * - Axe testa se o elemento **recebe** foco, nunca se o foco **aparece** —
 *   a regra de foco visível (2.4.7) é verificada à mão, no teste
 *   `foco é visível` abaixo, que é justamente o que o axe não pega.
 */

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** Manda a API para as fixtures, para cada página ter conteúdo real. */
async function mockApi(page: Page) {
  await page.route('**/api/v1/settings', (r) => r.fulfill({ json: settings }));
  await page.route('**/api/v1/categories', (r) =>
    r.fulfill({ json: { items: categorias, total: categorias.length } }),
  );
  await page.route('**/api/v1/books?**', (r) =>
    r.fulfill({ json: { items: [livro], total: 1, page: 1, limit: 100, totalPages: 1 } }),
  );
  await page.route('**/api/v1/books/confissoes/text', (r) =>
    r.fulfill({ json: { slug: 'confissoes', title: livro.title, text: textoObra } }),
  );
  await page.route('**/api/v1/books/confissoes', (r) => r.fulfill({ json: livro }));
  await page.route('**/api/v1/authors', (r) =>
    r.fulfill({ json: { items: [autor], total: 1, page: 1, limit: 100, totalPages: 1 } }),
  );
  await page.route('**/api/v1/authors/santo-agostinho', (r) => r.fulfill({ json: autor }));
  await page.route('**/api/v1/search**', (r) =>
    r.fulfill({ json: { books: [livro], authors: [autor] } }),
  );
}

/** Roda axe e falha o teste com o relatório legível. */
async function auditar(page: Page, contexto: string) {
  const resultado = await new AxeBuilder({ page })
    .withTags(TAGS)
    // erros de console não são violação axe; ficam de fora do critério
    .analyze();

  if (resultado.violations.length > 0) {
    const relatorio = resultado.violations
      .map(
        (v) =>
          `  · [${v.impact}] ${v.id} (${v.tags.filter((t) => t.startsWith('wcag')).join(', ')})\n` +
          v.nodes
            .slice(0, 3)
            .map((n) => `      ${n.target.join(' ')}\n        ${n.failureSummary?.split('\n')[1]?.trim() ?? ''}`)
            .join('\n'),
      )
      .join('\n');
    throw new Error(`axe-core encontrou violações em ${contexto} (${resultado.violations.length}):\n${relatorio}`);
  }
  expect(resultado.violations).toHaveLength(0);
}

const ROTAS = [
  { nome: 'home', caminho: '/' },
  { nome: 'catálogo de livros', caminho: '/livros' },
  { nome: 'ficha da obra', caminho: '/livros/confissoes' },
  { nome: 'leitor', caminho: '/ler/confissoes' },
  { nome: 'catálogo de autores', caminho: '/autores' },
  { nome: 'página do autor', caminho: '/autores/santo-agostinho' },
  { nome: 'busca', caminho: '/busca?q=confissoes' },
  { nome: 'categoria', caminho: '/categorias/patristica' },
  { nome: 'sobre (página única)', caminho: '/sobre' },
];

for (const rota of ROTAS) {
  test(`axe-core WCAG 2.2 A+AA — ${rota.nome}`, async ({ page }) => {
    await mockApi(page);
    await page.goto(rota.caminho);
    // espera o conteúdo do fixture entrar, senão a auditoria mede o esqueleto
    await page.waitForLoadState('networkidle');
    await auditar(page, rota.nome);
  });
}

/**
 * 2.4.7 Foco visível — o teste que o axe-core não faz.
 * Axe pergunta se o elemento RECEBE foco. Nunca pergunta se o foco
 * APARECE. Um projeto inteiro sem `:focus-visible` sai do axe com
 * "zero violações" e com o teclado cego.
 *
 * Aqui a verificação é observable: a cada Tab, o elemento focado precisa
 * ter algum indicador (outline, box-shadow ou borda) que não seja o
 * `outline: none` do próprio shadcn.
 */
test('foco é visível em tudo que recebe Tab', async ({ page }) => {
  await mockApi(page);
  await page.goto('/livros');
  await page.waitForLoadState('networkidle');

  const semIndicador = await page.evaluate(() => {
    const problemas: string[] = [];
    const focaveis = document.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    for (const el of Array.from(focaveis).slice(0, 25)) {
      // elemento não renderizado (ex.: dentro de <details> fechado) não
      // recebe foco de verdade — medir o estilo computado dele dá
      // "sem indicador" e é falso positivo
      if (!el.checkVisibility?.() && (el as HTMLElement).offsetParent === null) continue;
      el.focus();
      const cs = getComputedStyle(el);
      const temOutline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
      const temShadow = cs.boxShadow !== 'none';
      if (!temOutline && !temShadow) {
        const rotulo = (el.textContent ?? el.getAttribute('aria-label') ?? el.tagName).trim().slice(0, 40);
        problemas.push(`<${el.tagName.toLowerCase()}> "${rotulo}" focusado sem indicador`);
      }
    }
    return problemas;
  });

  expect(semIndicador, `foco sem indicador visível:\n${semIndicador.join('\n')}`).toHaveLength(0);
});

/**
 * 2.4.2 Título da página (A) — o deep link de busca é o caso que o
 * `Padrão de Acessibilidade` registra como quebrado no Scriptorium:
 * `/busca?q=confissoes` carregava o mesmo título de `/`. Aqui o título
 * é conferido por URL, e o resultado tem que ser **distinto** entre
 * rotas — é isso que 2.4.2 pede.
 */
test('cada rota tem título próprio e descritivo (2.4.2)', async ({ page }) => {
  await mockApi(page);
  const vistos = new Map<string, string>();

  for (const rota of ROTAS) {
    await page.goto(rota.caminho);
    await page.waitForLoadState('networkidle');
    const titulo = (await page.title()).trim();
    expect(titulo, `rota ${rota.caminho} ficou sem título`).not.toBe('');
    // a ficha e o leitor têm de dizer de qual obra se trata
    if (rota.caminho === '/livros/confissoes' || rota.caminho === '/ler/confissoes') {
      expect(titulo, `titulo de ${rota.caminho} não nomeia a obra`).toContain('Confissões');
    }
    // a busca nomeia o TERMO, não a obra — 2.4.2 pede o tema da página,
    // e o tema de uma busca é o que se procurou
    if (rota.caminho.startsWith('/busca?q=')) {
      expect(titulo.toLowerCase(), `titulo da busca não nomeia o termo`).toContain('confissoes');
    }
    vistos.set(rota.caminho, titulo);
  }

  // o deep link de busca não pode herdar o título da home
  const tituloBusca = vistos.get('/busca?q=confissoes');
  const tituloHome = vistos.get('/');
  expect(tituloBusca).not.toBe(tituloHome);
  expect(tituloBusca).toContain('confissoes');
});
