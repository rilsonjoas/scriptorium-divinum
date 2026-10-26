import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api-client';
import { adminQuotes, quoteKeys, type AdminQuoteItem, type QuoteListResponse } from '@/services/adminQuotes';
import { AdminLayout } from '@/components/AdminLayout';
import { QuotesPanel } from './QuotesPanel';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() } }));
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ admin: { id: 'ad1', email: 'admin@teste.com', name: 'Admin' }, signOut: vi.fn() }),
}));
vi.mock('@/services/adminQuotes', async (original) => {
  const real = await original<typeof import('@/services/adminQuotes')>();
  return { ...real, adminQuotes: { list: vi.fn(), create: vi.fn(), update: vi.fn(), ocultar: vi.fn(), reativar: vi.fn(), eventos: vi.fn() } };
});

const item = (extra: Partial<AdminQuoteItem>): AdminQuoteItem => ({
  id: 'a',
  author: 'C. S. Lewis',
  text: 'Texto da ativa.',
  source: 'Obra A',
  dominioPublico: false,
  scriptoriumUrl: null,
  theme: null,
  fonteUrl: 'https://exemplo.org',
  verificadoEm: '2026-10-01',
  status: 'ativa',
  motivoOcultacao: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  diasFixados: ['2026-01-10'],
  ...extra,
});
const ativa = item({});
const oculta = item({ id: 'o', author: 'Outro', text: 'Texto da oculta.', status: 'oculta', source: null });

const lista = (itens: AdminQuoteItem[]): QuoteListResponse => ({
  itens,
  total: itens.length,
  pagina: 1,
  porPagina: 50,
  contadores: { porStatus: { rascunho: 0, ativa: 1, oculta: 1 }, porAutor: [{ autor: 'C. S. Lewis', total: 1 }, { autor: 'Outro', total: 1 }], semVerificacao: 0 },
});

function montar() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const user = userEvent.setup();
  render(
    <QueryClientProvider client={client}>
      <QuotesPanel />
    </QueryClientProvider>,
  );
  return { user, client };
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(adminQuotes.list).mockResolvedValue(lista([ativa, oculta]));
});

describe('QuotesPanel', () => {
  it('carrega e mostra contadores e linhas', async () => {
    montar();
    expect(await screen.findByText('Texto da ativa.')).toBeInTheDocument();
    expect(screen.getByText('Texto da oculta.')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Resumo do acervo' })).toBeInTheDocument();
    expect(adminQuotes.list).toHaveBeenCalledWith({ page: 1 });
  });

  it('Nova citação abre o formulário, salva e a lista é recarregada', async () => {
    vi.mocked(adminQuotes.create).mockResolvedValue({ quote: ativa, avisos: ['Sem verificação registrada'] });
    const { user } = montar();
    await screen.findByText('Texto da ativa.');
    await user.click(screen.getByRole('button', { name: 'Nova citação' }));
    const dialogo = await screen.findByRole('dialog');
    await user.type(within(dialogo).getByLabelText(/^Autor/), 'Outro');
    await user.type(within(dialogo).getByLabelText(/^Texto/), 'Nova citação de teste.');
    await user.click(within(dialogo).getByRole('button', { name: 'Salvar' }));
    await waitFor(() => expect(adminQuotes.create).toHaveBeenCalled());
    await waitFor(() => expect(adminQuotes.list).toHaveBeenCalledTimes(2));
    expect(toast.success).toHaveBeenCalledWith('Citação criada');
    expect(toast.warning).toHaveBeenCalledWith('Sem verificação registrada');
  });

  it('Ocultar abre o diálogo com o impacto e, confirmado, recarrega', async () => {
    vi.mocked(adminQuotes.ocultar).mockResolvedValue({ quote: { ...ativa, status: 'oculta' } });
    const { user } = montar();
    await user.click(await screen.findByRole('button', { name: 'Ocultar citação de C. S. Lewis' }));
    const dialogo = await screen.findByRole('dialog');
    expect(within(dialogo).getByText(/Está fixada em 1 dia: 10\/01\/2026/)).toBeInTheDocument();
    await user.type(within(dialogo).getByLabelText(/^Motivo/), 'Fonte não confirmada');
    await user.click(within(dialogo).getByRole('button', { name: 'Ocultar citação' }));
    await waitFor(() => expect(adminQuotes.ocultar).toHaveBeenCalledWith('a', 'Fonte não confirmada'));
    await waitFor(() => expect(adminQuotes.list).toHaveBeenCalledTimes(2));
    expect(toast.success).toHaveBeenCalledWith('Citação ocultada');
  });

  it('Reativar chama o serviço e recarrega', async () => {
    vi.mocked(adminQuotes.reativar).mockResolvedValue({ quote: { ...oculta, status: 'ativa' } });
    const { user } = montar();
    await user.click(await screen.findByRole('button', { name: 'Reativar citação de Outro' }));
    await waitFor(() => expect(adminQuotes.reativar).toHaveBeenCalledWith('o'));
    await waitFor(() => expect(adminQuotes.list).toHaveBeenCalledTimes(2));
    expect(toast.success).toHaveBeenCalledWith('Citação reativada');
  });

  it('Reativar recusada por falta de fonte mostra o erro e abre a edição', async () => {
    vi.mocked(adminQuotes.reativar).mockRejectedValue(
      new ApiError(400, 'validation_error', 'Dados inválidos', undefined, { issues: { source: ['Informe a obra antes de reativar'] } }),
    );
    const { user } = montar();
    await user.click(await screen.findByRole('button', { name: 'Reativar citação de Outro' }));
    expect(await screen.findByRole('dialog', { name: 'Editar citação' })).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Informe a obra antes de reativar');
  });

  it('Histórico abre a gaveta', async () => {
    vi.mocked(adminQuotes.eventos).mockResolvedValue({ eventos: [] });
    const { user } = montar();
    await user.click(await screen.findByRole('button', { name: 'Histórico da citação de Outro' }));
    expect(await screen.findByText('Sem histórico registrado')).toBeInTheDocument();
    expect(adminQuotes.eventos).toHaveBeenCalledWith('o');
  });

  it('não há botão Excluir na tela', async () => {
    montar();
    await screen.findByText('Texto da ativa.');
    expect(screen.queryByRole('button', { name: /exclu/i })).toBeNull();
  });

  it('erro de rede mostra alerta e não quebra', async () => {
    vi.mocked(adminQuotes.list).mockRejectedValue(new Error('Sem conexão'));
    montar();
    expect(await screen.findByRole('alert')).toHaveTextContent('Sem conexão');
  });

  it('usa chaves de consulta com a raiz admin-quotes', () => {
    expect(quoteKeys.all[0]).toBe('admin-quotes');
  });
});

describe('AdminLayout', () => {
  it('o menu tem o link Citações para /admin/citacoes', () => {
    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <AdminLayout>
          <p>conteúdo</p>
        </AdminLayout>
      </MemoryRouter>,
    );
    const links = screen.getAllByRole('link', { name: 'Citações' });
    expect(links[0]).toHaveAttribute('href', '/admin/citacoes');
  });
});
