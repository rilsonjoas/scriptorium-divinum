import { useEffect, useRef, useState } from 'react';
import { BookMarked, ExternalLink, Loader2 } from 'lucide-react';
import { lookupWord, type GlossaryAnswer } from '@/utils/glossario';

interface GlossaryPopoverProps {
  word: string;
  anchor: { top: number; bottom: number; left: number };
  onClose: () => void;
}

export function GlossaryPopover({ word, anchor, onClose }: GlossaryPopoverProps) {
  const [answer, setAnswer] = useState<GlossaryAnswer | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty'>('loading');
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setAnswer(null);
    lookupWord(word).then(r => {
      if (!active) return;
      setAnswer(r);
      setStatus(r ? 'ready' : 'empty');
    });
    return () => {
      active = false;
    };
  }, [word]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    window.addEventListener('scroll', onClose, { passive: true, capture: true });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      window.removeEventListener('scroll', onClose, { capture: true });
    };
  }, [onClose]);

  const width = Math.min(360, window.innerWidth - 24);
  const left = Math.max(12, Math.min(anchor.left, window.innerWidth - width - 12));
  const below = anchor.bottom + 10;
  const top = below + 180 > window.innerHeight ? Math.max(12, anchor.top - 190) : below;

  return (
    <div
      ref={boxRef}
      role="dialog"
      aria-label={`Significado de ${word}`}
      className="fixed z-[70] rounded-lg border border-library-bronze bg-card/98 backdrop-blur-sm shadow-deep parchment-bg p-4"
      style={{ top, left, width }}
    >
      <p className="flex items-center gap-2 font-heading text-sm font-semibold text-library-wood mb-2">
        <BookMarked className="h-4 w-4 text-library-gold shrink-0" />
        <span className="truncate">{word}</span>
      </p>

      {status === 'loading' && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground font-body">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Buscando significado...
        </p>
      )}

      {status === 'empty' && (
        <p className="text-sm text-muted-foreground font-body">
          Nenhum significado encontrado para esta palavra.
        </p>
      )}

      {status === 'ready' && answer && (
        <>
          {answer.pos && (
            <p className="text-[11px] uppercase tracking-wide text-library-bronze/80 font-body mb-1">
              {answer.pos}
            </p>
          )}
          <p className="text-sm leading-relaxed text-foreground font-body">{answer.def}</p>
          {answer.source === 'curado' ? (
            <p className="text-[11px] text-library-bronze/70 font-body mt-2">Glossário do Scriptorium</p>
          ) : (
            <a
              href={`https://pt.wiktionary.org/wiki/${encodeURIComponent(word)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-library-bronze hover:text-library-wood font-body mt-2 underline-offset-2 hover:underline"
            >
              Fonte: Wikcionário
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </>
      )}
    </div>
  );
}
