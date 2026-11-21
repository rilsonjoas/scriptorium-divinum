import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Reader from './Reader';
import { splitProvenance } from '@/utils/readerText';
import { getReadingProgress, saveReadingProgress } from '@/utils/readingProgress';

vi.mock('@/components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/hooks/useDatabase', () => ({
  useBookText: vi.fn(),
  useBook: vi.fn().mockReturnValue({ data: null, isLoading: false, error: null }),
}));

import { useBookText } from '@/hooks/useDatabase';

const mockText = (data: unknown, state: { isLoading: boolean; error: unknown } = { isLoading: false, error: null }) => {
  vi.mocked(useBookText).mockReturnValue({ data, ...state } as never);
};

const renderReader = (rota = '/ler/as-95-teses') => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[rota]}>
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

  it('mostra título e texto em markdown, com a proveniência em destaque', async () => {
    mockText({
      slug: 'as-95-teses',
      title: 'As 95 Teses de Martinho Lutero',
      text: '# Proveniência\n\n- **Obra**: Disputatio...\n\n---\n\n# As 95 Teses\n\n1. Dizendo nosso Senhor...\n\n> Em nome de nosso Senhor Jesus Cristo. Amém.',
    });
    renderReader();
    expect(screen.getByRole('heading', { name: 'As 95 Teses de Martinho Lutero' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'As 95 Teses' })).toBeInTheDocument();
    expect(screen.getByText('Dizendo nosso Senhor...')).toBeInTheDocument();
    // a proveniência mora na ficha da edição, que abre num modal pelo botão de informação
    expect(screen.queryByText(/Disputatio\.\.\./)).not.toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Sobre esta edição' }));
    expect(screen.getByText(/Disputatio\.\.\./)).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('link de volta aponta para a ficha pelo slug, mesmo chegando por UUID', () => {
    mockText({
      slug: 'as-95-teses',
      title: 'As 95 Teses de Martinho Lutero',
      text: '# Título\n\nConteúdo.',
    });
    renderReader('/ler/8ceec7d1-c719-4eea-a3fc-a7bfd2a5a9da');
    const backLink = screen.getByRole('link', { name: 'Voltar ao Catálogo' });
    // canonicaliza: quem chegou por link antigo com UUID sai pela URL amigável
    expect(backLink).toHaveAttribute('href', '/livros/as-95-teses');
  });

  it('link de volta não quebra quando a ficha não carrega', () => {
    mockText({
      slug: '',
      title: 'Obra',
      text: '# Título\n\nConteúdo.',
    });
    renderReader('/ler/8ceec7d1-c719-4eea-a3fc-a7bfd2a5a9da');
    const backLink = screen.getByRole('link', { name: 'Voltar ao Catálogo' });
    expect(backLink).toHaveAttribute('href', '/livros/8ceec7d1-c719-4eea-a3fc-a7bfd2a5a9da');
  });

  describe('#hash na URL', () => {
    const longo = (palavra: string) => `${palavra} `.repeat(220);
    const texto = `# Obra\n\n## Capítulo A\n\n${longo('alfa')}\n\n## Capítulo B\n\n${longo('beta')}\n\n## Capítulo C\n\n${longo('gama')}`;

    beforeEach(() => {
      localStorage.clear();
    });

    it('abre direto no capítulo do hash', () => {
      mockText({ slug: 'obra', title: 'Obra de Teste', text: texto });
      renderReader('/ler/obra#capitulo-b');
      expect(screen.getByRole('heading', { name: 'Capítulo B' })).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Capítulo A' })).not.toBeInTheDocument();
    });

    it('o hash vale mais que a leitura salva', () => {
      saveReadingProgress({ slug: 'obra', title: 'Obra de Teste', ratio: 0.9 });
      expect(getReadingProgress('obra')?.ratio).toBeCloseTo(0.9);
      mockText({ slug: 'obra', title: 'Obra de Teste', text: texto });
      renderReader('/ler/obra#capitulo-a');
      expect(screen.getByRole('heading', { name: 'Capítulo A' })).toBeInTheDocument();
    });

    it('hash que não existe na obra não atrapalha: abre no começo', () => {
      mockText({ slug: 'obra', title: 'Obra de Teste', text: texto });
      renderReader('/ler/obra#nao-existe');
      expect(screen.getByRole('heading', { name: 'Capítulo A' })).toBeInTheDocument();
    });
  });
});

