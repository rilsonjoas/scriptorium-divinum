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

  it('nenhuma classe Tailwind foi escrita no lugar de uma propriedade CSS', () => {
    // `pointer-events-none: none` é CSS inválido: o navegador descarta a
    // declaração, o pseudo-elemento volta a `pointer-events: auto` e passa a
    // roubar os cliques dos filhos. Bug real, introduzido em fb04ed5 (2026-08-23).
    const CSS_VALIDAS = new Set([
      'animation', 'aside', 'background', 'background-clip', 'background-image',
      'border', 'border-color', 'border-radius', 'border-top',
      'border-top-left-radius', 'border-top-right-radius', 'box-shadow',
      'clip-path', 'color', 'color-scheme', 'content', 'display', 'div', 'float',
      'font-family', 'font-size', 'font-weight', 'height', 'inset',
      'letter-spacing', 'line-height', 'margin', 'margin-right', 'margin-top',
      'max-width', 'overflow', 'overflow-x', 'padding', 'pointer-events',
      'position', 'right', 'text-orientation', 'text-shadow', 'text-transform',
      'top', 'transform', 'transition', 'white-space', 'width', 'word-break',
      'writing-mode', 'z-index',
    ]);

    const semComentarios = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const invalidas: string[] = [];

    for (const linha of semComentarios.split('\n')) {
      const m = linha.match(/^\s*([a-z][a-z0-9-]*)\s*:\s*([^;]+);/);
      if (!m) continue;
      const propriedade = m[1];
      if (propriedade.startsWith('--')) continue;
      if (CSS_VALIDAS.has(propriedade)) continue;
      // fora da allowlist: só accuse se parecer nome de utilitário Tailwind
      if (/-(none|auto|hidden|full|sm|md|lg|xl|px|py|text|bg|border|shadow|flex|grid|absolute|relative|fixed|sticky|block|inline)$/.test(propriedade)) {
        invalidas.push(`${propriedade}: ${m[2].trim()}`);
      }
    }

    expect(invalidas).toEqual([]);
  });

  it('todo overlay decorativo do leather-pressed-card é inerte ao ponteiro', () => {
    const regra = corpoDaRegra('.leather-pressed-card::before');
    expect(regra).toMatch(/pointer-events:\s*none/);
    expect(regra).not.toMatch(/pointer-events-none/);
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
