import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { closeDb } from './client.js';
import { listQuotes } from './quotes.js';
import { exportarCanonico, restaurarCanonico, validarCanonico, type CanonicalQuote } from './quotes-canonical.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, './migrations');
const FUNCTIONS_SQL = path.join(import.meta.dirname, './custom-sql/functions.sql');
const id = (n: number) => `70000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

const base: CanonicalQuote = {
  id: id(1),
  author: 'C. S. Lewis',
  text: 'Texto da ativa de Lewis.',
  source: 'Cristianismo Puro e Simples',
  dominioPublico: false,
  scriptoriumUrl: null,
  theme: 'ceus',
  fonteUrl: null,
  verificadoEm: null,
  status: 'ativa',
  motivoOcultacao: null,
};
const quatro: CanonicalQuote[] = [
  base,
  { ...base, id: id(2), author: 'Santo Agostinho', text: 'Texto verificada.', source: 'Confissões', theme: null, dominioPublico: true, fonteUrl: 'https://exemplo.org/p/1', verificadoEm: '2026-10-01' },
  { ...base, id: id(3), author: 'Outro', text: 'Texto da oculta.', status: 'oculta', motivoOcultacao: 'Sem fonte confirmada' },
  { ...base, id: id(4), author: 'Rascunhante', text: 'Texto do rascunho.', status: 'rascunho', source: null },
];

describe('Canônico de citações: export e restore preservam o id', () => {
  let admin: postgres.Sql;
  const ids = async () => (await admin.unsafe('SELECT id FROM quotes ORDER BY id')).map((r) => r.id as string);
  const falha = async (p: Promise<unknown>) => {
    try {
      await p;
    } catch (e) {
      return (e as Error).message;
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

  it('ida e volta: restaurar o que foi exportado e exportar de novo dá o mesmo arquivo, com id', async () => {
    expect(await restaurarCanonico(admin, quatro)).toBe(4);
    const a = await exportarCanonico(admin);
    expect(a).toHaveLength(4);
    await restaurarCanonico(admin, a);
    const b = await exportarCanonico(admin);
    expect(b).toEqual(a);
    expect(a.map((q) => q.id).sort()).toEqual(quatro.map((q) => q.id));
  });

  it('o export inclui as não ativas', async () => {
    await restaurarCanonico(admin, quatro);
    const status = (await exportarCanonico(admin)).map((q) => q.status).sort();
    expect(status).toEqual(['ativa', 'ativa', 'oculta', 'rascunho']);
  });

  it('o evento de uma citação continua achando a citação depois do restore', async () => {
    await restaurarCanonico(admin, quatro);
    await admin.unsafe(`INSERT INTO quote_events (quote_id, acao) VALUES ('${id(3)}', 'ocultou')`);
    await restaurarCanonico(admin, quatro);
    const ligados = await admin.unsafe(`SELECT count(*)::int AS n FROM quote_events e JOIN quotes q ON q.id = e.quote_id`);
    expect(ligados[0]!.n).toBe(1);
  });

  it('oculta e rascunho voltam como estavam e não aparecem na lista pública', async () => {
    await restaurarCanonico(admin, quatro);
    const publicas = (await listQuotes()).map((q) => q.id).sort();
    expect(publicas).toEqual([id(1), id(2)]);
    const oculta = (await exportarCanonico(admin)).find((q) => q.id === id(3));
    expect(oculta?.status).toBe('oculta');
    expect(oculta?.motivoOcultacao).toBe('Sem fonte confirmada');
  });

  it.each<[string, (q: CanonicalQuote[]) => unknown[], RegExp]>([
    ['id repetido', (q) => [q[0], { ...q[1], id: q[0]!.id }], /id.*repetido/i],
    ['id faltando', (q) => [q[0], { ...q[1], id: undefined }], /\[1\].*id/i],
    ['id que não é uuid', (q) => [q[0], { ...q[1], id: 'abc' }], /\[1\].*id/i],
    ['status desconhecido', (q) => [q[0], { ...q[1], status: 'banida' }], /\[1\].*status/i],
    ['ativa sem fonte', (q) => [q[0], { ...q[1], source: '  ' }], /\[1\].*source/i],
    ['não é uma lista', () => ({}) as unknown as unknown[], /lista/i],
  ])('arquivo inválido (%s) é recusado e a tabela fica como estava', async (_n, estraga, mensagem) => {
    await restaurarCanonico(admin, quatro.slice(0, 3));
    const antes = await ids();
    const erro = await falha(restaurarCanonico(admin, estraga(quatro)));
    expect(erro).toMatch(mensagem);
    expect(await ids()).toEqual(antes);
  });

  it('a mensagem junta todos os problemas, um por linha', () => {
    expect(() => validarCanonico([{ ...base, id: 'x' }, { ...base, id: id(2), status: 'banida' }])).toThrow(/\[0\].*id[\s\S]*\[1\].*status/);
  });

  it('falha no meio do INSERT desfaz o TRUNCATE', async () => {
    await restaurarCanonico(admin, quatro.slice(0, 3));
    const antes = await ids();
    const estourado = { ...quatro[3]!, author: 'x'.repeat(300) };
    expect(await falha(restaurarCanonico(admin, [quatro[0]!, estourado]))).toBeDefined();
    expect(await ids()).toEqual(antes);
  });

  it('canônico sem id (formato antigo) é recusado', () => {
    const { id: _omitido, ...semId } = base;
    expect(() => validarCanonico([semId])).toThrow(/id/);
  });
});
