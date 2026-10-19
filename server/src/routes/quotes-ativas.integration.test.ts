import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { buildApp } from '../app.js';
import { closeDb } from '../db/client.js';
import { dateKeyInTimeZone } from '../lib/date.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, '../db/migrations');
const FUNCTIONS_SQL = path.join(import.meta.dirname, '../db/custom-sql/functions.sql');

const hoje = () => dateKeyInTimeZone(new Date());
function dia(n: number): string {
  const [y, m, d] = hoje().split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}
const idQuote = (n: number) => `50000000-0000-0000-0000-${String(n).padStart(12, '0')}`;

/** Painel de citações, F1 (R4 e R5): só `ativa` é pública, e a escolha gravada do dia que foi ocultada é substituída. */
describe('Citações ocultas e rascunhos não aparecem em lugar nenhum público', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let admin: postgres.Sql;

  const inserir = (n: number, status = 'ativa', autor = `Autor ${n}`) =>
    admin.unsafe(
      `INSERT INTO quotes (id, author, text, source, dominio_publico, status)
       VALUES ('${idQuote(n)}', '${autor}', 'Citação ${n}.', 'Obra de teste', true, '${status}')`,
    );
  const get = async (url: string) => app.inject({ method: 'GET', url });
  const diaDoDia = async (data: string) => (await get(`/api/v1/quotes/daily?date=${data}`)).json();
  const linhas = async (data?: string) =>
    (await admin.unsafe(
      data ? `SELECT * FROM daily_quotes WHERE date_key = '${data}'` : 'SELECT * FROM daily_quotes',
    )) as unknown as { date_key: string; quote_id: string }[];
  const ocultar = (id: string) =>
    admin.unsafe(`UPDATE quotes SET status = 'oculta', motivo_ocultacao = 'teste' WHERE id = '${id}'`);

  beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL não definida nos testes de integração');
    admin = postgres(url, { max: 1 });
    await migrate(drizzle(admin), { migrationsFolder: MIGRATIONS_DIR });
    await admin.unsafe(readFileSync(FUNCTIONS_SQL, 'utf-8'));
    app = await buildApp();
    await app.ready();
  });

  beforeEach(async () => {
    await admin.unsafe('TRUNCATE authors, books, quotes RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    if (app) await app.close();
    if (admin) await admin.end({ timeout: 5 });
    await closeDb();
  });

  describe('lista e sorteio', () => {
    beforeEach(async () => {
      for (let n = 1; n <= 4; n++) await inserir(n);
      await inserir(5, 'oculta');
      await inserir(6, 'rascunho');
    });

    it('GET /quotes não traz a oculta nem o rascunho', async () => {
      const ids = (await get('/api/v1/quotes')).json().map((q: { id: string }) => q.id);
      expect(ids).toHaveLength(4);
      expect(ids).not.toContain(idQuote(5));
      expect(ids).not.toContain(idQuote(6));
    });

    it('GET /quotes/random nunca devolve a oculta nem o rascunho', async () => {
      const vistos = new Set<string>();
      for (let i = 0; i < 60; i++) vistos.add((await get('/api/v1/quotes/random')).json().id);
      expect(vistos.has(idQuote(5))).toBe(false);
      expect(vistos.has(idQuote(6))).toBe(false);
      expect(vistos.size).toBeGreaterThan(1);
    });

    it('GET /quotes/daily nunca devolve a oculta, mesmo quando ela é fixada em daily_quotes', async () => {
      await admin.unsafe(`INSERT INTO daily_quotes (date_key, quote_id) VALUES ('${dia(1)}', '${idQuote(5)}')`);
      expect((await diaDoDia(dia(1))).id).not.toBe(idQuote(5));
    });
  });

  describe('autor cuja única citação está oculta', () => {
    beforeEach(async () => {
      await inserir(1, 'ativa', 'Autor A');
      await inserir(2, 'oculta', 'Autor B');
    });

    it('a lista do autor é [] (200), não 404', async () => {
      const res = await get('/api/v1/quotes?author=Autor%20B');
      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual([]);
    });

    it('random e daily com o autor dão 404, e o daily não grava nada', async () => {
      expect((await get('/api/v1/quotes/random?author=Autor%20B')).statusCode).toBe(404);
      expect((await get(`/api/v1/quotes/daily?date=${dia(1)}&author=Autor%20B`)).statusCode).toBe(404);
      expect(await linhas()).toHaveLength(0);
    });
  });

  it('todas ocultas: daily dá 404 e não grava', async () => {
    await inserir(1, 'oculta');
    await inserir(2, 'rascunho');
    expect((await get(`/api/v1/quotes/daily?date=${dia(1)}`)).statusCode).toBe(404);
    expect(await linhas()).toHaveLength(0);
  });

  describe('R4: a escolha gravada que foi ocultada é substituída', () => {
    beforeEach(async () => {
      for (let n = 1; n <= 6; n++) await inserir(n);
    });

    it('o dia escolhe outra entre as ativas e a nova escolha fica gravada', async () => {
      const a = await diaDoDia(dia(1));
      await ocultar(a.id);
      const b = await diaDoDia(dia(1));
      expect(b.id).not.toBe(a.id);
      expect((await linhas(dia(1)))).toHaveLength(1);
      expect((await linhas(dia(1)))[0]!.quote_id).toBe(b.id);
      expect((await diaDoDia(dia(1))).id).toBe(b.id);
    });

    it('os dias vizinhos já gravados não mudam', async () => {
      const antes = await diaDoDia(dia(0));
      const alvo = await diaDoDia(dia(1));
      const depois = await diaDoDia(dia(2));
      // oculta só se não for a citação de um vizinho (senão o vizinho também muda, como deve)
      expect(new Set([antes.id, alvo.id, depois.id]).size).toBe(3);
      await ocultar(alvo.id);
      await diaDoDia(dia(1));
      expect((await diaDoDia(dia(0))).id).toBe(antes.id);
      expect((await diaDoDia(dia(2))).id).toBe(depois.id);
    });

    it('consultas simultâneas depois de ocultar gravam uma linha só e devolvem a mesma citação', async () => {
      const a = await diaDoDia(dia(3));
      await ocultar(a.id);
      const respostas = await Promise.all(Array.from({ length: 12 }, () => diaDoDia(dia(3))));
      expect(new Set(respostas.map((r) => r.id)).size).toBe(1);
      expect(respostas[0].id).not.toBe(a.id);
      expect(await linhas(dia(3))).toHaveLength(1);
    });

    it('reativar a citação não desfaz a substituição', async () => {
      const a = await diaDoDia(dia(1));
      await ocultar(a.id);
      const b = await diaDoDia(dia(1));
      await admin.unsafe(`UPDATE quotes SET status = 'ativa' WHERE id = '${a.id}'`);
      expect((await diaDoDia(dia(1))).id).toBe(b.id);
    });

    it('fora da janela de ±30 dias a substituição não grava', async () => {
      const res = await get(`/api/v1/quotes/daily?date=${dia(60)}`);
      expect(res.statusCode).toBe(200);
      expect(await linhas(dia(60))).toHaveLength(0);
    });

    it('o dia segue estável quando a gravada é ativa (a substituição não mexe no que está certo)', async () => {
      const a = await diaDoDia(dia(1));
      await ocultar(idQuote(a.id === idQuote(1) ? 2 : 1));
      expect((await diaDoDia(dia(1))).id).toBe(a.id);
    });
  });
});
