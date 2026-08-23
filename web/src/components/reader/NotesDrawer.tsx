import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Bookmark, Copy, Trash2, Check, Plus, Sparkles } from 'lucide-react';
import { getBookHighlights, deleteHighlight, type UserHighlight } from '@/utils/readingNotes';

interface NotesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookSlug: string;
  bookTitle: string;
}

export function NotesDrawer({ open, onOpenChange, bookSlug, bookTitle }: NotesDrawerProps) {
  const [highlights, setHighlights] = useState<UserHighlight[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = () => {
    if (bookSlug) {
      setHighlights(getBookHighlights(bookSlug));
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open, bookSlug]);

  const handleDelete = (id: string) => {
    deleteHighlight(id);
    load();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(`"${text}" — ${bookTitle}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const colorBadge = (color: UserHighlight['color']) => {
    switch (color) {
      case 'gold':
        return 'bg-amber-100 border-amber-300 text-amber-900';
      case 'emerald':
        return 'bg-emerald-100 border-emerald-300 text-emerald-900';
      case 'bronze':
        return 'bg-orange-100 border-orange-300 text-orange-900';
      case 'leather':
        return 'bg-stone-200 border-stone-400 text-stone-900';
      default:
        return 'bg-amber-100 border-amber-300 text-amber-900';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-library-parchment border-library-bronze text-foreground w-full sm:w-96 p-6 flex flex-col justify-between">
        <div className="flex-1 overflow-y-auto pr-1">
          <SheetHeader className="text-left mb-6 border-b border-library-bronze/30 pb-4">
            <SheetTitle className="font-display text-xl text-library-wood flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-library-gold" />
              Minhas Anotações & Destaques
            </SheetTitle>
            <p className="text-xs text-library-bronze font-body">
              {bookTitle} ({highlights.length} trechos salvos)
            </p>
          </SheetHeader>

          {highlights.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-library-bronze/40 rounded-lg">
              <Sparkles className="h-8 w-8 text-library-gold mx-auto mb-2 opacity-60" />
              <p className="font-body text-sm text-library-wood font-medium">Nenhum trecho grifado ainda</p>
              <p className="font-body text-xs text-library-bronze mt-1">
                Selecione qualquer frase ou parágrafo durante a leitura para salvar seus destaques e anotações pessoais.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {highlights.map((hl) => (
                <div
                  key={hl.id}
                  className={`p-3.5 rounded-lg border text-xs font-body transition-all shadow-sm ${colorBadge(hl.color)}`}
                >
                  <p className="italic font-serif text-sm leading-relaxed mb-2">
                    "{hl.text}"
                  </p>
                  {hl.note && (
                    <div className="mt-2 pt-2 border-t border-black/10 text-xs font-body not-italic text-black/80 bg-white/40 p-2 rounded">
                      <strong className="font-semibold block text-[11px] uppercase tracking-wider mb-0.5 text-library-wood">Minha Nota:</strong>
                      {hl.note}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 text-[11px] text-library-bronze opacity-80 border-t border-black/5 pt-2">
                    <span>{new Date(hl.createdAt).toLocaleDateString('pt-BR')}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(hl.text, hl.id)}
                        className="p-1 hover:text-library-wood transition-colors"
                        title="Copiar trecho"
                      >
                        {copiedId === hl.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(hl.id)}
                        className="p-1 hover:text-red-700 transition-colors"
                        title="Excluir nota"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-library-bronze/30 text-center text-xs text-library-bronze font-body">
          Salvo localmente em seu navegador.
        </div>
      </SheetContent>
    </Sheet>
  );
}
