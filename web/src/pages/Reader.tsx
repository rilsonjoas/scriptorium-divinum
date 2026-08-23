import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BookMarked, BookOpen, Clock, List, Loader2, Pause, Play, ScrollText, Square, Volume2, GraduationCap, Bookmark } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useBookText, useBook } from '@/hooks/useDatabase';
import { useSpeech } from '@/hooks/useSpeech';
import { splitProvenance } from '@/utils/readerText';
import { normalizeWord } from '@/utils/glossario';
import { GlossaryPopover } from '@/components/reader/GlossaryPopover';
import { QuoteCardDialog, QuoteTriggerPill } from '@/components/reader/QuoteCardDialog';
import { AcademicCitationDialog } from '@/components/reader/AcademicCitationDialog';
import { NotesDrawer } from '@/components/reader/NotesDrawer';
import { saveHighlight } from '@/utils/readingNotes';
import { ReadingToolbar, DEFAULT_READING_SETTINGS, type ReadingSettings } from '@/components/reader/ReadingToolbar';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { markdownToSpeechText } from '@/utils/speech';
import { toast } from 'sonner';
import {
  getReadingProgress,
  removeReadingProgress,
  saveReadingProgress,
  shouldResume,
} from '@/utils/readingProgress';

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
    <h1 id={slugify(headingText(children))} className={`${headingClass} text-2xl md:text-3xl mt-10 mb-4 first:mt-0`}>
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 id={slugify(headingText(children))} className={`${headingClass} text-xl md:text-2xl mt-10 mb-4`}>
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 id={slugify(headingText(children))} className={`${headingClass} text-lg md:text-xl mt-8 mb-3`}>
      {children}
    </h3>
  ),
};

export default function Reader() {
  const { bookId } = useParams<{ bookId: string }>();
  const { data, isLoading, error } = useBookText(bookId || '');
  const { data: bookDetails } = useBook(bookId || '');
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [citationOpen, setCitationOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const restoredRef = useRef(false);
  const lastSavedRatio = useRef(0);

  // Reading Preferences State with LocalStorage
  const [readingSettings, setReadingSettings] = useState<ReadingSettings>(() => {
    try {
      const saved = localStorage.getItem('scriptorium_reading_settings');
      return saved ? JSON.parse(saved) : DEFAULT_READING_SETTINGS;
    } catch {
      return DEFAULT_READING_SETTINGS;
    }
  });

  const handleSettingsChange = (newSettings: ReadingSettings) => {
    setReadingSettings(newSettings);
    try {
      localStorage.setItem('scriptorium_reading_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save reading settings', e);
    }
  };

  const [glossaryQuery, setGlossaryQuery] = useState<{
    word: string;
    anchor: { top: number; bottom: number; left: number };
  } | null>(null);
  const [cardSelection, setCardSelection] = useState<{
    text: string;
    anchor: { top: number; bottom: number; left: number };
  } | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const {
    supported: ttsSupported,
    status: ttsStatus,
    start: startSpeech,
    pause: pauseSpeech,
    resume: resumeSpeech,
    stop: stopSpeech,
  } = useSpeech();

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

  const handleHighlightSelection = () => {
    if (!cardSelection || !data) return;
    saveHighlight({
      bookSlug: data.slug,
      text: cardSelection.text,
      color: 'gold',
    });
    toast.success('Trecho grifado e salvo em suas anotações!');
    setCardSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  useEffect(() => {
    const toc = parsed?.toc ?? [];
    const slug = data?.slug;
    let raf = 0;

    if (slug && !restoredRef.current) {
      restoredRef.current = true;
      const saved = getReadingProgress(slug);
      if (saved) {
        lastSavedRatio.current = saved.ratio;
        if (shouldResume(saved.ratio)) {
          requestAnimationFrame(() => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - doc.clientHeight;
            if (max > 0) window.scrollTo({ top: max * saved.ratio });
          });
        } else if (saved.ratio >= 0.95) {
          removeReadingProgress(slug);
        }
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const currentProgress = max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0;
        setProgress(currentProgress);
        setShowStickyHeader(doc.scrollTop > 200);

        if (slug && data && max > 0) {
          const ratio = doc.scrollTop / max;
          if (Math.abs(ratio - lastSavedRatio.current) >= 0.01) {
            lastSavedRatio.current = ratio;
            saveReadingProgress({ slug, title: data.title, ratio });
          }
        }

        if (toc.length === 0) return;
        let current: string | null = null;
        for (const item of toc) {
          const el = document.getElementById(item.id);
          if (el && el.getBoundingClientRect().top <= 120) current = item.id;
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
  }, [parsed, data]);

  useEffect(() => {
    setGlossaryQuery(null);
    setCardSelection(null);
    stopSpeech();
  }, [bookId, stopSpeech]);

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
      if (!word) return;

      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (!rect.width && !rect.height) return;
      const anchor = { top: rect.top, bottom: rect.bottom, left: rect.left };

      const wordCount = raw.trim().split(/\s+/).length;
      if (wordCount >= 2 && raw.trim().length <= 800) {
        setGlossaryQuery(null);
        setCardSelection({ text: raw, anchor });
        return;
      }
      if (!/\s/.test(word)) {
        setCardSelection(null);
        setGlossaryQuery({ word, anchor });
      }
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
    setDrawerOpen(false);
  };

  const indexNav = (
    <>
      <p className="flex items-center gap-2 font-display text-sm font-semibold text-library-wood mb-3">
        <List className="h-4 w-4 text-library-bronze" />
        Índice da Obra
      </p>
      <ul className="space-y-1 max-h-[65vh] overflow-y-auto pr-1">
        {parsed.toc.map(item => (
          <li key={`${item.id}-${item.level}`}>
            <button
              onClick={() => goToSection(item.id)}
              aria-current={activeId === item.id ? 'true' : undefined}
              className={`w-full text-left rounded-md px-2 py-1.5 transition-colors font-body ${
                item.level === 3 ? 'text-xs pl-5' : 'text-sm'
              } ${
                activeId === item.id
                  ? 'bg-library-gold/20 text-library-wood font-semibold'
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

  // Dynamic Theme Styling
  const themeClasses = {
    parchment: 'bg-card/95 parchment-bg border-library-bronze text-foreground',
    light: 'bg-white border-gray-200 text-gray-900 shadow-md',
    dark: 'bg-[#1a1614] border-[#382e2b] text-[#e5dcd3] shadow-xl',
    sepia: 'bg-[#f4ecd8] border-[#dfd0b5] text-[#4a3b2c] shadow-md',
  }[readingSettings.theme];

  const fontClass = {
    reading: 'font-reading',
    serif: 'font-serif',
    sans: 'font-sans',
  }[readingSettings.fontFamily];

  const fontSizeClass = {
    sm: 'text-base leading-relaxed',
    md: 'text-lg leading-relaxed',
    lg: 'text-xl leading-loose',
    xl: 'text-2xl leading-loose',
  }[readingSettings.fontSize];

  return (
    <Layout>
      {/* Top Reading Progress Bar com Gradiente Dourado-Carmesim */}
      {progress > 0 && (
        <div
          aria-hidden
          className="fixed top-0 left-0 right-0 z-[60] h-1.5 bg-gradient-to-r from-library-gold via-library-crimson to-library-gold transition-[width] duration-150 shadow-golden"
          style={{ width: `${progress}%` }}
        />
      )}

      {/* Floating / Sticky Compact Reader Toolbar */}
      {showStickyHeader && (
        <div className="fixed top-14 left-0 right-0 z-30 bg-library-wood/95 backdrop-blur-md border-b border-library-bronze text-library-parchment shadow-md transition-all duration-300 py-2 px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <BookOpen className="h-4 w-4 text-library-gold shrink-0" />
            <span className="font-display text-sm font-semibold truncate text-library-gold">
              {data.title}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-library-gold hover:bg-library-gold/20 text-xs hidden md:inline-flex"
              onClick={() => setCitationOpen(true)}
            >
              <GraduationCap className="h-3.5 w-3.5 mr-1" />
              Citar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-library-gold hover:bg-library-gold/20 text-xs hidden md:inline-flex"
              onClick={() => setNotesOpen(true)}
            >
              <Bookmark className="h-3.5 w-3.5 mr-1" />
              Anotações
            </Button>
            <span className="text-xs text-library-gold/80 font-body hidden sm:inline">
              {Math.round(progress)}% lido
            </span>
            {parsed.toc.length > 1 && (
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-library-gold hover:bg-library-gold/20">
                    <List className="h-4 w-4 mr-1" />
                    <span className="text-xs">Índice</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-library-parchment border-library-bronze p-6">
                  <DrawerHeader className="text-left pb-2 border-b border-library-bronze/30">
                    <DrawerTitle className="font-display text-lg text-library-wood">
                      {data.title}
                    </DrawerTitle>
                  </DrawerHeader>
                  <div className="py-4">{indexNav}</div>
                </DrawerContent>
              </Drawer>
            )}
            <ReadingToolbar settings={readingSettings} onChangeSettings={handleSettingsChange} />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="font-body text-library-bronze hover:text-library-wood">
            <Link to={bookId ? `/livros/${bookId}` : '/livros'}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Catálogo
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            {/* Como Citar Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 font-body text-xs border-library-bronze text-library-wood hover:bg-library-gold/20"
              onClick={() => setCitationOpen(true)}
            >
              <GraduationCap className="h-3.5 w-3.5 mr-1 text-library-gold" />
              Como Citar
            </Button>

            {/* Minhas Anotações Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 font-body text-xs border-library-bronze text-library-wood hover:bg-library-gold/20"
              onClick={() => setNotesOpen(true)}
            >
              <Bookmark className="h-3.5 w-3.5 mr-1 text-library-gold" />
              Anotações
            </Button>

            {/* Mobile TOC Drawer Trigger */}
            {parsed.toc.length > 1 && (
              <div className="lg:hidden">
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 px-2.5 font-body text-xs border-library-bronze text-library-wood">
                      <List className="h-3.5 w-3.5 mr-1 text-library-gold" />
                      Índice
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="bg-library-parchment border-library-bronze p-6">
                    <DrawerHeader className="text-left pb-2 border-b border-library-bronze/30">
                      <DrawerTitle className="font-display text-lg text-library-wood">
                        {data.title}
                      </DrawerTitle>
                    </DrawerHeader>
                    <div className="py-4">{indexNav}</div>
                  </DrawerContent>
                </Drawer>
              </div>
            )}

            {/* Reading Settings Popover */}
            <ReadingToolbar settings={readingSettings} onChangeSettings={handleSettingsChange} />
          </div>
        </div>

        {/* Header Title Section */}
        <div className="flex items-start gap-3 mb-3 max-w-3xl mx-auto lg:mx-0">
          <BookOpen className="h-6 w-6 text-library-gold mt-1 shrink-0" />
          <h1 className="font-heading text-2xl md:text-4xl text-library-wood leading-tight">{data.title}</h1>
        </div>

        <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-muted-foreground font-body mb-8 max-w-3xl mx-auto lg:mx-0 md:ml-9">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-library-gold" />
            ~{parsed.minutes} min de leitura
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-library-bronze/80">
            <BookMarked className="h-3.5 w-3.5" />
            Selecione uma frase para grifar ou criar card
          </span>
          {ttsSupported && (
            <span className="flex items-center gap-1">
              {ttsStatus === 'idle' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 font-body text-library-bronze hover:text-library-wood text-xs"
                  onClick={() => startSpeech(markdownToSpeechText(parsed.content))}
                >
                  <Volume2 className="h-3.5 w-3.5 mr-1" />
                  Ouvir
                </Button>
              )}
              {ttsStatus === 'playing' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 font-body text-library-bronze hover:text-library-wood text-xs"
                    onClick={pauseSpeech}
                  >
                    <Pause className="h-3.5 w-3.5 mr-1" />
                    Pausar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 font-body text-library-bronze hover:text-library-wood text-xs"
                    onClick={stopSpeech}
                  >
                    <Square className="h-3 w-3 mr-1" />
                    Parar
                  </Button>
                </>
              )}
              {ttsStatus === 'paused' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 font-body text-library-bronze hover:text-library-wood text-xs"
                    onClick={resumeSpeech}
                  >
                    <Play className="h-3.5 w-3.5 mr-1" />
                    Continuar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 font-body text-library-bronze hover:text-library-wood text-xs"
                    onClick={stopSpeech}
                  >
                    <Square className="h-3 w-3 mr-1" />
                    Parar
                  </Button>
                </>
              )}
            </span>
          )}
        </p>

        {/* Reader Layout (Desktop TOC + Main Article Container) */}
        <div className="lg:flex lg:gap-8 lg:items-start">
          {/* Desktop Sidebar TOC */}
          {parsed.toc.length > 1 && (
            <nav
              aria-label="Índice da obra"
              className="hidden lg:block w-64 shrink-0 sticky top-20"
            >
              <Card className="bg-card/95 backdrop-blur-sm border-library-bronze parchment-bg shadow-book">
                <CardContent className="p-4">{indexNav}</CardContent>
              </Card>
            </nav>
          )}

          {/* Main Content Area capped with max-w-prose */}
          <div className="min-w-0 flex-1 max-w-prose mx-auto" ref={contentRef}>
            {parsed.provenance && (
              <div className="prose prose-sm max-w-none mb-8 p-4 rounded-lg bg-library-parchment/60 border border-library-bronze/30 text-library-bronze">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{parsed.provenance}</ReactMarkdown>
              </div>
            )}

            <Card className={`transition-all duration-200 ${themeClasses}`}>
              <CardContent className="p-5 md:p-10">
                <article className={`prose prose-lg max-w-none capitular-medieval ${fontClass} ${fontSizeClass} prose-headings:font-heading prose-headings:text-library-wood prose-a:text-library-bronze prose-blockquote:border-library-bronze prose-blockquote:font-body prose-strong:text-library-wood`}>
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

        {cardSelection && !cardOpen && (
          <QuoteTriggerPill
            anchor={cardSelection.anchor}
            onClick={() => setCardOpen(true)}
            onHighlight={handleHighlightSelection}
            onClose={() => setCardSelection(null)}
          />
        )}

        {cardSelection && (
          <QuoteCardDialog
            open={cardOpen}
            quote={cardSelection.text}
            slug={data?.slug}
            fallbackTitle={data?.title ?? 'Scriptorium Divinum'}
            onClose={() => {
              setCardOpen(false);
              setCardSelection(null);
              window.getSelection()?.removeAllRanges();
            }}
          />
        )}

        {/* Academic Citation Dialog */}
        <AcademicCitationDialog
          open={citationOpen}
          onOpenChange={setCitationOpen}
          title={data.title}
          author={bookDetails?.author?.name || 'Autor Clássico'}
          publicationYear={bookDetails?.publicationYearOriginal}
          slug={data.slug}
          provenance={parsed.provenance}
          content={parsed.content}
        />

        {/* Notes & Highlights Drawer */}
        <NotesDrawer
          open={notesOpen}
          onOpenChange={setNotesOpen}
          bookSlug={data.slug}
          bookTitle={data.title}
        />
      </div>
    </Layout>
  );
}
