import type { ReactNode } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Headphones,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
/** botões que só aparecem com espaço; em tela estreita viram itens do menu ⋯ */
const SO_LARGO = 'hidden md:inline-flex';

/** legenda ao passar o mouse ou focar (o nome acessível do botão continua sendo o aria-label) */
function Dica({ texto, children }: { texto: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" className="font-body text-xs">
        {texto}
      </TooltipContent>
    </Tooltip>
  );
}

export function ReaderBar(p: ReaderBarProps) {
  const icone = `h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-full transition-colors disabled:opacity-40 ${p.paleta.botao}`;
  const secundario = `${icone} ${SO_LARGO}`;
  const audio = p.audio;
  return (
    <TooltipProvider delayDuration={250}>
      <div
        role="toolbar"
        aria-label="Controles de leitura"
        className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-1rem)] transition-all duration-200 ${
          p.visivel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className={`flex items-center gap-0.5 sm:gap-1 rounded-full border shadow-xl backdrop-blur-md px-1.5 py-1 ${p.paleta.fundo}`}>
          <Dica texto={p.rotuloVoltar}>
            <button type="button" className={icone} onClick={p.onVoltar} disabled={!p.podeVoltar} aria-label={p.rotuloVoltar}>
              <ChevronLeft className="h-5 w-5" />
            </button>
          </Dica>

          <p aria-live="polite" className="min-w-[3.25rem] px-1 text-center font-body leading-tight">
            <span className={`sm:hidden text-sm tabular-nums ${p.paleta.texto}`}>{p.statusCurto}</span>
            <span className={`hidden sm:block text-sm ${p.paleta.texto}`}>{p.status}</span>
            {p.detalhe && (
              <span className={`hidden md:block max-w-[16rem] truncate text-[11px] ${p.paleta.suave}`}>{p.detalhe}</span>
            )}
          </p>

          <Dica texto={p.rotuloAvancar}>
            <button type="button" className={icone} onClick={p.onAvancar} disabled={!p.podeAvancar} aria-label={p.rotuloAvancar}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </Dica>

          <span aria-hidden className={`mx-0.5 h-6 w-px ${p.paleta.suave} bg-current opacity-30`} />

          <Popover>
            <Dica texto="Ajustes de leitura">
              <PopoverTrigger asChild>
                <button type="button" className={icone} aria-label="Ajustes de leitura (tamanho, fonte, tema)">
                  <Type className="h-5 w-5" />
                </button>
              </PopoverTrigger>
            </Dica>
            <PopoverContent
              side="top"
              align="center"
              className="w-80 max-h-[70vh] overflow-y-auto p-4 bg-library-parchment-surface border-library-bronze text-foreground"
            >
              {p.ajustes}
            </PopoverContent>
          </Popover>

          {p.onIndice && (
            <Dica texto="Índice e destaques">
              <button type="button" className={icone} onClick={p.onIndice} aria-label="Índice e destaques">
                <List className="h-5 w-5" />
              </button>
            </Dica>
          )}

          {/* Ações secundárias: na própria barra quando há espaço (md+); abaixo disso vão para o ⋯ */}
          <Dica texto="Como citar">
            <button type="button" className={secundario} onClick={p.onCitar} aria-label="Como citar">
              <GraduationCap className="h-5 w-5" />
            </button>
          </Dica>
          {audio && (
            <>
              {(audio.status === 'idle' || audio.status === 'unavailable') && (
                <Dica texto={audio.status === 'unavailable' ? 'Ouvir o texto (tentar de novo)' : 'Ouvir o texto'}>
                  <button type="button" className={secundario} onClick={audio.onOuvir} aria-label={audio.status === 'unavailable' ? 'Ouvir o texto (tentar de novo)' : 'Ouvir o texto'}>
                    <Headphones className="h-5 w-5" />
                  </button>
                </Dica>
              )}
              {audio.status === 'playing' && (
                <Dica texto="Pausar áudio">
                  <button type="button" className={secundario} onClick={audio.onPausar} aria-label="Pausar áudio">
                    <Pause className="h-5 w-5" />
                  </button>
                </Dica>
              )}
              {audio.status === 'paused' && (
                <Dica texto="Continuar áudio">
                  <button type="button" className={secundario} onClick={audio.onContinuar} aria-label="Continuar áudio">
                    <Play className="h-5 w-5" />
                  </button>
                </Dica>
              )}
              {(audio.status === 'playing' || audio.status === 'paused') && (
                <Dica texto="Parar áudio">
                  <button type="button" className={secundario} onClick={audio.onParar} aria-label="Parar áudio">
                    <Square className="h-5 w-5" />
                  </button>
                </Dica>
              )}
            </>
          )}
          {/* informações: penúltimo da fila, antes do botão de sair da imersão */}
          <Dica texto="Sobre esta edição">
            <button type="button" className={secundario} onClick={p.onInfo} aria-label="Sobre esta edição">
              <Info className="h-5 w-5" />
            </button>
          </Dica>
          <Dica texto={p.foco ? 'Sair da leitura imersiva' : 'Leitura imersiva'}>
            <button
              type="button"
              className={secundario}
              onClick={p.onFoco}
              aria-pressed={p.foco}
              aria-label={p.foco ? 'Sair da leitura imersiva' : 'Leitura imersiva'}
            >
              {p.foco ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </Dica>

          {/* ⋯ só existe em tela estreita, onde as ações acima não cabem */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className={`${icone} md:hidden`} aria-label="Mais opções">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" className="bg-library-parchment-surface border-library-bronze font-body">
              <DropdownMenuItem onSelect={p.onCitar}>
                <GraduationCap className="h-4 w-4 mr-2" /> Como citar
              </DropdownMenuItem>
              {audio && (
                <>
                  {(audio.status === 'idle' || audio.status === 'unavailable') && (
                    <DropdownMenuItem onSelect={audio.onOuvir}>
                      <Headphones className="h-4 w-4 mr-2" />
                      {audio.status === 'unavailable' ? 'Ouvir (tentar de novo)' : 'Ouvir o texto'}
                    </DropdownMenuItem>
                  )}
                  {audio.status === 'playing' && (
                    <DropdownMenuItem onSelect={audio.onPausar}>
                      <Pause className="h-4 w-4 mr-2" /> Pausar áudio
                    </DropdownMenuItem>
                  )}
                  {audio.status === 'paused' && (
                    <DropdownMenuItem onSelect={audio.onContinuar}>
                      <Play className="h-4 w-4 mr-2" /> Continuar áudio
                    </DropdownMenuItem>
                  )}
                  {(audio.status === 'playing' || audio.status === 'paused') && (
                    <DropdownMenuItem onSelect={audio.onParar}>
                      <Square className="h-4 w-4 mr-2" /> Parar áudio
                    </DropdownMenuItem>
                  )}
                </>
              )}
              <DropdownMenuItem onSelect={p.onInfo}>
                <Info className="h-4 w-4 mr-2" /> Sobre esta edição
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={p.onFoco}>
                {p.foco ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize2 className="h-4 w-4 mr-2" />}
                {p.foco ? 'Sair da leitura imersiva' : 'Leitura imersiva'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
}
