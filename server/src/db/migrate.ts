import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { env } from '../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient);

  console.log('▶ Rodando migrations do Drizzle...');
  await migrate(db, { migrationsFolder: path.join(__dirname, 'migrations') });

  console.log('▶ Aplicando funções/triggers customizados (SQL puro)...');
  const functionsSql = readFileSync(
    path.join(__dirname, 'custom-sql/functions.sql'),
    'utf-8',
  );
  await migrationClient.unsafe(functionsSql);

  const seedsDir = path.join(__dirname, 'seeds');
  if (existsSync(seedsDir)) {
    console.log('▶ Aplicando seeds do catálogo (SQL puro idempotente)...');
    const files = readdirSync(seedsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();
    for (const file of files) {
      const sqlContent = readFileSync(path.join(seedsDir, file), 'utf-8');
      try {
        await migrationClient.unsafe(sqlContent);
        console.log(`  ✅ Seed aplicado: ${file}`);
      } catch (err: any) {
        console.error(`  ⚠️ Erro no seed ${file}:`, err.message || err);
      }
    }
  }

  console.log('✅ Migrations e seeds concluídos com sucesso.');
  await migrationClient.end();
}

main().catch((error) => {
  console.error('❌ Falha ao rodar migrations:', error);
  process.exit(1);
});
