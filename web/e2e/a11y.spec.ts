import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { autor, livro, textoObra, settings, categorias, listaAdminCitacoes, adminLogado } from './fixtures';

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

/** Anúncios do Google: terceiro, fora do nosso controle. O iframe que o AdSense injeta (às vezes sim, às vezes
 *  não, conforme a rede do runner) recebe Tab sem o nosso indicador de foco e fazia o teste de foco falhar de forma
 *  intermitente (main de 18/10/2026). Bloquear os scripts deixa a auditoria determinística e só sobre o nosso app. */
const ANUNCIOS = /googlesyndication|doubleclick|adtrafficquality|googleadservices|adsbygoogle/;

/** Manda a API para as fixtures, para cada página ter conteúdo real. */
async function mockApi(page: Page) {
  await page.route(ANUNCIOS, (r) => r.abort());
  await page.route('**/api/v1/settings', (r) => r.fulfill({ json: settings }));
  // /categories devolve uma LISTA (não o objeto paginado dos outros). Com o formato errado a home
  // quebrava (`.find is not a function`) e o axe auditava uma página em branco.
  await page.route('**/api/v1/categories', (r) => r.fulfill({ json: categorias }));
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

/** Sessão de administrador e a listagem de citações, para auditar as telas de /admin. */
async function mockAdminApi(page: Page) {
  await mockApi(page);
  await page.route('**/api/v1/admin/me', (r) => r.fulfill({ json: adminLogado }));
  await page.route('**/api/v1/admin/quotes?**', (r) => r.fulfill({ json: listaAdminCitacoes }));
  await page.route('**/api/v1/admin/quotes', (r) => r.fulfill({ json: listaAdminCitacoes }));
}

/** Roda axe e falha o teste com o relatório legível. */
async function auditar(page: Page, contexto: string) {
  // As seções entram com animação (opacidade parcial): medir no meio dela dá contraste falso. Espera terminar.
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))));
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
  { nome: 'catálogo de categorias', caminho: '/categorias' },
  { nome: 'categoria', caminho: '/categorias/patristica' },
  { nome: 'sobre (página única)', caminho: '/sobre' },
];

for (const rota of ROTAS) {
  test(`axe-core WCAG 2.2 A+AA — ${rota.nome}`, async ({ page }) => {
    // A11Y-02 (corrigido em 18/10/2026): o dourado de texto sobre fundo claro era #f2c75a (1,44:1) e #b39a61 (2,45:1);
    // agora --library-dourado-leitura (#80651a, 4,99:1). Se este teste voltar a falhar na home, o dourado regrediu.
    await mockApi(page);
    await page.goto(rota.caminho);
    // espera o conteúdo do fixture entrar, senão a auditoria mede o esqueleto
    await page.waitForLoadState('networkidle');
    await auditar(page, rota.nome);
  });
}

/** Rótulos dos elementos que recebem foco sem outline nem sombra (os 25 primeiros visíveis). */
async function focoSemIndicador(page: Page): Promise<string[]> {
  return page.evaluate(() => {
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

  const semIndicador = await focoSemIndicador(page);

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


/**
 * Painel de citações (/admin/citacoes). A API é simulada: sessão de administrador e a listagem de `listaAdminCitacoes`.
 * O dourado de texto sobre fundo claro (A11Y-02) e a cor dos erros são os pontos mais prováveis de falha aqui.
 */
async function abrirPainelDeCitacoes(page: Page) {
  await mockAdminApi(page);
  await page.goto('/admin/citacoes');
  await page.getByText('Fizeste-nos para ti, e inquieto está o nosso coração.').waitFor();
  await page.waitForLoadState('networkidle');
}

test('axe-core WCAG 2.2 A+AA — admin: citações', async ({ page }) => {
  await abrirPainelDeCitacoes(page);
  await auditar(page, 'admin: citações');
});

test('axe-core WCAG 2.2 A+AA — admin: citações, diálogo de ocultar aberto', async ({ page }) => {
  await abrirPainelDeCitacoes(page);
  await page.getByRole('button', { name: 'Ocultar citação de C. S. Lewis' }).click();
  await page.getByRole('dialog').waitFor();
  // Lewis: o aviso do Gerador (passos e link) entra na auditoria junto com o diálogo
  await page.getByRole('note').getByText('Depois, atualize a cópia do Gerador C. S. Lewis').waitFor();
  await auditar(page, 'admin: citações, ocultar');
});

test('axe-core WCAG 2.2 A+AA — admin: citações, edição de Lewis com aviso do Gerador', async ({ page }) => {
  await abrirPainelDeCitacoes(page);
  await page.getByRole('button', { name: 'Editar citação de C. S. Lewis' }).click();
  const dialogo = page.getByRole('dialog');
  await dialogo.waitFor();
  await dialogo.getByLabel(/^Texto/).press('End');
  await dialogo.getByLabel(/^Texto/).pressSequentially(' acréscimo');
  await dialogo.getByRole('note').getByText('Depois, atualize a cópia do Gerador C. S. Lewis').waitFor();
  await auditar(page, 'admin: citações, editar Lewis');
});

test('axe-core WCAG 2.2 A+AA — admin: citações, formulário de nova citação aberto', async ({ page }) => {
  await abrirPainelDeCitacoes(page);
  await page.getByRole('button', { name: 'Nova citação' }).click();
  const dialogo = page.getByRole('dialog');
  await dialogo.waitFor();
  // um erro visível entra na auditoria: a cor da mensagem também precisa de contraste
  await dialogo.getByLabel(/^Autor/).selectOption({ label: 'Outro autor (novo)…' });
  await dialogo.getByLabel('Nome do novo autor').fill('C.S. Lewis');
  await dialogo.getByText(/Já existe este autor escrito assim/).waitFor();
  await dialogo.getByRole('button', { name: 'Hoje' }).click();
  await dialogo.getByLabel(/^Texto/).fill('a');
  await dialogo.getByLabel(/^Texto/).fill('');
  await dialogo.getByText('Informe o texto da citação.').waitFor();
  await auditar(page, 'admin: citações, nova citação');
});

test('foco é visível em tudo que recebe Tab — admin: citações', async ({ page }) => {
  await abrirPainelDeCitacoes(page);
  const semIndicador = await focoSemIndicador(page);
  expect(semIndicador, `foco sem indicador visível:\n${semIndicador.join('\n')}`).toHaveLength(0);
});

/**
 * Contraste medido à mão para texto sobre fundo com textura/transparência: o axe devolve "incompleto" (não
 * violação) quando o fundo tem `background-image` ou alfa, e passa em silêncio. Foi assim que o dourado claro
 * (`library-dourado-texto`, 1,3:1) ficou nos cartões de categoria sem o teste acusar (30/10/2026).
 * Compõe o alfa dos fundos até a raiz sobre branco e compara com a cor do texto (WCAG 1.4.3, 4,5:1).
 */
async function razaoDeContraste(page: Page, seletor: string): Promise<number> {
  return page.evaluate((sel) => {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) throw new Error(`não achei ${sel}`);
    const rgba = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number) as number[];
    const camadas: number[][] = [];
    for (let n: HTMLElement | null = el; n; n = n.parentElement) {
      const c = rgba(getComputedStyle(n).backgroundColor);
      if (c.length >= 3 && (c[3] ?? 1) > 0) camadas.push(c);
    }
    // de fora para dentro, sobre branco
    let fundo = [255, 255, 255];
    for (const c of camadas.reverse()) {
      const a = c[3] ?? 1;
      fundo = fundo.map((v, i) => Math.round((c[i] ?? 0) * a + v * (1 - a)));
    }
    const lum = (c: number[]) => {
      const [r, g, b] = c.map((v) => {
        const s = (v ?? 0) / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
    };
    const texto = rgba(getComputedStyle(el).color).slice(0, 3);
    const [a, b] = [lum(texto), lum(fundo)].sort((x, y) => y - x);
    return ((a ?? 0) + 0.05) / ((b ?? 0) + 0.05);
  }, seletor);
}

for (const alvo of [
  { caminho: '/categorias', seletor: 'div.group span.font-mono', nome: 'contagem de obras no cartão' },
  { caminho: '/categorias', seletor: 'div.group div.border-t', nome: 'chamada "Explorar Estante"' },
  { caminho: '/categorias/patristica', seletor: 'div.inline-flex.rounded-full', nome: 'selo com a contagem de obras' },
]) {
  test(`contraste do dourado no tema claro >= 4,5:1 — ${alvo.nome} (${alvo.caminho})`, async ({ page }) => {
    await mockApi(page);
    await page.goto(alvo.caminho);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.getAnimations().forEach((a) => a.finish()));
    const razao = await razaoDeContraste(page, alvo.seletor);
    expect(razao, `contraste ${razao.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
  });
}

/**
 * Contraste do herói da home, medido no PIXEL renderizado.
 *
 * O axe não pega isto: o herói tem gradiente e textura de fundo, e o axe só
 * vê `background-color`. Em 30/10/2026 o texto dourado do herói dava 1,34 a
 * 1,64:1 no tema claro (mínimo 4,5:1) e passava no CI. Aqui o texto fica
 * transparente, o elemento é fotografado, e o PIOR pixel de fundo é comparado
 * com a cor real do texto.
 */
async function piorContrastePorPixel(page: Page, seletor: string): Promise<number> {
  const alvo = page.locator(seletor).first();
  await alvo.waitFor();
  const cor = await alvo.evaluate((e) => getComputedStyle(e).color);
  await alvo.evaluate((e) => {
    e.dataset.corOriginal = e.style.color;
    e.style.color = 'transparent';
  });
  const png = await alvo.screenshot();
  await alvo.evaluate((e) => {
    e.style.color = e.dataset.corOriginal ?? '';
  });
  return page.evaluate(
    async ({ b64, cor }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const g = c.getContext('2d')!;
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      const lum = (r: number, gg: number, b: number) =>
        [r, gg, b]
          .map((v) => {
            const s = v / 255;
            return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
          })
          .reduce((soma, v, i) => soma + v * [0.2126, 0.7152, 0.0722][i]!, 0);
      const t = (cor.match(/[\d.]+/g) ?? []).map(Number);
      const lt = lum(t[0]!, t[1]!, t[2]!);
      let pior = Infinity;
      for (let i = 0; i < d.length; i += 4) {
        const lb = lum(d[i]!, d[i + 1]!, d[i + 2]!);
        const [alto, baixo] = lt > lb ? [lt, lb] : [lb, lt];
        pior = Math.min(pior, (alto + 0.05) / (baixo + 0.05));
      }
      return pior;
    },
    { b64: png.toString('base64'), cor },
  );
}

const TEXTOS_DO_HEROI = [
  { nome: 'selo "Biblioteca Teológica Clássica"', seletor: 'section span.truncate' },
  { nome: 'lema "In principio erat Verbum"', seletor: 'section p.font-heading' },
  { nome: 'descrição "Explore o vasto tesouro…"', seletor: 'section p.font-body' },
  { nome: 'número de obras', seletor: 'section h3.font-heading >> nth=0' },
  { nome: 'número de autores', seletor: 'section h3.font-heading >> nth=1' },
  { nome: 'selo "100%"', seletor: 'section h3.font-heading >> nth=2' },
  { nome: 'legenda dos números', seletor: 'section div.group p.font-body >> nth=0' },
];

for (const tema of ['light', 'dark'] as const) {
  for (const texto of TEXTOS_DO_HEROI) {
    test(`contraste do herói da home >= 4,5:1 no tema ${tema === 'light' ? 'claro' : 'escuro'} — ${texto.nome}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('scriptorium:theme', t), tema);
      await mockApi(page);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // a home tem animações infinitas (brilho dourado): `finish()` falha nelas, então só as finitas são concluídas
      await page.evaluate(() =>
        document.getAnimations().forEach((a) => {
          try {
            a.finish();
          } catch {
            /* infinita: deixa como está */
          }
        }),
      );
      const razao = await piorContrastePorPixel(page, texto.seletor);
      expect(razao, `contraste ${razao.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
    });
  }
}
