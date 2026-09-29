/**
 * Ajustes do leitor (painel "Aa").
 *
 * Decididos com o Rilson em 2026-09-29: tamanho em passos finos (− / +) em
 * vez de 4 níveis, espaçamento entre linhas, largura da coluna e 1/2 páginas.
 * Os ajustes antigos salvos no navegador (com `fontSize` em 4 níveis) são
 * convertidos, não descartados.
 */

export type FontFamily = 'reading' | 'serif' | 'sans';
export type ReadingTheme = 'parchment' | 'light' | 'dark' | 'sepia';
export type LineHeight = 'normal' | 'relaxed' | 'loose';
/** 'pages': uma página do tamanho da tela por vez; 'flow': o capítulo inteiro, rolando. */
export type ReadingLayout = 'pages' | 'flow';
export type Largura = 'estreita' | 'media' | 'larga';
/** 'auto': duas páginas lado a lado em telas largas; 'uma': sempre uma. */
export type Paginas = 'auto' | 'uma';

export interface ReadingSettings {
  /** multiplicador do tamanho base do texto */
  escala: number;
  fontFamily: FontFamily;
  theme: ReadingTheme;
  lineHeight: LineHeight;
  layout: ReadingLayout;
  largura: Largura;
  paginas: Paginas;
}

export const ESCALA_MIN = 0.8;
export const ESCALA_MAX = 1.8;
const PASSO = 0.1;

export const AJUSTES_PADRAO: ReadingSettings = {
  escala: 1,
  fontFamily: 'reading',
  theme: 'parchment',
  lineHeight: 'relaxed',
  layout: 'pages',
  largura: 'media',
  paginas: 'auto',
};

const ESCALA_ANTIGA: Record<string, number> = { sm: 0.9, md: 1, lg: 1.2, xl: 1.4 };

const arred = (n: number) => Math.round(n * 100) / 100;
const limitar = (n: number) => Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, arred(n)));

function escolha<T extends string>(valor: unknown, validos: readonly T[], padrao: T): T {
  return validos.includes(valor as T) ? (valor as T) : padrao;
}

/** Ajustes salvos (em qualquer formato, inclusive o antigo ou corrompido) -> ajustes válidos. */
export function normalizarAjustes(salvo: unknown): ReadingSettings {
  if (!salvo || typeof salvo !== 'object') return { ...AJUSTES_PADRAO };
  const s = salvo as Record<string, unknown>;
  const escala =
    typeof s.escala === 'number' && Number.isFinite(s.escala)
      ? limitar(s.escala)
      : typeof s.fontSize === 'string' && s.fontSize in ESCALA_ANTIGA
        ? ESCALA_ANTIGA[s.fontSize]
        : AJUSTES_PADRAO.escala;
  return {
    escala,
    fontFamily: escolha(s.fontFamily, ['reading', 'serif', 'sans'] as const, AJUSTES_PADRAO.fontFamily),
    theme: escolha(s.theme, ['parchment', 'light', 'dark', 'sepia'] as const, AJUSTES_PADRAO.theme),
    lineHeight: escolha(s.lineHeight, ['normal', 'relaxed', 'loose'] as const, AJUSTES_PADRAO.lineHeight),
    layout: escolha(s.layout, ['pages', 'flow'] as const, AJUSTES_PADRAO.layout),
    largura: escolha(s.largura, ['estreita', 'media', 'larga'] as const, AJUSTES_PADRAO.largura),
    paginas: escolha(s.paginas, ['auto', 'uma'] as const, AJUSTES_PADRAO.paginas),
  };
}

/** Próximo tamanho ao tocar em − (-1) ou + (+1). */
export function passoTamanho(escala: number, direcao: 1 | -1): number {
  return limitar(escala + direcao * PASSO);
}

/** Valores de CSS derivados dos ajustes. */
export const ALTURA_LINHA: Record<LineHeight, number> = { normal: 1.5, relaxed: 1.75, loose: 2 };
/** largura máxima da coluna de texto (1 página / modo Rolagem), em caracteres */
export const LARGURA_CH: Record<Largura, number> = { estreita: 55, media: 65, larga: 80 };
