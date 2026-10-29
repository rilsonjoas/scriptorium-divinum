import { useRef, useState } from 'react';
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

  const consulta = useQuery({
    queryKey: quoteKeys.list(filtros),
    queryFn: () => adminQuotes.list(filtros),
    placeholderData: keepPreviousData,
  });

  const recarregar = () => queryClient.invalidateQueries({ queryKey: quoteKeys.all });
  const autoresExistentes = consulta.data?.contadores.porAutor.map((a) => a.autor) ?? [];

  // A cópia embutida do Gerador só fica atrás da API quando a mudança a altera (lib/gerador.ts).
  const avisarGerador = (antes: AdminQuote | null, depois: AdminQuote) => {
    if (!mudaCopiaDoGerador(antes, depois)) return;
    toast.warning('Atualize a cópia do Gerador C. S. Lewis', {
      description: 'Rode npm run quotes:sync no repositório do Gerador, revise o diff e publique (passo a passo no manual do painel).',
      duration: 20000,
    });
  };

  const salvou = (antes: AdminQuote | undefined) => (r: { quote: AdminQuote; avisos: string[] }) => {
    void recarregar();
    toast.success(antes ? 'Citação atualizada' : 'Citação criada');
    for (const aviso of r.avisos) toast.warning(aviso);
    avisarGerador(antes ?? null, r.quote);
  };

  const reativar = async (q: AdminQuoteItem) => {
    if (reativando.current.has(q.id)) return;
    reativando.current.add(q.id);
    try {
      const { quote } = await adminQuotes.reativar(q.id);
      void recarregar();
      toast.success('Citação reativada');
      avisarGerador(q, quote);
    } catch (err) {
      toast.error(mensagemDe(err));
      if (err instanceof ApiError && err.statusCode === 400) setFormulario({ quote: q });
      else void recarregar();
    } finally {
      reativando.current.delete(q.id);
    }
  };

  return (
    <div className="grid gap-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="font-display text-2xl font-semibold text-library-wood-foreground">Citações</h1>
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
        onReativar={(q) => void reativar(q)}
        onHistorico={setHistorico}
      />

      {formulario && (
        <QuoteFormDialog
          open
          onOpenChange={(aberto) => !aberto && setFormulario(null)}
          quote={formulario.quote}
          autoresExistentes={autoresExistentes}
          onSaved={salvou(formulario.quote)}
        />
      )}
      <OcultarDialog
        quote={ocultando}
        onOpenChange={(aberto) => !aberto && setOcultando(null)}
        onDone={(oculta) => {
          void recarregar();
          toast.success('Citação ocultada');
          avisarGerador(ocultando, oculta);
        }}
      />
      <EventosSheet quote={historico} onOpenChange={(aberto) => !aberto && setHistorico(null)} />
    </div>
  );
}
