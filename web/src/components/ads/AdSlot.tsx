import { useEffect, useRef, useState } from 'react';

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
  const [adVisible, setAdVisible] = useState<boolean>(false);

  useEffect(() => {
    if (pushed.current || !insRef.current) return;
    pushed.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      
      // Checar se o anúncio foi preenchido de fato após o push
      const timer = setTimeout(() => {
        if (insRef.current) {
          const status = insRef.current.getAttribute('data-ad-status');
          const hasChild = insRef.current.children.length > 0;
          const hasHeight = insRef.current.offsetHeight > 0;
          
          if (status === 'filled' || (hasChild && hasHeight)) {
            setAdVisible(true);
          } else {
            setAdVisible(false);
          }
        }
      }, 1200);

      return () => clearTimeout(timer);
    } catch {
      setAdVisible(false);
    }
  }, []);

  // Se o anúncio não carregou/bloqueado/em branco, esconde completamente (inclusive o texto 'Publicidade')
  if (!adVisible) return null;

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
