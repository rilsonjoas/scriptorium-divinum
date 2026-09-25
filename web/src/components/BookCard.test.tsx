import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BookCard } from './BookCard';

const book = {
  id: '8ceec7d1-c719-4eea-a3fc-a7bfd2a5a9da',
  slug: 'confissoes',
  title: 'Confissões',
  originalTitle: 'Confessiones',
  description: 'Autobiografia espiritual de Santo Agostinho.',
  categories: ['Patrística'],
  publicationYearOriginal: '397',
  onlineReadPath: '/texts/confissoes-garnier-1905-pt.md',
  coverImageUrl: '/covers/confissoes.svg',
  author: { id: 'a1', slug: 'santo-agostinho', name: 'Santo Agostinho' },
} as unknown as Parameters<typeof BookCard>[0]['book'];

function renderCard() {
  return render(
    <MemoryRouter>
      <BookCard book={book} />
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('BookCard — links navegáveis', () => {
  it('renderiza âncora para a ficha da obra', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /detalhes/i });
    expect(link.getAttribute('href')).toBe(`/livros/${book.id}`);
  });

  it('renderiza âncora para o leitor online', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /ler online/i });
    expect(link.getAttribute('href')).toBe(`/ler/${book.id}`);
  });

  it('todo overlay absolute dentro do card está contido num pai relative', () => {
    const { container } = renderCard();
    const absolutos = Array.from(container.querySelectorAll('[class*="absolute"]'));
    for (const el of absolutos) {
      const pai = el.parentElement?.getAttribute('class') ?? '';
      const cls = el.getAttribute('class') ?? '';
      const contido = pai.includes('relative');
      const inerte = cls.includes('pointer-events-none');
      expect(contido || inerte).toBe(true);
    }
  });

  it('o título não é âncora', () => {
    renderCard();
    expect(screen.getByText('Confissões').closest('a')).toBeNull();
  });
});
