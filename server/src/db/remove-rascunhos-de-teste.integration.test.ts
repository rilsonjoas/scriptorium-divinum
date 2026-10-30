import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { closeDb } from './client.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, './migrations');
const SQL = path.join(MIGRATIONS_DIR, '0017_remove_2_rascunhos_de_teste_do_painel.sql');
const SQL_18 = path.join(MIGRATIONS_DIR, '0018_remove_teste_oculto_do_painel.sql');
const TESTE_1 = 'a4b1b4d1-7465-4dd3-bc62-f955c5a401c1';
const TESTE_2 = '3d8b3505-903e-4248-8ba1-8bf9e3e949ec';
const OUTRA = '40000000-0000-0000-0000-000000000009';

/** Migration 0017: remove as duas citações de teste do painel (30/10/2026), só se ainda forem rascunho. */
describe('migration 0017: remove os 2 rascunhos de teste do painel', () => {
  let admin: postgres.Sql;
  const ids = async () =>
    (await admin.unsafe<{ id: string }[]>('SELECT id FROM quotes ORDER BY id')).map((r) => r.id);
  const inserir = (id: string, status: string, source: string | null = null) =>
    admin.unsafe(
      `INSERT INTO quotes (id, author, text, status, source) VALUES ('${id}', 'Autor', 'Texto ${id}.', '${status}', ${
        source ? `'${source}'` : 'NULL'
      })`,
    );
  const rodar = () => admin.unsafe(readFileSync(SQL, 'utf-8'));

  beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL não definida nos testes de integração');
    admin = postgres(url, { max: 1 });
    await migrate(drizzle(admin), { migrationsFolder: MIGRATIONS_DIR });
  });

  beforeEach(async () => {
    await admin.unsafe('TRUNCATE authors, books, quotes, quote_events RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    if (admin) await admin.end({ timeout: 5 });
    await closeDb();
  });

  it('apaga os dois rascunhos e só eles', async () => {
    await inserir(TESTE_1, 'rascunho');
    await inserir(TESTE_2, 'rascunho');
    await inserir(OUTRA, 'rascunho');
    await rodar();
    expect(await ids()).toEqual([OUTRA]);
  });

  it('não apaga se o rascunho já virou ativa (editado antes do deploy)', async () => {
    await inserir(TESTE_1, 'ativa', 'Fonte real');
    await inserir(TESTE_2, 'rascunho');
    await rodar();
    expect(await ids()).toEqual([TESTE_1]);
  });

  it('não apaga se virou oculta', async () => {
    await inserir(TESTE_1, 'oculta');
    await rodar();
    expect(await ids()).toEqual([TESTE_1]);
  });

  it('é idempotente e não falha com o banco vazio (ambiente novo)', async () => {
    await rodar();
    await rodar();
    expect(await ids()).toEqual([]);
  });

  it('o histórico em quote_events sobrevive (decisão do desenho: sem FK em cascata)', async () => {
    await inserir(TESTE_1, 'rascunho');
    await admin.unsafe(`INSERT INTO quote_events (quote_id, acao) VALUES ('${TESTE_1}', 'criou')`);
    await rodar();
    expect(await ids()).toEqual([]);
    const linhas = await admin.unsafe<{ n: number }[]>('SELECT count(*)::int AS n FROM quote_events');
    expect(linhas[0]?.n).toBe(1);
  });

  describe('migration 0018: remove o teste que o autor ocultou antes do deploy da 0017', () => {
    const rodar18 = () => admin.unsafe(readFileSync(SQL_18, 'utf-8'));
    const inserirOculta = (id: string, motivo: string) =>
      admin.unsafe(
        `INSERT INTO quotes (id, author, text, status, motivo_ocultacao) VALUES ('${id}', 'Autor', 'Texto ${id}.', 'oculta', '${motivo}')`,
      );

    it('apaga a citação oculta com o motivo "Teste"', async () => {
      await inserirOculta(TESTE_1, 'Teste');
      await inserir(OUTRA, 'rascunho');
      await rodar18();
      expect(await ids()).toEqual([OUTRA]);
    });

    it('não apaga se o motivo da ocultação é outro (foi aproveitada e ocultada por outra razão)', async () => {
      await inserirOculta(TESTE_1, 'Fonte não confirmada');
      await rodar18();
      expect(await ids()).toEqual([TESTE_1]);
    });

    it('não apaga se foi reativada ou virou outra coisa', async () => {
      await inserir(TESTE_1, 'ativa', 'Fonte real');
      await rodar18();
      expect(await ids()).toEqual([TESTE_1]);
    });

    it('é idempotente e não falha com o banco vazio', async () => {
      await rodar18();
      await rodar18();
      expect(await ids()).toEqual([]);
    });
  });
});
