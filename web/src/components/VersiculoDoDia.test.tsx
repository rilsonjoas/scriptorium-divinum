import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { VersiculoDoDia } from './VersiculoDoDia';

const sample = {
  date: '2026-01-01',
  verse: {
    type: 'gospel' as const,
    reference: 'Mateus 2:1-12',
    citation: 'Mateus 2',
    text: 'E, tendo nascido Jesus em Belém da Judeia, no tempo do rei Herodes, eis que uns magos vieram do oriente a Jerusalém.',
  },
  fallback: false,
  shifted: false,
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

describe('VersiculoDoDia', () => {
  it('renderiza versículo, referência, data e link pro Lecionário', async () => {
    stubFetch(true, sample);
    render(<VersiculoDoDia />);

    expect(await screen.findByText(sample.verse.text)).toBeInTheDocument();
    expect(screen.getByText('Mateus 2:1-12 • ARC')).toBeInTheDocument();
    expect(screen.getByText('1 de janeiro de 2026')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Lecionário Comum Revisado/ });
    expect(link).toHaveAttribute('href', 'https://lecionario.narniano.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('some com graça quando a rota não responde', async () => {
    stubFetch(false);
    const { container } = render(<VersiculoDoDia />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(container).toBeEmptyDOMElement();
  });

  it('some com graça quando o servidor responde com erro de rede', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('falha de rede')));
    const { container } = render(<VersiculoDoDia />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(container).toBeEmptyDOMElement();
  });
});