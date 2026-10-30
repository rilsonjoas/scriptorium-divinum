import { useEffect, useRef, useState } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError, issuesDe } from '@/lib/api-client';
import { mudaCopiaDoGerador } from '@/lib/gerador';
import { adminQuotes, quoteKeys, type AdminQuote, type AdminQuoteItem } from '@/services/adminQuotes';
import { EventosSheet } from './EventosSheet';
import { OcultarDialog } from './OcultarDialog';
import { QuoteFormDialog } from './QuoteFormDialog';
import { QuotesLista, type Filtros } from './QuotesLista';
import { QuotesResumo } from './QuotesResumo';

/** Mensagem útil de uma recusa: os problemas por campo, quando houver; senão a do servidor. */
function mensagemDe(err: unknown): string {
  const issues = Object.values(issuesDe(err)).flat();
  if (issues.length > 0) return issues.join(' ');
  return err instanceof Error ? err.message : 'Não foi possível concluir a ação.';
}

export function QuotesPanel() {
  const queryClient = useQueryClient();
  const [filtros, setFiltros] = useState<Filtros>({ page: 1 });
  const [formulario, setFormulario] = useState<{ quote?: AdminQuote } | null>(null);
  const [ocultando, setOcultando] = useState<AdminQuoteItem | null>(null);
  const [historico, setHistorico] = useState<AdminQuoteItem | null>(null);
  const reativando = useRef(new Set<string>());
  // O que está sendo reativado agora, para desabilitar o botão (a guarda acima só impede o segundo envio).
  const [reativandoIds, setReativandoIds] = useState<ReadonlySet<string>>(new Set());
  const titulo = useRef<HTMLHeadingElement>(null);

  const consulta = useQuery({
    queryKey: quoteKeys.list(filtros),
    queryFn: () => adminQuotes.list(filtros),
    placeholderData: keepPreviousData,
  });

  const recarregar = () => queryClient.invalidateQueries({ queryKey: quoteKeys.all });
  // A linha que mudou (ocultada, reativada) sai ou troca de lugar na lista: sem isto o foco se perde (WCAG 2.4.3).
  const devolverFoco = () => setTimeout(() => titulo.current?.focus(), 0);

  // Falha ao atualizar a lista em segundo plano (os dados na tela são os anteriores): não pode ser silenciosa.
  useEffect(() => {
    if (consulta.isRefetchError) {
      toast.error('Não foi possível atualizar a lista. O que aparece na tela pode estar desatualizado.');
    }
  }, [consulta.isRefetchError, consulta.errorUpdatedAt]);
  const autoresExistentes = consulta.data?.contadores.porAutor.map((a) => a.autor) ?? [];

  // A cópia embutida do Gerador só fica atrás da API quando a mudança a altera (lib/gerador.ts).
  const avisarGerador = (antes: AdminQuote | null, depois: AdminQuote) => {
    if (!mudaCopiaDoGerador(antes, depois)) return;
    toast.warning('Atualize a cópia do Gerador C. S. Lewis', {
      description:
        'Rode gh workflow run sync-quotes.yml --repo rilsonjoas/GeradorCSLewis, confira o PR que ele abre e mescle (passo a passo no manual do painel).',
      duration: 20000,
    });
  };

  // `r.antes` é a citação que o formulário tinha ao salvar (depois de "Carregar a versão atual", a versão carregada).
  const salvou = (r: { quote: AdminQuote; avisos: string[]; antes: AdminQuote | null }) => {
    void recarregar();
    toast.success(r.antes ? 'Citação atualizada' : 'Citação criada');
    for (const aviso of r.avisos) toast.warning(aviso);
    avisarGerador(r.antes, r.quote);
  };

  const reativar = async (q: AdminQuoteItem) => {
    if (reativando.current.has(q.id)) return;
    reativando.current.add(q.id);
    setReativandoIds(new Set(reativando.current));
    try {
      const { quote } = await adminQuotes.reativar(q.id);
      toast.success('Citação reativada');
      avisarGerador(q, quote);
      await recarregar();
      devolverFoco();
    } catch (err) {
      toast.error(mensagemDe(err));
      if (err instanceof ApiError && err.statusCode === 400) setFormulario({ quote: q });
      else void recarregar();
    } finally {
      reativando.current.delete(q.id);
      setReativandoIds(new Set(reativando.current));
    }
  };

  return (
    <div className="grid gap-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 ref={titulo} tabIndex={-1} className="font-display text-2xl font-semibold text-library-wood-foreground outline-none">
          Citações
        </h1>
        <p className="font-body text-library-bronze-foreground">
          Acervo de citações do Scriptorium. Citações não são excluídas: quando necessário, são ocultadas.
        </p>
      </header>

      {consulta.data && <QuotesResumo contadores={consulta.data.contadores} />}

      <QuotesLista
        dados={consulta.data}
        carregando={consulta.isFetching}
        erro={consulta.error ?? undefined}
        filtros={filtros}
        autoresExistentes={autoresExistentes}
        onFiltros={setFiltros}
        onNova={() => setFormulario({})}
        onEditar={(q) => setFormulario({ quote: q })}
        onOcultar={setOcultando}
        reativandoIds={reativandoIds}
        onReativar={(q) => void reativar(q)}
        onHistorico={setHistorico}
      />

      {formulario && (
        <QuoteFormDialog
          open
          onOpenChange={(aberto) => !aberto && setFormulario(null)}
          quote={formulario.quote}
          autoresExistentes={autoresExistentes}
          onSaved={salvou}
        />
      )}
      <OcultarDialog
        quote={ocultando}
        onOpenChange={(aberto) => !aberto && setOcultando(null)}
        onDone={(oculta) => {
          toast.success('Citação ocultada');
          avisarGerador(ocultando, oculta);
          void recarregar().then(devolverFoco);
        }}
        onConflito={(mensagem) => {
          toast.error(mensagem);
          void recarregar();
        }}
      />
      <EventosSheet quote={historico} onOpenChange={(aberto) => !aberto && setHistorico(null)} />
    </div>
  );
}
