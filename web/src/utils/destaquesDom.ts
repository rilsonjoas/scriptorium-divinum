/**
 * Acha, no DOM do capítulo, o trecho que a pessoa grifou. O trecho foi salvo
 * como texto puro (o que o navegador devolve da seleção), então a busca ignora
 * diferenças de espaço e de quebra de linha e pode atravessar elementos
 * (negrito, itálico, parágrafos).
 */
export function acharTrecho(raiz: Node, texto: string): Range | null {
  const procurado = texto.replace(/\s+/g, ' ').trim();
  if (!procurado) return null;

  const walker = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
  let colapsado = '';
  const origem: { no: Text; posicao: number }[] = [];

  const BLOCOS = 'p, li, h1, h2, h3, h4, h5, h6, blockquote, div, td, th';
  let blocoAnterior: Element | null = null;

  for (let no = walker.nextNode() as Text | null; no; no = walker.nextNode() as Text | null) {
    // entre parágrafos o navegador põe uma quebra na seleção; aqui vira um espaço
    const bloco = no.parentElement?.closest(BLOCOS) ?? null;
    if (blocoAnterior && bloco !== blocoAnterior && colapsado !== '' && !colapsado.endsWith(' ')) {
      colapsado += ' ';
      origem.push(origem[origem.length - 1]);
    }
    blocoAnterior = bloco;
    const dado = no.data;
    for (let i = 0; i < dado.length; i++) {
      const espaco = /\s/.test(dado[i]);
      if (espaco && (colapsado === '' || colapsado.endsWith(' '))) continue;
      colapsado += espaco ? ' ' : dado[i];
      origem.push({ no, posicao: i });
    }
  }

  const inicio = colapsado.indexOf(procurado);
  if (inicio === -1) return null;
  const fim = inicio + procurado.length - 1;

  const range = document.createRange();
  range.setStart(origem[inicio].no, origem[inicio].posicao);
  range.setEnd(origem[fim].no, origem[fim].posicao + 1);
  return range;
}
