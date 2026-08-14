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
