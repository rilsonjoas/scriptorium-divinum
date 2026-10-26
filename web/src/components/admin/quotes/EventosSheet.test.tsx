import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { adminQuotes, type AdminQuoteItem, type QuoteEvent } from '@/services/adminQuotes';
import { EventosSheet } from './EventosSheet';

vi.mock('@/services/adminQuotes', async (original) => {
  const real = await original<typeof import('@/services/adminQuotes')>();
  return { ...real, adminQuotes: { eventos: vi.fn() } };
});

const quote = { id: 'q1', author: 'Santo Agostinho' } as AdminQuoteItem;
const evento = (e: Partial<QuoteEvent>): QuoteEvent => ({
  id: 'e',
  quoteId: 'q1',
  acao: 'criou',
  antes: null,
  depois: null,
  motivo: null,
  adminId: null,
  em: '2026-10-20T15:30:00.000Z',
  ...e,
});

function abrir() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <EventosSheet quote={quote} onOpenChange={vi.fn()} />
    </QueryClientProvider>,
  );
}

beforeEach(() => vi.resetAllMocks());

describe('EventosSheet', () => {
  it('lista os eventos com ação em português, motivo e campos alterados', async () => {
    vi.mocked(adminQuotes.eventos).mockResolvedValue({
      eventos: [
        evento({ id: '3', acao: 'ocultou', motivo: 'Sem fonte confiável', antes: { status: 'ativa' }, depois: { status: 'oculta' } }),
        evento({ id: '2', acao: 'editou', antes: { text: 'Antes.', source: null }, depois: { text: 'Depois.', source: 'Confissões' } }),
        evento({ id: '1', acao: 'criou' }),
      ],
    });
    abrir();
    expect(await screen.findByText('Ocultada')).toBeInTheDocument();
    expect(screen.getByText('Editada')).toBeInTheDocument();
    expect(screen.getByText('Criada')).toBeInTheDocument();
    expect(screen.getByText(/Sem fonte confiável/)).toBeInTheDocument();
    expect(screen.getByText('Situação: ativa → oculta')).toBeInTheDocument();
    expect(screen.getByText('Texto: Antes. → Depois.')).toBeInTheDocument();
    expect(screen.getByText('Obra: (vazio) → Confissões')).toBeInTheDocument();
    expect(adminQuotes.eventos).toHaveBeenCalledWith('q1');
  });

  it('sem eventos mostra vazio', async () => {
    vi.mocked(adminQuotes.eventos).mockResolvedValue({ eventos: [] });
    abrir();
    expect(await screen.findByText('Sem histórico registrado')).toBeInTheDocument();
  });

  it('erro mostra alerta', async () => {
    vi.mocked(adminQuotes.eventos).mockRejectedValue(new Error('Falhou a rede'));
    abrir();
    expect(await screen.findByRole('alert')).toHaveTextContent('Falhou a rede');
  });
});
