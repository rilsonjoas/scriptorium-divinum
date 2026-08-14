import { eq } from 'drizzle-orm';
import { env } from '../config.js';
import { db } from '../db/client.js';
import { admins } from '../db/schema.js';
import { hashPassword } from '../lib/password.js';

async function main() {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.error('Defina ADMIN_EMAIL e ADMIN_PASSWORD no ambiente para criar o administrador.');
    process.exit(1);
  }

  const email = env.ADMIN_EMAIL.toLowerCase();
  const passwordHash = await hashPassword(env.ADMIN_PASSWORD);

  const [existing] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

  if (existing) {
    await db
      .update(admins)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(admins.id, existing.id));
    console.log(`Admin '${email}' atualizado.`);
  } else {
    await db.insert(admins).values({ email, passwordHash, name: 'Admin' });
    console.log(`Admin '${email}' criado.`);
  }

  await db.$client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
