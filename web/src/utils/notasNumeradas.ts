import type { Chapter } from './chapters';

/**
 * Muitos textos trazem as notas no estilo `texto[1]` e, mais adiante, uma linha
 * `[1] texto da nota`. O leitor já abre notas em balão, mas só as entende no
 * formato `[^id]`. Aqui o padrão é convertido, e SÓ quando a ligação é certa:
 * o id tem exatamente 1 chamada e 1 definição na obra. Id repetido, chamada
 * sem definição (ex.: `[1201]` de manuscrito) e definição sem chamada ficam
 * como estão: nota pendurada no trecho errado é pior do que nota sem link.
 *
 * O arquivo não é alterado; a conversão acontece na exibição.
 */
const DEFINICAO = /^[ \t]*\[(\d{1,4})\][ \t]+(\S.*)$/;
/** chamada: `[n]` que não é link `[n](url)` nem definição `[n]:` */
const CHAMADA = /\[(\d{1,4})\](?![(:])/g;

export function converterNotas(markdown: string): string {
  const linhas = markdown.split('\n');
  const emCodigo: boolean[] = [];
  let aberto = false;
  for (const l of linhas) {
    if (/^\s*```/.test(l)) {
      emCodigo.push(true);
      aberto = !aberto;
    } else emCodigo.push(aberto);
  }

  const definicoes = new Map<string, number>();
  const chamadas = new Map<string, number>();
  linhas.forEach((l, i) => {
    if (emCodigo[i]) return;
    const d = DEFINICAO.exec(l);
    let resto = l;
    if (d) {
      definicoes.set(d[1]!, (definicoes.get(d[1]!) ?? 0) + 1);
      resto = l.replace(/^[ \t]*\[\d{1,4}\]/, '');
    }
    for (const m of resto.matchAll(CHAMADA)) chamadas.set(m[1]!, (chamadas.get(m[1]!) ?? 0) + 1);
  });
  const seguro = (id: string) => chamadas.get(id) === 1 && definicoes.get(id) === 1;

  return linhas
    .map((l, i) => {
      if (emCodigo[i]) return l;
      const d = DEFINICAO.exec(l);
      if (d) {
        const id = d[1]!;
        const resto = d[2]!;
        return seguro(id) ? `[^n${id}]: ${resto}` : l;
      }
      return l.replace(CHAMADA, (todo, id: string) => (seguro(id) ? `[^n${id}]` : todo));
    })
    .join('\n');
}

/**
 * Depois de dividir em capítulos, a definição precisa estar no capítulo que tem
 * a chamada (o leitor renderiza um capítulo por vez). Leva a definição para
 * lá, tirando-a de onde estava.
 */
export function relocarNotas(capitulos: Chapter[]): Chapter[] {
  const DEF = /^\[\^(n\d+)\]:\s?(.*)$/;
  const definicoes = new Map<string, string>();
  for (const c of capitulos) {
    for (const l of c.body.split('\n')) {
      const m = DEF.exec(l);
      if (m) definicoes.set(m[1]!, l);
    }
  }
  if (definicoes.size === 0) return capitulos;

  const usadas = new Set<string>();
  const comChamadas = capitulos.map((c) => {
    const ids = new Set<string>();
    for (const l of c.body.split('\n')) {
      if (DEF.test(l)) continue;
      for (const m of l.matchAll(/\[\^(n\d+)\](?!:)/g)) ids.add(m[1]!);
    }
    ids.forEach((id) => usadas.add(id));
    return { c, ids };
  });

  return comChamadas.map(({ c, ids }) => {
    if (ids.size === 0 && !c.body.includes('[^n')) return c;
    const sem = c.body
      .split('\n')
      .filter((l) => {
        const m = DEF.exec(l);
        return !(m && usadas.has(m[1]!));
      })
      .join('\n')
      .trimEnd();
    const notas = [...ids].map((id) => definicoes.get(id)).filter((d): d is string => Boolean(d));
    return { ...c, body: notas.length ? `${sem}\n\n${notas.join('\n\n')}\n` : sem };
  });
}
