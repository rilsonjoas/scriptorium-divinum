#!/usr/bin/env node
/**
 * Merge das duas curadorias de citações na fonte única do cluster (ADR 001):
 *  - lecionario-web/src/data/lewis-quotes.json   (217 entradas, Lewis + clássicos)
 *  - gerador-cslewis/src/lib/quotes.ts            (165 entradas, só Lewis, tema "ceus")
 *
 * Regras (não destrutivas):
 *  - Lewis = NÃO domínio público (CTA Amazon centralizado na API).
 *  - Clássicos = domínio público, mantêm scriptoriumUrl do Lecionário.
 *  - Duplicata exata (texto normalizado idêntico) é mesclada, preservando o
 *    texto do Lecionário e absorvendo o tema "ceus" do Gerador.
 *  - Quase-iguais (variante de tradução) NÃO são mescladas — ambas entram e
 *    são impressas para revisão humana.
 *
 * Saída: scripts/data/quotes-canonical.json
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lewisQuotes as geradorQuotes } from '/home/narniano/Downloads/Programação/1 - Pessoal/gerador-cslewis/src/lib/quotes.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LECIONARIO_JSON = path.join(
  __dirname,
  '../../../lecionario/lecionario-web/src/data/lewis-quotes.json',
);
const OUT_FILE = path.join(__dirname, 'data', 'quotes-canonical.json');

interface LecionarioQuote {
  quote: string;
  source: string;
  author: string;
  scriptoriumUrl?: string | null;
}

interface CanonicalQuote {
  author: string;
  text: string;
  source: string;
  dominioPublico: boolean;
  scriptoriumUrl: string | null;
  theme: string | null;
}

function normalize(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[''`´]/g, "'")
    .replace(/[«»""“”]/g, '"')
    .replace(/[.,;:!?…—-]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function loadLecionario(): LecionarioQuote[] {
  return JSON.parse(readFileSync(LECIONARIO_JSON, 'utf-8')) as LecionarioQuote[];
}

function main() {
  const lecionario = loadLecionario();
  const lewis = lecionario.filter((q) => q.author === 'C. S. Lewis');
  const classics = lecionario.filter((q) => q.author !== 'C. S. Lewis');

  const canonicals: CanonicalQuote[] = lecionario.map((q) => ({
    author: q.author,
    text: q.quote,
    source: q.source,
    dominioPublico: q.author !== 'C. S. Lewis',
    scriptoriumUrl: q.scriptoriumUrl ?? null,
    theme: null,
  }));

  const byNorm = new Map<string, CanonicalQuote>();
  for (const c of canonicals) {
    const key = normalize(c.text);
    if (!byNorm.has(key)) byNorm.set(key, c);
  }

  let merged = 0;
  let newFromGerador = 0;
  const variants: { gerador: string; lecionario: string }[] = [];

  for (const g of geradorQuotes) {
    const norm = normalize(g.quote);
    const hit = byNorm.get(norm);
    if (hit) {
      if (g.theme && !hit.theme) {
        hit.theme = g.theme;
      }
      merged++;
      continue;
    }
    // quase-iguais: uma das variantes contém a outra (comprimento ≥ 30)
    const near = canonicals.find((c) => {
      const n = normalize(c.text);
      return n.length >= 30 && norm.length >= 30 && (n.includes(norm) || norm.includes(n));
    });
    if (near) {
      variants.push({ gerador: g.quote, lecionario: near.text });
    }
    canonicals.push({
      author: 'C. S. Lewis',
      text: g.quote,
      source: g.source,
      dominioPublico: false,
      scriptoriumUrl: null,
      theme: g.theme ?? null,
    });
    byNorm.set(norm, canonicals[canonicals.length - 1]!);
    newFromGerador++;
  }

  canonicals.sort((a, b) =>
    a.author === b.author ? a.text.localeCompare(b.text) : a.author.localeCompare(b.author),
  );
  writeFileSync(OUT_FILE, JSON.stringify(canonicals, null, 2) + '\n');

  const total = canonicals.length;
  const finalLewis = canonicals.filter((c) => c.author === 'C. S. Lewis').length;
  const finalClassics = total - finalLewis;
  const themed = canonicals.filter((c) => c.theme).length;

  console.log('── Leitura ─────────────────────────────────');
  console.log(`  Gerador C.S. Lewis : ${geradorQuotes.length} (tema "ceus": ${geradorQuotes.filter((q) => q.theme).length})`);
  console.log(`  Lecionário         : ${lecionario.length} (Lewis: ${lewis.length}, clássicos: ${classics.length})`);
  console.log('── Resultado ───────────────────────────────');
  console.log(`  Duplicatas exatas mescladas (tema absorvido): ${merged}`);
  console.log(`  Novas do Gerador adicionadas               : ${newFromGerador}`);
  console.log(`  Variantes quasi-iguais (mantidas p/ revisão): ${variants.length}`);
  console.log(`  TOTAL final                                : ${total} (Lewis: ${finalLewis}, clássicos: ${finalClassics}, tema "ceus": ${themed})`);
  console.log(`  Escrito em                                   ${OUT_FILE}`);
  if (variants.length > 0) {
    console.log('\n── Variantes para revisão ─────────────────────');
    for (const v of variants) {
      console.log(`  • GERADOR   : ${v.gerador.slice(0, 90)}`);
      console.log(`    LECIONÁRIO: ${v.lecionario.slice(0, 90)}\n`);
    }
  }
}

main();