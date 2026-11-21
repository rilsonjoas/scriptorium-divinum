import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AutorDetalhes from './AutorDetalhes';

vi.mock('@/components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/hooks/useDatabase', () => ({
  useAuthorWithBooks: vi.fn(),
}));

import { useAuthorWithBooks } from '@/hooks/useDatabase';

const Onde = () => <span data-testid="onde">{useLocation().pathname}</span>;

const renderPagina = (rota: string) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[rota]}>
        <Onde />
        <Routes>
          <Route path="/autores/:authorSlug" element={<AutorDetalhes />} />
          <Route path="/404" element={<div>não encontrado</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

const autor = (slug: string) => ({ id: 'a1', slug, name: 'Santo Agostinho de Hipona', books: [] });

describe('AutorDetalhes: slug antigo de autor unificado', () => {
  beforeEach(() => {
    vi.mocked(useAuthorWithBooks).mockReset();
  });

  it('a API devolveu o autor canônico para um slug antigo: o endereço passa a ser o canônico', () => {
    vi.mocked(useAuthorWithBooks).mockReturnValue({ data: autor('agostinho-de-hipona'), isLoading: false, error: null } as never);
    renderPagina('/autores/santo-agostinho');
    expect(screen.getByTestId('onde')).toHaveTextContent('/autores/agostinho-de-hipona');
  });

  it('slug canônico não redireciona', () => {
    vi.mocked(useAuthorWithBooks).mockReturnValue({ data: autor('agostinho-de-hipona'), isLoading: false, error: null } as never);
    renderPagina('/autores/agostinho-de-hipona');
    expect(screen.getByTestId('onde')).toHaveTextContent('/autores/agostinho-de-hipona');
  });

  it('autor que não existe continua indo para /404', () => {
    vi.mocked(useAuthorWithBooks).mockReturnValue({ data: null, isLoading: false, error: new Error('not_found') } as never);
    renderPagina('/autores/nao-existe');
    expect(screen.getByTestId('onde')).toHaveTextContent('/404');
  });
});
