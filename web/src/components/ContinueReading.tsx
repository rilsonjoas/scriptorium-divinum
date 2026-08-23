import { BookOpen, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listReadingProgress, type ReadingProgressEntry } from '@/utils/readingProgress';

export function ContinueReading() {
  const entries: ReadingProgressEntry[] = listReadingProgress();
  if (entries.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8" aria-label="Continuar leitura">
      <div className="ornament mb-6"></div>
      <h2 className="font-display text-2xl font-semibold text-library-wood golden-foil text-center mb-8">
        Continuar Leitura
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {entries.slice(0, 3).map(entry => {
          const percent = Math.round(entry.ratio * 100);
          return (
            <Link
              key={entry.slug}
              to={`/ler/${entry.slug}`}
              className="group block rounded-lg border border-library-bronze bg-card/95 backdrop-blur-sm parchment-bg shadow-book hover:shadow-deep transition-all duration-300 hover:-translate-y-0.5 p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 shrink-0 bg-gradient-leather rounded-md border border-library-bronze/50 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-library-gold" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-body font-medium text-library-wood text-sm line-clamp-2 group-hover:text-library-bronze transition-colors">
                    {entry.title}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground font-body mt-1">
                    <Clock3 className="h-3 w-3" />
                    {percent}% lido
                  </p>
                </div>
              </div>
              <div
                className="h-1.5 w-full bg-library-bronze/15 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progresso em ${entry.title}`}
              >
                <div
                  className="h-full bg-library-gold rounded-full transition-[width]"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
