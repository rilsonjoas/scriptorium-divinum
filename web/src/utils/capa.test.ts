import { describe, it, expect } from 'vitest';
import { layoutCapa, usaCapaTipografica } from './capa';

describe('layoutCapa (mesmas regras do antigo scripts/generate_covers.mjs)', () => {
  it('título curto: fonte grande, uma ou duas linhas', () => {
    const l = layoutCapa('Confissões');
    expect(l.tamanho).toBe(46);
    expect(l.linhas).toEqual(['Confissões']);
  });

  it('título longo: fonte menor e quebra em várias linhas sem cortar palavra', () => {
    const l = layoutCapa('Summa Theologica, Part II-II (Secunda Secundae)');
    expect(l.tamanho).toBeLessThan(46);
    expect(l.linhas.join(' ')).toBe('Summa Theologica, Part II-II');
    for (const linha of l.linhas) expect(linha.length).toBeGreaterThan(0);
  });

  it('parênteses saem da capa (o subtítulo vai na ficha)', () => {
    expect(layoutCapa('The Teaching of the Twelve Apostles (Didache)').linhas.join(' ')).not.toMatch(/Didache/);
  });

  it('nunca passa de 6 linhas', () => {
    const l = layoutCapa('palavra '.repeat(60).trim());
    expect(l.linhas.length).toBeLessThanOrEqual(6);
  });

  it('bloco do título fica centrado na altura da capa', () => {
    const l = layoutCapa('Imitação de Cristo');
    const meio = l.tituloY - l.tamanho * 0.8 + l.blocoAltura / 2;
    expect(meio).toBeCloseTo(450, 0);
  });
});

describe('usaCapaTipografica', () => {
  it('sem capa, ou com a capa SVG gerada antes, desenha a capa tipográfica', () => {
    expect(usaCapaTipografica(undefined)).toBe(true);
    expect(usaCapaTipografica('')).toBe(true);
    expect(usaCapaTipografica('/covers/confissoes.svg')).toBe(true);
  });

  it('capa de verdade (foto/escaneamento) continua sendo a imagem', () => {
    expect(usaCapaTipografica('https://archive.org/services/img/x')).toBe(false);
    expect(usaCapaTipografica('/images/capas/peregrino.jpg')).toBe(false);
  });
});
