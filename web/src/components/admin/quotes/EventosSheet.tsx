import { useQuery } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { adminQuotes, quoteKeys, type AdminQuoteItem, type QuoteEvent } from '@/services/adminQuotes';

interface Props {
  quote: AdminQuoteItem | null;
  onOpenChange: (open: boolean) => void;
}

const ACAO: Record<string, string> = {
  criou: 'Criada',
  editou: 'Editada',
  ocultou: 'Ocultada',
  reativou: 'Reativada',
  verificou: 'Verificada',
};

const CAMPO: Record<string, string> = {
  author: 'Autor',
  text: 'Texto',
  source: 'Obra',
  dominioPublico: 'Domínio público',
  scriptoriumUrl: 'Endereço no Scriptorium',
  theme: 'Tema',
  fonteUrl: 'Endereço da conferência',
  verificadoEm: 'Conferida em',
  status: 'Situação',
  motivoOcultacao: 'Motivo da ocultação',
};

const valor = (v: unknown) => (v === null || v === undefined || v === '' ? '(vazio)' : String(v));

function alteracoes(e: QuoteEvent): string[] {
  if (e.acao === 'criou' || !e.antes || !e.depois) return [];
  const chaves = new Set([...Object.keys(e.antes), ...Object.keys(e.depois)]);
  return [...chaves]
    .filter((k) => valor(e.antes![k]) !== valor(e.depois![k]))
    .map((k) => `${CAMPO[k] ?? k}: ${valor(e.antes![k])} → ${valor(e.depois![k])}`);
}

export function EventosSheet({ quote, onOpenChange }: Props) {
  const consulta = useQuery({
    queryKey: quoteKeys.eventos(quote?.id ?? ''),
    queryFn: () => adminQuotes.eventos(quote!.id),
    enabled: quote !== null,
  });

  return (
    <Sheet open={quote !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto bg-library-parchment-surface sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-library-wood-foreground">Histórico</SheetTitle>
          <SheetDescription className="font-body text-library-bronze-foreground">
            {quote ? `Citação de ${quote.author}` : ''}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 font-body text-sm text-library-wood-foreground">
          {consulta.isLoading ? (
            <div aria-busy="true" className="grid gap-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : consulta.isError ? (
            <div role="alert" className="rounded-md border border-destructive p-3 text-destructive">
              {consulta.error instanceof Error ? consulta.error.message : 'Não foi possível carregar o histórico.'}
            </div>
          ) : consulta.data && consulta.data.eventos.length === 0 ? (
            <p>Sem histórico registrado</p>
          ) : (
            <ol className="grid gap-4">
              {consulta.data?.eventos.map((e) => (
                <li key={e.id} className="border-l-2 border-library-bronze pl-3">
                  <p className="font-semibold">{ACAO[e.acao] ?? e.acao}</p>
                  <p className="text-xs text-library-bronze-foreground">
                    <time dateTime={e.em}>{new Date(e.em).toLocaleString('pt-BR')}</time>
                  </p>
                  {e.motivo && <p>{`Motivo: ${e.motivo}`}</p>}
                  {alteracoes(e).map((a) => (
                    <p key={a}>{a}</p>
                  ))}
                </li>
              ))}
            </ol>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
