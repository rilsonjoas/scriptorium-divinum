import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiError } from '@/lib/api-client';
import { adminQuotes, type AdminQuote } from '@/services/adminQuotes';
import { QuoteFormDialog } from './QuoteFormDialog';

vi.mock('@/services/adminQuotes');

const existente: AdminQuote = {
  id: 'q1',
  author: 'C. S. Lewis',
  text: 'Texto original.',
  source: 'Cristianismo Puro e Simples',
  dominioPublico: false,
  scriptoriumUrl: null,
  theme: null,
  fonteUrl: 'https://exemplo.org/p/1',
  verificadoEm: '2026-10-01',
  status: 'ativa',
  motivoOcultacao: null,
  createdAt: '2026-01-01T10:00:00.000Z',
  updatedAt: '2026-01-02T10:00:00.123Z',
};
const AUTORES = ['C. S. Lewis', 'Santo Agostinho'];

function abrir(props: Partial<React.ComponentProps<typeof QuoteFormDialog>> = {}) {
  const onSaved = vi.fn();
  const onOpenChange = vi.fn();
  const user = userEvent.setup();
  render(<QuoteFormDialog open onOpenChange={onOpenChange} autoresExistentes={AUTORES} onSaved={onSaved} {...props} />);
  return { user, onSaved, onOpenChange };
}
const salvar = () => screen.getByRole('button', { name: 'Salvar' });

async function preencherNova(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Autor/), 'Santo Agostinho');
  await user.type(screen.getByLabelText(/^Texto/), 'Fizeste-nos para ti.');
}

beforeEach(() => vi.resetAllMocks());

describe('QuoteFormDialog', () => {
  it('mostra erros ao vivo e mantém Salvar desabilitado enquanto inválido', async () => {
    const { user } = abrir();
    expect(salvar()).toBeDisabled();
    await user.type(screen.getByLabelText(/^Autor/), 'x');
    await user.type(screen.getByLabelText(/^Texto/), 'a');
    await user.clear(screen.getByLabelText(/^Texto/));
    expect(screen.getByText('Informe o texto da citação.')).toBeInTheDocument();
    expect(salvar()).toBeDisabled();
    await user.type(screen.getByLabelText(/^Texto/), 'Agora sim.');
    expect(salvar()).toBeEnabled();
  });

  it('sugere a grafia existente do autor e oferece os autores num datalist', async () => {
    const { user } = abrir();
    const campo = screen.getByLabelText(/^Autor/);
    await user.type(campo, 'C.S. Lewis');
    expect(screen.getByText(/Já existe este autor escrito assim: "C\. S\. Lewis"/)).toBeInTheDocument();
    expect(campo).toHaveAttribute('aria-describedby');
    const lista = document.getElementById(campo.getAttribute('list')!);
    expect([...lista!.querySelectorAll('option')].map((o) => o.getAttribute('value'))).toEqual(AUTORES);
  });

  it('criar chama adminQuotes.create com os valores e chama onSaved', async () => {
    const resposta = { quote: existente, avisos: ['aviso x'] };
    vi.mocked(adminQuotes.create).mockResolvedValue(resposta);
    const { user, onSaved, onOpenChange } = abrir();
    await preencherNova(user);
    await user.click(salvar());
    await waitFor(() => expect(onSaved).toHaveBeenCalledWith(resposta));
    expect(vi.mocked(adminQuotes.create).mock.calls[0]![0]).toMatchObject({
      author: 'Santo Agostinho',
      text: 'Fizeste-nos para ti.',
      status: 'rascunho',
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('editar manda só o que mudou e o updatedAt da citação aberta', async () => {
    vi.mocked(adminQuotes.update).mockResolvedValue({ quote: existente, avisos: [] });
    const { user, onSaved } = abrir({ quote: existente });
    expect(salvar()).toBeDisabled();
    const texto = screen.getByLabelText(/^Texto/);
    await user.clear(texto);
    await user.type(texto, 'Texto corrigido.');
    await user.click(salvar());
    await waitFor(() => expect(onSaved).toHaveBeenCalled());
    expect(adminQuotes.update).toHaveBeenCalledWith('q1', { text: 'Texto corrigido.' }, existente.updatedAt);
  });

  it('issues do servidor aparecem no campo certo, ligados por aria-describedby', async () => {
    vi.mocked(adminQuotes.create).mockRejectedValue(
      new ApiError(400, 'validation_error', 'inválido', undefined, {
        issues: { text: ['Já existe uma citação com este texto (id 1)'] },
      }),
    );
    const { user } = abrir();
    await preencherNova(user);
    await user.click(salvar());
    const msg = await screen.findByText('Já existe uma citação com este texto (id 1)');
    const texto = screen.getByLabelText(/^Texto/);
    expect(texto.getAttribute('aria-describedby')).toContain(msg.id);
    expect(texto).toHaveAttribute('aria-invalid', 'true');
  });

  it('409 avisa que mudou, oferece carregar a versão atual e preserva o que foi digitado', async () => {
    const atual = { ...existente, text: 'Texto do outro admin.', updatedAt: '2026-01-03T10:00:00.000Z' };
    vi.mocked(adminQuotes.update).mockRejectedValueOnce(
      new ApiError(409, 'conflict', 'A citação mudou desde que você a abriu', undefined, { error: 'conflict', atual }),
    );
    vi.mocked(adminQuotes.update).mockResolvedValue({ quote: atual, avisos: [] });
    const { user } = abrir({ quote: existente });
    const texto = screen.getByLabelText(/^Texto/);
    await user.clear(texto);
    await user.type(texto, 'Minha edição.');
    await user.click(salvar());
    expect(await screen.findByRole('alert')).toHaveTextContent(/mudou/i);
    expect(texto).toHaveValue('Minha edição.');
    await user.click(screen.getByRole('button', { name: 'Carregar a versão atual' }));
    expect(screen.getByLabelText(/^Texto/)).toHaveValue('Texto do outro admin.');
    await user.type(screen.getByLabelText(/^Texto/), '!');
    await user.click(salvar());
    await waitFor(() => expect(adminQuotes.update).toHaveBeenCalledTimes(2));
    expect(vi.mocked(adminQuotes.update).mock.calls[1]![2]).toBe(atual.updatedAt);
  });

  it('duplo clique em Salvar chama o serviço uma vez', async () => {
    let liberar!: () => void;
    vi.mocked(adminQuotes.create).mockReturnValue(
      new Promise((r) => {
        liberar = () => r({ quote: existente, avisos: [] });
      }),
    );
    const { user } = abrir();
    await preencherNova(user);
    await user.dblClick(salvar());
    liberar();
    await waitFor(() => expect(adminQuotes.create).toHaveBeenCalledTimes(1));
  });

  it('mostra o contador e não interpreta HTML do texto', async () => {
    const { user } = abrir();
    await user.type(screen.getByLabelText(/^Texto/), '<b>x</b>');
    expect(screen.getByText('8 / 2000')).toBeInTheDocument();
    expect(document.querySelector('b')).toBeNull();
  });

  it('rascunho existente oferece publicar; ativa não oferece situação', () => {
    const { unmount } = render(
      <QuoteFormDialog open onOpenChange={vi.fn()} autoresExistentes={AUTORES} onSaved={vi.fn()} quote={{ ...existente, status: 'rascunho' }} />,
    );
    expect(screen.getByLabelText('Situação')).toBeInTheDocument();
    unmount();
    abrir({ quote: existente });
    expect(screen.queryByLabelText('Situação')).toBeNull();
  });
});
