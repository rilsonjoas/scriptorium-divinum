import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiClient, atualDe, issuesDe } from './api-client';

function fetchComErro(status: number, corpo: unknown) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status, json: async () => corpo }));
}

describe('api-client: corpo do erro', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('409 guarda o corpo e atualDe devolve a versão atual', async () => {
    fetchComErro(409, { error: 'conflict', message: 'm', atual: { id: 'x' } });
    const err = (await apiClient('/x').catch((e: unknown) => e)) as ApiError;
    expect(err).toBeInstanceOf(ApiError);
    expect(err.statusCode).toBe(409);
    expect(atualDe<{ id: string }>(err)).toEqual({ id: 'x' });
  });

  it('400 expõe os issues por campo', async () => {
    fetchComErro(400, { error: 'validation_error', message: 'm', issues: { text: ['repetido'] } });
    const err = (await apiClient('/x').catch((e: unknown) => e)) as ApiError;
    expect(issuesDe(err)).toEqual({ text: ['repetido'] });
  });

  it('issuesDe e atualDe toleram erro sem corpo', () => {
    expect(issuesDe(new Error('x'))).toEqual({});
    expect(atualDe(new Error('x'))).toBeUndefined();
    expect(issuesDe(new ApiError(500, 'api_error', 'm'))).toEqual({});
  });
});
