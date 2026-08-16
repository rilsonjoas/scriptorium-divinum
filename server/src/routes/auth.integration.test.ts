import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { buildApp } from '../app.js';
import { closeDb } from '../db/client.js';
import { admins } from '../db/schema.js';
import { hashPassword } from '../lib/password.js';
import { env } from '../config.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, '../db/migrations');
const FUNCTIONS_SQL = path.join(import.meta.dirname, '../db/custom-sql/functions.sql');

describe('Auth de admin por cookie de sessão — Testes de Integração', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let admin: postgres.Sql;
  let cookie: string | undefined;

  beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL não definida nos testes de integração');

    admin = postgres(url, { max: 1 });
    const adminDb = drizzle(admin);

    await migrate(adminDb, { migrationsFolder: MIGRATIONS_DIR });
    await admin.unsafe(readFileSync(FUNCTIONS_SQL, 'utf-8'));

    const passwordHash = await hashPassword('senha-admin-teste');
    await admin.unsafe(`DELETE FROM admins WHERE email = 'admin@teste.com'`);
    await admin.unsafe(`DELETE FROM authors WHERE slug = 'novo-autor'`);
    await admin.unsafe(`DELETE FROM categories WHERE name IN ('Categoria Teste', 'Categoria Renomeada')`);
    await admin.unsafe(`DELETE FROM books WHERE slug = 'novo-livro-de-download'`);
    await admin.unsafe(
      `INSERT INTO admins (email, password_hash, name) VALUES ('admin@teste.com', '${passwordHash}', 'Admin Teste')`,
    );

    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
    if (admin) await admin.end({ timeout: 5 });
    await closeDb();
  });

  it('POST /api/v1/admin/login rejeita credenciais inválidas', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/login',
      payload: { email: 'admin@teste.com', password: 'senha-errada' },
    });
    expect(res.statusCode).toBe(401);
    expect(res.json().error).toBe('invalid_credentials');
  });

  it('POST /api/v1/admin/login autentica e seta cookie httpOnly', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/login',
      payload: { email: 'ADMIN@teste.com', password: 'senha-admin-teste' },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().admin.email).toBe('admin@teste.com');

    const setCookie = res.headers['set-cookie'] as unknown as string | string[];
    const cookies = Array.isArray(setCookie) ? setCookie.join(';') : String(setCookie);
    expect(cookies).toContain(env.ADMIN_COOKIE_NAME);
    expect(cookies).toContain('HttpOnly');
    cookie = cookies.split(';')[0];
  });

  it('GET /api/v1/admin/me retorna 401 sem cookie', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/admin/me' });
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/v1/admin/me devolve o admin autenticado com cookie', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/me',
      headers: { cookie },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().email).toBe('admin@teste.com');
  });

  it('rotas admin exigem autenticação', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/authors',
      payload: { name: 'Autor Não Autorizado' },
    });
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/v1/admin/authors cria autor autenticado', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/authors',
      headers: { cookie },
      payload: { name: 'Novo Autor', birthYear: 1500 },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().slug).toBe('novo-autor');
  });

  it('PUT /api/v1/admin/settings exige autenticação', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/api/v1/admin/settings',
      payload: { siteName: 'Sem Sessão' },
    });
    expect(res.statusCode).toBe(401);
  });

  it('PUT /api/v1/admin/settings atualiza e GET público reflete', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/api/v1/admin/settings',
      headers: { cookie },
      payload: { siteName: 'Scriptorium Teste', featuredBooksCount: 6 },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().siteName).toBe('Scriptorium Teste');
    expect(res.json().featuredBooksCount).toBe(6);

    const pub = await app.inject({ method: 'GET', url: '/api/v1/settings' });
    expect(pub.statusCode).toBe(200);
    expect(pub.json().siteName).toBe('Scriptorium Teste');

    const restore = await app.inject({
      method: 'PUT',
      url: '/api/v1/admin/settings',
      headers: { cookie },
      payload: { siteName: 'Scriptorium Divinum', featuredBooksCount: 3 },
    });
    expect(restore.statusCode).toBe(200);
  });

  it('POST /api/v1/admin/books cria livro com downloadLinks e tableOfContents (payload camelCase da web)', async () => {
    const [author] = await admin.unsafe<{ id: string }[]>(
      `SELECT id FROM authors WHERE slug = 'novo-autor'`,
    );
    expect(author).toBeDefined();

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/books',
      headers: { cookie },
      payload: {
        title: 'Novo Livro de Download',
        authorId: author!.id,
        description: 'Descrição do novo livro.',
        language: 'pt',
        featured: false,
        downloadLinks: [
          { format: 'pdf', url: 'https://exemplo.com/livro.pdf', source: 'Teste', fileSize: 12345 },
          { format: 'epub', url: 'https://exemplo.com/livro.epub' },
        ],
        tableOfContents: [
          { title: 'Capítulo I — Introdução', anchor: 'cap-1', orderIndex: 1 },
          { title: 'Capítulo II — Desenvolvimento', anchor: 'cap-2', orderIndex: 2 },
        ],
      },
    });
    expect(res.statusCode).toBe(201);

    const detail = await app.inject({
      method: 'GET',
      url: '/api/v1/books/novo-livro-de-download',
    });
    expect(detail.statusCode).toBe(200);
    expect(detail.json().downloadLinks).toHaveLength(2);
    expect(detail.json().downloadLinks[0]).toMatchObject({
      format: 'pdf',
      url: 'https://exemplo.com/livro.pdf',
      fileSize: 12345,
    });
    expect(detail.json().tableOfContents).toHaveLength(2);
    expect(detail.json().tableOfContents[0]).toMatchObject({
      title: 'Capítulo I — Introdução',
      anchor: 'cap-1',
      orderIndex: 1,
    });

    const del = await app.inject({
      method: 'DELETE',
      url: `/api/v1/admin/books/${detail.json().id}`,
      headers: { cookie },
    });
    expect(del.statusCode).toBe(204);
  });

  it('PATCH renomeia categoria (payload camelCase da web)', async () => {
    const create = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/categories',
      headers: { cookie },
      payload: { name: 'Categoria Teste', description: 'Para o teste' },
    });
    expect(create.statusCode).toBe(201);

    const rename = await app.inject({
      method: 'PATCH',
      url: '/api/v1/admin/categories',
      headers: { cookie },
      payload: { oldName: 'Categoria Teste', newName: 'Categoria Renomeada' },
    });
    expect(rename.statusCode).toBe(200);

    const [cat] = await admin.unsafe<{ name: string; slug: string }[]>(
      `SELECT name, slug FROM categories WHERE name = 'Categoria Renomeada'`,
    );
    expect(cat).toBeDefined();
    expect(cat!.slug).toBe('categoria-renomeada');
  });

  it('POST /api/v1/admin/logout invalida a sessão', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/logout',
      headers: { cookie },
    });
    expect(res.statusCode).toBe(204);

    const me = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/me',
      headers: { cookie },
    });
    expect(me.statusCode).toBe(401);
  });
});
