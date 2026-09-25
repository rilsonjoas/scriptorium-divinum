import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  fetchVersiculoDoDia,
  lecionarioHomeUrl,
  type VersiculoDoDia,
} from '@/services/versiculoDoDia';
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

/** "Versículo do Dia" — fonte única do cluster "A Biblioteca": a rota
 *  /api/versiculo-do-dia do Lecionário (leituras RCL, ARC, determinística).
 *  Chamada SEM `?date` de propósito — o endpoint resolve "hoje" em São
 *  Paulo, mesma regra do card de pintura (ver pinturaDoDia.ts). O mesmo
 *  card existe no home do Bíblia na Arte: os dois mostram o MESMO
 *  versículo no mesmo dia. Falha silenciosa — vitrine na home, some com
 *  graça (ex.: quando o deploy do lecionario-web não tiver a rota ainda). */
export function VersiculoDoDia() {
  const [versiculo, setVersiculo] = useState<VersiculoDoDia | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setVersiculo(null);
    fetchVersiculoDoDia(ctrl.signal).then((result) => {
      if (!ctrl.signal.aborted) setVersiculo(result);
    });
    return () => ctrl.abort();
  }, []);

  if (!versiculo) return null;

  return (
    <section className="container mx-auto px-4 py-12" aria-label="Passagem do dia">
      <div className="ornament mb-6"></div>
      <h2 className="font-display text-2xl font-semibold text-library-wood-foreground golden-foil text-center mb-2">
        Passagem do Dia
      </h2>
      <p className="font-body text-xs text-muted-foreground tracking-wide text-center mb-8">
        {formatDate(versiculo.date)}
      </p>
      <blockquote className="max-w-3xl mx-auto rounded-lg border border-library-bronze bg-card/95 backdrop-blur-sm parchment-bg shadow-book p-6 text-center">
        <p className="font-display text-base md:text-lg text-library-wood-foreground leading-relaxed">
          {versiculo.verse.text}
        </p>
        <SectionLabel tone="crimson" className="justify-center mt-4">
          {versiculo.verse.reference} • ARC
        </SectionLabel>
        <a
          href={lecionarioHomeUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 font-body text-sm text-library-bronze-foreground hover:text-library-crimson transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Lecionário Comum Revisado
        </a>
      </blockquote>
    </section>
  );
}