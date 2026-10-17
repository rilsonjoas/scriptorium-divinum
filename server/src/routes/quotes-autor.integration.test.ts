import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { buildApp } from '../app.js';
import { closeDb } from '../db/client.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, '../db/migrations');
const FUNCTIONS_SQL = path.join(import.meta.dirname, '../db/custom-sql/functions.sql');
const idQuote = (n: number) => `40000000-0000-0000-0000-${String(n).padStart(12, '0')}`;

// `quotes.author` é texto livre (sem chave estrangeira para `authors`) e o Gerador C. S. Lewis
// filtra por ele. Quem cadastra uma citação nova pode escrever o nome de outro jeito, e a
// citação some do Gerador sem erro nenhum. Estes testes fixam o que o filtro tolera.
describe('Citações — filtro de autor tolera a grafia de quem cadastra', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let admin: postgres.Sql;

  const inserir = (n: number, autor: string) =>
    admin.unsafe(
      `INSERT INTO quotes (id, author, text, dominio_publico) VALUES ('${idQuote(n)}', '${autor}', 'Citação ${n}.', false)`,
    );
  const doAutor = async (autor: string) => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/quotes?author=${encodeURIComponent(autor)}`,
    });
    return (res.json() as { id: string }[]).map((q) => q.id).sort();
  };

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

  it('caixa e espaços já eram tolerados', async () => {
    await inserir(1, 'C. S. Lewis');
    await inserir(2, 'c. s.  lewis ');
    expect(await doAutor('C. S. Lewis')).toEqual([idQuote(1), idQuote(2)]);
  });

  it('PONTUAÇÃO: "C.S. Lewis" (sem espaço) e "C. S. Lewis" são o mesmo autor', async () => {
    await inserir(1, 'C. S. Lewis');
    await inserir(2, 'C.S. Lewis');
    await inserir(3, 'CS Lewis');
    // o Gerador manda o nome completo com espaços: tem de achar as três grafias
    expect(await doAutor('C. S. Lewis')).toEqual([idQuote(1), idQuote(2), idQuote(3)]);
    // e o inverso: quem pergunta sem espaços também acha
    expect(await doAutor('C.S. Lewis')).toEqual([idQuote(1), idQuote(2), idQuote(3)]);
  });

  it('apelido continua sendo outro autor ("Lewis" não é "C. S. Lewis"), por decisão de curadoria', async () => {
    await inserir(1, 'C. S. Lewis');
    expect(await doAutor('Lewis')).toEqual([]);
  });

  it('autores diferentes não se misturam', async () => {
    await inserir(1, 'C. S. Lewis');
    await inserir(2, 'G. K. Chesterton');
    expect(await doAutor('C. S. Lewis')).toEqual([idQuote(1)]);
    expect(await doAutor('G.K. Chesterton')).toEqual([idQuote(2)]);
  });

  it('acentos continuam distinguindo ("Søren" não vira "Soren")', async () => {
    await inserir(1, 'Søren Kierkegaard');
    expect(await doAutor('Søren Kierkegaard')).toEqual([idQuote(1)]);
    expect(await doAutor('Soren Kierkegaard')).toEqual([]);
  });
});
