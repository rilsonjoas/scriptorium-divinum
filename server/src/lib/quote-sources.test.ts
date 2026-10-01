import { describe, expect, it } from 'vitest';
import { isCuratedSource, normalizeSource } from './quote-sources.js';

describe('normalizeSource', () => {
  it('remove acento, pontuação e colapsa espaços', () => {
    expect(normalizeSource('Confissões, Livro V, cap. 6')).toBe('confissoes livro v cap 6');
    expect(normalizeSource('  O   Peso   da  Glória ')).toBe('o peso da gloria');
    expect(normalizeSource('C. S. Lewis')).toBe('c s lewis');
  });
});

describe('isCuratedSource', () => {
  it('aceita obra exata do acervo', () => {
    expect(isCuratedSource('C. S. Lewis', 'Milagres')).toBe(true);
    expect(isCuratedSource('C. S. Lewis', 'O Problema do Sofrimento')).toBe(true);
    expect(isCuratedSource('Tomás de Kempis', 'Imitação de Cristo')).toBe(true);
  });

  it('aceita sufixo de capítulo/página', () => {
    expect(isCuratedSource('Dietrich Bonhoeffer', 'Discipulado, cap. 1')).toBe(true);
    expect(isCuratedSource('Agostinho de Hipona', 'Confissões, Livro III, cap. 13')).toBe(true);
    expect(isCuratedSource('Jonathan Edwards', 'Afeições Religiosas, p. 218')).toBe(true);
  });

  it('aceita variação de título dentro da curadoria', () => {
    // "Cartas a Malcolm" aparece no acervo como "Oração: Cartas a Malcolm"
    expect(isCuratedSource('C. S. Lewis', 'Oração: Cartas a Malcolm')).toBe(true);
    expect(isCuratedSource('C. S. Lewis', 'O Cavalo e seu Menino')).toBe(true);
    expect(
      isCuratedSource('C. S. Lewis', 'As crônicas de Nárnia: Príncipe Caspian'),
    ).toBe(true);
    // ensaio confirmado no banco de auditoria
    expect(
      isCuratedSource(
        'C. S. Lewis',
        'Bluspels and Flalansferes (em Rehabilitations and Other Essays)',
      ),
    ).toBe(true);
  });

  it('rejeita obra inexistente (bug reportado em produção)', () => {
    expect(isCuratedSource('C. S. Lewis', 'Cheque-Livro do Banco da Fé')).toBe(false);
  });

  it('rejeita source igual ao nome do autor (7 casos no acervo)', () => {
    expect(isCuratedSource('C. S. Lewis', 'C. S. Lewis')).toBe(false);
    expect(isCuratedSource('C. S. Lewis', '  c. s. lewis  ')).toBe(false);
  });

  it('rejeita source vazio ou nulo', () => {
    expect(isCuratedSource('C. S. Lewis', null)).toBe(false);
    expect(isCuratedSource('C. S. Lewis', '')).toBe(false);
    expect(isCuratedSource('C. S. Lewis', '   ')).toBe(false);
  });

  it('rejeita quando o autor não tem curadoria', () => {
    expect(isCuratedSource('Autor Desconhecido', 'Obra Qualquer')).toBe(false);
  });
});