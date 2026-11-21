import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { closeDb } from './client.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, './migrations');
const SQL = path.join(MIGRATIONS_DIR, '0022_oculta_5_obras_com_traducao_moderna_na_proveniencia.sql');
const MANIFESTO = path.join(import.meta.dirname, '../../texts/MANIFESTO.json');

/** Migration 0022: oculta as 5 obras cujo texto mostra tradução moderna como base (21/11/2026). */
describe('migration 0022: oculta obras com tradução moderna na proveniência', () => {
  let admin: postgres.Sql;
  const estado = async (slug: string) =>
    (await admin.unsafe<{ published: boolean; featured: boolean }[]>(
      `SELECT published, featured FROM books WHERE slug = '${slug}'`,
    ))[0];
  const rodar = () => admin.unsafe(readFileSync(SQL, 'utf-8'));
  const obra = (slug: string, featured = false) =>
    admin.unsafe(
      `INSERT INTO books (slug, title, author_id, description, featured)
       SELECT '${slug}', 'Titulo ${slug}', id, 'd', ${featured} FROM authors WHERE slug = 'a'`,
    );

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

  it('oculta e tira do destaque as listadas, e só elas', async () => {
    await obra('de-magistro', true);
    await obra('tradicao-apostolica-hipolito');
    await obra('a-cidade-de-deus-agostinho', true);
    await rodar();
    expect(await estado('de-magistro')).toEqual({ published: false, featured: false });
    expect(await estado('tradicao-apostolica-hipolito')).toEqual({ published: false, featured: false });
    expect(await estado('a-cidade-de-deus-agostinho')).toEqual({ published: true, featured: true });
  });

  it('é idempotente', async () => {
    await obra('de-magistro');
    await rodar();
    await rodar();
    expect((await estado('de-magistro'))?.published).toBe(false);
  });

  it('os slugs da migration são exatamente as obras ocultas por "tradução moderna" no manifesto', () => {
    const sql = readFileSync(SQL, 'utf-8');
    const slugs = [...sql.matchAll(/^\s+'([a-z0-9-]+)',?$/gm)].map((m) => m[1]).sort();
    const man = JSON.parse(readFileSync(MANIFESTO, 'utf-8')).arquivos as Record<string, { estado: string; motivo?: string }>;
    const ocultas = Object.entries(man)
      .filter(([, v]) => v.estado === 'oculta' && /tradução moderna na proveniência/.test(v.motivo ?? ''))
      .map(([k]) => k)
      .sort();
    expect(slugs).toEqual(ocultas);
    expect(slugs).toHaveLength(5);
  });
});
