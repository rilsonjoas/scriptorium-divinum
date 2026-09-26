#!/usr/bin/env node
/**
 * Seed da tabela `quotes` a partir do JSON canônico do cluster (ADR 001).
 *
 * ⚠️ DESTRUTIVO: `TRUNCATE ... CASCADE` — só rodar pra restaurar um
 * ambiente do zero (dev local novo, disaster recovery), NUNCA em produção
 * com dados reais. O JSON em scripts/data/quotes-canonical.json é gerado
 * por `export-quotes-canonical.ts` (banco → JSON, é a direção certa desde
 * 2026-09-26) — nunca editar esse JSON à mão nem rodar este seed contra
 * produção sem antes rodar o export pra garantir que ele reflete o estado
 * atual (achado real: o JSON ficou 1 mês desatualizado depois da grande
 * diversificação de autores de 25/09/2026 e teria apagado tudo aquilo,
 * inclusive ressuscitando uma citação fabricada já removida).
 *  - Lewis            → dominio_publico=false (CTA Amazon central na API)
 *  - Clássicos        → dominio_publico=true
 *  - theme "ceus"     → preservado do Gerador C.S. Lewis
 *  - scriptorium_url  → link da curadoria do Lecionário
 *  - fonte_url/verificado_em → curadoria de verificação (ver
 *    docs/PROTOCOLO-VERIFICACAO-DE-CITACOES.md), NULL = não verificado
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '../src/config.js';
import { quotes } from '../src/db/schema.js';

const CANONICAL = path.join(import.meta.dirname, 'data', 'quotes-canonical.json');

interface CanonicalQuote {
  author: string;
  text: string;
  source: string;
  dominioPublico: boolean;
  scriptoriumUrl: string | null;
  theme: string | null;
  fonteUrl: string | null;
  verificadoEm: string | null;
}

async function seed() {
  const client = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);
  const data = JSON.parse(readFileSync(CANONICAL, 'utf-8')) as CanonicalQuote[];

  console.log(`🌱 Seed de quotes: ${data.length} citações do JSON canônico...`);

  await client.unsafe('TRUNCATE quotes RESTART IDENTITY CASCADE');

  await db.insert(quotes).values(
    data.map((q) => ({
      author: q.author,
      text: q.text,
      source: q.source,
      dominioPublico: q.dominioPublico,
      scriptoriumUrl: q.scriptoriumUrl,
      theme: q.theme,
      fonteUrl: q.fonteUrl ?? null,
      verificadoEm: q.verificadoEm ?? null,
    })),
  );

  const lewis = data.filter((q) => q.author === 'C. S. Lewis').length;
  const themed = data.filter((q) => q.theme).length;
  console.log(`✅ quotes inseridas: ${data.length} (Lewis: ${lewis}, tema "ceus": ${themed})`);
  await client.end({ timeout: 5 });
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});