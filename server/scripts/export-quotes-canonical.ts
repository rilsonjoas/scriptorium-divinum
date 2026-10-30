#!/usr/bin/env node
/**
 * Exporta a tabela `quotes` (fonte única do cluster, ADR 001) para o JSON em scripts/data/quotes-canonical.json,
 * com o `id` e as citações não ativas (R3). Sentido sempre banco → JSON; `seed-quotes.ts` só restaura ambiente do zero.
 *
 * Contra o banco de PRODUÇÃO (sem túnel), use a consulta `export-quotes-canonical.sql` por `psql` no VPS:
 * docs/GERENCIAR-ACERVO.md. Este script serve para o banco que a `DATABASE_URL` aponta (dev, ensaio).
 *
 * Rodar depois de qualquer mudança na tabela `quotes` em produção (a tela de citações grava lá), para o
 * espelho continuar fiel.
 *
 * Uso: pnpm --filter server exec tsx scripts/export-quotes-canonical.ts
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { env } from '../src/config.js';
import { exportarCanonico } from '../src/db/quotes-canonical.js';

const OUT_FILE = path.join(import.meta.dirname, 'data', 'quotes-canonical.json');

async function main() {
  const client = postgres(env.DATABASE_URL, { max: 1 });
  try {
    const canonical = await exportarCanonico(client);
    writeFileSync(OUT_FILE, JSON.stringify(canonical, null, 2) + '\n');
    const lewis = canonical.filter((c) => c.author === 'C. S. Lewis').length;
    const verified = canonical.filter((c) => c.verificadoEm).length;
    const naoAtivas = canonical.filter((c) => c.status !== 'ativa').length;
    console.log(`✅ Exportadas ${canonical.length} citações (Lewis: ${lewis}, verificadas: ${verified}/${canonical.length}, não ativas: ${naoAtivas}) → ${OUT_FILE}`);
  } finally {
    await client.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
