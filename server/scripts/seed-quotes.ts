#!/usr/bin/env node
/**
 * Seed da tabela `quotes` a partir do JSON canônico do cluster (ADR 001).
 * Gerado por scripts/merge-quotes.ts — NUNCA editar à mão este script; mas
 * o JSON em scripts/data/ é revisável. Idempotente: limpa e reinsere tudo.
 *  - Lewis            → dominio_publico=false (CTA Amazon central na API)
 *  - Clássicos        → dominio_publico=true
 *  - theme "ceus"     → preservado do Gerador C.S. Lewis
 *  - scriptorium_url  → link da curadoria do Lecionário
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