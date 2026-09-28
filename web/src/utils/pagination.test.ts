import { describe, it, expect } from 'vitest';
import {
  countPages,
  pageOfOffset,
  nextPosition,
  prevPosition,
  bookRatio,
  positionFromRatio,
  pageFromFraction,
  assignChapters,
  LAST_PAGE,
} from './pagination';
import type { Chapter } from './chapters';

describe('countPages', () => {
  it('conta quantas colunas do tamanho da tela o conteúdo ocupa', () => {
    // 3 colunas de 600px com gap de 48: largura total = 3*600 + 2*48
    expect(countPages(3 * 600 + 2 * 48, 600, 48)).toBe(3);
  });

  it('nunca devolve menos que 1 página', () => {
    expect(countPages(0, 600, 48)).toBe(1);
    expect(countPages(100, 600, 48)).toBe(1);
  });

  it('tolera arredondamento de subpixel do navegador', () => {
    expect(countPages(3 * 600 + 2 * 48 + 0.6, 600, 48)).toBe(3);
  });

  it('com largura inválida (ainda não medida) fica em 1', () => {
    expect(countPages(5000, 0, 48)).toBe(1);
  });
});

describe('pageOfOffset', () => {
  it('diz em que página está um elemento pela posição horizontal', () => {
    expect(pageOfOffset(0, 600, 48)).toBe(0);
    expect(pageOfOffset(647, 600, 48)).toBe(0);
    expect(pageOfOffset(648, 600, 48)).toBe(1);
    expect(pageOfOffset(1400, 600, 48)).toBe(2);
  });
});

describe('nextPosition / prevPosition', () => {
  it('avança dentro do capítulo', () => {
    expect(nextPosition({ chapter: 2, page: 0 }, 5, 10)).toEqual({ chapter: 2, page: 1 });
  });

  it('na última página do capítulo, vai para a primeira do próximo', () => {
    expect(nextPosition({ chapter: 2, page: 4 }, 5, 10)).toEqual({ chapter: 3, page: 0 });
  });

  it('na última página da obra, não anda', () => {
    expect(nextPosition({ chapter: 9, page: 4 }, 5, 10)).toBeNull();
  });

  it('volta dentro do capítulo', () => {
    expect(prevPosition({ chapter: 2, page: 3 })).toEqual({ chapter: 2, page: 2 });
  });

  it('na primeira página do capítulo, volta para a ÚLTIMA página do anterior', () => {
    expect(prevPosition({ chapter: 2, page: 0 })).toEqual({ chapter: 1, page: LAST_PAGE });
  });

  it('na primeira página da obra, não anda', () => {
    expect(prevPosition({ chapter: 0, page: 0 })).toBeNull();
  });
});

describe('bookRatio / positionFromRatio', () => {
  it('mede o progresso na obra inteira, não só no capítulo', () => {
    // capítulo 5 de 10, página 0: metade da obra
    expect(bookRatio({ chapter: 5, page: 0 }, 4, 10)).toBeCloseTo(0.5);
    // capítulo 5, página 2 de 4: meio capítulo a mais
    expect(bookRatio({ chapter: 5, page: 2 }, 4, 10)).toBeCloseTo(0.55);
  });

  it('volta para o capítulo certo a partir do progresso salvo', () => {
    expect(positionFromRatio(0.55, 10)).toEqual({ chapter: 5, fraction: expect.closeTo(0.5, 5) });
    expect(positionFromRatio(0, 10)).toEqual({ chapter: 0, fraction: 0 });
  });

  it('ida e volta exata em obra com muitos capítulos (sem erro de ponto flutuante)', () => {
    for (let ch = 0; ch < 126; ch++) {
      expect(positionFromRatio(bookRatio({ chapter: ch, page: 0 }, 5, 126), 126).chapter).toBe(ch);
    }
  });

  it('progresso 1 fica no último capítulo', () => {
    expect(positionFromRatio(1, 10).chapter).toBe(9);
  });
});

describe('pageFromFraction', () => {
  it('ida e volta exata da página salva (sem cair uma página antes)', () => {
    for (const total of [1, 5, 126]) {
      for (const pages of [1, 2, 3, 7, 43]) {
        for (let page = 0; page < pages; page++) {
          const { fraction } = positionFromRatio(bookRatio({ chapter: 0, page }, pages, total), total);
          expect(pageFromFraction(fraction, pages)).toBe(page);
        }
      }
    }
  });

  it('se o capítulo encolheu (fonte menor), fica na última página', () => {
    expect(pageFromFraction(0.99, 3)).toBe(2);
  });
});

describe('assignChapters', () => {
  const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const chapters: Chapter[] = [
    { id: 'a', title: 'Credo Niceno', level: 2, body: '## Credo Niceno\n\ntexto\n\n### Texto original (grego)\n\n> ...' },
    { id: 'b', title: 'Calcedônia', level: 2, body: '## Calcedonia\n\ntexto\n\n### Texto original (grego)\n\n> ...' },
  ];

  it('título repetido em capítulos diferentes aponta para o capítulo certo', () => {
    const toc = ['Credo Niceno', 'Texto original (grego)', 'Calcedonia', 'Texto original (grego)'].map(t => ({ id: slug(t) }));
    expect(assignChapters(toc, chapters, slug).map(i => i.chapter)).toEqual([0, 0, 1, 1]);
  });

  it('item que não existe no texto fica com -1 sem bagunçar os seguintes', () => {
    const toc = [{ id: 'credo-niceno' }, { id: 'fantasma' }, { id: 'calcedonia' }];
    expect(assignChapters(toc, chapters, slug).map(i => i.chapter)).toEqual([0, -1, 1]);
  });
});
