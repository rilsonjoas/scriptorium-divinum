import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api-client';
import { booksService } from '@/services/database';
import { adminQuotes, quoteKeys, type AdminQuoteItem, type QuoteListResponse } from '@/services/adminQuotes';
import { AdminLayout } from '@/components/AdminLayout';
import { QuotesPanel } from './QuotesPanel';

vi.mock('@/services/database', () => ({ booksService: { getAll: vi.fn() } }));
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
  contadores: { porStatus: { rascunho: 0, ativa: 1, oculta: 1 }, porAutor: [{ autor: 'C. S. Lewis', total: 1 }, { autor: 'Outro', total: 1 }], porAutorAtivas: [{ autor: 'C. S. Lewis', total: 1 }], semVerificacao: 0 },
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
  vi.mocked(booksService.getAll).mockResolvedValue({ items: [], total: 0, page: 1, limit: 100, totalPages: 1 } as never);
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
    await user.selectOptions(within(dialogo).getByLabelText(/^Autor/), 'Outro autor (novo)…');
    await user.type(within(dialogo).getByLabelText('Nome do novo autor'), 'Outro');
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

describe('QuotesPanel: toast do Gerador', () => {
  const AVISO = 'Atualize a cópia do Gerador C. S. Lewis';
  const avisouDoGerador = () => vi.mocked(toast.warning).mock.calls.some(([m]) => m === AVISO);
  const lewisOculta = item({ id: 'lo', text: 'Lewis oculta.', status: 'oculta' });

  it('ocultar uma Lewis com sucesso avisa', async () => {
    vi.mocked(adminQuotes.ocultar).mockResolvedValue({ quote: { ...ativa, status: 'oculta' } });
    const { user } = montar();
    await user.click(await screen.findByRole('button', { name: 'Ocultar citação de C. S. Lewis' }));
    const dialogo = await screen.findByRole('dialog');
    await user.type(within(dialogo).getByLabelText(/^Motivo/), 'Fonte não confirmada');
    await user.click(within(dialogo).getByRole('button', { name: 'Ocultar citação' }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Citação ocultada'));
    expect(avisouDoGerador()).toBe(true);
    expect(toast.warning).toHaveBeenCalledWith(
      AVISO,
      expect.objectContaining({ duration: 20000, description: expect.stringContaining('gh workflow run sync-quotes.yml --repo rilsonjoas/GeradorCSLewis') }),
    );
  });

  it('ocultar que falha com 409 não avisa', async () => {
    vi.mocked(adminQuotes.ocultar).mockRejectedValue(new ApiError(409, 'conflict', 'Já está oculta'));
    const { user } = montar();
    await user.click(await screen.findByRole('button', { name: 'Ocultar citação de C. S. Lewis' }));
    const dialogo = await screen.findByRole('dialog');
    await user.type(within(dialogo).getByLabelText(/^Motivo/), 'Fonte não confirmada');
    await user.click(within(dialogo).getByRole('button', { name: 'Ocultar citação' }));
    await waitFor(() => expect(adminQuotes.ocultar).toHaveBeenCalled());
    expect(avisouDoGerador()).toBe(false);
  });

  it('ocultar citação de outro autor não avisa', async () => {
    const outra = item({ id: 'x', author: 'Outro', text: 'De outro.' });
    vi.mocked(adminQuotes.list).mockResolvedValue(lista([outra]));
    vi.mocked(adminQuotes.ocultar).mockResolvedValue({ quote: { ...outra, status: 'oculta' } });
    const { user } = montar();
    await user.click(await screen.findByRole('button', { name: 'Ocultar citação de Outro' }));
    const dialogo = await screen.findByRole('dialog');
    await user.type(within(dialogo).getByLabelText(/^Motivo/), 'Fonte não confirmada');
    await user.click(within(dialogo).getByRole('button', { name: 'Ocultar citação' }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Citação ocultada'));
    expect(avisouDoGerador()).toBe(false);
  });

  it('reativar uma Lewis com sucesso avisa; reativar que falha não', async () => {
    vi.mocked(adminQuotes.list).mockResolvedValue(lista([lewisOculta]));
    vi.mocked(adminQuotes.reativar).mockRejectedValueOnce(new ApiError(409, 'conflict', 'Não está oculta'));
    const { user } = montar();
    await user.click(await screen.findByRole('button', { name: 'Reativar citação de C. S. Lewis' }));
    await waitFor(() => expect(adminQuotes.reativar).toHaveBeenCalledTimes(1));
    expect(avisouDoGerador()).toBe(false);
    vi.mocked(adminQuotes.reativar).mockResolvedValue({ quote: { ...lewisOculta, status: 'ativa' } });
    await user.click(await screen.findByRole('button', { name: 'Reativar citação de C. S. Lewis' }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Citação reativada'));
    expect(avisouDoGerador()).toBe(true);
  });

  it('salvar edição de texto de uma Lewis ativa avisa; só a verificação não', async () => {
    // a API devolve a citação já editada
    vi.mocked(adminQuotes.update)
      .mockResolvedValueOnce({ quote: { ...ativa, verificadoEm: '2026-10-02' }, avisos: [] })
      .mockResolvedValueOnce({ quote: { ...ativa, text: 'Texto da ativa. mais' }, avisos: [] });
    const { user } = montar();
    await user.click(await screen.findByRole('button', { name: 'Editar citação de C. S. Lewis' }));
    let dialogo = await screen.findByRole('dialog');
    fireEvent.change(within(dialogo).getByLabelText(/^Conferida em/), { target: { value: '2026-10-02' } });
    await user.click(within(dialogo).getByRole('button', { name: 'Salvar' }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Citação atualizada'));
    expect(avisouDoGerador()).toBe(false);

    await user.click(await screen.findByRole('button', { name: 'Editar citação de C. S. Lewis' }));
    dialogo = await screen.findByRole('dialog');
    await user.type(within(dialogo).getByLabelText(/^Texto/), ' mais');
    await user.click(within(dialogo).getByRole('button', { name: 'Salvar' }));
    await waitFor(() => expect(adminQuotes.update).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(avisouDoGerador()).toBe(true));
  });
});

describe('QuotesPanel: conflito, foco e falhas (menores da revisão da F3)', () => {
  it('ocultar com 409 avisa, recarrega a lista e fecha o diálogo', async () => {
    vi.mocked(adminQuotes.ocultar).mockRejectedValue(new ApiError(409, 'conflict', 'Já está oculta'));
    const { user } = montar();
    await user.click(await screen.findByRole('button', { name: 'Ocultar citação de C. S. Lewis' }));
    const dialogo = await screen.findByRole('dialog');
    await user.type(within(dialogo).getByLabelText(/^Motivo/), 'Fonte não confirmada');
    await user.click(within(dialogo).getByRole('button', { name: 'Ocultar citação' }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Já está oculta'));
    await waitFor(() => expect(adminQuotes.list).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('ocultar com outro erro mantém o diálogo aberto com a mensagem', async () => {
    vi.mocked(adminQuotes.ocultar).mockRejectedValue(new ApiError(500, 'internal', 'Erro interno do servidor'));
    const { user } = montar();
    await user.click(await screen.findByRole('button', { name: 'Ocultar citação de C. S. Lewis' }));
    const dialogo = await screen.findByRole('dialog');
    await user.type(within(dialogo).getByLabelText(/^Motivo/), 'Fonte não confirmada');
    await user.click(within(dialogo).getByRole('button', { name: 'Ocultar citação' }));
    expect(await within(dialogo).findByText('Erro interno do servidor')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('Reativar fica desabilitado enquanto envia (sinal visual além da guarda)', async () => {
    let resolver!: (v: { quote: typeof oculta }) => void;
    vi.mocked(adminQuotes.reativar).mockReturnValue(new Promise((r) => (resolver = r)) as never);
    const { user } = montar();
    const botao = await screen.findByRole('button', { name: 'Reativar citação de Outro' });
    await user.click(botao);
    await waitFor(() => expect(botao).toBeDisabled());
    expect(botao).toHaveTextContent('Reativando');
    resolver({ quote: { ...oculta, status: 'ativa' } });
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Citação reativada'));
  });

  it('depois de ocultar com sucesso o foco vai para o título da página (não se perde na linha que mudou)', async () => {
    vi.mocked(adminQuotes.ocultar).mockResolvedValue({ quote: { ...ativa, status: 'oculta' } });
    const { user } = montar();
    await user.click(await screen.findByRole('button', { name: 'Ocultar citação de C. S. Lewis' }));
    const dialogo = await screen.findByRole('dialog');
    await user.type(within(dialogo).getByLabelText(/^Motivo/), 'Fonte não confirmada');
    await user.click(within(dialogo).getByRole('button', { name: 'Ocultar citação' }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Citação ocultada'));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Citações', level: 1 })));
  });

  it('depois de reativar com sucesso o foco vai para o título da página', async () => {
    vi.mocked(adminQuotes.reativar).mockResolvedValue({ quote: { ...oculta, status: 'ativa' } });
    const { user } = montar();
    await user.click(await screen.findByRole('button', { name: 'Reativar citação de Outro' }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Citação reativada'));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Citações', level: 1 })));
  });

  it('falha ao atualizar a lista em segundo plano avisa que a tela pode estar desatualizada', async () => {
    const { user, client } = montar();
    await screen.findByText('Texto da ativa.');
    vi.mocked(adminQuotes.list).mockRejectedValue(new ApiError(500, 'internal', 'Erro interno do servidor'));
    await client.invalidateQueries();
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('desatualizad')));
    expect(user).toBeDefined();
  });
});
