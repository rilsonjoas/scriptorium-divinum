import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { buildApp } from '../app.js';
import { closeDb } from '../db/client.js';

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
         true, '10000000-0000-0000-0000-000000000001', 'https://scriptorium.narniano.com/livros/confissoes', NULL);
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
    expect(body.affiliateUrl).toContain('tag=rilson-20');
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
    expect(body.length).toBe(4);
    expect(body[0]).toHaveProperty('text');
  });

  it('GET /api/v1/quotes/daily — sem date usa "hoje" em America/Sao_Paulo', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/quotes/daily' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('id');
  });
});