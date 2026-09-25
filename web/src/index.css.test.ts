import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const css = readFileSync(path.join(import.meta.dirname, 'index.css'), 'utf-8');

function corpoDaRegra(seletor: string): string {
  const re = new RegExp(`(?:^|[}\\n])\\s*${seletor.replace('.', '\\.')}\\s*\\{([^}]*)\\}`, 'g');
  const corpo = [...css.matchAll(re)].map((m) => m[1]).join('\n');
  if (!corpo) throw new Error(`Regra ${seletor} não encontrada em index.css`);
  return corpo;
}

function regrasDeComponente(): { seletor: string; corpo: string }[] {
  const semComentarios = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...semComentarios.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .map((m) => ({ seletor: m[1].trim(), corpo: m[2] }))
    .filter(({ seletor }) => seletor.length > 0 && !seletor.includes('@'));
}

describe('index.css — superfícies que precisam responder ao tema', () => {
  it('nenhuma regra de componente fixa um fundo claro (H >= 85%)', () => {
    const offenders: string[] = [];

    for (const { seletor, corpo } of regrasDeComponente()) {
      // a paleta do :root e o bloco .dark são a definição dos tokens, não fixos
      if (seletor === ':root' || seletor === '.dark') continue;
      if (!/background(-color)?\s*:/.test(corpo)) continue;

      for (const h of corpo.matchAll(/hsl\(\s*\d+\s+\d+%\s+(\d+)%/g)) {
        if (Number(h[1]) >= 85) offenders.push(`${seletor} -> hsl(... ${h[1]}%)`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('.leather-pressed-card deriva a cor dos tokens, não de valores fixos', () => {
    const regra = corpoDaRegra('.leather-pressed-card');
    expect(regra).toMatch(/background:[\s\S]*var\(--card\)/);
    expect(regra).toMatch(/var\(--library-parchment-surface\)/);
  });

  it('a capitular usa vinho no pergaminho e dourado claro no tema escuro do leitor', () => {
    expect(css).toMatch(/\.capitular-medieval[\s\S]{0,400}var\(--library-vinho\)/);
    expect(css).toMatch(/\.reader-theme-dark \.capitular-medieval[\s\S]{0,400}var\(--library-dourado-texto\)/);
  });

  it('o body deriva o gradiente do token de superfície, não do pergaminho claro', () => {
    const regra = corpoDaRegra('body');
    expect(regra).toContain('to-library-parchment-surface');
    expect(regra).not.toMatch(/to-library-parchment(?![-])/);
  });
});
