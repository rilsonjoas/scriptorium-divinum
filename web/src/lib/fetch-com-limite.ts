/** `fetch` com limite de tempo. Política do cluster (hetzner-infra/CONTRATOS-ENTRE-PROJETOS.md,
 *  seção 10.1): toda chamada a outro projeto tem limite, senão uma API lenta deixa o card
 *  aparecer tarde (deslocando o layout) ou nunca. Estourar o limite rejeita como qualquer
 *  falha de rede; os fetchers já transformam isso em `null` e o card some.
 *
 *  Escrito à mão (sem `AbortSignal.timeout`/`AbortSignal.any`) para funcionar em navegadores
 *  e no Hermes do React Native. O sinal de quem chama (ex.: desmontar o componente) continua
 *  valendo. O limite vale até chegarem os cabeçalhos da resposta, não para ler o corpo. */
export const LIMITE_DE_TEMPO_MS = 5000;

export function fetchComLimite(
  url: string,
  init: RequestInit = {},
  limiteMs: number = LIMITE_DE_TEMPO_MS,
): Promise<Response> {
  const controle = new AbortController();
  const externo = init.signal ?? undefined;
  const abortar = () => controle.abort();

  if (externo) {
    if (externo.aborted) controle.abort();
    else externo.addEventListener('abort', abortar, { once: true });
  }
  const relogio = setTimeout(abortar, limiteMs);

  return fetch(url, { ...init, signal: controle.signal }).finally(() => {
    clearTimeout(relogio);
    externo?.removeEventListener('abort', abortar);
  });
}
