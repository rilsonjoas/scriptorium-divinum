import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { adminQuotes, quoteKeys, type QuoteFormValues } from './adminQuotes';

const vazio: QuoteFormValues = {
  author: 'C. S. Lewis',
  text: 'Texto.',
  source: '',
  dominioPublico: false,
  scriptoriumUrl: '',
  theme: '',
  fonteUrl: '',
  verificadoEm: '',
  status: 'rascunho',
};

describe('adminQuotes', () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  const chamada = (i = 0) => {
    const [url, init] = fetchMock.mock.calls[i] as [string, RequestInit | undefined];
    return { url, method: init?.method ?? 'GET', body: init?.body as string | undefined };
  };

  it('list monta a query string só com os filtros presentes', async () => {
    await adminQuotes.list({ status: 'oculta', page: 2 });
    expect(chamada().url).toMatch(/\/api\/v1\/admin\/quotes\?status=oculta&page=2$/);
    await adminQuotes.list({ semVerificacao: true });
    expect(chamada(1).url).toContain('semVerificacao=true');
    expect(chamada(1).url).not.toContain('status=');
  });

  it('create omite campos de texto vazios', async () => {
    await adminQuotes.create(vazio);
    const { url, method, body } = chamada();
    expect(url).toMatch(/\/api\/v1\/admin\/quotes$/);
    expect(method).toBe('POST');
    const corpo = JSON.parse(body!);
    expect(corpo).toEqual({ author: 'C. S. Lewis', text: 'Texto.', dominioPublico: false, status: 'rascunho' });
  });

  it('update manda updatedAt e transforma campo esvaziado em null', async () => {
    await adminQuotes.update('id1', { source: '', text: 'Novo.' }, '2026-01-01T10:00:00.123Z');
    const { url, method, body } = chamada();
    expect(url).toMatch(/\/admin\/quotes\/id1$/);
    expect(method).toBe('PATCH');
    expect(JSON.parse(body!)).toEqual({ source: null, text: 'Novo.', updatedAt: '2026-01-01T10:00:00.123Z' });
  });

  it('ocultar manda o motivo e reativar manda corpo {}', async () => {
    await adminQuotes.ocultar('id1', 'motivo');
    expect(chamada()).toMatchObject({ method: 'POST', body: JSON.stringify({ motivo: 'motivo' }) });
    expect(chamada().url).toMatch(/\/id1\/ocultar$/);
    await adminQuotes.reativar('id1');
    expect(chamada(1)).toMatchObject({ method: 'POST', body: '{}' });
    expect(chamada(1).url).toMatch(/\/id1\/reativar$/);
  });

  it('eventos busca o histórico', async () => {
    await adminQuotes.eventos('id1');
    expect(chamada().url).toMatch(/\/admin\/quotes\/id1\/eventos$/);
  });

  it('nenhum método usa DELETE', async () => {
    await adminQuotes.list({});
    await adminQuotes.create(vazio);
    await adminQuotes.update('i', { text: 'x' }, '2026-01-01T00:00:00.000Z');
    await adminQuotes.ocultar('i', 'motivo');
    await adminQuotes.reativar('i');
    await adminQuotes.eventos('i');
    const metodos = fetchMock.mock.calls.map((_, i) => chamada(i).method);
    expect(metodos).not.toContain('DELETE');
  });

  it('quoteKeys parte da mesma raiz para invalidar tudo', () => {
    expect(quoteKeys.list({ page: 1 })[0]).toBe(quoteKeys.all[0]);
    expect(quoteKeys.eventos('a')[0]).toBe(quoteKeys.all[0]);
  });
});
