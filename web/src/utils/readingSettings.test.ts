import { describe, it, expect } from 'vitest';
import { normalizarAjustes, passoTamanho, AJUSTES_PADRAO, ESCALA_MIN, ESCALA_MAX } from './readingSettings';

describe('normalizarAjustes', () => {
  it('sem nada salvo, usa o padrão', () => {
    expect(normalizarAjustes(null)).toEqual(AJUSTES_PADRAO);
  });

  it('converte o formato antigo (fontSize em 4 níveis) para a escala', () => {
    expect(normalizarAjustes({ fontSize: 'sm' }).escala).toBe(0.9);
    expect(normalizarAjustes({ fontSize: 'md' }).escala).toBe(1);
    expect(normalizarAjustes({ fontSize: 'lg' }).escala).toBe(1.2);
    expect(normalizarAjustes({ fontSize: 'xl' }).escala).toBe(1.4);
  });

  it('mantém o que já estava salvo (tema, fonte, modo)', () => {
    const a = normalizarAjustes({ fontSize: 'md', theme: 'sepia', fontFamily: 'serif', layout: 'flow' });
    expect(a.theme).toBe('sepia');
    expect(a.fontFamily).toBe('serif');
    expect(a.layout).toBe('flow');
  });

  it('descarta valores inválidos em vez de quebrar o leitor', () => {
    const a = normalizarAjustes({ escala: 99, theme: 'neon', largura: 'gigante', paginas: 7 });
    expect(a.escala).toBe(ESCALA_MAX);
    expect(a.theme).toBe(AJUSTES_PADRAO.theme);
    expect(a.largura).toBe(AJUSTES_PADRAO.largura);
    expect(a.paginas).toBe(AJUSTES_PADRAO.paginas);
  });
});

describe('passoTamanho', () => {
  it('aumenta e diminui em passos de 10%', () => {
    expect(passoTamanho(1, +1)).toBeCloseTo(1.1);
    expect(passoTamanho(1, -1)).toBeCloseTo(0.9);
  });

  it('respeita os limites', () => {
    expect(passoTamanho(ESCALA_MAX, +1)).toBe(ESCALA_MAX);
    expect(passoTamanho(ESCALA_MIN, -1)).toBe(ESCALA_MIN);
  });

  it('não acumula erro de ponto flutuante', () => {
    let e = 1;
    for (let i = 0; i < 5; i++) e = passoTamanho(e, +1);
    for (let i = 0; i < 5; i++) e = passoTamanho(e, -1);
    expect(e).toBe(1);
  });
});
