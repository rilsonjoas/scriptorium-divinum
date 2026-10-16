import { useState, useEffect } from 'react';
import { Copy, Check, BookMarked, Quote, Bookmark } from 'lucide-react';
import { toast } from 'sonner';

export interface SelectionAnchor {
  top: number;
  bottom: number;
  left: number;
}

interface ReaderSelectionMenuProps {
  text: string;
  normalizedWord: string | null;
  wordCount: number;
  anchor: SelectionAnchor;
  onOpenGlossary: (word: string, anchor: SelectionAnchor) => void;
  onCreateCard: () => void;
  onHighlight: () => void;
  onClose: () => void;
}

export function ReaderSelectionMenu({
  text,
  normalizedWord,
  wordCount,
  anchor,
  onOpenGlossary,
  onCreateCard,
  onHighlight,
  onClose,
}: ReaderSelectionMenuProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => onClose();
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', onScroll, { capture: true });
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Texto copiado para a área de transferência!');
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1200);
    } catch {
      toast.error('Não foi possível copiar o texto.');
    }
  };

  // Posicionamento inteligente para evitar overflow da viewport
  const pillWidth = wordCount >= 2 ? 320 : 250;
  const left = Math.max(12, Math.min(anchor.left, window.innerWidth - pillWidth));
  const top = anchor.bottom + 8;

  return (
    <div
      role="toolbar"
      aria-label="Ações para o texto selecionado"
      className="fixed z-[65] flex items-center gap-1 rounded-full bg-library-wood text-library-gold border border-library-gold/30 shadow-deep p-1 font-body text-xs backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
      style={{ top, left }}
    >
      {/* Botão Copiar */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copiar texto"
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 hover:bg-library-gold/20 active:scale-95 transition-all font-medium text-library-parchment"
        title="Copiar texto selecionado"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span className="text-emerald-400">Copiado</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 shrink-0 text-library-gold" />
            <span>Copiar</span>
          </>
        )}
      </button>

      {/* Botão Dicionário / Glossário (para palavra única identificada) */}
      {normalizedWord && wordCount === 1 && (
        <>
          <span className="w-px h-3.5 bg-library-bronze/40" />
          <button
            type="button"
            onClick={() => onOpenGlossary(normalizedWord, anchor)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 hover:bg-library-gold/20 active:scale-95 transition-all font-medium text-library-gold"
            title={`Consultar "${normalizedWord}" no glossário histórico`}
          >
            <BookMarked className="h-3.5 w-3.5 shrink-0" />
            <span>Dicionário</span>
          </button>
        </>
      )}

      {/* Botão Criar Card de Citação (para citações com 2 ou mais palavras) */}
      {wordCount >= 2 && (
        <>
          <span className="w-px h-3.5 bg-library-bronze/40" />
          <button
            type="button"
            onClick={onCreateCard}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 hover:bg-library-gold/20 active:scale-95 transition-all font-medium text-library-gold"
            title="Criar card de citação para compartilhar"
          >
            <Quote className="h-3.5 w-3.5 shrink-0" />
            <span>Criar Card</span>
          </button>
        </>
      )}

      {/* Botão Grifar */}
      <span className="w-px h-3.5 bg-library-bronze/40" />
      <button
        type="button"
        onClick={onHighlight}
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 hover:bg-library-gold/20 active:scale-95 transition-all font-medium text-amber-200"
        title="Salvar trecho em suas anotações"
      >
        <Bookmark className="h-3.5 w-3.5 shrink-0" />
        <span>Grifar</span>
      </button>
    </div>
  );
}
