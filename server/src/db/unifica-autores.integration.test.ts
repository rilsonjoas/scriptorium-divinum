import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { buildApp } from '../app.js';
import { closeDb } from './client.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, './migrations');
const SQL = path.join(MIGRATIONS_DIR, '0021_unifica_autores_duplicados.sql');

const CANON = '00000000-0000-0000-0000-0000000000a1';
const DUP = '00000000-0000-0000-0000-0000000000a2';

describe('migration 0021: unifica autores duplicados', () => {
  let admin: postgres.Sql;
  let app: Awaited<ReturnType<typeof buildApp>>;
  const rodar = () => admin.unsafe(readFileSync(SQL, 'utf-8'));
  const livro = (slug: string, autor: string) =>
    admin.unsafe(`INSERT INTO books (slug, title, author_id, description) VALUES ('${slug}', 'T ${slug}', '${autor}', 'd')`);
  const autores = async () =>
    admin.unsafe<{ slug: string; name: string; birth_year: number | null; death_year: number | null; bio_summary: string | null }[]>(
      'SELECT slug, name, birth_year, death_year, bio_summary FROM authors ORDER BY slug',
    );

  beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL não definida nos testes de integração');
    admin = postgres(url, { max: 1 });
    await migrate(drizzle(admin), { migrationsFolder: MIGRATIONS_DIR });
    app = await buildApp();
    await app.ready();
  });

  beforeEach(async () => {
    await admin.unsafe('TRUNCATE authors, books, quotes, quote_events RESTART IDENTITY CASCADE');
    // par real da migration: canônico agostinho-de-hipona (mais obras, sem datas), duplicado santo-agostinho (com datas e bio curta)
    await admin.unsafe(`
      INSERT INTO authors (id, slug, name, bio_summary) VALUES ('${CANON}', 'agostinho-de-hipona', 'Santo Agostinho de Hipona', 'Bio longa do bispo de Hipona, doutor da Igreja.');
      INSERT INTO authors (id, slug, name, birth_year, death_year, bio_summary) VALUES ('${DUP}', 'santo-agostinho', 'Santo Agostinho de Hipona', 354, 430, 'Bio curta');
    `);
  });

  afterAll(async () => {
    if (app) await app.close();
    if (admin) await admin.end({ timeout: 5 });
    await closeDb();
  });

  it('move as obras, completa os anos, guarda o alias e apaga o duplicado', async () => {
    await livro('contra-a-mentira', CANON);
    await livro('confissoes', DUP);
    await rodar();
    const a = await autores();
    expect(a).toHaveLength(1);
    expect(a[0]).toMatchObject({ slug: 'agostinho-de-hipona', birth_year: 354, death_year: 430, bio_summary: 'Bio longa do bispo de Hipona, doutor da Igreja.' });
    const obras = await admin.unsafe<{ slug: string; autor: string }[]>(
      'SELECT b.slug, a.slug AS autor FROM books b JOIN authors a ON a.id = b.author_id ORDER BY b.slug',
    );
    expect(obras).toEqual([
      { slug: 'confissoes', autor: 'agostinho-de-hipona' },
      { slug: 'contra-a-mentira', autor: 'agostinho-de-hipona' },
    ]);
    const alias = await admin.unsafe<{ alias: string }[]>('SELECT alias FROM author_slug_aliases');
    expect(alias.map((x) => x.alias)).toEqual(['santo-agostinho']);
  });

  it('é idempotente (rodar de novo não muda nem quebra)', async () => {
    await livro('confissoes', DUP);
    await rodar();
    await rodar();
    expect(await autores()).toHaveLength(1);
    expect((await admin.unsafe('SELECT * FROM author_slug_aliases')).length).toBe(1);
  });

  it('só unifica quando os dois existem: sem o duplicado, nada muda; sem o canônico, o duplicado fica', async () => {
    await admin.unsafe(`DELETE FROM authors WHERE id = '${DUP}'`);
    await rodar();
    expect((await autores()).map((x) => x.slug)).toEqual(['agostinho-de-hipona']);
    await admin.unsafe('TRUNCATE authors CASCADE');
    await admin.unsafe(`INSERT INTO authors (id, slug, name) VALUES ('${DUP}', 'santo-agostinho', 'Santo Agostinho')`);
    await rodar();
    expect((await autores()).map((x) => x.slug)).toEqual(['santo-agostinho']);
  });

  it('aplica o nome melhor quando o par pede (Tomás de Aquino)', async () => {
    await admin.unsafe(`
      INSERT INTO authors (slug, name) VALUES ('sao-tomas-de-aquino', 'São Tomás de Aquino'), ('tomas-de-aquino', 'Santo Tomás de Aquino');
    `);
    await rodar();
    const a = await autores();
    expect(a.find((x) => x.slug === 'sao-tomas-de-aquino')?.name).toBe('São Tomás de Aquino');
    expect(a.find((x) => x.slug === 'tomas-de-aquino')).toBeUndefined();
  });

  it('API: a URL do slug antigo resolve para o autor canônico (o site redireciona por isso)', async () => {
    await livro('confissoes', DUP);
    await rodar();
    const res = await app.inject({ method: 'GET', url: '/api/v1/authors/santo-agostinho' });
    expect(res.statusCode).toBe(200);
    expect(res.json().slug).toBe('agostinho-de-hipona');
    expect(res.json().birthYear).toBe(354);
    const canonico = await app.inject({ method: 'GET', url: '/api/v1/authors/agostinho-de-hipona' });
    expect(canonico.json().slug).toBe('agostinho-de-hipona');
    const nenhum = await app.inject({ method: 'GET', url: '/api/v1/authors/nao-existe-mesmo' });
    expect(nenhum.statusCode).toBe(404);
  });
});
