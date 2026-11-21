import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { closeDb } from './client.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, './migrations');
const SQL = path.join(MIGRATIONS_DIR, '0024_proveniencia_pais_da_igreja_confirmada.sql');

/** Migration 0024: grava a edição-fonte confirmada em obras de Pais da Igreja (21/11/2026). */
describe('migration 0024: proveniência dos Pais da Igreja', () => {
  let admin: postgres.Sql;
  const rodar = () => admin.unsafe(readFileSync(SQL, 'utf-8'));
  const obra = (slug: string, pub = true) =>
    admin.unsafe(
      `INSERT INTO books (slug, title, author_id, description, translation_is_ai, published, attribution_text)
       SELECT '${slug}', 'T ${slug}', id, 'd', true, ${pub}, 'Tradução gerada por IA a partir de obra em domínio público.' FROM authors WHERE slug = 'a'`,
    );
  const atrib = async (slug: string) =>
    (await admin.unsafe<{ attribution_text: string }[]>(`SELECT attribution_text FROM books WHERE slug = '${slug}'`))[0]?.attribution_text;

  beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL não definida nos testes de integração');
    admin = postgres(url, { max: 1 });
    await migrate(drizzle(admin), { migrationsFolder: MIGRATIONS_DIR });
  });
  beforeEach(async () => {
    await admin.unsafe('TRUNCATE authors, books, quotes, quote_events RESTART IDENTITY CASCADE');
    await admin.unsafe(`INSERT INTO authors (slug, name) VALUES ('a', 'Autor')`);
  });
  afterAll(async () => {
    if (admin) await admin.end({ timeout: 5 });
    await closeDb();
  });

  it('grava a edição, preserva a licença e não mexe em outras obras nem em obra oculta', async () => {
    await obra('contra-praxeas-tertuliano');
    await obra('sobre-os-caidos-cipriano', false);
    await obra('outra-obra');
    await rodar();
    expect(await atrib('contra-praxeas-tertuliano')).toContain('ANF vol. 3');
    expect(await atrib('contra-praxeas-tertuliano')).toContain('CC BY-SA 4.0');
    expect(await atrib('sobre-os-caidos-cipriano')).toBe('Tradução gerada por IA a partir de obra em domínio público.');
    expect(await atrib('outra-obra')).toBe('Tradução gerada por IA a partir de obra em domínio público.');
  });

  it('é idempotente', async () => {
    await obra('contra-praxeas-tertuliano');
    await rodar();
    const a = await atrib('contra-praxeas-tertuliano');
    await rodar();
    expect(await atrib('contra-praxeas-tertuliano')).toBe(a);
  });
});
