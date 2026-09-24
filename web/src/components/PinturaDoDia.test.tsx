import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { PinturaDoDia } from './PinturaDoDia';

const sample = {
  id: '318a8226-2db2-5365-8d2d-e263d46a1ecf',
  title: 'O dinheiro do tributo',
  artistOrDirector: 'Ticiano',
  year: '1540',
  imageUrl: '/images/ticiano-o-dinheiro-do-tributo.webp',
  description: '',
  sourceUrl: null,
  references: [{ book: 'Mateus', chapter: 22, verses: '19-21' }],
};

function stubFetch(ok: boolean, body?: unknown): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 404,
      json: async () => body,
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('PinturaDoDia', () => {
  it('renderiza título, artista, passagem e links da obra quando a API responde', async () => {
    stubFetch(true, sample);
    render(<PinturaDoDia />);

    const heading = await screen.findByRole('heading', { level: 3, name: 'O dinheiro do tributo (1540)' });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText('Ticiano • Bíblia na Arte')).toBeInTheDocument();
    expect(screen.getByText('Mateus 22:19-21')).toBeInTheDocument();

    const img = screen.getByRole('img', { name: 'O dinheiro do tributo' }) as HTMLImageElement;
    expect(img).toHaveAttribute(
      'src',
      'https://biblianaarte.narniano.com/images/ticiano-o-dinheiro-do-tributo.webp',
    );

    const links = screen.getAllByRole('link');
    const infoLink = links.find((l) => l.getAttribute('href') === 'https://biblianaarte.narniano.com/obra/318a8226-2db2-5365-8d2d-e263d46a1ecf');
    expect(infoLink).toBeDefined();
    expect(infoLink).toHaveAttribute('target', '_blank');
    expect(infoLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('some com graça quando a API não tem obra para o dia', async () => {
    stubFetch(false);
    const { container } = render(<PinturaDoDia />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(container).toBeEmptyDOMElement();
  });

  it('tenta a imagem uma vez e esconde só a imagem após falha repetida', async () => {
    stubFetch(true, sample);
    render(<PinturaDoDia />);

    const firstImg = (await screen.findByRole('img', { name: 'O dinheiro do tributo' })) as HTMLImageElement;
    fireEvent.error(firstImg);

    await waitFor(() => {
      const retried = screen.getByRole('img', { name: 'O dinheiro do tributo' });
      expect(retried).toHaveAttribute(
        'src',
        'https://biblianaarte.narniano.com/images/ticiano-o-dinheiro-do-tributo.webp',
      );
    });

    const secondImg = screen.getByRole('img', { name: 'O dinheiro do tributo' });
    fireEvent.error(secondImg);

    await waitFor(() => expect(screen.queryByRole('img')).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { level: 3, name: 'O dinheiro do tributo (1540)' })).toBeInTheDocument();
    expect(screen.getByText('Ver obra completa')).toBeInTheDocument();
  });
});