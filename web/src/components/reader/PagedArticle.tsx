import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { FocusEvent, ReactNode } from 'react';
import { countPages, pageOfOffset, LAST_PAGE } from '@/utils/pagination';

/** Espaço entre páginas (colunas). Precisa ser o mesmo na medição e no deslocamento. */
const GAP = 48;

interface PagedArticleProps {
  /** Página a mostrar (0-based) ou LAST_PAGE. */
  page: number;
  /** Chamado sempre que o número de páginas do capítulo muda (nova medição). */
  onPagesChange: (pages: number) => void;
  /** O componente pede para ir a uma página (foco de teclado, título do índice). */
  onPageRequest: (page: number) => void;
  /** Id de um título para abrir na página onde ele está (vindo do índice). */
  targetId?: string | null;
  onTargetResolved?: () => void;
  /** Muda quando algo que altera a medida muda (capítulo, fonte, tamanho). */
  measureKey: string;
  /** Altura da página em px (calculada pelo Reader a partir do cabeçalho real). */
  height: number;
  /** Páginas por vista: 2 = livro aberto (telas largas). */
  colunas?: 1 | 2;
  /** Classe do contêiner (ex.: a animação de abertura de capítulo). */
  viewportClassName?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Mostra o capítulo em páginas do tamanho da área de leitura, sem rolagem.
 *
 * O texto é distribuído em colunas CSS com a largura exata da área visível;
 * cada coluna é uma página e o artigo é deslocado horizontalmente para mostrar
 * a página atual. É a técnica dos leitores de ebook no navegador: a quebra de
 * página respeita a tipografia escolhida e se refaz quando a fonte ou a tela
 * mudam.
 */
export function PagedArticle({
  page,
  onPagesChange,
  onPageRequest,
  targetId,
  onTargetResolved,
  measureKey,
  height,
  colunas = 1,
  viewportClassName,
  className,
  children,
}: PagedArticleProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pages, setPages] = useState(1);

  // Tamanho da área de leitura
  useLayoutEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const read = () => setSize({ w: vp.clientWidth, h: vp.clientHeight });
    read();
    // navegadores antigos (e o jsdom dos testes) não têm ResizeObserver
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', read);
      return () => window.removeEventListener('resize', read);
    }
    const ro = new ResizeObserver(read);
    ro.observe(vp);
    return () => ro.disconnect();
  }, []);

  const offsetOf = useCallback((el: Element) => {
    const article = articleRef.current;
    if (!article) return 0;
    return el.getBoundingClientRect().left - article.getBoundingClientRect().left;
  }, []);

  // Mede quantas páginas o capítulo ocupa
  const measure = useCallback(() => {
    const article = articleRef.current;
    // sem altura aplicada o capítulo cabe numa coluna só e a medição daria
    // "1 página" (e consumiria a posição a retomar); espera a área real
    if (!article || size.w <= 0 || size.h <= 0) return;
    const n = countPages(article.scrollWidth, size.w, GAP);
    setPages(n);
    onPagesChange(n);
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el && article.contains(el)) {
        // offset medido com o artigo já deslocado: soma o deslocamento atual
        const current = Math.max(0, page === LAST_PAGE ? n - 1 : page);
        onPageRequest(pageOfOffset(offsetOf(el) + current * (size.w + GAP), size.w, GAP));
      }
      onTargetResolved?.();
    }
  }, [size.w, size.h, targetId, page, onPagesChange, onPageRequest, onTargetResolved, offsetOf]);

  useLayoutEffect(() => {
    measure();
    // fontes web carregam depois da primeira pintura e mudam a quebra
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
    };
    // measureKey cobre capítulo, fonte e tamanho; size cobre a tela
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measureKey, size.w, size.h, targetId]);

  // Tab até um link/elemento fora da página visível: vai até a página dele
  const onFocusCapture = (e: FocusEvent) => {
    if (size.w <= 0) return;
    const current = Math.max(0, page === LAST_PAGE ? pages - 1 : page);
    const target = pageOfOffset(offsetOf(e.target) + current * (size.w + GAP), size.w, GAP);
    if (target !== current) onPageRequest(Math.min(target, pages - 1));
  };

  const shown = page === LAST_PAGE ? pages - 1 : Math.min(page, pages - 1);

  return (
    <div
      ref={viewportRef}
      onFocusCapture={onFocusCapture}
      className={`relative overflow-hidden ${viewportClassName ?? ''}`}
      style={{ height: `${height}px` }}
    >
      <article
        ref={articleRef}
        className={className}
        style={{
          // com 2 colunas por vista, cada página tem metade da vista menos o
          // espaço entre elas; o deslocamento continua sendo de uma vista
          columnWidth: size.w > 0 ? `${(size.w - GAP * (colunas - 1)) / colunas}px` : undefined,
          columnGap: `${GAP}px`,
          columnFill: 'auto',
          height: size.h > 0 ? `${size.h}px` : undefined,
          transform: `translateX(-${Math.max(0, shown) * (size.w + GAP)}px)`,
        }}
      >
        {children}
      </article>
    </div>
  );
}
