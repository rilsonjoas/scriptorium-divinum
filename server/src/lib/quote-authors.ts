/** Chave de comparação de autor: minúsculas e só letras e números. É a versão em JS da regra que
 *  `whereByAuthor` aplica em SQL (`regexp_replace(lower(x), '[^[:alnum:]]+', '', 'g')`): `C. S. Lewis`,
 *  `C.S. Lewis` e `CS Lewis` dão a mesma chave; acento continua distinguindo. */
export function chaveDeAutor(nome: string): string {
  return nome.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
}

export interface GrafiasDivergentes {
  chave: string;
  grafias: string[];
}

/** Grupos de nomes de autor que são o mesmo autor escrito de jeitos diferentes (mesma chave, mais de
 *  uma grafia). Quem cadastra uma citação escrevendo `C.S. Lewis` ao lado de `C. S. Lewis` cria dois
 *  "autores" na vitrine, e consumidores que comparam o nome exato (o Narniano mostra o autor como veio)
 *  passam a exibir os dois. O filtro da API já os une; isto aponta para corrigir o dado. */
export function grafiasDivergentes(nomes: readonly string[]): GrafiasDivergentes[] {
  const porChave = new Map<string, Set<string>>();
  for (const nome of nomes) {
    const chave = chaveDeAutor(nome);
    if (!chave) continue;
    const grafias = porChave.get(chave) ?? new Set<string>();
    grafias.add(nome.trim());
    porChave.set(chave, grafias);
  }
  return [...porChave]
    .filter(([, grafias]) => grafias.size > 1)
    .map(([chave, grafias]) => ({ chave, grafias: [...grafias].sort() }));
}
