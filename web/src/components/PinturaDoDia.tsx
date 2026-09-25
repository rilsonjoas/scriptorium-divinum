import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  fetchPinturaDoDia,
  formatPinturaReference,
  pinturaImageUrl,
  pinturaInfoUrl,
  type PinturaDoDia,
} from '@/services/pinturaDoDia';
import { SectionLabel } from '@/components/SectionLabel';

export function PinturaDoDia() {
  const [artwork, setArtwork] = useState<PinturaDoDia | null>(null);
  const [imageAttempt, setImageAttempt] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    setArtwork(null);
    setImageAttempt(0);
    setImageFailed(false);
    fetchPinturaDoDia(ctrl.signal).then((result) => {
      if (!ctrl.signal.aborted) setArtwork(result);
    });
    return () => ctrl.abort();
  }, []);

  if (!artwork) return null;

  const imageUrl = artwork.imageUrl && !imageFailed ? pinturaImageUrl(artwork) : null;
  const infoUrl = pinturaInfoUrl(artwork);
  const relatedPassages = artwork.references.map(formatPinturaReference).join(' · ');
  const year = artwork.year ? ` (${artwork.year})` : '';

  return (
    <section className="container mx-auto px-4 py-12" aria-label="Pintura do dia">
      <div className="ornament mb-6"></div>
      <h2 className="font-display text-2xl font-semibold text-library-wood-foreground golden-foil text-center mb-8">
        Pintura do Dia
      </h2>
      <div className="max-w-3xl mx-auto rounded-lg border border-library-bronze bg-card/95 backdrop-blur-sm parchment-bg shadow-book overflow-hidden">
        {imageUrl && (
          <a href={infoUrl} target="_blank" rel="noopener noreferrer" className="block" aria-label={`Ampliar obra ${artwork.title}`}>
            <img
              key={imageAttempt}
              src={imageUrl}
              alt={artwork.title}
              loading="lazy"
              className="h-64 md:h-80 w-full object-contain bg-library-parchment-surface"
              onError={() => {
                if (imageAttempt === 0) {
                  setImageAttempt(1);
                } else {
                  setImageFailed(true);
                }
              }}
            />
          </a>
        )}
        <div className="p-6 text-center">
          <SectionLabel tone="crimson" className="justify-center mb-2">
            {artwork.artistOrDirector} • Bíblia na Arte
          </SectionLabel>
          <h3 className="font-display text-xl font-semibold text-library-wood-foreground mb-2">
            {artwork.title}
            {year}
          </h3>
          {relatedPassages && (
            <p className="font-body text-sm text-muted-foreground mb-4 italic">{relatedPassages}</p>
          )}
          <a
            href={infoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-library-wood px-4 py-2 font-body text-sm text-library-gold hover:bg-library-bronze transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Ver obra completa
          </a>
        </div>
      </div>
    </section>
  );
}