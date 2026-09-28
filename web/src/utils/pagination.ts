import type { Chapter } from './chapters';

/**
 * Paginação do leitor em páginas do tamanho da tela.
 *
 * O capítulo é distribuído em colunas CSS da largura da área de leitura
 * (a mesma técnica dos leitores de ebook); cada coluna é uma página e o
 * leitor mostra uma por vez. Aqui fica só a aritmética, testável sem DOM.
 */

export interface ReaderPosition {
  chapter: number;
  /** Página dentro do capítulo, começando em 0. */
  page: number;
}

/**
 * Página "última do capítulo", usada ao voltar do início de um capítulo para
 * o anterior: o número real só é conhecido depois que o capítulo é medido.
 */
export const LAST_PAGE = -1;

export function countPages(scrollWidth: number, pageWidth: number, gap: number): number {
  if (!(pageWidth > 0)) return 1;
  // +1px de folga: o navegador arredonda larguras de coluna em subpixel
  return Math.max(1, Math.floor((scrollWidth + gap + 1) / (pageWidth + gap)));
}

export function pageOfOffset(offsetLeft: number, pageWidth: number, gap: number): number {
  if (!(pageWidth > 0)) return 0;
  return Math.max(0, Math.floor(offsetLeft / (pageWidth + gap)));
}

export function nextPosition(
  pos: ReaderPosition,
  pagesInChapter: number,
  totalChapters: number,
): ReaderPosition | null {
  if (pos.page < pagesInChapter - 1) return { chapter: pos.chapter, page: pos.page + 1 };
  if (pos.chapter < totalChapters - 1) return { chapter: pos.chapter + 1, page: 0 };
  return null;
}

export function prevPosition(pos: ReaderPosition): ReaderPosition | null {
  if (pos.page > 0) return { chapter: pos.chapter, page: pos.page - 1 };
  if (pos.chapter > 0) return { chapter: pos.chapter - 1, page: LAST_PAGE };
  return null;
}

/** Progresso na obra inteira (0–1), para a barra do topo e para retomar a leitura. */
export function bookRatio(pos: ReaderPosition, pagesInChapter: number, totalChapters: number): number {
  if (totalChapters <= 0) return 0;
  const withinChapter = pagesInChapter > 0 ? Math.max(0, pos.page) / pagesInChapter : 0;
  return Math.min(1, (pos.chapter + withinChapter) / totalChapters);
}

/** Inverso de `bookRatio`: capítulo e fração dentro dele. */
export function positionFromRatio(ratio: number, totalChapters: number): { chapter: number; fraction: number } {
  if (totalChapters <= 0) return { chapter: 0, fraction: 0 };
  // epsilon: (52 / 126) * 126 pode dar 51,999… em ponto flutuante
  const scaled = Math.min(1, Math.max(0, ratio)) * totalChapters + 1e-9;
  const chapter = Math.min(totalChapters - 1, Math.floor(scaled));
  return { chapter, fraction: Math.min(1, Math.max(0, scaled - chapter - 1e-9)) };
}

/** Página a retomar dentro do capítulo, a partir da fração salva. */
export function pageFromFraction(fraction: number, pages: number): number {
  if (pages <= 1) return 0;
  // folga: 1/3 * 3 pode dar 0,999… em ponto flutuante e cair uma página antes
  return Math.min(pages - 1, Math.max(0, Math.floor(fraction * pages + 1e-6)));
}

/**
 * Capítulo de cada item do índice, pela ordem. Não dá para achar pelo texto
 * do título: títulos repetidos em capítulos diferentes (ex.: "Texto original
 * (grego)" nos Credos) levariam sempre ao primeiro.
 */
export function assignChapters<T extends { id: string }>(
  toc: T[],
  chapters: Chapter[],
  slugify: (text: string) => string,
): (T & { chapter: number })[] {
  const headings: { chapter: number; id: string }[] = [];
  chapters.forEach((c, i) => {
    for (const line of c.body.split('\n')) {
      const m = /^#{1,3}\s+(.+?)\s*#*\s*$/.exec(line);
      if (m) headings.push({ chapter: i, id: slugify(m[1].trim()) });
    }
  });
  let cursor = 0;
  return toc.map(item => {
    let k = cursor;
    while (k < headings.length && headings[k].id !== item.id) k++;
    if (k < headings.length) {
      cursor = k + 1;
      return { ...item, chapter: headings[k].chapter };
    }
    return { ...item, chapter: -1 };
  });
}
