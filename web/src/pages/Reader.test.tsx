import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Reader from './Reader';
import { splitProvenance } from '@/utils/readerText';

vi.mock('@/components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/hooks/useDatabase', () => ({
  useBookText: vi.fn(),
}));

import { useBookText } from '@/hooks/useDatabase';

const mockText = (data: unknown, state: { isLoading: boolean; error: unknown } = { isLoading: false, error: null }) => {
  vi.mocked(useBookText).mockReturnValue({ data, ...state } as never);
};

const renderReader = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/ler/as-95-teses']}>
        <Routes>
          <Route path="/ler/:bookId" element={<Reader />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('splitProvenance', () => {
  it('separa o bloco de proveniência do conteúdo no separador ---', () => {
    const text = '# Proveniência\n\n- **Obra**: X\n\n---\n\n# Título\n\nCorpo do texto.';
    const { provenance, content } = splitProvenance(text);
    expect(provenance).toContain('# Proveniência');
    expect(provenance).not.toContain('Corpo do texto');
    expect(content).toContain('# Título');
    expect(content).not.toContain('- **Obra**: X');
  });

  it('devolve texto inteiro como conteúdo quando não há separador', () => {
    const text = '# Sem proveniência\n\nTexto simples.';
    const { provenance, content } = splitProvenance(text);
    expect(provenance).toBeNull();
    expect(content).toBe(text);
  });
});

describe('Reader', () => {
  beforeEach(() => {
    vi.mocked(useBookText).mockReset();
  });

  it('mostra estado de carregamento enquanto o texto é buscado', () => {
    mockText(undefined, { isLoading: true, error: null });
    renderReader();
    expect(screen.getByText('Preparando a leitura...')).toBeInTheDocument();
  });

  it('mostra "Conteúdo indisponível" quando a rota de texto falha (404/sem arquivo)', () => {
    mockText(undefined, { isLoading: false, error: new Error('not_found') });
    renderReader();
    expect(screen.getByText('Conteúdo indisponível')).toBeInTheDocument();
  });

  it('mostra título e texto em markdown, com a proveniência em destaque', () => {
    mockText({
      slug: 'as-95-teses',
      title: 'As 95 Teses de Martinho Lutero',
      text: '# Proveniência\n\n- **Obra**: Disputatio...\n\n---\n\n# As 95 Teses\n\n1. Dizendo nosso Senhor...\n\n> Em nome de nosso Senhor Jesus Cristo. Amém.',
    });
    renderReader();
    expect(screen.getByRole('heading', { name: 'As 95 Teses de Martinho Lutero' })).toBeInTheDocument();
    expect(screen.getByText(/Disputatio\.\.\./)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'As 95 Teses' })).toBeInTheDocument();
    expect(screen.getByText('Dizendo nosso Senhor...')).toBeInTheDocument();
  });

  it('link de volta aponta para a página da obra', () => {
    mockText({
      slug: 'as-95-teses',
      title: 'As 95 Teses de Martinho Lutero',
      text: '# Título\n\nConteúdo.',
    });
    renderReader();
    const backLink = screen.getByRole('link', { name: 'Voltar ao Catálogo' });
    expect(backLink).toHaveAttribute('href', '/livros/as-95-teses');
  });
});
