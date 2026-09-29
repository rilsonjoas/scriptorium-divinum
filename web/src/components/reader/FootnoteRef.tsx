import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface FootnoteRefProps {
  /** número da nota, como o remark-gfm renderiza */
  children: ReactNode;
  /** texto da nota (markdown); sem ele, cai no link normal para o fim do capítulo */
  nota?: string;
  href?: string;
}

/**
 * Número de nota de rodapé que abre a nota num balão, sem sair da página
 * (no modo Páginas, pular para o fim do capítulo tirava a pessoa da página).
 * A lista de notas no fim do capítulo continua existindo.
 */
export function FootnoteRef({ children, nota, href }: FootnoteRefProps) {
  if (!nota) return <a href={href}>{children}</a>;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Nota ${String(children)}`}
          className="leading-none font-semibold reader-nota-ref px-0.5 rounded focus-visible:outline focus-visible:outline-2"
        >
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="max-w-sm max-h-[50vh] overflow-y-auto prose prose-sm prose-leitor bg-library-parchment-surface border-library-bronze text-foreground font-body"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{nota}</ReactMarkdown>
      </PopoverContent>
    </Popover>
  );
}
