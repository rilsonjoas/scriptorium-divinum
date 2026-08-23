import { useEffect, useRef, useState } from 'react';
import { Download, Link2, Quote, Share2, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBook } from '@/hooks/useDatabase';
import { fontSizeForQuote, normalizeQuote, quoteCardFileName } from '@/utils/quoteCard';

const COLORS = {
  bg: '#f4ecdc',
  ink: '#2c1e13',
  bronze: '#8a6a3f',
  gold: '#b08d3e',
  faint: 'rgba(138, 106, 63, 0.35)',
};

function QuoteCardArt({ quote, title, author }: { quote: string; title: string; author?: string }) {
  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: COLORS.bg,
        color: COLORS.ink,
        fontFamily: "Georgia, 'Times New Roman', serif",
        padding: 72,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          height: '100%',
          border: `2px solid ${COLORS.bronze}`,
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              margin: 0,
              fontSize: 26,
              letterSpacing: 10,
              textTransform: 'uppercase',
              color: COLORS.gold,
              fontWeight: 700,
            }}
          >
            Scriptorium Divinum
          </p>
          <p style={{ margin: '14px auto 0', width: 120, borderTop: `2px solid ${COLORS.faint}` }} />
        </div>

        <div>
          <p style={{ margin: 0, fontSize: 130, lineHeight: 0.6, color: COLORS.gold, fontFamily: 'Georgia, serif' }}>
            &ldquo;
          </p>
          <p
            style={{
              margin: '18px 0 0',
              fontSize: fontSizeForQuote(quote),
              lineHeight: 1.38,
              fontStyle: 'italic',
            }}
          >
            {quote}
          </p>
          <p style={{ margin: '10px 0 0', fontSize: 130, lineHeight: 0.5, color: COLORS.gold, textAlign: 'right' }}>
            &rdquo;
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 24, color: COLORS.gold }}>✦</p>
          <p style={{ margin: '16px 0 0', fontSize: 30, fontWeight: 700 }}>{title}</p>
          {author && (
            <p style={{ margin: '6px 0 0', fontSize: 26, color: COLORS.bronze }}>{author}</p>
          )}
          <p style={{ margin: '20px 0 0', fontSize: 22, letterSpacing: 4, color: COLORS.bronze }}>
            scriptorium.narniano.com
          </p>
        </div>
      </div>
    </div>
  );
}

async function captureBlob(node: HTMLElement): Promise<Blob> {
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(node, {
    scale: 1,
    backgroundColor: null,
    useCORS: true,
    logging: false,
  });
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error('toBlob falhou'))), 'image/png');
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface QuoteCardDialogProps {
  open: boolean;
  quote: string;
  slug?: string;
  fallbackTitle: string;
  onClose: () => void;
}

export function QuoteCardDialog({ open, quote, slug, fallbackTitle, onClose }: QuoteCardDialogProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const clean = normalizeQuote(quote);

  const { data: book } = useBook(slug ?? '');

  const build = async (): Promise<{ blob: Blob; filename: string } | null> => {
    if (!exportRef.current) return null;
    setBusy(true);
    try {
      const blob = await captureBlob(exportRef.current);
      return { blob, filename: quoteCardFileName(fallbackTitle) };
    } catch {
      toast.error('Não foi possível gerar a imagem.');
      return null;
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async () => {
    const r = await build();
    if (!r) return;
    downloadBlob(r.blob, r.filename);
    toast.success('Imagem baixada!');
  };

  const handleShare = async () => {
    const r = await build();
    if (!r) return;
    const file = new File([r.blob], r.filename, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Scriptorium Divinum',
          text: `Citação de "${fallbackTitle}"`,
        });
        return;
      } catch {
        return;
      }
    }
    downloadBlob(r.blob, r.filename);
    toast.info('Compartilhamento nativo indisponível — baixamos a imagem.');
  };

  const handleCopy = async () => {
    const r = await build();
    if (!r) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': r.blob })]);
      toast.success('Imagem copiada!');
    } catch {
      toast.error('Seu navegador não permite copiar imagens.');
    }
  };

  const canNativeShare =
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    typeof navigator.share === 'function';

  return (
    <>
      <div
        aria-hidden
        style={{ position: 'fixed', left: -99999, top: 0, opacity: 1, pointerEvents: 'none' }}
      >
        <div ref={exportRef}>
          <QuoteCardArt
            quote={clean}
            title={book?.title ?? fallbackTitle}
            author={book?.author?.name}
          />
        </div>
      </div>

      <Dialog open={open} onOpenChange={o => !o && onClose()}>
        <DialogContent className="max-w-md parchment-bg border-library-bronze">
          <DialogHeader>
            <DialogTitle className="font-display text-library-wood flex items-center gap-2">
              <Quote className="h-4 w-4 text-library-gold" />
              Card de citação
            </DialogTitle>
            <DialogDescription className="font-body">
              Prévia do card para compartilhar nas redes.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg overflow-hidden border-2 border-library-bronze shadow-book mx-auto" style={{ width: 300 }}>
            <div style={{ transform: 'scale(0.2778)', transformOrigin: 'top left', width: 1080, height: 1080 }}>
              <QuoteCardArt
                quote={clean}
                title={book?.title ?? fallbackTitle}
                author={book?.author?.name}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            <Button
              onClick={handleDownload}
              disabled={busy}
              size="sm"
              className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
            >
              <Download className="h-4 w-4 mr-1" />
              Baixar
            </Button>
            <Button
              onClick={handleCopy}
              disabled={busy}
              variant="outline"
              size="sm"
              className="border-library-bronze text-library-bronze hover:bg-library-bronze hover:text-primary-foreground font-body"
            >
              <Link2 className="h-4 w-4 mr-1" />
              Copiar
            </Button>
            {canNativeShare ? (
              <Button
                onClick={handleShare}
                disabled={busy}
                variant="outline"
                size="sm"
                className="border-library-bronze text-library-bronze hover:bg-library-bronze hover:text-primary-foreground font-body"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Enviar
              </Button>
            ) : (
              <span />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function QuoteTriggerPill({
  anchor,
  onClick,
  onHighlight,
  onClose,
}: {
  anchor: { top: number; bottom: number; left: number };
  onClick: () => void;
  onHighlight?: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onScroll = () => onClose();
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', onScroll, { capture: true });
  }, [onClose]);

  const left = Math.max(12, Math.min(anchor.left, window.innerWidth - 300));
  const top = anchor.bottom + 8;

  return (
    <div
      className="fixed z-[65] flex items-center gap-1.5 rounded-full bg-library-wood text-library-gold shadow-deep p-1.5 font-body text-xs"
      style={{ top, left }}
    >
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 hover:bg-library-gold/20 transition-colors font-medium"
      >
        <Quote className="h-3.5 w-3.5 shrink-0 text-library-gold" />
        Criar Card
      </button>

      {onHighlight && (
        <>
          <span className="w-px h-4 bg-library-bronze/40" />
          <button
            onClick={onHighlight}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 hover:bg-library-gold/20 transition-colors font-medium text-emerald-300"
          >
            <Bookmark className="h-3.5 w-3.5 shrink-0" />
            Grifar
          </button>
        </>
      )}
    </div>
  );
}
