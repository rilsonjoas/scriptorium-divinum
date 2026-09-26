import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LivroDetalhes from './LivroDetalhes';
import type { Book } from '@/types';

vi.mock('@/components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/hooks/useDatabase', () => ({
  useBook: vi.fn(),
  useBookText: vi.fn(),
  useSiteSettings: vi.fn(),
}));

import { useBook, useBookText, useSiteSettings } from '@/hooks/useDatabase';

const makeBook = (overrides: Partial<Book> = {}): Book => ({
  id: 'as-95-teses',
  title: 'As 95 Teses sobre as Indulgências',
  author: { id: 'lutero', name: 'Martinho Lutero', slug: 'martinho-lutero' },
  language: 'Português',
  description: 'Obra clássica de 1517.',
  ...overrides,
});

/**
 * Mocks the book catalog. `extras` simulates other editions in the
 * acervo — needed because the "edição original" notice fetches the
 * counterpart by slug, and a mockReturnValue would answer every call
 * with the same book (and produce a link pointing at itself).
 */
const mockBook = (
  book: Book,
  text: string | null = null,
  extras: Record<string, Book> = {},
) => {
  const catalogo: Record<string, Book> = { [book.slug ?? book.id]: book, ...extras };
  vi.mocked(useBook).mockImplementation(((id: string) => ({
    data: catalogo[id] ?? null,
    isLoading: false,
    error: null,
  })) as never);
  vi.mocked(useBookText).mockReturnValue({
    data: text ? { slug: book.slug ?? '', title: book.title, text } : null,
    isLoading: false,
  } as never);
  vi.mocked(useSiteSettings).mockReturnValue({
    data: { maintenanceMode: false },
    isLoading: false,
  } as never);
};

const renderLivro = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/livros/as-95-teses']}>
        <Routes>
          <Route path="/livros/:bookId" element={<LivroDetalhes />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('LivroDetalhes — botão "Ler Online"', () => {
  beforeEach(() => {
    vi.mocked(useBook).mockReset();
    vi.mocked(useBookText).mockReset();
    vi.mocked(useSiteSettings).mockReset();
  });

  it('mostra o botão "Ler Online" quando textAvailable é true', () => {
    mockBook(makeBook({ textAvailable: true }));
    renderLivro();
    const readButton = screen.getByRole('link', { name: /Ler Online/ });
    expect(readButton).toHaveAttribute('href', '/ler/as-95-teses');
  });

  it('não mostra "Ler Online" quando o texto não existe (textAvailable false)', () => {
    mockBook(makeBook({ textAvailable: false, onlineReadPath: '/texts/lutero-95-teses.md' }));
    renderLivro();
    expect(screen.queryByRole('link', { name: /Ler Online/ })).not.toBeInTheDocument();
  });

  it('não mostra "Ler Online" mesmo com texto órfão (bug: onlineReadPath apontava para arquivo inexistente)', () => {
    mockBook(makeBook({ onlineReadPath: '/texts/lutero-95-teses.md' }));
    renderLivro();
    expect(screen.queryByRole('link', { name: /Ler Online/ })).not.toBeInTheDocument();
  });

  it('mostra o título e o autor da obra', () => {
    mockBook(makeBook({ textAvailable: false }));
    renderLivro();
    expect(screen.getByRole('heading', { name: 'As 95 Teses sobre as Indulgências' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Martinho Lutero' })).toHaveAttribute('href', '/autores/martinho-lutero');
  });
});

describe('LivroDetalhes — barra de downloads', () => {
  beforeEach(() => {
    vi.mocked(useBook).mockReset();
    vi.mocked(useBookText).mockReset();
    vi.mocked(useSiteSettings).mockReset();
  });

  it('oferece ePub, TXT e Markdown quando há texto disponível', () => {
    mockBook(makeBook({ textAvailable: true }), '# Capítulo I\n\nTexto da obra.');
    renderLivro();
    expect(screen.getByRole('button', { name: /ePub/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /TXT/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Markdown/i })).toBeInTheDocument();
  });

  it('não mostra nenhum formato gerado quando a obra não tem texto', () => {
    mockBook(makeBook({ textAvailable: false }), null);
    renderLivro();
    expect(screen.queryByRole('button', { name: /ePub/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Markdown/i })).not.toBeInTheDocument();
  });

  it('mantém o PDF hospedado visível mesmo sem texto', () => {
    mockBook(
      makeBook({
        textAvailable: false,
        downloadLinks: [{ format: 'pdf', url: '/downloads/obras/95-teses.pdf', source: 'Internet Archive' }],
      }),
      null,
    );
    renderLivro();
    expect(screen.getByRole('link', { name: /PDF/ })).toHaveAttribute(
      'href',
      '/downloads/obras/95-teses.pdf',
    );
  });
});

describe('LivroDetalhes — obra sem texto disponível', () => {
  beforeEach(() => {
    vi.mocked(useBook).mockReset();
    vi.mocked(useBookText).mockReset();
    vi.mocked(useSiteSettings).mockReset();
  });

  it('explica por que nao ha o que ler, em vez de deixar a pagina muda', () => {
    mockBook(makeBook({ textAvailable: false, relatedEditionSlug: null }), null);
    renderLivro();
    expect(
      screen.getByText(/ainda não está disponível para leitura online/i),
    ).toBeInTheDocument();
  });

  it('oferece a edicao original quando ela existe no acervo', () => {
    mockBook(
      makeBook({ textAvailable: false, relatedEditionSlug: 'the-city-of-god' }),
      null,
      { 'the-city-of-god': makeBook({ slug: 'the-city-of-god', title: 'The City of God', language: 'English' }) },
    );
    renderLivro();
    expect(screen.getByRole('link', { name: /edição original/i })).toHaveAttribute(
      'href',
      '/ler/the-city-of-god',
    );
  });

  it('nao inventa link quando nao existe edicao original', () => {
    mockBook(makeBook({ textAvailable: false, relatedEditionSlug: null }), null);
    renderLivro();
    expect(screen.queryByRole('link', { name: /edição original/i })).not.toBeInTheDocument();
  });

  it('nao mostra o aviso em obra que tem texto', () => {
    mockBook(makeBook({ textAvailable: true, relatedEditionSlug: 'the-city-of-god' }), '# Capítulo I\n\nTexto.');
    renderLivro();
    expect(
      screen.queryByText(/ainda não está disponível para leitura online/i),
    ).not.toBeInTheDocument();
  });
});
