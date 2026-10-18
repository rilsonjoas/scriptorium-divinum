import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchCitacaoDoDia } from './citacaoDoDia';
import { fetchPinturaDoDia } from './pinturaDoDia';
import { fetchVersiculoDoDia } from './versiculoDoDia';

/** fetch que nunca responde, mas rejeita quando o sinal é abortado (como o de verdade). */
function fetchPendente() {
  return vi.fn(
    (_url: string, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        const abortado = () => reject(new DOMException('abortado', 'AbortError'));
        if (init?.signal?.aborted) abortado();
        else init?.signal?.addEventListener('abort', abortado);
      }),
  );
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// Política do cluster (hetzner-infra/CONTRATOS-ENTRE-PROJETOS.md, 10.1): toda chamada tem limite
// de tempo; API lenta vira null e o card "do dia" some, em vez de aparecer tarde ou nunca.
describe.each([
  ['citação do dia', fetchCitacaoDoDia],
  ['pintura do dia', fetchPinturaDoDia],
  ['versículo do dia', fetchVersiculoDoDia],
])('%s com a API lenta', (_nome, buscar) => {
  it('vira null depois do limite de tempo', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', fetchPendente());
    const resultado = buscar();
    await vi.advanceTimersByTimeAsync(5001);
    expect(await resultado).toBeNull();
  });
});
