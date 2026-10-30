import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { buildApp } from '../app.js';
import { closeDb } from '../db/client.js';
import { entrarComoAdmin } from '../test/admin-login.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, '../db/migrations');
const FUNCTIONS_SQL = path.join(import.meta.dirname, '../db/custom-sql/functions.sql');
// UUID de verdade (versão 4, variante 8): o `uuid()` do Zod 4 recusa o que não segue a RFC, como os ids reais seguem.
const UUID = '63000000-0000-4000-8000-000000000001';
const BASE = '/api/v1/admin/quotes';
const PUBLICAS = ['id', 'author', 'text', 'source', 'dominioPublico', 'scriptoriumUrl', 'theme', 'affiliateUrl'].sort();

/** Painel de citações, F2: a API de administração de ponta a ponta (seção 7 do desenho). */
describe('API de administração de citações', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let admin: postgres.Sql;
  let cookie: string;
  let adminId: string;

  const req = (method: 'GET' | 'POST' | 'PATCH' | 'DELETE', url: string, payload?: unknown, comLogin = true) =>
    app.inject({
      method,
      url,
      headers: comLogin ? { cookie } : {},
      ...(payload === undefined ? {} : { payload: payload as object }),
    });
  const livroPublicado = async (slug: string) => {
    await admin.unsafe(
      `INSERT INTO authors (id, slug, name) VALUES ('62000000-0000-0000-0000-000000000001', 'autor-livro', 'Autor Livro') ON CONFLICT DO NOTHING`,
    );
    await admin.unsafe(
      `INSERT INTO books (slug, title, author_id, description, published)
       VALUES ('${slug}', 'Livro ${slug}', '62000000-0000-0000-0000-000000000001', 'd', true)`,
    );
  };
  const nova = (extra: Record<string, unknown> = {}) => ({
    author: 'Autor Teste',
    text: 'Frase de teste.',
    source: 'Obra de teste',
    fonteUrl: 'https://exemplo.org/f',
    verificadoEm: '2026-10-01',
    status: 'ativa',
    ...extra,
  });

  beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL não definida nos testes de integração');
    admin = postgres(url, { max: 1 });
    await migrate(drizzle(admin), { migrationsFolder: MIGRATIONS_DIR });
    await admin.unsafe(readFileSync(FUNCTIONS_SQL, 'utf-8'));
    app = await buildApp();
    await app.ready();
    ({ cookie, adminId } = await entrarComoAdmin(app, admin));
  });

  beforeEach(async () => {
    await admin.unsafe('TRUNCATE authors, books, quotes, quote_events, daily_quotes RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    if (app) await app.close();
    if (admin) await admin.end({ timeout: 5 });
    await closeDb();
  });

  it('toda rota recusa sem login (401)', async () => {
    const chamadas: [Parameters<typeof req>[0], string, unknown?][] = [
      ['GET', BASE],
      ['POST', BASE, nova()],
      ['PATCH', `${BASE}/${UUID}`, { text: 'x', updatedAt: '2026-01-01T10:00:00.000Z' }],
      ['POST', `${BASE}/${UUID}/ocultar`, { motivo: 'qualquer motivo' }],
      ['POST', `${BASE}/${UUID}/reativar`],
      ['GET', `${BASE}/${UUID}/eventos`],
    ];
    for (const [m, u, p] of chamadas) expect((await req(m, u, p, false)).statusCode, `${m} ${u}`).toBe(401);
  });

  it('não existe DELETE em citações', async () => {
    expect((await req('DELETE', `${BASE}/${UUID}`)).statusCode).toBe(404);
  });

  it('ciclo completo: criar, editar, 409, ocultar, sumir da API pública, reativar, histórico', async () => {
    const criada = await req('POST', BASE, nova());
    expect(criada.statusCode).toBe(201);
    const { quote } = criada.json();
    expect(quote.status).toBe('ativa');

    const editada = await req('PATCH', `${BASE}/${quote.id}`, { text: 'Frase corrigida.', updatedAt: quote.updatedAt });
    expect(editada.statusCode).toBe(200);
    expect(editada.json().quote.text).toBe('Frase corrigida.');

    const velha = await req('PATCH', `${BASE}/${quote.id}`, { text: 'Outra.', updatedAt: quote.updatedAt });
    expect(velha.statusCode).toBe(409);
    expect(velha.json().error).toBe('conflict');
    expect(velha.json().atual.text).toBe('Frase corrigida.');

    expect((await req('POST', `${BASE}/${quote.id}/ocultar`, {})).statusCode).toBe(400);
    expect((await req('POST', `${BASE}/${quote.id}/ocultar`, { motivo: 'fonte não confere' })).statusCode).toBe(200);
    expect((await app.inject({ method: 'GET', url: '/api/v1/quotes' })).json()).toEqual([]);

    expect((await req('POST', `${BASE}/${quote.id}/reativar`)).statusCode).toBe(200);
    expect((await app.inject({ method: 'GET', url: '/api/v1/quotes' })).json()).toHaveLength(1);

    const hist = await req('GET', `${BASE}/${quote.id}/eventos`);
    expect(hist.statusCode).toBe(200);
    expect(hist.json().eventos.map((e: { acao: string }) => e.acao)).toEqual(['reativou', 'ocultou', 'editou', 'criou']);
    expect(hist.json().eventos[0].adminId).toBe(adminId);
  });

  it('GET lista com contadores', async () => {
    await req('POST', BASE, nova());
    const r = await req('GET', `${BASE}?status=ativa&page=1`);
    expect(r.statusCode).toBe(200);
    expect(r.json().itens).toHaveLength(1);
    expect(r.json().contadores.porStatus.ativa).toBe(1);
  });

  it('GET ?semVerificacao=true filtra e valor inválido dá 400', async () => {
    await req('POST', BASE, nova());
    const todas = await req('GET', BASE);
    expect(todas.json().itens[0].diasFixados).toEqual([]);
    const r = await req('GET', `${BASE}?semVerificacao=true`);
    expect(r.statusCode).toBe(200);
    expect(r.json().itens).toEqual([]);
    expect((await req('GET', `${BASE}?semVerificacao=talvez`)).statusCode).toBe(400);
  });

  it('400 no formato do cluster, também nas regras de negócio', async () => {
    const vazio = await req('POST', BASE, nova({ text: '' }));
    expect(vazio.statusCode).toBe(400);
    expect(vazio.json().error).toBe('validation_error');
    expect(vazio.json().issues.text.length).toBeGreaterThan(0);
    expect(vazio.json().details.issues).toBeDefined();

    await req('POST', BASE, nova({ author: 'C. S. Lewis', text: 'Primeira.' }));
    const grafia = await req('POST', BASE, nova({ author: 'C.S. Lewis', text: 'Segunda.' }));
    expect(grafia.statusCode).toBe(400);
    expect(grafia.json().error).toBe('validation_error');
    expect(grafia.json().issues.author[0]).toContain('C. S. Lewis');
  });

  describe('validação de entrada (menores da revisão da F2)', () => {
    it('espaço nas pontas de fonteUrl e verificadoEm é aparado, como no resto dos campos', async () => {
      const r = await req('POST', BASE, nova({ fonteUrl: '  https://exemplo.org/f  ', verificadoEm: ' 2026-10-01 ' }));
      expect(r.statusCode).toBe(201);
      expect(r.json().quote.fonteUrl).toBe('https://exemplo.org/f');
      expect(r.json().quote.verificadoEm).toBe('2026-10-01');
    });

    it.each([
      ['outro host', 'https://evil.example/livros/publicada'],
      ['http em vez de https', 'http://scriptorium.narniano.com/livros/publicada'],
      ['caminho que não é de livro', 'https://scriptorium.narniano.com/autores/publicada'],
      ['não é endereço', 'livros/publicada'],
    ])('scriptoriumUrl recusa %s', async (_nome, url) => {
      await livroPublicado('publicada');
      const r = await req('POST', BASE, nova({ scriptoriumUrl: url }));
      expect(r.statusCode).toBe(400);
      expect(r.json().issues.scriptoriumUrl?.length).toBeGreaterThan(0);
    });

    it('scriptoriumUrl aceita o endereço certo, com ou sem barra no fim', async () => {
      await livroPublicado('publicada');
      for (const [i, url] of ['https://scriptorium.narniano.com/livros/publicada', 'https://scriptorium.narniano.com/livros/publicada/'].entries()) {
        const r = await req('POST', BASE, nova({ text: `Frase ${i}.`, scriptoriumUrl: url }));
        expect(r.statusCode, url).toBe(201);
      }
    });

    it('POST com Content-Type JSON e corpo vazio dá 400 no formato do cluster (não FST_ERR_CTP_EMPTY_JSON_BODY)', async () => {
      const r = await app.inject({ method: 'POST', url: BASE, headers: { cookie, 'content-type': 'application/json' }, payload: '' });
      expect(r.statusCode).toBe(400);
      expect(r.json().error).toBe('validation_error');
      expect(Object.keys(r.json().issues).length).toBeGreaterThan(0);
    });

    it('PATCH sem corpo dá 400 com issues preenchido', async () => {
      const { quote } = (await req('POST', BASE, nova())).json();
      const r = await app.inject({ method: 'PATCH', url: `${BASE}/${quote.id}`, headers: { cookie, 'content-type': 'application/json' }, payload: '' });
      expect(r.statusCode).toBe(400);
      expect(r.json().error).toBe('validation_error');
      expect(Object.keys(r.json().issues).length).toBeGreaterThan(0);
    });

    it('updatedAt absurdo (ano 0001 ou 9999) não vira 500', async () => {
      const { quote } = (await req('POST', BASE, nova())).json();
      for (const updatedAt of ['0001-01-01T00:00:00.000Z', '9999-12-31T23:59:59.999Z']) {
        const r = await req('PATCH', `${BASE}/${quote.id}`, { text: 'Outro.', updatedAt });
        expect([400, 409], updatedAt).toContain(r.statusCode);
      }
    });
  });

  it('PATCH recusa status oculta, id e campo desconhecido; :id inválido dá 400', async () => {
    const { quote } = (await req('POST', BASE, nova())).json();
    const v = quote.updatedAt;
    for (const extra of [{ status: 'oculta' }, { id: UUID }, { inventado: 1 }]) {
      expect((await req('PATCH', `${BASE}/${quote.id}`, { updatedAt: v, ...extra })).statusCode).toBe(400);
    }
    expect((await req('PATCH', `${BASE}/abc`, { text: 'x', updatedAt: v })).statusCode).toBe(400);
  });

  it('404 para id que não existe; eventos de citação excluída devolvem 200', async () => {
    expect((await req('POST', `${BASE}/${UUID}/ocultar`, { motivo: 'qualquer motivo' })).statusCode).toBe(404);
    const { quote } = (await req('POST', BASE, nova())).json();
    await admin.unsafe(`DELETE FROM quotes WHERE id = '${quote.id}'`);
    const r = await req('GET', `${BASE}/${quote.id}/eventos`);
    expect(r.statusCode).toBe(200);
    expect(r.json().eventos).toHaveLength(1);
  });

  it('a API pública não ganha campos', async () => {
    const { quote } = (await req('POST', BASE, nova())).json();
    await req('POST', `${BASE}/${quote.id}/ocultar`, { motivo: 'teste de contrato' });
    await req('POST', `${BASE}/${quote.id}/reativar`);
    const publica = (await app.inject({ method: 'GET', url: '/api/v1/quotes' })).json()[0];
    expect(Object.keys(publica).sort()).toEqual(PUBLICAS);
  });
});
