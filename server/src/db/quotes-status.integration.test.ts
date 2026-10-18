import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { closeDb } from './client.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, './migrations');
const FUNCTIONS_SQL = path.join(import.meta.dirname, './custom-sql/functions.sql');
const ID = '40000000-0000-0000-0000-000000000001';

/** Painel de citações, F1: `status`, CHECKs e `quote_events` (docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md, seção 5). */
describe('Citações: status, regra "ativa exige fonte" e eventos', () => {
  let admin: postgres.Sql;

  const inserir = (campos: string, valores: string) =>
    admin.unsafe(`INSERT INTO quotes (id, author, text, ${campos}) VALUES ('${ID}', 'Autor', 'Texto.', ${valores})`);
  const codigoDoErro = async (p: Promise<unknown>) => {
    try {
      await p;
    } catch (e) {
      return (e as { code?: string }).code;
    }
    return undefined;
  };

  beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL não definida nos testes de integração');
    admin = postgres(url, { max: 1 });
    await migrate(drizzle(admin), { migrationsFolder: MIGRATIONS_DIR });
    await admin.unsafe(readFileSync(FUNCTIONS_SQL, 'utf-8'));
  });

  beforeEach(async () => {
    await admin.unsafe('TRUNCATE authors, books, quotes, quote_events RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    if (admin) await admin.end({ timeout: 5 });
    await closeDb();
  });

  it('citação nova sem status entra como ativa', async () => {
    await inserir('source', "'Mere Christianity'");
    const [row] = await admin.unsafe(`SELECT status FROM quotes WHERE id = '${ID}'`);
    expect(row!.status).toBe('ativa');
  });

  it('status fora da lista é recusado', async () => {
    expect(await codigoDoErro(inserir('source, status', "'Obra', 'apagada'"))).toBe('23514');
  });

  it('ativa sem fonte é recusada (nula ou só espaços); oculta e rascunho sem fonte passam', async () => {
    expect(await codigoDoErro(inserir('status', "'ativa'"))).toBe('23514');
    expect(await codigoDoErro(inserir('source, status', "'   ', 'ativa'"))).toBe('23514');
    await inserir('status', "'oculta'");
    await admin.unsafe(`DELETE FROM quotes`);
    await inserir('status', "'rascunho'");
  });

  it('ocultar uma ativa que ficou sem fonte é aceito, mas voltar a ativa sem fonte não', async () => {
    await inserir('source', "'Obra'");
    await admin.unsafe(`UPDATE quotes SET status = 'oculta', source = NULL WHERE id = '${ID}'`);
    expect(await codigoDoErro(admin.unsafe(`UPDATE quotes SET status = 'ativa' WHERE id = '${ID}'`))).toBe('23514');
  });

  it('quote_events aceita INSERT e sobrevive à exclusão da citação', async () => {
    await inserir('source', "'Obra'");
    await admin.unsafe(`INSERT INTO quote_events (quote_id, acao) VALUES ('${ID}', 'criou')`);
    await admin.unsafe(`DELETE FROM quotes WHERE id = '${ID}'`);
    const [{ n }] = (await admin.unsafe('SELECT count(*)::int AS n FROM quote_events')) as unknown as [{ n: number }];
    expect(n).toBe(1);
  });

  it('acao fora da lista é recusada em quote_events', async () => {
    expect(await codigoDoErro(admin.unsafe(`INSERT INTO quote_events (quote_id, acao) VALUES ('${ID}', 'apagou')`))).toBe('23514');
  });
});
