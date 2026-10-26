import { useRef, useState } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError, issuesDe } from '@/lib/api-client';
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

  const salvou = (editou: boolean) => (r: { quote: AdminQuote; avisos: string[] }) => {
    void recarregar();
    toast.success(editou ? 'Citação atualizada' : 'Citação criada');
    for (const aviso of r.avisos) toast.warning(aviso);
  };

  const reativar = async (q: AdminQuoteItem) => {
    if (reativando.current.has(q.id)) return;
    reativando.current.add(q.id);
    try {
      await adminQuotes.reativar(q.id);
      void recarregar();
      toast.success('Citação reativada');
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
          onSaved={salvou(Boolean(formulario.quote))}
        />
      )}
      <OcultarDialog
        quote={ocultando}
        onOpenChange={(aberto) => !aberto && setOcultando(null)}
        onDone={() => {
          void recarregar();
          toast.success('Citação ocultada');
        }}
      />
      <EventosSheet quote={historico} onOpenChange={(aberto) => !aberto && setHistorico(null)} />
    </div>
  );
}
