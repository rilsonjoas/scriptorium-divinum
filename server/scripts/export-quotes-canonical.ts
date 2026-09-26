#!/usr/bin/env node
/**
 * Exporta a tabela `quotes` (fonte única do cluster, ADR 001) pro JSON de
 * backup/seed em scripts/data/quotes-canonical.json.
 *
 * Substitui merge-quotes.ts (2026-08, mesclava lecionario-web/gerador-cslewis
 * — os dois viraram consumidores da API depois do ADR 001, não fonte de
 * dados; rodar aquele script de novo regeneraria o estado ANTIGO, de antes
 * da diversificação de autores de 25/09/2026). A partir de agora o sentido é
 * sempre banco → JSON, nunca o contrário — `seed-quotes.ts` só existe pra
 * restaurar um ambiente do zero a partir de um export recente, não é a
 * fonte de verdade.
 *
 * Rodar depois de qualquer mudança na tabela `quotes` em produção (nova
 * citação, correção, remoção) pra manter o backup fiel ao estado real —
 * achado 2026-09-26: o JSON ficou 1 mês desatualizado depois da grande
 * diversificação de autores, e teria ressuscitado uma citação fabricada
 * (já removida) se `seed-quotes.ts` fosse rodado de novo por qualquer
 * motivo (reset de ambiente, disaster recovery).
 *
 * Uso: pnpm --filter server exec tsx scripts/export-quotes-canonical.ts
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '../src/config.js';
import { quotes } from '../src/db/schema.js';

const OUT_FILE = path.join(import.meta.dirname, 'data', 'quotes-canonical.json');

async function main() {
  const client = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  const rows = await db.select().from(quotes).orderBy(quotes.author, quotes.text);

  const canonical = rows.map((r) => ({
    author: r.author,
    text: r.text,
    source: r.source,
    dominioPublico: r.dominioPublico,
    scriptoriumUrl: r.scriptoriumUrl,
    theme: r.theme,
    fonteUrl: r.fonteUrl,
    verificadoEm: r.verificadoEm,
  }));

  writeFileSync(OUT_FILE, JSON.stringify(canonical, null, 2) + '\n');

  const lewis = canonical.filter((c) => c.author === 'C. S. Lewis').length;
  const verified = canonical.filter((c) => c.verificadoEm).length;
  console.log(`✅ Exportadas ${canonical.length} citações (Lewis: ${lewis}, verificadas: ${verified}/${canonical.length}) → ${OUT_FILE}`);

  await client.end({ timeout: 5 });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
