/**
 * Notas de rodapé em balão (decisão de 2026-09-29): ao tocar no número, a
 * nota abre ali mesmo, sem pular para o fim do capítulo (que no modo
 * Páginas tiraria a pessoa da página). A lista no fim continua existindo.
 */

/** Definições `[^id]: texto` do markdown de um capítulo (com continuação recuada). */
export function notasDoCapitulo(markdown: string): Map<string, string> {
  const notas = new Map<string, string>();
  const linhas = markdown.split('\n');
  for (let i = 0; i < linhas.length; i++) {
    const m = /^\[\^([^\]]+)\]:\s?(.*)$/.exec(linhas[i]);
    if (!m) continue;
    const partes = [m[2]];
    while (i + 1 < linhas.length && /^( {4}|\t)\S/.test(linhas[i + 1])) {
      partes.push(linhas[++i].trim());
    }
    notas.set(m[1], partes.join('\n').trim());
  }
  return notas;
}

/** "#user-content-fn-ap1" (link gerado pelo remark-gfm) -> "ap1". */
export function idDaNota(href: string | undefined): string | null {
  const m = href ? /^#user-content-fn-(.+)$/.exec(href) : null;
  return m ? decodeURIComponent(m[1]) : null;
}
