import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ordenarCanonico, validarCanonico, type CanonicalQuote } from './quotes-canonical.js';

const ler = (p: string) => JSON.parse(readFileSync(path.join(import.meta.dirname, p), 'utf-8')) as unknown;

/**
 * Invariantes do arquivo versionado, que valem para qualquer acervo. Atualizá-lo depois de mexer nas citações pela tela
 * (docs/GERENCIAR-ACERVO.md) não pode deixar a suíte vermelha: contagens e conteúdo de um dia específico ficam de fora.
 * (Em 29/10/2026 o arquivo foi gerado de produção: 270 citações, 145 de C. S. Lewis, os mesmos pares autor e texto do
 * canônico anterior; 12 `scriptoriumUrl` já corrigidos em produção por migration.)
 */
describe('quotes-canonical.json versionado', () => {
  const bruto = ler('../../scripts/data/quotes-canonical.json');
  const canonico = validarCanonico(bruto);

  it('é válido e não é um arquivo truncado (piso de 200 citações)', () => {
    expect(canonico.length).toBeGreaterThanOrEqual(200);
  });

  it('os ids já estão em minúsculas e únicos (o arquivo é o que o export escreve, não uma versão editada à mão)', () => {
    expect(canonico.map((q) => q.id)).toEqual((bruto as { id: string }[]).map((q) => q.id));
    expect(new Set(canonico.map((q) => q.id)).size).toBe(canonico.length);
  });

  it('está na ordem canônica (autor e texto por ponto de código): a mesma que o export e a consulta SQL produzem', () => {
    expect(canonico).toEqual(ordenarCanonico(canonico));
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
