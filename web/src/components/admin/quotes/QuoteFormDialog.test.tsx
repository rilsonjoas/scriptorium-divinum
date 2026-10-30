import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiError } from '@/lib/api-client';
import { adminQuotes, type AdminQuote } from '@/services/adminQuotes';
import { booksService } from '@/services/database';
import { hojeISO } from '@/lib/formularioCitacao';
import { QuoteFormDialog } from './QuoteFormDialog';

vi.mock('@/services/adminQuotes');
vi.mock('@/services/database', () => ({ booksService: { getAll: vi.fn() } }));

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
const NOVO_AUTOR = 'Outro autor (novo)…';
const OBRAS = [
  { slug: 'o-peregrino', title: 'O Peregrino', author: { name: 'John Bunyan' } },
  { slug: 'confissoes', title: 'Confissões', author: { name: 'Santo Agostinho' } },
];

function abrir(props: Partial<React.ComponentProps<typeof QuoteFormDialog>> = {}) {
  const onSaved = vi.fn();
  const onOpenChange = vi.fn();
  const user = userEvent.setup();
  render(<QuoteFormDialog open onOpenChange={onOpenChange} autoresExistentes={AUTORES} onSaved={onSaved} {...props} />);
  return { user, onSaved, onOpenChange };
}
const salvar = () => screen.getByRole('button', { name: 'Salvar' });

async function preencherNova(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText(/^Autor/), 'Santo Agostinho');
  await user.type(screen.getByLabelText(/^Texto/), 'Fizeste-nos para ti.');
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(booksService.getAll).mockResolvedValue({ items: OBRAS, total: 2, page: 1, limit: 100, totalPages: 1 } as never);
});

describe('QuoteFormDialog', () => {
  it('mostra erros ao vivo e mantém Salvar desabilitado enquanto inválido', async () => {
    const { user } = abrir();
    expect(salvar()).toBeDisabled();
    await user.selectOptions(screen.getByLabelText(/^Autor/), 'Santo Agostinho');
    await user.type(screen.getByLabelText(/^Texto/), 'a');
    await user.clear(screen.getByLabelText(/^Texto/));
    expect(screen.getByText('Informe o texto da citação.')).toBeInTheDocument();
    expect(salvar()).toBeDisabled();
    await user.type(screen.getByLabelText(/^Texto/), 'Agora sim.');
    expect(salvar()).toBeEnabled();
  });

  it('criar chama adminQuotes.create com os valores e chama onSaved', async () => {
    const resposta = { quote: existente, avisos: ['aviso x'] };
    vi.mocked(adminQuotes.create).mockResolvedValue(resposta);
    const { user, onSaved, onOpenChange } = abrir();
    await preencherNova(user);
    await user.click(salvar());
    await waitFor(() => expect(onSaved).toHaveBeenCalledWith({ ...resposta, antes: null }));
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

describe('QuoteFormDialog: aviso do Gerador', () => {
  const aviso = () => screen.queryByRole('note');
  const rascunho: AdminQuote = { ...existente, id: 'r1', status: 'rascunho' };
  const oculta: AdminQuote = { ...existente, id: 'o1', status: 'oculta', motivoOcultacao: 'x' };

  it('editar uma Lewis ativa sem mexer em nada não avisa; mudar o texto avisa como "mudar"', async () => {
    const { user } = abrir({ quote: existente });
    expect(aviso()).toBeNull();
    await user.type(screen.getByLabelText(/^Texto/), ' a mais');
    expect(aviso()).toHaveTextContent('Depois, atualize a cópia do Gerador C. S. Lewis');
    expect(aviso()).toHaveTextContent('o texto de q1 muda');
  });

  it('mudar só o endereço da conferência ou a data de verificação não avisa', async () => {
    const { user } = abrir({ quote: existente });
    await user.type(screen.getByLabelText(/^Endereço da conferência/), 'x');
    fireEvent.change(screen.getByLabelText(/^Conferida em/), { target: { value: '2026-10-02' } });
    expect(aviso()).toBeNull();
  });

  it('nova citação: autor C.S. Lewis ativa avisa; rascunho não', async () => {
    const { user } = abrir();
    await user.selectOptions(screen.getByLabelText(/^Autor/), NOVO_AUTOR);
    await user.type(screen.getByLabelText('Nome do novo autor'), 'C.S. Lewis');
    await user.type(screen.getByLabelText(/^Texto/), 'Frase.');
    expect(aviso()).toBeNull();
    await user.selectOptions(screen.getByLabelText('Situação'), 'ativa');
    expect(aviso()).toHaveTextContent('entra uma citação nova');
    await user.selectOptions(screen.getByLabelText('Situação'), 'rascunho');
    expect(aviso()).toBeNull();
  });

  it('trocar o autor para Lewis entra; trocar de Lewis para outro sai', async () => {
    const { user, } = abrir({ quote: { ...existente, author: 'Santo Agostinho' } });
    await user.selectOptions(screen.getByLabelText(/^Autor/), 'C. S. Lewis');
    expect(aviso()).toHaveTextContent('entra uma citação nova');
  });

  it('Lewis passa a outro autor: sai', async () => {
    const { user } = abrir({ quote: existente });
    await user.selectOptions(screen.getByLabelText(/^Autor/), 'Santo Agostinho');
    expect(aviso()).toHaveTextContent('o id q1 sai do arquivo');
  });

  it('editar rascunho ou oculta de Lewis não avisa', async () => {
    const a = abrir({ quote: rascunho });
    await a.user.type(screen.getByLabelText(/^Texto/), ' mais');
    expect(aviso()).toBeNull();
  });

  it('editar oculta de Lewis não avisa', async () => {
    const { user } = abrir({ quote: oculta });
    await user.type(screen.getByLabelText(/^Texto/), ' mais');
    expect(aviso()).toBeNull();
  });

  describe('autor, endereços, data e obra (F7)', () => {
    it('autor é uma lista com os existentes e a opção de autor novo', () => {
      abrir();
      const campo = screen.getByLabelText(/^Autor/) as HTMLSelectElement;
      expect(campo.tagName).toBe('SELECT');
      expect([...campo.options].map((o) => o.textContent)).toEqual(['Escolha o autor…', ...AUTORES, NOVO_AUTOR]);
      expect(screen.queryByLabelText('Nome do novo autor')).not.toBeInTheDocument();
    });

    it('autor novo mostra o campo de texto e a grafia parecida com a de um existente continua sendo sugerida', async () => {
      const { user } = abrir();
      await user.selectOptions(screen.getByLabelText(/^Autor/), NOVO_AUTOR);
      const novo = screen.getByLabelText('Nome do novo autor');
      await user.type(novo, 'C.S. Lewis');
      expect(screen.getByText(/Já existe este autor escrito assim: "C\. S\. Lewis"/)).toBeInTheDocument();
      expect(novo).toHaveAttribute('aria-describedby');
    });

    it('autor legado, fora da lista, abre como autor novo com o valor preservado', () => {
      abrir({ quote: { ...existente, author: 'Autor Antigo' } });
      expect(screen.getByLabelText(/^Autor/)).toHaveValue('__novo__');
      expect(screen.getByLabelText('Nome do novo autor')).toHaveValue('Autor Antigo');
    });

    it('endereço da conferência: foco vazio preenche https://, só o esquema volta a vazio, sem esquema ganha https://', async () => {
      const { user } = abrir();
      const campo = screen.getByLabelText(/^Endereço da conferência/);
      await user.click(campo);
      expect(campo).toHaveValue('https://');
      await user.tab();
      expect(campo).toHaveValue('');
      await user.click(campo);
      await user.keyboard('exemplo.org/p/1');
      await user.tab();
      expect(campo).toHaveValue('https://exemplo.org/p/1');
    });

    it('endereço com http:// digitado é respeitado', async () => {
      const { user } = abrir();
      const campo = screen.getByLabelText(/^Endereço da conferência/);
      await user.click(campo);
      await user.clear(campo);
      await user.type(campo, 'http://exemplo.org');
      await user.tab();
      expect(campo).toHaveValue('http://exemplo.org');
    });

    it('"Conferida em" é um seletor de data sem valor inicial, que não aceita o futuro, com botão Hoje', async () => {
      const { user } = abrir();
      const campo = screen.getByLabelText(/^Conferida em/);
      expect(campo).toHaveAttribute('type', 'date');
      expect(campo).toHaveAttribute('max', hojeISO());
      expect(campo).toHaveValue('');
      await user.click(screen.getByRole('button', { name: 'Hoje' }));
      expect(campo).toHaveValue(hojeISO());
    });

    it('endereço da obra é uma lista das obras publicadas e envia o endereço certo', async () => {
      vi.mocked(adminQuotes.create).mockResolvedValue({ quote: existente, avisos: [] });
      const { user } = abrir();
      await preencherNova(user);
      const campo = await screen.findByLabelText(/^Obra no Scriptorium/);
      expect(campo.tagName).toBe('SELECT');
      expect([...(campo as HTMLSelectElement).options].map((o) => o.textContent)).toEqual([
        'Nenhuma',
        'O Peregrino, John Bunyan',
        'Confissões, Santo Agostinho',
      ]);
      await user.selectOptions(campo, 'Confissões, Santo Agostinho');
      await user.click(salvar());
      await waitFor(() => expect(adminQuotes.create).toHaveBeenCalled());
      expect(vi.mocked(adminQuotes.create).mock.calls[0]![0].scriptoriumUrl).toBe(
        'https://scriptorium.narniano.com/livros/confissoes',
      );
    });

    it('endereço atual fora da lista aparece como "(atual)" e é preservado', async () => {
      abrir({ quote: { ...existente, scriptoriumUrl: 'https://scriptorium.narniano.com/livros/obra-despublicada' } });
      const campo = (await screen.findByLabelText(/^Obra no Scriptorium/)) as HTMLSelectElement;
      expect(campo).toHaveValue('https://scriptorium.narniano.com/livros/obra-despublicada');
      expect([...campo.options].map((o) => o.textContent)).toContain('(atual) obra-despublicada');
    });

    it('se a lista de obras não carrega, vira campo de texto com aviso e salvar continua possível', async () => {
      vi.mocked(booksService.getAll).mockRejectedValue(new Error('rede'));
      const { user } = abrir();
      await preencherNova(user);
      const campo = await screen.findByLabelText(/^Endereço da obra no Scriptorium/);
      expect(campo.tagName).toBe('INPUT');
      expect(screen.getByText(/Não foi possível carregar a lista de obras/)).toBeInTheDocument();
      expect(salvar()).toBeEnabled();
    });

    it('editar sem mexer em nada não envia nada (o salvar fica desabilitado)', () => {
      abrir({ quote: existente });
      expect(salvar()).toBeDisabled();
    });
  });

  describe('Salvar explica o motivo e os erros são anunciados (menores da revisão da F3)', () => {
    it('com o Salvar desabilitado por campo obrigatório, diz o que falta (mesmo de campo ainda não tocado)', async () => {
      const { user } = abrir();
      await user.selectOptions(screen.getByLabelText(/^Autor/), 'Santo Agostinho');
      expect(salvar()).toBeDisabled();
      const motivo = screen.getByRole('status');
      expect(motivo).toHaveTextContent(/Para salvar/);
      expect(motivo).toHaveTextContent('Texto');
      expect(salvar()).toHaveAttribute('aria-describedby', motivo.id);
    });

    it('o motivo some quando tudo está preenchido', async () => {
      const { user } = abrir();
      await preencherNova(user);
      expect(salvar()).toBeEnabled();
      expect(screen.queryByText(/Para salvar/)).not.toBeInTheDocument();
    });

    it('editando sem mudar nada, diz que não há alteração', () => {
      abrir({ quote: existente });
      expect(screen.getByRole('status')).toHaveTextContent('Nenhuma alteração para salvar.');
    });

    it('ativa antiga sem obra: o motivo cita a obra mesmo sem o campo ter sido tocado', () => {
      abrir({ quote: { ...existente, source: null } });
      expect(salvar()).toBeDisabled();
      expect(screen.getByRole('status')).toHaveTextContent('Obra ou fonte');
    });

    it('a mensagem de erro de campo fica numa região viva, para o leitor de tela anunciar', async () => {
      const { user } = abrir();
      await user.type(screen.getByLabelText(/^Texto/), 'a');
      await user.clear(screen.getByLabelText(/^Texto/));
      const erro = screen.getByText('Informe o texto da citação.');
      expect(erro).toHaveAttribute('aria-live', 'polite');
    });

    it('o contador só vira região viva perto do limite (senão anunciaria a cada tecla)', async () => {
      const { user } = abrir();
      const campo = screen.getByLabelText(/^Texto/);
      await user.type(campo, 'abc');
      expect(screen.getByText('3 / 2000')).toHaveAttribute('aria-live', 'off');
      fireEvent.change(campo, { target: { value: 'x'.repeat(1950) } });
      expect(screen.getByText('1950 / 2000')).toHaveAttribute('aria-live', 'polite');
    });

    it('o aviso do Gerador mora numa região viva que já existe antes de aparecer', async () => {
      const { user } = abrir({ quote: existente });
      const regiao = document.querySelector('[data-regiao-aviso-gerador]');
      expect(regiao).not.toBeNull();
      expect(regiao).toHaveAttribute('aria-live', 'polite');
      expect(regiao!.querySelector('[role="note"]')).toBeNull();
      await user.type(screen.getByLabelText(/^Texto/), ' a mais');
      expect(regiao!.querySelector('[role="note"]')).not.toBeNull();
    });

    it('mudar a obra de uma Lewis ativa: o aviso nomeia a obra, não o texto', async () => {
      const { user } = abrir({ quote: existente });
      await user.type(screen.getByLabelText(/^Obra ou fonte/), ' (ed. 2)');
      expect(aviso()).toHaveTextContent('mudam obra');
      expect(aviso()).not.toHaveTextContent('o texto de q1 muda');
    });

    it('depois de "Carregar a versão atual", o onSaved leva a versão que o formulário passou a ter como "antes"', async () => {
      const atual = { ...existente, text: 'Texto da outra pessoa.', updatedAt: '2026-01-03T10:00:00.000Z' };
      vi.mocked(adminQuotes.update)
        .mockRejectedValueOnce(new ApiError(409, 'conflict', 'mudou', undefined, { atual }))
        .mockResolvedValueOnce({ quote: { ...atual, source: 'Nova obra' }, avisos: [] });
      const { user, onSaved } = abrir({ quote: existente });
      await user.type(screen.getByLabelText(/^Obra ou fonte/), ' x');
      await user.click(salvar());
      await user.click(await screen.findByRole('button', { name: 'Carregar a versão atual' }));
      await user.type(screen.getByLabelText(/^Obra ou fonte/), ' y');
      await user.click(salvar());
      await waitFor(() => expect(onSaved).toHaveBeenCalled());
      expect(onSaved.mock.calls[0]![0].antes).toEqual(atual);
    });
  });
});
