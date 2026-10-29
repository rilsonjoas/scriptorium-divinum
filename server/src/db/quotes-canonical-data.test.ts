import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ordenarCanonico, validarCanonico, type CanonicalQuote } from './quotes-canonical.js';

const ler = (p: string) => JSON.parse(readFileSync(path.join(import.meta.dirname, p), 'utf-8')) as unknown;

/** O arquivo versionado é o espelho de produção de 29/10/2026 (F5): o `id` entrou e 12 `scriptoriumUrl` foram atualizados para o valor de produção (o JSON antigo estava atrasado em relação a uma migration). */
describe('quotes-canonical.json versionado', () => {
  const canonico = validarCanonico(ler('../../scripts/data/quotes-canonical.json'));

  it('é válido: 270 citações, ids únicos em formato uuid', () => {
    expect(canonico).toHaveLength(270);
    expect(new Set(canonico.map((q) => q.id)).size).toBe(270);
  });

  it('todas ativas, 145 de C. S. Lewis (estado de produção em 29/10/2026)', () => {
    expect(canonico.every((q) => q.status === 'ativa')).toBe(true);
    expect(canonico.filter((q) => q.author === 'C. S. Lewis')).toHaveLength(145);
  });

  it('o conjunto de citações é o mesmo do canônico anterior (pares autor e texto); os campos vêm de produção', () => {
    const antes = ler('./__fixtures__/pares-canonico-2026-10-29.json') as string[][];
    const depois = canonico.map((q) => [q.author, q.text]).sort((a, b) => (a.join('\u0000') < b.join('\u0000') ? -1 : 1));
    const esperado = [...antes].sort((a, b) => (a.join('\u0000') < b.join('\u0000') ? -1 : 1));
    expect(depois).toEqual(esperado);
  });
});

describe('ordenarCanonico', () => {
  const q = (author: string, text: string) => ({ author, text }) as CanonicalQuote;
  it('ordena por ponto de código (autor, depois texto), sem depender da collation do banco', () => {
    const ordem = ordenarCanonico([q('abc', 'b'), q('Zeno', 'a'), q('abc', 'a'), q('Ágata', 'a'), q('abc', 'B')]).map((x) => `${x.author}|${x.text}`);
    expect(ordem).toEqual(['Zeno|a', 'abc|B', 'abc|a', 'abc|b', 'Ágata|a']);
  });
  it('não altera a lista recebida', () => {
    const lista = [q('b', 'x'), q('a', 'x')];
    ordenarCanonico(lista);
    expect(lista.map((x) => x.author)).toEqual(['b', 'a']);
  });
});
