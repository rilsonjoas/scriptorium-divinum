/**
 * Capa tipográfica desenhada na hora (sem arquivo).
 *
 * Antes cada obra nova precisava rodar scripts/generate_covers.mjs, gerar um
 * SVG em web/public/covers e um UPDATE no banco; quem não passava por isso
 * ficava com o ícone genérico (o lote inglês de 2026-09-28 inteiro). Agora
 * a capa sai do título e do autor, com as mesmas medidas do gerador.
 */

export const CAPA_L = 600;
export const CAPA_A = 900;

export interface LayoutCapa {
  linhas: string[];
  tamanho: number;
  alturaLinha: number;
  blocoAltura: number;
  /** y da primeira linha do título (baseline), em unidades da viewBox */
  tituloY: number;
}

function quebrar(titulo: string, maxChars: number): string[] {
  const linhas: string[] = [];
  let atual = '';
  for (const palavra of titulo.split(/\s+/)) {
    const tentativa = `${atual} ${palavra}`.trim();
    if (tentativa.length > maxChars && atual) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = tentativa;
    }
  }
  if (atual) linhas.push(atual);
  return linhas.slice(0, 6);
}

export function layoutCapa(titulo: string): LayoutCapa {
  // subtítulo entre parênteses fica na ficha, não na capa
  const limpo = titulo.replace(/\([^)]*\)/g, '').trim() || titulo;
  const tamanho = limpo.length <= 22 ? 46 : limpo.length <= 44 ? 38 : limpo.length <= 70 ? 32 : 27;
  const linhas = quebrar(limpo, Math.floor(340 / (tamanho * 0.52)));
  const alturaLinha = tamanho * 1.25;
  const blocoAltura = linhas.length * alturaLinha;
  return { linhas, tamanho, alturaLinha, blocoAltura, tituloY: CAPA_A / 2 - blocoAltura / 2 + tamanho * 0.8 };
}

/**
 * Desenhar a capa tipográfica? Sim quando não há capa, ou quando a capa é
 * um dos SVGs gerados antes (/covers/*.svg), que são esta mesma capa. Capa
 * de verdade (foto, escaneamento) continua sendo a imagem.
 */
export function usaCapaTipografica(coverImageUrl: string | null | undefined): boolean {
  return !coverImageUrl || coverImageUrl.startsWith('/covers/');
}
