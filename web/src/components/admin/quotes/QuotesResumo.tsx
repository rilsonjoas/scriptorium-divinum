import type { QuoteListResponse } from '@/services/adminQuotes';

interface Props {
  contadores: QuoteListResponse['contadores'];
}

const MAIORES = 5;

function Numero({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="rounded-md border border-library-bronze/40 bg-library-parchment-surface px-4 py-3">
      <dt className="text-sm font-body text-library-bronze-foreground">{rotulo}</dt>
      <dd className="text-2xl font-display text-library-wood-foreground">{valor}</dd>
    </div>
  );
}

/** Contadores do acervo inteiro e a concentração dos maiores autores sobre as citações ativas. */
export function QuotesResumo({ contadores }: Props) {
  const { porStatus, porAutorAtivas, semVerificacao } = contadores;
  const total = porStatus.ativa + porStatus.oculta + porStatus.rascunho;
  const percentual = (n: number) => (porStatus.ativa > 0 ? Math.round((n / porStatus.ativa) * 100) : 0);

  return (
    <section aria-label="Resumo do acervo" className="grid gap-4">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Numero rotulo="Total" valor={total} />
        <Numero rotulo="Ativas" valor={porStatus.ativa} />
        <Numero rotulo="Ocultas" valor={porStatus.oculta} />
        <Numero rotulo="Rascunhos" valor={porStatus.rascunho} />
        <Numero rotulo="Sem verificação" valor={semVerificacao} />
      </dl>
      {porAutorAtivas.length > 0 && (
        <div>
          <h2 className="text-sm font-body font-semibold text-library-wood-foreground">Autores com mais citações ativas</h2>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm font-body text-library-bronze-foreground">
            {porAutorAtivas.slice(0, MAIORES).map((a) => (
              <li key={a.autor}>{`${a.autor} ${a.total}, ${percentual(a.total)}%`}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
