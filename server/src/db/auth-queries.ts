import { createHash, randomBytes } from 'node:crypto';
import { and, eq, gt, lt } from 'drizzle-orm';
import { db } from './client.js';
import { admins, sessions } from './schema.js';
import { env } from '../config.js';

export function generateSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function findAdminByEmail(email: string) {
  const [admin] = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1);
  return admin ?? undefined;
}

export async function findAdminById(id: string) {
  const [admin] = await db
    .select({
      id: admins.id,
      email: admins.email,
      name: admins.name,
    })
    .from(admins)
    .where(eq(admins.id, id))
    .limit(1);
  return admin ?? undefined;
}

export async function createSession(adminId: string): Promise<string> {
  const token = generateSessionToken();

  await db.insert(sessions).values({
    adminId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + env.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000),
  });

  return token;
}

export async function getSessionByToken(token: string) {
  const tokenHash = hashToken(token);

  const [session] = await db
    .select({
      id: sessions.id,
      adminId: sessions.adminId,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (!session) return undefined;

  await db
    .update(sessions)
    .set({ lastUsedAt: new Date() })
    .where(eq(sessions.id, session.id));

  return session;
}

export async function deleteSessionByToken(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
}

export async function deleteExpiredSessions(): Promise<void> {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}
