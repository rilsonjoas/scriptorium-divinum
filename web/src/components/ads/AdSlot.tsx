import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADSENSE_CLIENT = "ca-pub-5482566824255473";

interface AdSlotProps {
  slotId?: string;
  format?: string;
  className?: string;
  label?: boolean;
}

// Slot de anúncio discreto que colapsa totalmente (0px de altura/margem)
// caso o Google não preencha o anúncio ou esteja bloqueado, sem rótulos vazios.
export function AdSlot({ slotId, format = "auto", className = "" }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [isUnfilled, setIsUnfilled] = useState(false);

  useEffect(() => {
    const el = insRef.current;
    if (!el) return;

    if (!pushed.current) {
      pushed.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        setIsUnfilled(true);
      }
    }

    const observer = new MutationObserver(() => {
      const status = el.getAttribute("data-ad-status");
      if (status === "unfilled") {
        setIsUnfilled(true);
      } else if (status === "filled") {
        setIsUnfilled(false);
      }
    });

    observer.observe(el, {
      attributes: true,
      attributeFilter: ["data-ad-status", "style"],
    });

    return () => observer.disconnect();
  }, []);

  if (isUnfilled) return null;

  return (
    <aside
      className={`mx-auto max-w-4xl px-4 overflow-hidden empty:hidden ${className}`}
      aria-label="Publicidade"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
