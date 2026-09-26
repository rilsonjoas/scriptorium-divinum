import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
  /** filete dourado à esquerda, no gesto do chapter-divider */
  withRule?: boolean;
  tone?: 'crimson' | 'gold' | 'muted';
}

const TONS = {
  crimson: 'text-library-crimson-foreground',
  gold: 'text-library-gold',
  muted: 'text-muted-foreground',
} as const;

/**
 * Rótulo curto que abre uma seção ("Obras em Destaque", "Citação do Dia").
 *
 * Antes, cada um desses rótulos repetia a mesma classe solta
 * `uppercase tracking-widest text-library-crimson-foreground` — quatro cópias
 * idênticas no app. Uppercase gritava em todo scroll e era o maior
 *Responsible pela sensação de "dashboard" em vez de biblioteca.
 *
 * A hierarquia agora vem do peso e do tracking, não do grito, e o
 * filete dourado dá o gesto editorial sem levantar a voz.
 */
export function SectionLabel({
  children,
  className,
  withRule = false,
  tone = 'crimson',
}: SectionLabelProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-2 font-body text-[0.8125rem] font-semibold tracking-[0.06em]',
        withRule && 'before:h-px before:w-6 before:shrink-0 before:bg-library-dourado/60',
        TONS[tone],
        className,
      )}
    >
      {children}
    </p>
  );
}
