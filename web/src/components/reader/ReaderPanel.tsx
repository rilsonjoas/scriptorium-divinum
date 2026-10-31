import type { ReactNode } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotesList } from './NotesDrawer';

export type AbaDoPainel = 'indice' | 'destaques';

interface ReaderPanelProps {
  open: boolean;
  aba: AbaDoPainel;
  onAba: (aba: AbaDoPainel) => void;
  onOpenChange: (open: boolean) => void;
  titulo: string;
  bookSlug: string;
  /** conteúdo da aba Índice; sem ele (obra sem índice) só há Destaques */
  indice?: ReactNode;
  onCloseAutoFocus?: (e: Event) => void;
}

/**
 * Painel lateral do leitor: gaveta à direita com Índice e Destaques.
 * Fica fechado por padrão para o texto ocupar a tela; abre pelo botão do
 * índice, pelo de anotações ou pela tecla I, e fecha ao clicar fora ou com Esc.
 */
export function ReaderPanel({ open, aba, onAba, onOpenChange, titulo, bookSlug, indice, onCloseAutoFocus }: ReaderPanelProps) {
  const abaAtiva = indice ? aba : 'destaques';
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-sm bg-library-parchment-surface border-library-bronze text-foreground p-5 flex flex-col"
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <SheetHeader className="text-left pb-2">
          <SheetTitle className="font-display text-lg text-library-wood-foreground">{titulo}</SheetTitle>
          <SheetDescription className="sr-only">Índice da obra e trechos que você grifou</SheetDescription>
        </SheetHeader>
        <Tabs value={abaAtiva} onValueChange={(v) => onAba(v as AbaDoPainel)} className="flex min-h-0 flex-1 flex-col">
          {/* com uma aba só (obra sem índice) a lista de abas seria redundante */}
          {indice && (
          <TabsList className="w-full justify-start gap-1 bg-transparent p-0 border-b border-library-bronze/30 rounded-none h-auto">
            {indice && (
              <TabsTrigger value="indice" className="rounded-none border-b-2 border-transparent px-3 py-2 font-body text-library-bronze-foreground data-[state=active]:border-library-gold data-[state=active]:bg-transparent data-[state=active]:text-library-wood-foreground data-[state=active]:shadow-none">
                Índice
              </TabsTrigger>
            )}
            <TabsTrigger value="destaques" className="rounded-none border-b-2 border-transparent px-3 py-2 font-body text-library-bronze-foreground data-[state=active]:border-library-gold data-[state=active]:bg-transparent data-[state=active]:text-library-wood-foreground data-[state=active]:shadow-none">
              Destaques
            </TabsTrigger>
          </TabsList>
          )}
          {indice && (
            <TabsContent value="indice" className="mt-4 min-h-0 flex-1 overflow-y-auto">
              {indice}
            </TabsContent>
          )}
          <TabsContent value="destaques" className="mt-4 min-h-0 flex-1">
            <NotesList bookSlug={bookSlug} bookTitle={titulo} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
