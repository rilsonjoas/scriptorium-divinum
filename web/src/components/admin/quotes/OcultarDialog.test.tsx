import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiError } from '@/lib/api-client';
import { adminQuotes, type AdminQuoteItem } from '@/services/adminQuotes';
import { OcultarDialog } from './OcultarDialog';

vi.mock('@/services/adminQuotes');

const quote: AdminQuoteItem = {
  id: 'q1',
  author: 'Santo Agostinho',
  text: 'Fizeste-nos para ti.',
  source: 'Confissões',
  dominioPublico: true,
  scriptoriumUrl: null,
  theme: null,
  fonteUrl: null,
  verificadoEm: null,
  status: 'ativa',
  motivoOcultacao: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  diasFixados: [],
};

function abrir(q: AdminQuoteItem | null = quote) {
  const onDone = vi.fn();
  const onOpenChange = vi.fn();
  const user = userEvent.setup();
  render(<OcultarDialog quote={q} onOpenChange={onOpenChange} onDone={onDone} />);
  return { user, onDone, onOpenChange };
}
const confirmar = () => screen.getByRole('button', { name: 'Ocultar citação' });

beforeEach(() => vi.resetAllMocks());

describe('OcultarDialog', () => {
  it('não renderiza nada sem citação', () => {
    abrir(null);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('motivo curto mantém o botão desabilitado', async () => {
    const { user } = abrir();
    expect(confirmar()).toBeDisabled();
    await user.type(screen.getByLabelText(/^Motivo/), 'ab');
    expect(confirmar()).toBeDisabled();
    await user.type(screen.getByLabelText(/^Motivo/), 'c');
    expect(confirmar()).toBeEnabled();
  });

  it('mostra dias fixados com as datas e o aviso de cache', () => {
    abrir({ ...quote, diasFixados: ['2026-01-10', '2026-01-12'] });
    expect(screen.getByText(/Está fixada em 2 dias: 10\/01\/2026, 12\/01\/2026\. Esses dias passam a mostrar outra citação\./)).toBeInTheDocument();
    expect(screen.getByText(/Narniano pode continuar mostrando por até 6 horas/)).toBeInTheDocument();
    expect(screen.getByText(/Gerador C\. S\. Lewis por até 10 minutos/)).toBeInTheDocument();
  });

  it('um dia fixado usa o singular; nenhum diz que não está fixada', () => {
    const { unmount } = render(<OcultarDialog quote={{ ...quote, diasFixados: ['2026-01-10'] }} onOpenChange={vi.fn()} onDone={vi.fn()} />);
    expect(screen.getByText(/Está fixada em 1 dia: 10\/01\/2026\./)).toBeInTheDocument();
    unmount();
    abrir();
    expect(screen.getByText('Não está fixada em nenhum dia.')).toBeInTheDocument();
  });

  it('autor C. S. Lewis mostra o passo do Gerador; outro autor não', () => {
    const { unmount } = render(<OcultarDialog quote={{ ...quote, author: 'C.S. Lewis' }} onOpenChange={vi.fn()} onDone={vi.fn()} />);
    expect(screen.getByText(/npm run quotes:sync/)).toBeInTheDocument();
    unmount();
    abrir();
    expect(screen.queryByText(/npm run quotes:sync/)).toBeNull();
  });

  it('confirmar chama ocultar com o motivo e onDone, uma vez só mesmo com duplo clique', async () => {
    let liberar!: () => void;
    const ocultada = { ...quote, status: 'oculta' as const };
    vi.mocked(adminQuotes.ocultar).mockReturnValue(
      new Promise((r) => {
        liberar = () => r({ quote: ocultada });
      }),
    );
    const { user, onDone } = abrir();
    await user.type(screen.getByLabelText(/^Motivo/), 'Sem fonte confiável');
    await user.dblClick(confirmar());
    liberar();
    await waitFor(() => expect(onDone).toHaveBeenCalledWith(ocultada));
    expect(adminQuotes.ocultar).toHaveBeenCalledTimes(1);
    expect(adminQuotes.ocultar).toHaveBeenCalledWith('q1', 'Sem fonte confiável');
  });

  it('409 mostra mensagem e não chama onDone', async () => {
    vi.mocked(adminQuotes.ocultar).mockRejectedValue(new ApiError(409, 'conflict', 'A citação já está oculta'));
    const { user, onDone } = abrir();
    await user.type(screen.getByLabelText(/^Motivo/), 'Sem fonte confiável');
    await user.click(confirmar());
    expect(await screen.findByRole('alert')).toHaveTextContent('A citação já está oculta');
    expect(onDone).not.toHaveBeenCalled();
  });
});
