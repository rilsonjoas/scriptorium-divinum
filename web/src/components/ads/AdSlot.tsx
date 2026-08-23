import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADSENSE_CLIENT = 'ca-pub-5482566824255473';

interface AdSlotProps {
  slotId?: string;
  format?: string;
  className?: string;
  label?: boolean;
}

export function AdSlot({ slotId, format = 'auto', className = '', label = true }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current || !insRef.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // script ainda não carregou ou bloqueado — slot permanece em branco
    }
  }, []);

  return (
    <aside className={`mx-auto max-w-4xl px-4 ${className}`} aria-label="Publicidade">
      {label && (
        <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground/60 font-body mb-1">
          Publicidade
        </p>
      )}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
