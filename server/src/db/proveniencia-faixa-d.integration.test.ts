import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { closeDb } from './client.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, './migrations');
const SQL = path.join(MIGRATIONS_DIR, '0023_proveniencia_faixa_d_confirmada.sql');
const MANIFESTO = path.join(import.meta.dirname, '../../texts/MANIFESTO.json');

/** Migration 0023: grava a edição-fonte confirmada na faixa D e oculta as 3 não confirmadas (21/11/2026). */
describe('migration 0023: proveniência da faixa D', () => {
  let admin: postgres.Sql;
  const rodar = () => admin.unsafe(readFileSync(SQL, 'utf-8'));
  const obra = (slug: string, ia = true, pub = true) =>
    admin.unsafe(
      `INSERT INTO books (slug, title, author_id, description, translation_is_ai, published, attribution_text)
       SELECT '${slug}', 'T ${slug}', id, 'd', ${ia}, ${pub}, 'Tradução gerada por IA a partir de obra em domínio público.' FROM authors WHERE slug = 'a'`,
    );
  const linha = async (slug: string) =>
    (await admin.unsafe<{ published: boolean; attribution_text: string }[]>(`SELECT published, attribution_text FROM books WHERE slug = '${slug}'`))[0];

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

  it('grava a edição confirmada na atribuição e não mexe em quem não está na lista', async () => {
    await obra('pensamentos-blaise-pascal');
    await obra('outra-obra-qualquer');
    await rodar();
    expect((await linha('pensamentos-blaise-pascal'))?.attribution_text).toContain('Trotter');
    expect((await linha('pensamentos-blaise-pascal'))?.attribution_text).toContain('CC BY-SA 4.0');
    expect((await linha('outra-obra-qualquer'))?.attribution_text).toBe('Tradução gerada por IA a partir de obra em domínio público.');
  });

  it('oculta as 3 não confirmadas e é idempotente', async () => {
    await obra('aos-jovens-sobre-a-literatura-grega-basilio');
    await obra('a-cidade-de-deus-agostinho');
    await rodar();
    await rodar();
    expect((await linha('aos-jovens-sobre-a-literatura-grega-basilio'))?.published).toBe(false);
    expect((await linha('a-cidade-de-deus-agostinho'))?.published).toBe(true);
  });

  it('as 3 ocultas da migration são exatamente as do manifesto com "Fonte não confirmada"', () => {
    const sql = readFileSync(SQL, 'utf-8');
    const bloco = sql.slice(sql.indexOf('UPDATE books\nSET published = false'));
    const slugs = [...bloco.matchAll(/^\s+'([a-z0-9-]+)',?$/gm)].map((m) => m[1]).sort();
    const man = JSON.parse(readFileSync(MANIFESTO, 'utf-8')).arquivos as Record<string, { estado: string; motivo?: string }>;
    const ocultas = Object.entries(man).filter(([, v]) => v.estado === 'oculta' && /Fonte não confirmada/.test(v.motivo ?? '')).map(([k]) => k).sort();
    expect(slugs).toEqual(ocultas);
    expect(slugs).toHaveLength(3);
  });
});
