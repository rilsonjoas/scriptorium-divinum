import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchComLimite, LIMITE_DE_TEMPO_MS } from './fetch-com-limite';

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

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('fetchComLimite', () => {
  it('rejeita quando a API passa do limite de tempo', async () => {
    vi.stubGlobal('fetch', fetchPendente());
    const p = fetchComLimite('https://x.test/a');
    const resultado = expect(p).rejects.toThrow('abortado');
    await vi.advanceTimersByTimeAsync(LIMITE_DE_TEMPO_MS + 1);
    await resultado;
  });

  it('não aborta antes do limite', async () => {
    vi.stubGlobal('fetch', fetchPendente());
    let rejeitou = false;
    fetchComLimite('https://x.test/a').catch(() => {
      rejeitou = true;
    });
    await vi.advanceTimersByTimeAsync(LIMITE_DE_TEMPO_MS - 100);
    expect(rejeitou).toBe(false);
  });

  it('o sinal de quem chama (desmontar) também cancela', async () => {
    vi.stubGlobal('fetch', fetchPendente());
    const externo = new AbortController();
    const p = fetchComLimite('https://x.test/a', { signal: externo.signal });
    const resultado = expect(p).rejects.toThrow('abortado');
    externo.abort();
    await resultado;
  });

  it('sinal já abortado cancela de imediato', async () => {
    vi.stubGlobal('fetch', fetchPendente());
    const externo = new AbortController();
    externo.abort();
    await expect(fetchComLimite('https://x.test/a', { signal: externo.signal })).rejects.toThrow(
      'abortado',
    );
  });

  it('resposta rápida passa e o relógio é desligado', async () => {
    const resposta = { ok: true } as Response;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta));
    await expect(fetchComLimite('https://x.test/a')).resolves.toBe(resposta);
    expect(vi.getTimerCount()).toBe(0);
  });
});
