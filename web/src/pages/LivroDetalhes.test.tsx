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

const mockBook = (book: Book, text: string | null = null) => {
  vi.mocked(useBook).mockReturnValue({ data: book, isLoading: false, error: null } as never);
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
