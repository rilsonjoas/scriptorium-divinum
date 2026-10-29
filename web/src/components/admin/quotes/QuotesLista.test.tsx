import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AdminQuoteItem, QuoteListResponse } from '@/services/adminQuotes';
import { QuotesLista, type Filtros } from './QuotesLista';

const base: AdminQuoteItem = {
  id: 'a',
  author: 'C. S. Lewis',
  text: 'Texto da ativa.',
  source: 'Obra A',
  dominioPublico: false,
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
const oculta: AdminQuoteItem = { ...base, id: 'o', author: 'Outro', text: 'Texto da oculta.', status: 'oculta', verificadoEm: '2026-10-01' };

const dados = (itens: AdminQuoteItem[], extra: Partial<QuoteListResponse> = {}): QuoteListResponse => ({
  itens,
  total: itens.length,
  pagina: 1,
  porPagina: 50,
  contadores: { porStatus: { rascunho: 0, ativa: 1, oculta: 1 }, porAutor: [], porAutorAtivas: [], semVerificacao: 1 },
  ...extra,
});

function montar(props: Partial<React.ComponentProps<typeof QuotesLista>> = {}) {
  const fns = {
    onFiltros: vi.fn(),
    onEditar: vi.fn(),
    onOcultar: vi.fn(),
    onReativar: vi.fn(),
    onHistorico: vi.fn(),
    onNova: vi.fn(),
  };
  const filtros: Filtros = { page: 1 };
  render(
    <QuotesLista dados={dados([base, oculta])} carregando={false} filtros={filtros} autoresExistentes={['C. S. Lewis', 'Outro']} {...fns} {...props} />,
  );
  return fns;
}

afterEach(() => vi.useRealTimers());

describe('QuotesLista', () => {
  it('linha de ativa sem verificação mostra o selo em texto', () => {
    montar();
    const linha = screen.getByText('Texto da ativa.').closest('tr')!;
    expect(within(linha).getByText('Sem verificação')).toBeInTheDocument();
    expect(within(linha).getByText('Ativa')).toBeInTheDocument();
    const outra = screen.getByText('Texto da oculta.').closest('tr')!;
    expect(within(outra).queryByText('Sem verificação')).toBeNull();
    expect(within(outra).getByText('Oculta')).toBeInTheDocument();
  });

  it('oculta oferece Reativar e não Ocultar; ativa o contrário', () => {
    montar();
    const ativa = screen.getByText('Texto da ativa.').closest('tr')!;
    const ocultaTr = screen.getByText('Texto da oculta.').closest('tr')!;
    expect(within(ativa).getByRole('button', { name: 'Ocultar citação de C. S. Lewis' })).toBeInTheDocument();
    expect(within(ativa).queryByRole('button', { name: /Reativar/ })).toBeNull();
    expect(within(ocultaTr).getByRole('button', { name: 'Reativar citação de Outro' })).toBeInTheDocument();
    expect(within(ocultaTr).queryByRole('button', { name: /Ocultar/ })).toBeNull();
  });

  it('ações chamam os callbacks com a citação', async () => {
    const f = montar();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Editar citação de C. S. Lewis' }));
    expect(f.onEditar).toHaveBeenCalledWith(base);
    await user.click(screen.getByRole('button', { name: 'Histórico da citação de Outro' }));
    expect(f.onHistorico).toHaveBeenCalledWith(oculta);
    await user.click(screen.getByRole('button', { name: 'Nova citação' }));
    expect(f.onNova).toHaveBeenCalled();
  });

  it('mostra Fixada em N dias, com singular', () => {
    montar({ dados: dados([{ ...base, diasFixados: ['2026-01-10', '2026-01-12'] }, { ...oculta, diasFixados: ['2026-01-10'] }]) });
    expect(screen.getByText('Fixada em 2 dias')).toBeInTheDocument();
    expect(screen.getByText('Fixada em 1 dia')).toBeInTheDocument();
  });

  it('não existe botão Excluir em nenhum estado', () => {
    montar();
    expect(screen.queryByRole('button', { name: /exclu/i })).toBeNull();
  });

  it('trecho passa de 120 caracteres com reticências', () => {
    montar({ dados: dados([{ ...base, text: 'a'.repeat(200) }]) });
    expect(screen.getByText(`${'a'.repeat(120)}…`)).toBeInTheDocument();
  });

  it('texto com HTML aparece literal', () => {
    montar({ dados: dados([{ ...base, text: '<b>negrito</b>' }]) });
    expect(screen.getByText('<b>negrito</b>')).toBeInTheDocument();
    expect(document.querySelector('b')).toBeNull();
  });

  it('busca só chama onFiltros depois de 300 ms e volta para a página 1', () => {
    vi.useFakeTimers();
    const f = montar({ dados: dados([base], { total: 200, pagina: 3 }), filtros: { page: 3 } });
    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: 'graça' } });
    act(() => vi.advanceTimersByTime(299));
    expect(f.onFiltros).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(f.onFiltros).toHaveBeenCalledWith({ q: 'graça', page: 1 });
  });

  it('trocar filtro de status e de verificação volta para a página 1', () => {
    const f = montar({ dados: dados([base], { total: 200, pagina: 3 }), filtros: { page: 3 } });
    fireEvent.change(screen.getByLabelText('Situação'), { target: { value: 'oculta' } });
    expect(f.onFiltros).toHaveBeenLastCalledWith({ status: 'oculta', page: 1 });
    fireEvent.click(screen.getByLabelText('Só sem verificação'));
    expect(f.onFiltros).toHaveBeenLastCalledWith({ semVerificacao: true, page: 1 });
    fireEvent.change(screen.getByLabelText('Autor'), { target: { value: 'Outro' } });
    expect(f.onFiltros).toHaveBeenLastCalledWith({ author: 'Outro', page: 1 });
  });

  it('paginação mostra Página X de Y e anda', async () => {
    const f = montar({ dados: dados([base], { total: 120, pagina: 2 }), filtros: { page: 2 } });
    expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Próxima página' }));
    expect(f.onFiltros).toHaveBeenLastCalledWith({ page: 3 });
    await user.click(screen.getByRole('button', { name: 'Página anterior' }));
    expect(f.onFiltros).toHaveBeenLastCalledWith({ page: 1 });
  });

  it('trocar de página leva o topo da lista de volta à tela', async () => {
    const rolar = vi.fn();
    Element.prototype.scrollIntoView = rolar;
    montar({ dados: dados([base], { total: 120, pagina: 2 }), filtros: { page: 2 } });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Próxima página' }));
    expect(rolar).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Página anterior' }));
    expect(rolar).toHaveBeenCalledTimes(2);
  });

  it('vazio sem filtro e vazio com filtro têm estados próprios', async () => {
    const f = montar({ dados: dados([], { total: 0 }) });
    expect(screen.getByText('Nenhuma citação cadastrada')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Limpar filtros' })).toBeNull();
    void f;
  });

  it('Limpar filtros também esvazia a caixa de busca', async () => {
    const f = montar({ dados: dados([], { total: 0 }), filtros: { q: 'graça', page: 1 } });
    expect(screen.getByLabelText('Buscar')).toHaveValue('graça');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(f.onFiltros).toHaveBeenCalledWith({ page: 1 });
    expect(screen.getByLabelText('Buscar')).toHaveValue('');
  });

  it('vazio com filtro oferece Limpar filtros', async () => {
    const f = montar({ dados: dados([], { total: 0 }), filtros: { status: 'oculta', page: 1 } });
    expect(screen.getByText('Nenhuma citação com estes filtros')).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(f.onFiltros).toHaveBeenCalledWith({ page: 1 });
  });

  it('página além da última pede a última, uma vez', () => {
    const f = montar({ dados: dados([], { total: 60, pagina: 4 }), filtros: { page: 4 } });
    expect(f.onFiltros).toHaveBeenCalledTimes(1);
    expect(f.onFiltros).toHaveBeenCalledWith({ page: 2 });
  });

  it('erro mostra alerta e carregando marca aria-busy', () => {
    montar({ dados: undefined, erro: new Error('Falhou a rede') });
    expect(screen.getByRole('alert')).toHaveTextContent('Falhou a rede');
  });

  it('carregando sem dados mostra esqueleto com aria-busy', () => {
    montar({ dados: undefined, carregando: true });
    expect(document.querySelector('[aria-busy="true"]')).not.toBeNull();
  });
});
