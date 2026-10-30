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

/** Hosts em que uma obra do Scriptorium tem endereço público. Só `https`, nunca `http`. */
export const HOSTS_DO_SCRIPTORIUM = ['scriptorium.narniano.com'];

/**
 * `slug` da obra de um endereço `https://scriptorium.narniano.com/livros/<slug>` (com ou sem barra no fim), ou
 * `null` se o endereço não tem essa forma (outro host, `http`, outro caminho, texto que não é endereço). É a regra do
 * campo `scriptoriumUrl` das citações: o link tem de apontar para uma obra do Scriptorium de verdade.
 */
export function slugDoEnderecoDaObra(endereco: string): string | null {
  let url: URL;
  try {
    url = new URL(endereco);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || !HOSTS_DO_SCRIPTORIUM.includes(url.hostname)) return null;
  const m = /^\/livros\/([^/]+)\/?$/.exec(url.pathname);
  return m ? decodeURIComponent(m[1]!) : null;
}
