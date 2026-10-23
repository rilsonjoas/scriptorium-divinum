import type postgres from 'postgres';
import type { buildApp } from '../app.js';
import { hashPassword } from '../lib/password.js';

const EMAIL = 'admin-quotes@teste.com';
const SENHA = 'senha-admin-teste';

/** Recria o administrador de teste e entra por `POST /api/v1/admin/login`. Devolve o cookie (`nome=valor`) e o id. */
export async function entrarComoAdmin(
  app: Awaited<ReturnType<typeof buildApp>>,
  sql: postgres.Sql,
): Promise<{ cookie: string; adminId: string }> {
  await sql.unsafe(`DELETE FROM admins WHERE email = '${EMAIL}'`);
  const hash = await hashPassword(SENHA);
  const [{ id }] = (await sql.unsafe(
    `INSERT INTO admins (email, password_hash, name) VALUES ('${EMAIL}', '${hash}', 'Admin Quotes') RETURNING id`,
  )) as unknown as [{ id: string }];
  const res = await app.inject({ method: 'POST', url: '/api/v1/admin/login', payload: { email: EMAIL, password: SENHA } });
  if (res.statusCode !== 200) throw new Error(`login de teste falhou: ${res.statusCode}`);
  const setCookie = res.headers['set-cookie'] as unknown as string | string[];
  const cookie = (Array.isArray(setCookie) ? setCookie.join(';') : String(setCookie)).split(';')[0]!;
  return { cookie, adminId: id };
}
