import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { mkdtempSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { hashPassword } from '../lib/password.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, '../db/migrations');
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);

function multipart(filename: string, mime: string, content: Buffer) {
  const boundary = '----teste' + Math.random().toString(16).slice(2);
  const head = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mime}\r\n\r\n`,
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
  return {
    payload: Buffer.concat([head, content, tail]),
    headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
  };
}

describe('Upload de capas — valida o conteúdo, não só o nome', () => {
  const uploadDir = mkdtempSync(path.join(tmpdir(), 'sd-uploads-'));
  let app: Awaited<ReturnType<typeof import('../app.js').buildApp>>;
  let closeDb: () => Promise<void>;
  let sql: postgres.Sql;
  let cookie = '';

  beforeAll(async () => {
    process.env.UPLOAD_DIR = uploadDir;
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL não definida nos testes de integração');
    sql = postgres(url, { max: 1 });
    await migrate(drizzle(sql), { migrationsFolder: MIGRATIONS_DIR });
    const hash = await hashPassword('senha-upload-teste');
    await sql.unsafe(`DELETE FROM admins WHERE email = 'upload@teste.com'`);
    await sql.unsafe(
      `INSERT INTO admins (email, password_hash, name) VALUES ('upload@teste.com', '${hash}', 'Upload Teste')`,
    );
    ({ closeDb } = await import('../db/client.js'));
    app = await (await import('../app.js')).buildApp();
    await app.ready();
    const login = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/login',
      headers: { 'x-forwarded-for': '198.51.100.7' },
      payload: { email: 'upload@teste.com', password: 'senha-upload-teste' },
    });
    const sc = login.headers['set-cookie'] as unknown as string | string[];
    cookie = String(Array.isArray(sc) ? sc[0] : sc).split(';')[0]!;
  });

  afterAll(async () => {
    if (app) await app.close();
    if (sql) await sql.end({ timeout: 5 });
    if (closeDb) await closeDb();
    rmSync(uploadDir, { recursive: true, force: true });
  });

  const enviar = (filename: string, mime: string, content: Buffer) => {
    const { payload, headers } = multipart(filename, mime, content);
    return app.inject({
      method: 'POST',
      url: '/api/v1/admin/uploads',
      headers: { ...headers, cookie },
      payload,
    });
  };

  it('aceita PNG de verdade', async () => {
    const res = await enviar('capa.png', 'image/png', PNG);
    expect(res.statusCode).toBe(201);
    expect(res.json().url).toMatch(/^\/uploads\/covers\/[0-9a-f-]+\.png$/);
  });

  it('recusa SVG, mesmo com Content-Type de imagem', async () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
    expect((await enviar('x.svg', 'image/svg+xml', svg)).statusCode).toBe(400);
  });

  it('recusa HTML disfarçado de .png', async () => {
    const res = await enviar('capa.png', 'image/png', Buffer.from('<html><script>alert(1)</script></html>'));
    expect(res.statusCode).toBe(400);
    const dir = path.join(uploadDir, 'covers');
    const gravados = existsSync(dir) ? readdirSync(dir) : [];
    expect(gravados.length).toBe(1); // só o PNG legítimo do teste anterior
  });

  it('recusa PNG com extensão .jpg', async () => {
    expect((await enviar('capa.jpg', 'image/jpeg', PNG)).statusCode).toBe(400);
  });
});
