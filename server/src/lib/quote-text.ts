/** Chave de comparação do texto de uma citação: minúsculas e só letras e números, a mesma regra de
 *  `chaveDeAutor` (e do SQL de `validarTexto`, em `db/admin-quotes.ts`). Duas citações com a mesma chave
 *  são a mesma frase escrita com caixa, espaço ou pontuação diferentes; acento continua distinguindo. */
export function chaveDeTexto(texto: string): string {
  return texto.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
}

/** Último segmento do caminho de uma URL do Scriptorium (`.../livros/confissoes/` → `confissoes`):
 *  a mesma regra de `scripts/verificar-acervo.ts` para achar a obra de um link de citação. */
export function slugDaUrlDoScriptorium(url: string): string {
  return url.replace(/\/$/, '').split('/').pop() ?? '';
}
