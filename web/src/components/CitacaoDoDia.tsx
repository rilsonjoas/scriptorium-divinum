import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { fetchCitacaoDoDia, type CitacaoDoDia } from '@/services/citacaoDoDia';
import { SectionLabel } from '@/components/SectionLabel';

const MONTHS_PT = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

function formatDate(responseDate: string): string {
  const [year, month, day] = responseDate.split('-').map(Number);
  if (!year || !month || !day) return responseDate;
  return `${day} de ${MONTHS_PT[month - 1]} de ${year}`;
}

/** "Citação do Dia" — fonte única do cluster "A Biblioteca" (ADR 001): a
 *  própria API do Scriptorium resolve a citação de "hoje" em São Paulo,
 *  deterministicamente, e o mesmo card aparece em Scriptorium, Lecionário e
 *  Gerador C.S. Lewis. O CTA vem pronto da API (`affiliateUrl` para obras
 *  não-públicas; `scriptoriumUrl` para domínio público). Falha silenciosa —
 *  vitrine na home, some com graça (mesma regra dos cards de pintura e
 *  versículo). */
export function CitacaoDoDia() {
  const [citacao, setCitacao] = useState<CitacaoDoDia | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setCitacao(null);
    fetchCitacaoDoDia(ctrl.signal).then((result) => {
      if (!ctrl.signal.aborted) setCitacao(result);
    });
    return () => ctrl.abort();
  }, []);

  if (!citacao) return null;

  const ctaUrl = citacao.dominioPublico ? citacao.scriptoriumUrl : citacao.affiliateUrl;
  const ctaLabel = citacao.dominioPublico ? 'Ler livro completo' : 'Comprar o livro';

  return (
    <section className="container mx-auto px-4 py-12" aria-label="Citação do dia">
      <div className="ornament mb-6"></div>
      <h2 className="font-display text-2xl font-semibold text-library-wood-foreground golden-foil text-center mb-2">
        Citação do Dia
      </h2>
      <p className="font-body text-xs text-muted-foreground tracking-wide text-center mb-8">
        {formatDate(citacao.date)}
      </p>
      <blockquote className="max-w-3xl mx-auto rounded-lg border border-library-bronze bg-card/95 backdrop-blur-sm parchment-bg shadow-book p-8 text-center">
        <p className="font-display text-xl md:text-2xl text-library-wood-foreground leading-relaxed mb-6">
          “{citacao.text}”
        </p>
        <SectionLabel tone="crimson" className="justify-center">
          {citacao.author}
          {citacao.source ? ` • ${citacao.source}` : ''}
        </SectionLabel>
        {ctaUrl && (
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 font-body text-sm text-library-bronze-foreground hover:text-library-crimson transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            {ctaLabel}
          </a>
        )}
      </blockquote>
    </section>
  );
}