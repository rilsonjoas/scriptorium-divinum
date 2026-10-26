import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { closeDb } from './client.js';
import { gravarEscolhaDoDia } from './quotes.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, './migrations');
const FUNCTIONS_SQL = path.join(import.meta.dirname, './custom-sql/functions.sql');
const [A, B] = ['1', '2'].map((n) => `41000000-0000-0000-0000-00000000000${n}`) as [string, string];
const DIA = '2026-01-10';

/** R4: o `setWhere` de `gravarEscolhaDoDia` só deixa substituir a linha do dia cuja citação não é ativa. */
describe('gravarEscolhaDoDia (setWhere do ON CONFLICT)', () => {
  let admin: postgres.Sql;

  const gravada = async () =>
    (
      (await admin.unsafe(`SELECT quote_id FROM daily_quotes WHERE date_key = '${DIA}'`)) as unknown as {
        quote_id: string;
      }[]
    )[0]?.quote_id;

  beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL não definida nos testes de integração');
    admin = postgres(url, { max: 1 });
    await migrate(drizzle(admin), { migrationsFolder: MIGRATIONS_DIR });
    await admin.unsafe(readFileSync(FUNCTIONS_SQL, 'utf-8'));
  });

  beforeEach(async () => {
    await admin.unsafe('TRUNCATE authors, books, quotes, daily_quotes RESTART IDENTITY CASCADE');
    for (const [id, n] of [[A, 'A'], [B, 'B']] as const) {
      await admin.unsafe(
        `INSERT INTO quotes (id, author, text, source) VALUES ('${id}', 'Autor', 'Citação ${n}.', 'Obra')`,
      );
    }
  });

  afterAll(async () => {
    if (admin) await admin.end({ timeout: 5 });
    await closeDb();
  });

  it('sem linha do dia: grava', async () => {
    await gravarEscolhaDoDia(DIA, B);
    expect(await gravada()).toBe(B);
  });

  it('linha do dia com citação ativa: NÃO é sobrescrita', async () => {
    await gravarEscolhaDoDia(DIA, A);
    await gravarEscolhaDoDia(DIA, B);
    expect(await gravada()).toBe(A);
  });

  it.each(['oculta', 'rascunho'])('linha do dia com citação %s: é substituída', async (status) => {
    await gravarEscolhaDoDia(DIA, A);
    await admin.unsafe(`UPDATE quotes SET status = '${status}', motivo_ocultacao = 't' WHERE id = '${A}'`);
    await gravarEscolhaDoDia(DIA, B);
    expect(await gravada()).toBe(B);
  });
});
