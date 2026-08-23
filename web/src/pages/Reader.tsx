import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BookMarked, BookOpen, Clock, List, Loader2, ScrollText } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useBookText } from '@/hooks/useDatabase';
import { splitProvenance } from '@/utils/readerText';
import { normalizeWord } from '@/utils/glossario';
import { GlossaryPopover } from '@/components/reader/GlossaryPopover';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);

const headingText = (node: ReactNode): string => {
  let out = '';
  const walk = (c: unknown): void => {
    if (typeof c === 'string' || typeof c === 'number') {
      out += String(c);
    } else if (Array.isArray(c)) {
      c.forEach(walk);
    } else if (c && typeof c === 'object' && 'props' in c) {
      walk((c as { props?: { children?: ReactNode } }).props?.children);
    }
  };
  walk(node);
  return out;
};

function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  let inFence = false;
  for (const line of markdown.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) {
      const text = m[2].trim();
      items.push({ id: slugify(text), text, level: m[1].length });
    }
  }
  const onlyTitles = items.length > 1 && items.every(i => i.level === 1);
  return onlyTitles ? items.slice(1) : items;
}

function readingMinutes(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const headingClass = 'scroll-mt-24 font-heading font-semibold text-library-wood';
const markdownComponents = {
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 id={slugify(headingText(children))} className={`${headingClass} text-3xl mt-10 mb-4 first:mt-0`}>
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 id={slugify(headingText(children))} className={`${headingClass} text-2xl mt-10 mb-4`}>
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 id={slugify(headingText(children))} className={`${headingClass} text-xl mt-8 mb-3`}>
      {children}
    </h3>
  ),
};

export default function Reader() {
  const { bookId } = useParams<{ bookId: string }>();
  const { data, isLoading, error } = useBookText(bookId || '');
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [glossaryQuery, setGlossaryQuery] = useState<{
    word: string;
    anchor: { top: number; bottom: number; left: number };
  } | null>(null);

  const parsed = useMemo(() => {
    if (!data) return null;
    const { provenance, content } = splitProvenance(data.text);
    return {
      provenance,
      content,
      toc: extractToc(content),
      minutes: readingMinutes(content),
    };
  }, [data]);

  useEffect(() => {
    const toc = parsed?.toc ?? [];
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setProgress(max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0);
        if (toc.length === 0) return;
        let current: string | null = null;
        for (const item of toc) {
          const el = document.getElementById(item.id);
          if (el && el.getBoundingClientRect().top <= 96) current = item.id;
        }
        setActiveId(current ?? toc[0]?.id ?? null);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [parsed]);

  useEffect(() => {
    setGlossaryQuery(null);
  }, [bookId]);

  useEffect(() => {
    const onSelectEnd = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setGlossaryQuery(q => (q ? (window.getSelection()?.isCollapsed ? null : q) : null));
        return;
      }
      const container = contentRef.current;
      if (!container || !container.contains(sel.anchorNode)) return;

      const raw = sel.toString();
      const word = normalizeWord(raw);
      if (!word || /\s/.test(word)) return;

      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (!rect.width && !rect.height) return;
      setGlossaryQuery({
        word,
        anchor: { top: rect.top, bottom: rect.bottom, left: rect.left },
      });
    };
    document.addEventListener('mouseup', onSelectEnd);
    document.addEventListener('touchend', onSelectEnd);
    return () => {
      document.removeEventListener('mouseup', onSelectEnd);
      document.removeEventListener('touchend', onSelectEnd);
    };
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm" className="font-body text-library-bronze hover:text-library-wood">
              <Link to={bookId ? `/livros/${bookId}` : '/livros'}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Catálogo
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-library-gold mr-3" />
            <span className="font-body text-library-bronze text-lg">Preparando a leitura...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !data || !parsed) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm" className="font-body text-library-bronze hover:text-library-wood">
              <Link to={bookId ? `/livros/${bookId}` : '/livros'}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Catálogo
              </Link>
            </Button>
          </div>
          <Card className="bg-card/95 backdrop-blur-sm border-library-bronze shadow-book parchment-bg">
            <CardContent className="p-10 text-center">
              <ScrollText className="h-12 w-12 text-library-bronze mx-auto mb-4" />
              <h1 className="font-heading text-2xl text-library-wood mb-2">Conteúdo indisponível</h1>
              <p className="font-body text-library-bronze">
                O texto desta obra ainda não está disponível no leitor online.
                Você pode encontrar os formatos para download na página da obra.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const goToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const indexNav = (
    <>
      <p className="flex items-center gap-2 font-display text-sm font-semibold text-library-wood mb-3">
        <List className="h-4 w-4 text-library-bronze" />
        Índice
      </p>
      <ul className="space-y-1 lg:max-h-[70vh] lg:overflow-y-auto pr-1">
        {parsed.toc.map(item => (
          <li key={`${item.id}-${item.level}`}>
            <button
              onClick={() => goToSection(item.id)}
              aria-current={activeId === item.id ? 'true' : undefined}
              className={`w-full text-left rounded-md px-2 py-1 transition-colors font-body ${
                item.level === 3 ? 'text-xs pl-5' : 'text-sm'
              } ${
                activeId === item.id
                  ? 'bg-library-gold/20 text-library-wood font-medium'
                  : 'text-library-bronze hover:bg-library-gold/10 hover:text-library-wood'
              }`}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <Layout>
      {progress > 0 && (
        <div
          aria-hidden
          className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-library-gold transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="font-body text-library-bronze hover:text-library-wood">
            <Link to={bookId ? `/livros/${bookId}` : '/livros'}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Catálogo
            </Link>
          </Button>
        </div>

        <div className="flex items-start gap-3 mb-2 max-w-3xl">
          <BookOpen className="h-6 w-6 text-library-gold mt-1 shrink-0" />
          <h1 className="font-heading text-3xl md:text-4xl text-library-wood">{data.title}</h1>
        </div>

        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-body mb-8 md:ml-9">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            ~{parsed.minutes} min de leitura
          </span>
          <span className="flex items-center gap-1.5 text-library-bronze/80">
            <BookMarked className="h-3.5 w-3.5" />
            Selecione uma palavra para ver o significado
          </span>
        </p>

        <div className="lg:flex lg:gap-8 lg:items-start lg:max-w-none">
          {parsed.toc.length > 1 && (
            <nav
              aria-label="Índice da obra"
              className="hidden lg:block w-64 shrink-0 sticky top-6"
            >
              <Card className="bg-card/95 backdrop-blur-sm border-library-bronze parchment-bg shadow-book">
                <CardContent className="p-4">{indexNav}</CardContent>
              </Card>
            </nav>
          )}

          <div className="min-w-0 flex-1" ref={contentRef}>
            {parsed.provenance && (
              <div className="prose prose-sm max-w-none mb-8 p-4 rounded-lg bg-library-parchment/60 border border-library-bronze/30 text-library-bronze">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{parsed.provenance}</ReactMarkdown>
              </div>
            )}

            {parsed.toc.length > 1 && (
              <details className="lg:hidden mb-6 rounded-lg border border-library-bronze bg-card/95 parchment-bg px-4 py-3">
                <summary className="cursor-pointer font-display text-sm font-semibold text-library-wood select-none">
                  Índice da obra
                </summary>
                <div className="pt-3">{indexNav}</div>
              </details>
            )}

            <Card className="bg-card/95 backdrop-blur-sm border-library-bronze shadow-book parchment-bg">
              <CardContent className="p-6 md:p-10">
                <article className="prose prose-lg max-w-none font-reading prose-headings:font-heading prose-headings:text-library-wood prose-a:text-library-bronze prose-blockquote:border-library-bronze prose-blockquote:font-body prose-strong:text-library-wood">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {parsed.content}
                  </ReactMarkdown>
                </article>
              </CardContent>
            </Card>
          </div>
        </div>

        {glossaryQuery && (
          <GlossaryPopover
            word={glossaryQuery.word}
            anchor={glossaryQuery.anchor}
            onClose={() => setGlossaryQuery(null)}
          />
        )}
      </div>
    </Layout>
  );
}
