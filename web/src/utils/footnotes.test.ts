import { describe, it, expect } from 'vitest';
import { notasDoCapitulo, idDaNota } from './footnotes';

describe('notasDoCapitulo', () => {
  it('extrai as definições de nota do markdown do capítulo', () => {
    const md = 'Texto[^ap1] e mais[^ap2].\n\n[^ap1]: Latim _descendit_.\n\n[^ap2]: Grego _katholikós_, "universal".';
    const n = notasDoCapitulo(md);
    expect(n.get('ap1')).toBe('Latim _descendit_.');
    expect(n.get('ap2')).toBe('Grego _katholikós_, "universal".');
  });

  it('junta linhas de continuação recuadas', () => {
    const md = '[^x]: primeira linha\n    segunda linha\n\nParágrafo seguinte.';
    expect(notasDoCapitulo(md).get('x')).toBe('primeira linha\nsegunda linha');
  });

  it('capítulo sem notas devolve mapa vazio', () => {
    expect(notasDoCapitulo('Só texto.').size).toBe(0);
  });
});

describe('idDaNota', () => {
  it('lê o identificador do link que o remark-gfm gera', () => {
    expect(idDaNota('#user-content-fn-ap1')).toBe('ap1');
    expect(idDaNota('#user-content-fn-ni2')).toBe('ni2');
  });

  it('link que não é de nota devolve null', () => {
    expect(idDaNota('https://exemplo.com')).toBeNull();
    expect(idDaNota(undefined)).toBeNull();
  });
});
