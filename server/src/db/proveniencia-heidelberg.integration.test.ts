import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { closeDb } from './client.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, './migrations');
const SQL = path.join(MIGRATIONS_DIR, '0025_proveniencia_heidelberg.sql');

describe('migration 0025: proveniência do Catecismo de Heidelberg', () => {
  let admin: postgres.Sql;
  const obra = (slug: string) =>
    admin.unsafe(
      `INSERT INTO books (slug, title, author_id, description, translation_is_ai, published, attribution_text)
       SELECT '${slug}', 'T ${slug}', id, 'd', true, true, 'antiga' FROM authors WHERE slug = 'a'`,
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

  it('grava a edição só no Heidelberg e é idempotente', async () => {
    await obra('catecismo-de-heidelberg');
    await obra('outra-obra');
    await admin.unsafe(readFileSync(SQL, 'utf-8'));
    await admin.unsafe(readFileSync(SQL, 'utf-8'));
    expect(await atrib('catecismo-de-heidelberg')).toContain('Schaff');
    expect(await atrib('catecismo-de-heidelberg')).toContain('CC BY-SA 4.0');
    expect(await atrib('outra-obra')).toBe('antiga');
  });
});
