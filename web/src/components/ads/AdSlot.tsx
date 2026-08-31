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
      
      const checkAdStatus = () => {
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
      };

      const timer1 = setTimeout(checkAdStatus, 1200);
      const timer2 = setTimeout(checkAdStatus, 3000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } catch {
      setAdVisible(false);
    }
  }, []);

  return (
    <aside
      className={`mx-auto max-w-4xl px-4 ${adVisible ? 'block' : 'hidden'} ${className}`}
      aria-label="Publicidade"
    >
      {label && adVisible && (
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
