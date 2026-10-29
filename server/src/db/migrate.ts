import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { env } from '../config.js';
import { tabelasSemAcesso } from './acesso-tabelas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const failedSeeds: string[] = [];
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
      } catch (err: unknown) {
        failedSeeds.push(file);
        console.error(`  ❌ Erro no seed ${file}:`, (err instanceof Error ? err.message : String(err)));
        // Seed com BEGIN/COMMIT que falha no meio deixa a conexão em transação
        // abortada, e TODO seed seguinte falharia com "current transaction is
        // aborted" (visto em 2026-10-16 com o catálogo universal). O ROLLBACK
        // devolve a conexão a um estado usável; sem transação aberta ele só
        // emite um aviso.
        try {
          await migrationClient.unsafe('ROLLBACK');
        } catch {
          // conexão já utilizável
        }
      }
    }
  }

  const semAcesso = await tabelasSemAcesso(migrationClient);

  await migrationClient.end();

  if (semAcesso.length > 0) {
    console.error(
      `❌ O usuário da API não acessa: ${semAcesso.join(', ')}. ` +
        `Tabela criada à mão como postgres? Rode: ALTER TABLE <tabela> OWNER TO scriptorium_app;`,
    );
    process.exit(1);
  }

  // Falhar alto: antes, o script imprimia "concluídos com sucesso" e saía com
  // 0 mesmo com seeds quebrados, e o deploy ficava verde com o catálogo atrás
  // do código. Schema/catálogo atrás do código é pior que deploy vermelho.
  if (failedSeeds.length > 0) {
    console.error(`❌ ${failedSeeds.length} seed(s) falharam: ${failedSeeds.join(', ')}`);
    process.exit(1);
  }

  console.log('✅ Migrations e seeds concluídos com sucesso.');
}

main().catch((error) => {
  console.error('❌ Falha ao rodar migrations:', error);
  process.exit(1);
});
