import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { buildApp } from '../app.js';
import { closeDb } from '../db/client.js';
import { env } from '../config.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, '../db/migrations');
const FUNCTIONS_SQL = path.join(import.meta.dirname, '../db/custom-sql/functions.sql');

describe('Quotes API — Citação do dia (ADR 001)', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let admin: postgres.Sql;

  beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL não definida nos testes de integração');

    admin = postgres(url, { max: 1 });
    const adminDb = drizzle(admin);

    await migrate(adminDb, { migrationsFolder: MIGRATIONS_DIR });
    await admin.unsafe(readFileSync(FUNCTIONS_SQL, 'utf-8'));

    await admin.unsafe('TRUNCATE authors, books, quotes RESTART IDENTITY CASCADE');

    // 5 citações: 4 Lewis (não-públicas) + 1 Agostinho (domínio público)
    await admin.unsafe(`
      INSERT INTO authors (id, slug, name, birth_year, death_year) VALUES
        ('00000000-0000-0000-0000-000000000001', 'santo-agostinho', 'Santo Agostinho', 354, 430),
        ('00000000-0000-0000-0000-000000000011', 'c-s-lewis', 'C. S. Lewis', 1898, 1963);

      INSERT INTO books (id, slug, title, author_id, publication_year_original, description, categories, tags, featured) VALUES
        ('10000000-0000-0000-0000-000000000001', 'confissoes', 'Confissões',
         '00000000-0000-0000-0000-000000000001', '397', 'Autobiografia espiritual',
         ARRAY['Patrística'], ARRAY['conversão'], true),
        ('10000000-0000-0000-0000-000000000002', 'cartas-a-malcolm', 'Cartas a Malcolm',
         '00000000-0000-0000-0000-000000000011', '1964', 'Cartas sobre a oração',
         ARRAY['Anglicana'], ARRAY['oração'], false);

      INSERT INTO quotes (id, author, text, source, dominio_publico, scriptorium_work_id, scriptorium_url, theme) VALUES
        ('30000000-0000-0000-0000-000000000001', 'C. S. Lewis', 'Alegria é o assunto sério do Céu.', 'Cartas a Malcolm',
         false, '10000000-0000-0000-0000-000000000002', NULL, NULL),
        ('30000000-0000-0000-0000-000000000002', 'C. S. Lewis', 'Você nunca é velho demais para definir um novo objetivo.',
         'O Problema do Sofrimento', false, NULL, NULL, NULL),
        ('30000000-0000-0000-0000-000000000003', 'C. S. Lewis', 'A fé é a arte de se segurar em coisas que a sua razão aceitou.', 'Cartas de um Diabo a seu Aprendiz',
         false, NULL, NULL, 'ceus'),
        ('30000000-0000-0000-0000-000000000004', 'C. S. Lewis', 'Ele morreu não por homens, mas por ele mesmo.', 'Cristianismo Puro e Simples',
         false, NULL, NULL, NULL),
        ('30000000-0000-0000-0000-000000000005', 'Santo Agostinho', 'Fizeste-nos para ti, e o nosso coração está inquieto enquanto não repousa em ti.', 'Confissões',
         true, '10000000-0000-0000-0000-000000000001', 'https://scriptorium.narniano.com/livros/confissoes', NULL),
        ('30000000-0000-0000-0000-000000000006', 'C. S. Lewis', 'A fé caminha a passos largos no escuro, pois tem a mão firme de Deus a guiá-la.', 'Cheque-Livro do Banco da Fé',
         false, NULL, NULL, NULL),
        ('30000000-0000-0000-0000-000000000007', 'C. S. Lewis', 'Se você está no caminho errado, voltar atrás significa progresso.', 'C. S. Lewis',
         false, NULL, NULL, NULL);
    `);

    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
    if (admin) await admin.end({ timeout: 5 });
    await closeDb();
  });

  it('GET /api/v1/quotes/daily — mesma data, mesma citação (determinístico)', async () => {
    const a = await app.inject({ method: 'GET', url: '/api/v1/quotes/daily?date=2026-09-23' });
    const b = await app.inject({ method: 'GET', url: '/api/v1/quotes/daily?date=2026-09-23' });
    expect(a.statusCode).toBe(200);
    expect(b.statusCode).toBe(200);
    expect(a.json().id).toBe(b.json().id);
  });

  it('GET /api/v1/quotes/daily — datas diferentes, citação diferente', async () => {
    const a = await app.inject({ method: 'GET', url: '/api/v1/quotes/daily?date=2026-09-22' });
    const b = await app.inject({ method: 'GET', url: '/api/v1/quotes/daily?date=2026-09-23' });
    expect(a.json().id).not.toBe(b.json().id);
  });

  it('GET /api/v1/quotes/daily — anexa a data de referência na resposta', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/quotes/daily?date=2026-09-23' });
    expect(res.statusCode).toBe(200);
    expect(res.json().date).toBe('2026-09-23');
  });

  it('GET /api/v1/quotes/daily — Lewis retorna affiliateUrl e dominioPublico=false', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/quotes/daily?date=2026-09-23&author=C.%20S.%20Lewis',
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.author).toBe('C. S. Lewis');
    expect(body.dominioPublico).toBe(false);
    expect(body.affiliateUrl).toContain('amazon.com.br');
    expect(body.affiliateUrl).toContain(`tag=${env.AMAZON_AFFILIATE_TAG}`);
  });

  it('GET /api/v1/quotes/daily — domínio público não gera affiliateUrl', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/quotes/daily?date=2026-09-23&author=Santo%20Agostinho',
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().affiliateUrl).toBeNull();
  });

  it('GET /api/v1/quotes/random — dentro do acervo e respeitando filtro de autor', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/quotes/random?author=C.%20S.%20Lewis' });
    expect(res.statusCode).toBe(200);
    expect(res.json().author).toBe('C. S. Lewis');
  });

  it('GET /api/v1/quotes/random — autor inexistente → 404', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/quotes/random?author=Desconhecido' });
    expect(res.statusCode).toBe(404);
  });

  it('GET /api/v1/quotes — lista com filtro por autor', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/quotes?author=C.%20S.%20Lewis' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.length).toBe(6);
    expect(body[0]).toHaveProperty('text');
  });

  it('GET /api/v1/quotes/daily — sem date usa "hoje" em America/Sao_Paulo', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/quotes/daily' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('id');
  });

  it('obra inexistente não gera CTA, mas a citação continua sendo servida', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/quotes?author=C.%20S.%20Lewis' });
    const body = res.json() as { text: string; source: string; affiliateUrl: string | null }[];
    const fabricada = body.find((q) => q.source === 'Cheque-Livro do Banco da Fé');
    expect(fabricada).toBeDefined();
    expect(fabricada?.affiliateUrl).toBeNull();
    expect(fabricada?.text).toContain('A fé caminha a passos largos');
  });

  it('source igual ao nome do autor não gera CTA', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/quotes?author=C.%20S.%20Lewis' });
    const body = res.json() as { source: string; affiliateUrl: string | null }[];
    const semObra = body.find((q) => q.source === 'C. S. Lewis');
    expect(semObra).toBeDefined();
    expect(semObra?.affiliateUrl).toBeNull();
  });

  it('filtro de autor tolera variação de caixa e espaços extras', async () => {
    // Antes o filtro era eq() exato: estas variações devolviam [] em silêncio,
    // o que desligava o Gerador C. S. Lewis sem erro nenhum.
    const variacoes = [
      'c.%20s.%20lewis', // caixa baixa
      'C.%20%20S.%20%20Lewis', // espaço duplo entre as iniciais
      '%20C.%20S.%20Lewis%20', // espaço no começo e no fim
    ];
    for (const autor of variacoes) {
      const res = await app.inject({ method: 'GET', url: `/api/v1/quotes?author=${autor}` });
      expect(res.statusCode, `autor=${autor}`).toBe(200);
      expect((res.json() as unknown[]).length, `autor=${autor}`).toBe(6);
    }
  });

  it('filtro de autor continua rejeitando quem não existe', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/quotes?author=Desconhecido' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveLength(0);
  });

  it('normalização não embaralha autores com nomes parecidos', async () => {
    // Regressão do escape: com `'\s+'` sem escape duplo o padrão chegava ao
    // Postgres como 's+', que troca a letra "s" por espaço. Aí "Assis
    // Effingers" e "Assi Effingers" viravam a mesma string e o filtro devolvia
    // as citações do autor errado — bem pior do que devolver [].
    await admin.unsafe(`
      INSERT INTO quotes (id, author, text, source, dominio_publico) VALUES
        ('30000000-0000-0000-0000-0000000000ff', 'Assis Effingers', ' Citação de teste. ', 'O Peregrino', false)
    `);
    try {
      const exato = await app.inject({ method: 'GET', url: '/api/v1/quotes?author=Assis%20Effingers' });
      expect(exato.statusCode).toBe(200);
      expect(exato.json()).toHaveLength(1);

      const parecido = await app.inject({ method: 'GET', url: '/api/v1/quotes?author=Assi%20Effingers' });
      expect(parecido.statusCode).toBe(200);
      expect(parecido.json(), 'autor parecido não pode vazar as citações do outro').toHaveLength(0);
    } finally {
      await admin.unsafe(`DELETE FROM quotes WHERE id = '30000000-0000-0000-0000-0000000000ff'`);
    }
  });
});