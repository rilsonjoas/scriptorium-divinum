import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CitacaoDoDia } from './CitacaoDoDia';

const sample = {
  id: '11111111-1111-4111-8111-111111111111',
  date: '2026-09-23',
  author: 'C. S. Lewis',
  text: 'A porta para o inferno está trancada por dentro.',
  source: 'O Problema do Sofrimento',
  dominioPublico: false,
  scriptoriumUrl: null,
  theme: null,
  affiliateUrl: 'https://www.amazon.com.br/s?k=O%20Problema%20do%20Sofrimento&tag=rilson-20',
};

function stubFetch(ok: boolean, body?: unknown): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
      json: async () => body,
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('CitacaoDoDia', () => {
  it('renderiza citação, autor, data e CTA de afiliado da API', async () => {
    stubFetch(true, sample);
    render(<CitacaoDoDia />);

    expect(await screen.findByText('“A porta para o inferno está trancada por dentro.”')).toBeInTheDocument();
    expect(screen.getByText('23 de setembro de 2026')).toBeInTheDocument();

    const cta = screen.getByRole('link', { name: 'Comprar o livro' });
    expect(cta).toHaveAttribute('href', sample.affiliateUrl);
    expect(cta).toHaveAttribute('target', '_blank');
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('domínio público: link "Ler livro completo" para scriptoriumUrl, sem CTA Amazon', async () => {
    stubFetch(true, {
      ...sample,
      author: 'Santo Agostinho',
      source: 'Confissões',
      dominioPublico: true,
      scriptoriumUrl: 'https://scriptorium.narniano.com/livros/confissoes',
      affiliateUrl: null,
    });
    render(<CitacaoDoDia />);

    const cta = await screen.findByRole('link', { name: 'Ler livro completo' });
    expect(cta).toHaveAttribute('href', 'https://scriptorium.narniano.com/livros/confissoes');
    expect(screen.queryByRole('link', { name: 'Comprar o livro' })).not.toBeInTheDocument();
  });

  it('some com graça quando a rota não responde', async () => {
    stubFetch(false);
    const { container } = render(<CitacaoDoDia />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(container).toBeEmptyDOMElement();
  });

  it('some com graça quando o servidor responde com erro de rede', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('falha de rede')));
    const { container } = render(<CitacaoDoDia />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(container).toBeEmptyDOMElement();
  });
});