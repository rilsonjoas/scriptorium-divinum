import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

// o teste mora em src/components/, entao a raiz do src e um nivel acima
const SRC = path.join(import.meta.dirname, '..');
const RAIZES = ['components', 'pages'];

/** Uppercase é legítimo em convenção editorial — estes são os aprovados. */
const APROVADOS = [
  'pages/AutorDetalhes.tsx', // <cite> com o nome do autor: assinatura editorial
  'components/reader/NotesDrawer.tsx', // rótulo curto de campo ("Minha Nota")
  'components/reader/QuoteCardDialog.tsx', // classe gramatical (convenção lexicográfica)
  'components/Footer.tsx', // rótulo do cluster no rodapé
];

function arquivosTSX(raiz: string): string[] {
  const out: string[] = [];
  const stack = [path.join(SRC, raiz)];
  while (stack.length) {
    const atual = stack.pop()!;
    for (const e of readdirSync(atual, { withFileTypes: true })) {
      const p = path.join(atual, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (p.endsWith('.tsx') && !p.endsWith('.test.tsx')) out.push(p);
    }
  }
  return out;
}

describe('caixa alta no app (F1 — convergência visual)', () => {
  it('uppercase só aparece nos 4 arquivos aprovados', () => {
    const infratores: string[] = [];

    for (const raiz of RAIZES) {
      for (const abs of arquivosTSX(raiz)) {
        const rel = path.relative(SRC, abs);
        if (APROVADOS.includes(rel)) continue;
        const linhas = readFileSync(abs, 'utf-8').split('\n');
        linhas.forEach((linha, i) => {
          // ignora comentário
          if (/^\s*(\/\/|\*|\/\*)/.test(linha)) return;
          if (/\buppercase\b/.test(linha)) infratores.push(`${rel}:${i + 1}`);
        });
      }
    }

    expect(infratores).toEqual([]);
  });

  it('o SectionLabel existe e não usa caixa alta', () => {
    const src = readFileSync(path.join(SRC, 'components/SectionLabel.tsx'), 'utf-8');
    expect(src).toContain('export function SectionLabel');
    const foraDoComentario = src
      .split('\n')
      .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
      .join('\n');
    expect(foraDoComentario).not.toMatch(/\buppercase\b/);
  });

  it('o token de texto do carmesim existe nos dois temas', () => {
    const css = readFileSync(path.join(SRC, 'index.css'), 'utf-8');
    // precisa existir a definição base e a do dark, senão o rótulo
    // carmesim fica ilegível em um dos temas (2.71:1 no escuro)
    const defs = [...css.matchAll(/--library-crimson-foreground:\s*([^;]+);/g)].map((m) => m[1].trim());
    expect(defs.length).toBeGreaterThanOrEqual(2);
    expect(defs[0]).not.toBe(defs[1]);
  });
});
