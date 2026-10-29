#!/usr/bin/env node
/**
 * Restaura a tabela `quotes` a partir do JSON canônico do cluster (ADR 001), PRESERVANDO o `id` de cada
 * citação (F5 do painel de citações): `quote_events`, `daily_quotes`, o Gerador C. S. Lewis e o canário se
 * ligam à citação por id.
 *
 * ⚠️ DESTRUTIVO: `TRUNCATE quotes CASCADE` apaga também `daily_quotes` (a escolha gravada de cada dia).
 * Só para restaurar um AMBIENTE DO ZERO (dev local novo); NUNCA em produção. A recuperação de desastre
 * de verdade é o backup do banco. O arquivo é validado antes de apagar e o TRUNCATE + INSERT rodam numa
 * transação: um arquivo ruim deixa a tabela como estava (`src/db/quotes-canonical.ts`).
 *
 * O JSON em scripts/data/quotes-canonical.json é o espelho de produção: ver `export-quotes-canonical.sql` e
 * docs/GERENCIAR-ACERVO.md. Nunca editar à mão, e atualizar antes de restaurar (o JSON já ficou um mês
 * atrasado e teria ressuscitado uma citação fabricada).
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { env } from '../src/config.js';
import { restaurarCanonico } from '../src/db/quotes-canonical.js';

const CANONICAL = path.join(import.meta.dirname, 'data', 'quotes-canonical.json');

async function seed() {
  const client = postgres(env.DATABASE_URL, { max: 1 });
  try {
    const dados = JSON.parse(readFileSync(CANONICAL, 'utf-8')) as unknown;
    console.log(`🌱 Restore de quotes a partir do JSON canônico...`);
    const total = await restaurarCanonico(client, dados);
    console.log(`✅ quotes restauradas: ${total}, com os ids do arquivo`);
  } finally {
    await client.end({ timeout: 5 });
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
