import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const DB = path.join(import.meta.dirname, '../db');
const MIGRATION = path.join(DB, 'migrations/0021_unifica_autores_duplicados.sql');
const SEEDS = path.join(DB, 'seeds');

/** Pares (canônico, duplicado) lidos da própria migration, para não haver segunda lista a manter. */
function pares(): { canonico: string; duplicado: string }[] {
  const sql = readFileSync(MIGRATION, 'utf-8');
  return [...sql.matchAll(/^\s+\('([a-z0-9-]+)', '([a-z0-9-]+)', (?:NULL|'[^']+')\)/gm)].map((m) => ({
    canonico: m[1] ?? '',
    duplicado: m[2] ?? '',
  }));
}

describe('autores unificados (migration 0021)', () => {
  it('são 17 pares, sem cadeia (o canônico de um nunca é o duplicado de outro) e sem slug repetido', () => {
    const p = pares();
    expect(p).toHaveLength(17);
    const duplicados = p.map((x) => x.duplicado);
    expect(new Set(duplicados).size).toBe(17);
    expect(new Set(p.map((x) => x.canonico)).size).toBe(17);
    for (const { canonico } of p) expect(duplicados).not.toContain(canonico);
  });

  it('nenhum seed insere nem consulta autor pelo slug antigo (recriaria o duplicado a cada deploy)', () => {
    const antigos = pares().map((x) => x.duplicado);
    const problemas: string[] = [];
    for (const f of readdirSync(SEEDS).filter((n) => n.endsWith('.sql'))) {
      const sql = readFileSync(path.join(SEEDS, f), 'utf-8');
      for (const bloco of sql.match(/INSERT INTO authors[\s\S]*?;/gi) ?? []) {
        for (const a of antigos) if (bloco.includes(`'${a}'`)) problemas.push(`${f}: INSERT INTO authors com '${a}'`);
      }
      for (const a of antigos) {
        if (new RegExp(`slug\\s*=\\s*'${a}'`).test(sql)) problemas.push(`${f}: slug = '${a}'`);
      }
    }
    expect(problemas).toEqual([]);
  });
});
