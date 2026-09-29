import type { ReactNode } from 'react';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Info,
  List,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Pause,
  Play,
  Square,
  Type,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface PaletaBarra {
  fundo: string;
  texto: string;
  suave: string;
  botao: string;
}

interface ReaderBarProps {
  paleta: PaletaBarra;
  visivel: boolean;
  /** "Página 3 de 14" (ou "Capítulo 2 de 9" no modo Rolagem) */
  status: string;
  /** versão curta para o celular: "3/14" */
  statusCurto: string;
  /** segunda linha (capítulo e título), só em telas maiores */
  detalhe?: string;
  rotuloVoltar: string;
  rotuloAvancar: string;
  podeVoltar: boolean;
  podeAvancar: boolean;
  onVoltar: () => void;
  onAvancar: () => void;
  ajustes: ReactNode;
  onIndice?: () => void;
  onInfo: () => void;
  foco: boolean;
  onFoco: () => void;
  onCitar: () => void;
  onAnotacoes: () => void;
  audio?: {
    status: 'idle' | 'playing' | 'paused' | 'unavailable';
    onOuvir: () => void;
    onPausar: () => void;
    onContinuar: () => void;
    onParar: () => void;
  };
}

/**
 * Barra flutuante do leitor, embaixo, junto do texto (decisão de 2026-09-29,
 * no lugar dos botões no topo, "longe do texto"). Segue a paleta do tema do
 * LEITOR. No celular, o Foco vai para o menu ⋯ para tudo caber em 360px.
 */
export function ReaderBar(p: ReaderBarProps) {
  const icone = `h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-full transition-colors disabled:opacity-40 ${p.paleta.botao}`;
  return (
    <div
      role="toolbar"
      aria-label="Controles de leitura"
      className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-1rem)] transition-all duration-200 ${
        p.visivel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className={`flex items-center gap-0.5 sm:gap-1 rounded-full border shadow-xl backdrop-blur-md px-1.5 py-1 ${p.paleta.fundo}`}>
        <button type="button" className={icone} onClick={p.onVoltar} disabled={!p.podeVoltar} aria-label={p.rotuloVoltar}>
          <ChevronLeft className="h-5 w-5" />
        </button>

        <p aria-live="polite" className="min-w-[3.25rem] px-1 text-center font-body leading-tight">
          <span className={`sm:hidden text-sm tabular-nums ${p.paleta.texto}`}>{p.statusCurto}</span>
          <span className={`hidden sm:block text-sm ${p.paleta.texto}`}>{p.status}</span>
          {p.detalhe && (
            <span className={`hidden md:block max-w-[16rem] truncate text-[11px] ${p.paleta.suave}`}>{p.detalhe}</span>
          )}
        </p>

        <button type="button" className={icone} onClick={p.onAvancar} disabled={!p.podeAvancar} aria-label={p.rotuloAvancar}>
          <ChevronRight className="h-5 w-5" />
        </button>

        <span aria-hidden className={`mx-0.5 h-6 w-px ${p.paleta.suave} bg-current opacity-30`} />

        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className={icone} aria-label="Ajustes de leitura (tamanho, fonte, tema)">
              <Type className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="center"
            className="w-80 max-h-[70vh] overflow-y-auto p-4 bg-library-parchment-surface border-library-bronze text-foreground"
          >
            {p.ajustes}
          </PopoverContent>
        </Popover>

        {p.onIndice && (
          <button type="button" className={icone} onClick={p.onIndice} aria-label="Índice da obra">
            <List className="h-5 w-5" />
          </button>
        )}

        <button type="button" className={icone} onClick={p.onInfo} aria-label="Sobre esta edição (ficha da obra)">
          <Info className="h-5 w-5" />
        </button>

        <button
          type="button"
          className={`${icone} hidden sm:inline-flex`}
          onClick={p.onFoco}
          aria-pressed={p.foco}
          aria-label={p.foco ? 'Sair do modo foco' : 'Modo foco'}
        >
          {p.foco ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={icone} aria-label="Mais opções">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="bg-library-parchment-surface border-library-bronze font-body">
            <DropdownMenuItem className="sm:hidden" onSelect={p.onFoco}>
              {p.foco ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize2 className="h-4 w-4 mr-2" />}
              {p.foco ? 'Sair do modo foco' : 'Modo foco'}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={p.onCitar}>
              <GraduationCap className="h-4 w-4 mr-2" /> Como citar
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={p.onAnotacoes}>
              <Bookmark className="h-4 w-4 mr-2" /> Anotações
            </DropdownMenuItem>
            {p.audio && (
              <>
                <DropdownMenuSeparator />
                {(p.audio.status === 'idle' || p.audio.status === 'unavailable') && (
                  <DropdownMenuItem onSelect={p.audio.onOuvir}>
                    <Play className="h-4 w-4 mr-2" />
                    {p.audio.status === 'unavailable' ? 'Ouvir (tentar de novo)' : 'Ouvir o texto'}
                  </DropdownMenuItem>
                )}
                {p.audio.status === 'playing' && (
                  <DropdownMenuItem onSelect={p.audio.onPausar}>
                    <Pause className="h-4 w-4 mr-2" /> Pausar áudio
                  </DropdownMenuItem>
                )}
                {p.audio.status === 'paused' && (
                  <DropdownMenuItem onSelect={p.audio.onContinuar}>
                    <Play className="h-4 w-4 mr-2" /> Continuar áudio
                  </DropdownMenuItem>
                )}
                {(p.audio.status === 'playing' || p.audio.status === 'paused') && (
                  <DropdownMenuItem onSelect={p.audio.onParar}>
                    <Square className="h-4 w-4 mr-2" /> Parar áudio
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
