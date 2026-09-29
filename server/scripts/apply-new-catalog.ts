import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { env } from '../src/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptsDir = path.resolve(__dirname, '../../scripts');

async function main() {
  const sql = postgres(env.DATABASE_URL, { max: 1 });

  console.log('▶ Buscando scripts SQL em:', scriptsDir);
  const files = readdirSync(scriptsDir)
    .filter((f) => f.startsWith('add_') && f.endsWith('.sql'))
    .sort();

  console.log(`▶ Encontrados ${files.length} scripts SQL para aplicar.`);

  let aplicados = 0;
  let erros = 0;

  for (const file of files) {
    const fullPath = path.join(scriptsDir, file);
    const content = readFileSync(fullPath, 'utf-8');

    try {
      await sql.unsafe(content);
      console.log(`  ✅ Aplicado com sucesso: ${file}`);
      aplicados++;
    } catch (err) {
      console.error(`  ❌ Erro ao aplicar ${file}:`, err);
      erros++;
    }
  }

  console.log('━'.repeat(50));
  console.log(`▶ Concluído: ${aplicados} aplicados, ${erros} erros.`);
  await sql.end();
}

main().catch((err) => {
  console.error('❌ Falha geral na execução do script:', err);
  process.exit(1);
});
