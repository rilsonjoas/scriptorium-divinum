/**
 * Marcas da edição impressa que as traduções acadêmicas preservam no meio do
 * texto: coluna da Patrologia (`[960A]`) e página (`|18`). São aparato útil
 * para quem cita, mas atrapalham a leitura corrida. Em vez de apagá-las do
 * arquivo, o leitor as mostra pequenas e apagadas (`.marca-edicao`).
 *
 * Chamadas de nota (`[1]`) e versículos (`[12]`) ficam como estão: não têm
 * letra e são conteúdo, não aparato.
 */
type No = {
  type: string;
  value?: string;
  children?: No[];
  data?: { hName?: string; hProperties?: { className?: string[] } };
};

const MARCA = /(\[\d{2,4}[A-Za-z]\]|(?<![\w|])\|\d{1,4}(?!\w))/g;
/** nós em que o texto é literal e não deve ser tocado */
const LITERAIS = new Set(['code', 'inlineCode', 'html', 'yaml']);

export function marcarEdicao(no: No): void {
  if (!no.children || LITERAIS.has(no.type)) return;
  const novos: No[] = [];
  for (const filho of no.children) {
    if (filho.type === 'text' && filho.value && MARCA.test(filho.value)) {
      MARCA.lastIndex = 0;
      for (const parte of filho.value.split(MARCA)) {
        if (parte === '') continue;
        MARCA.lastIndex = 0;
        if (MARCA.test(parte) && parte.match(MARCA)?.[0] === parte) {
          novos.push({
            type: 'emphasis',
            data: { hName: 'span', hProperties: { className: ['marca-edicao'] } },
            children: [{ type: 'text', value: parte }],
          });
        } else {
          novos.push({ type: 'text', value: parte });
        }
        MARCA.lastIndex = 0;
      }
    } else {
      marcarEdicao(filho);
      novos.push(filho);
    }
    MARCA.lastIndex = 0;
  }
  no.children = novos;
}

/** plugin remark: `remarkPlugins={[remarkGfm, remarkMarcasDeEdicao]}` */
export function remarkMarcasDeEdicao() {
  return (arvore: No) => marcarEdicao(arvore);
}
