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
  useSiteSettings: vi.fn(),
}));

import { useBook, useSiteSettings } from '@/hooks/useDatabase';

const makeBook = (overrides: Partial<Book> = {}): Book => ({
  id: 'as-95-teses',
  title: 'As 95 Teses sobre as Indulgências',
  author: { id: 'lutero', name: 'Martinho Lutero', slug: 'martinho-lutero' },
  language: 'Português',
  description: 'Obra clássica de 1517.',
  ...overrides,
});

const mockBook = (book: Book) => {
  vi.mocked(useBook).mockReturnValue({ data: book, isLoading: false, error: null } as never);
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
