import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BookMarked, BookOpen, ChevronLeft, ChevronRight, Clock, List, Loader2, Pause, Play, ScrollText, Square, Volume2, GraduationCap, Bookmark } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode, TouchEvent as ReactTouchEvent } from 'react';
import { useBookText, useBook } from '@/hooks/useDatabase';
import { useSpeech } from '@/hooks/useSpeech';
import { splitProvenance } from '@/utils/readerText';
import { splitIntoChapters } from '@/utils/chapters';
import {
  assignChapters,
  bookRatio,
  nextPosition,
  pageFromFraction,
  positionFromRatio,
  prevPosition,
  LAST_PAGE,
  type ReaderPosition,
} from '@/utils/pagination';
import { PagedArticle } from '@/components/reader/PagedArticle';
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
import { bookPath } from '@/lib/bookRoutes';
import { usePageTitle } from '@/hooks/usePageTitle';
import {
  getReadingProgress,
  isFinished,
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

const fontClassFor = (family: ReadingSettings['fontFamily']) =>
  ({ reading: 'font-reading', serif: 'font-serif', sans: 'font-sans' })[family];

const fontSizeClassFor = (size: ReadingSettings['fontSize']) =>
  ({
    sm: 'text-base leading-relaxed',
    md: 'text-lg leading-relaxed',
    lg: 'text-xl leading-loose',
    xl: 'text-2xl leading-loose',
  })[size];

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
  usePageTitle(bookDetails?.title ?? "Leitura");
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [citationOpen, setCitationOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const restoredRef = useRef(false);
  const lastSavedRatio = useRef(0);

  // Link de volta para a ficha, sempre na URL canônica (slug).
  // Prioridade: metadados da obra → slug que o próprio texto devolve →
  // o param da URL. O último é o que mantém o link funcionando se a
  // ficha falhar ao carregar, e o primeiro é o que canonicaliza quem
  // chegou por um link antigo com UUID.
  const backToBook =
    bookDetails || bookId
      ? bookPath({ slug: bookDetails?.slug ?? data?.slug, id: bookId || '' })
      : '/livros';

  // Reading Preferences State with LocalStorage
  const [readingSettings, setReadingSettings] = useState<ReadingSettings>(() => {
    try {
      const saved = localStorage.getItem('scriptorium_reading_settings');
      // mescla com o padrão: configurações salvas antes de existir `layout` não o têm
      return saved ? { ...DEFAULT_READING_SETTINGS, ...JSON.parse(saved) } : DEFAULT_READING_SETTINGS;
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
    const chapters = splitIntoChapters(content);
    return {
      provenance,
      content,
      // F2/Bloco B: a obra é segmentada em capítulos e só o capítulo
      // ativo é entregue ao react-markdown. Sem isso, Confissões
      // (~579KB de markdown) travava ~23s na primeira pintura.
      chapters,
      toc: assignChapters(extractToc(content), chapters, slugify),
      minutes: readingMinutes(content),
    };
  }, [data]);

  // Posição de leitura: capítulo (Bloco B) e, no modo Páginas, página dentro dele
  const [pos, setPos] = useState<ReaderPosition>({ chapter: 0, page: 0 });
  // páginas medidas, com o capítulo a que pertencem (medição velha não vale)
  const [measured, setMeasured] = useState({ chapter: -1, pages: 1 });
  // título do índice a abrir depois que o capítulo dele for renderizado
  const [targetId, setTargetId] = useState<string | null>(null);
  // posição a retomar (leitura salva): aplicada quando o capítulo certo for
  // medido. Guarda o capítulo porque o capítulo aberto antes da retomada
  // também é medido e não pode consumi-la.
  const pendingResume = useRef<{ chapter: number; fraction: number } | null>(null);
  const readerTopRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    setPos({ chapter: 0, page: 0 });
    restoredRef.current = false;
  }, [bookId]);

  const capAtivo = pos.chapter;
  const pagesInChapter = measured.chapter === capAtivo ? measured.pages : 1;
  const capituloAtual = parsed?.chapters[capAtivo];
  const totalCapitulos = parsed?.chapters.length ?? 0;
  const paged = readingSettings.layout === 'pages';

  const persistRatio = useCallback(
    (ratio: number) => {
      // durante a retomada a posição ainda não é a da pessoa: não sobrescrever
      if (pendingResume.current) return;
      setProgress(ratio * 100);
      if (!data?.slug) return;
      // limiar fino: numa obra de 126 capítulos, um capítulo inteiro é 0,8%
      // da obra; com o limiar antigo (1%) virar de capítulo às vezes não salvava
      if (Math.abs(ratio - lastSavedRatio.current) >= 0.001) {
        lastSavedRatio.current = ratio;
        saveReadingProgress({ slug: data.slug, title: data.title, ratio });
      }
    },
    [data],
  );

  // Retoma a leitura salva. O progresso é da obra inteira (capítulo + posição
  // dentro dele); antes era só a rolagem do capítulo aberto, e a retomada
  // sempre caía no capítulo 1.
  useEffect(() => {
    const slug = data?.slug;
    if (!slug || totalCapitulos === 0 || restoredRef.current) return;
    restoredRef.current = true;
    const saved = getReadingProgress(slug);
    if (!saved) return;
    lastSavedRatio.current = saved.ratio;
    if (shouldResume(saved.ratio)) {
      const { chapter, fraction } = positionFromRatio(saved.ratio, totalCapitulos);
      pendingResume.current = { chapter, fraction };
      setProgress(saved.ratio * 100);
      setPos({ chapter, page: 0 });
    } else if (isFinished(saved.ratio)) {
      removeReadingProgress(slug);
    }
  }, [data, totalCapitulos]);

  // Modo Páginas: o progresso anda com a página
  useEffect(() => {
    if (!paged || totalCapitulos === 0 || pos.page === LAST_PAGE) return;
    persistRatio(bookRatio(pos, pagesInChapter, totalCapitulos));
  }, [paged, pos, pagesInChapter, totalCapitulos, persistRatio]);

  // `measuredChapter`: de qual capítulo é a medição. A medição do capítulo
  // anterior pode chegar depois que a posição já mudou (o `prev` do updater já
  // vê o capítulo novo), e não pode ser tomada como sendo do novo.
  const handlePagesChange = useCallback((n: number, measuredChapter: number) => {
    setMeasured({ chapter: measuredChapter, pages: n });
    setPos(prev => {
      if (measuredChapter !== prev.chapter) return prev;
      const resume = pendingResume.current;
      if (resume && resume.chapter === measuredChapter) {
        pendingResume.current = null;
        return { ...prev, page: pageFromFraction(resume.fraction, n) };
      }
      if (prev.page === LAST_PAGE || prev.page > n - 1) return { ...prev, page: n - 1 };
      return prev;
    });
  }, []);

  const handlePageRequest = useCallback((page: number) => {
    setPos(prev => (prev.page === page ? prev : { ...prev, page }));
  }, []);

  const handleTargetResolved = useCallback(() => setTargetId(null), []);

  // Quanto do topo da tela fica coberto: o cabeçalho do site (sticky, com
  // uma linha no celular e duas no desktop) e a barra compacta do leitor
  // (fixed, top-14, ~44px), que aparece depois de rolar.
  const topObstruction = () => {
    const header = document.querySelector('header');
    return Math.max(header?.getBoundingClientRect().height ?? 64, 56 + 44);
  };

  // Altura da página: o que sobra da tela depois do topo coberto, da barra
  // de navegação (‹ página ›, ~84px) e do respiro do cartão.
  const [pageHeight, setPageHeight] = useState(480);
  useEffect(() => {
    const compute = () => {
      const cardPadding = window.innerWidth >= 768 ? 40 : 20;
      setPageHeight(Math.max(288, window.innerHeight - topObstruction() - 84 - cardPadding - 16));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Ao virar a página, alinha o topo da área de leitura logo abaixo do que
  // cobre a tela (a pessoa pode ter rolado para ver a ficha acima).
  const keepReaderInView = useCallback(() => {
    const el = readerTopRef.current;
    if (!el) return;
    const wanted = topObstruction() + 8;
    const top = el.getBoundingClientRect().top;
    if (Math.abs(top - wanted) > 4) {
      window.scrollTo({ top: top + window.scrollY - wanted, behavior: 'smooth' });
    }
  }, []);

  // Ao fechar, o drawer do índice devolve o foco ao botão "Índice", no topo
  // da página, e o navegador rola até ele, desfazendo o alinhamento. Quando o
  // fechamento veio de uma escolha no índice, o foco vai para a área de
  // leitura (onde a pessoa quer estar) e a página é alinhada.
  const alignAfterDrawer = useRef(false);
  const onDrawerCloseAutoFocus = useCallback(
    (e: Event) => {
      if (!alignAfterDrawer.current) return;
      alignAfterDrawer.current = false;
      e.preventDefault();
      readerTopRef.current?.focus({ preventScroll: true });
      keepReaderInView();
    },
    [keepReaderInView],
  );

  const goNext = useCallback(() => {
    const next = nextPosition(pos, pagesInChapter, totalCapitulos);
    if (!next) return;
    setPos(next);
    keepReaderInView();
  }, [pos, pagesInChapter, totalCapitulos, keepReaderInView]);

  const goPrev = useCallback(() => {
    const prev = prevPosition(pos);
    if (!prev) return;
    setPos(prev);
    keepReaderInView();
  }, [pos, keepReaderInView]);

  // Modo Rolagem: abre o título escolhido no índice depois que o capítulo dele renderiza
  useEffect(() => {
    if (paged || !targetId) return;
    const raf = requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTargetId(null);
    });
    return () => cancelAnimationFrame(raf);
  }, [paged, targetId, capAtivo]);

  // Modo Rolagem: retoma a posição salva dentro do capítulo
  useEffect(() => {
    const resume = pendingResume.current;
    if (paged || !resume || resume.chapter !== capAtivo) return;
    const fraction = resume.fraction;
    pendingResume.current = null;
    const raf = requestAnimationFrame(() => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max > 0) window.scrollTo({ top: max * fraction });
    });
    return () => cancelAnimationFrame(raf);
  }, [paged, capAtivo]);

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
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        setShowStickyHeader(doc.scrollTop > 200);
        // no modo Páginas o progresso anda com a página, não com a rolagem
        if (paged) return;

        const max = doc.scrollHeight - doc.clientHeight;
        if (totalCapitulos > 0 && max > 0) {
          persistRatio((capAtivo + Math.min(1, doc.scrollTop / max)) / totalCapitulos);
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
  }, [parsed, paged, capAtivo, totalCapitulos, persistRatio]);

  // Modo Páginas: o item ativo do índice é o capítulo aberto
  useEffect(() => {
    if (paged && capituloAtual) setActiveId(slugify(capituloAtual.title));
  }, [paged, capituloAtual]);

  // Modo Páginas: setas e Page Up/Down viram a página
  const modalOpen = drawerOpen || citationOpen || notesOpen || cardOpen;
  useEffect(() => {
    if (!paged) return;
    const onKey = (e: KeyboardEvent) => {
      if (modalOpen || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paged, modalOpen, goNext, goPrev]);

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
            <Button asChild variant="ghost" size="sm" className="font-body text-library-bronze-foreground hover:text-library-wood-foreground">
              <Link to={backToBook}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Catálogo
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-library-gold mr-3" />
            <span className="font-body text-library-bronze-foreground text-lg">Preparando a leitura...</span>
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
            <Button asChild variant="ghost" size="sm" className="font-body text-library-bronze-foreground hover:text-library-wood-foreground">
              <Link to={backToBook}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Catálogo
              </Link>
            </Button>
          </div>
          <Card className="bg-card/95 backdrop-blur-sm border-library-bronze shadow-book parchment-bg">
            <CardContent className="p-10 text-center">
              <ScrollText className="h-12 w-12 text-library-bronze-foreground mx-auto mb-4" />
              <h1 className="font-heading text-2xl text-library-wood-foreground mb-2">Conteúdo indisponível</h1>
              <p className="font-body text-library-bronze-foreground">
                O texto desta obra ainda não está disponível no leitor online.
                Você pode encontrar os formatos para download na página da obra.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // O índice lista a obra inteira, mas só o capítulo aberto está na página:
  // abre o capítulo do título e depois vai até ele.
  const goToSection = (id: string, idx: number) => {
    if (idx < 0) {
      setDrawerOpen(false);
      return;
    }
    if (idx === capAtivo && !paged) {
      setDrawerOpen(false);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setPos({ chapter: idx, page: 0 });
    setTargetId(id);
    if (paged) {
      // o drawer do índice (celular) restaura a rolagem ao fechar; alinhar
      // só depois, senão o ajuste é desfeito
      if (drawerOpen) alignAfterDrawer.current = true;
      else keepReaderInView();
    }
    setDrawerOpen(false);
  };

  // `leitor-abertura` anima com fill-mode `both`, e o transform final da
  // animação anularia o deslocamento das páginas; no modo Páginas ela vai no
  // contêiner da página (PagedArticle), não no artigo.
  const articleClass = `prose prose-lg prose-leitor max-w-none capitular-medieval ${paged ? '' : 'leitor-abertura'} ${fontClassFor(readingSettings.fontFamily)} ${fontSizeClassFor(readingSettings.fontSize)} prose-headings:font-heading prose-blockquote:border-library-bronze prose-blockquote:font-body prose-a:underline`;
  const markdown = capituloAtual ? (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {capituloAtual.body}
    </ReactMarkdown>
  ) : null;
  const shownPage = pos.page === LAST_PAGE ? pagesInChapter - 1 : pos.page;

  // Deslizar o dedo vira a página (só com gesto claramente horizontal e sem
  // texto selecionado, para não brigar com grifar/criar card).
  const onTouchStart = (e: ReactTouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (!window.getSelection()?.isCollapsed) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  const indexNav = (
    <>
      <p className="flex items-center gap-2 font-display-sm text-sm font-semibold text-library-wood-foreground mb-3">
        <List className="h-4 w-4 text-library-bronze-foreground" />
        Índice da Obra
      </p>
      <ul className="space-y-1 max-h-[65vh] overflow-y-auto pr-1">
        {parsed.toc.map((item, i) => (
          <li key={`${i}-${item.id}`}>
            <button
              onClick={() => goToSection(item.id, item.chapter)}
              aria-current={activeId === item.id ? 'true' : undefined}
              className={`w-full text-left rounded-md px-2 py-1.5 transition-colors font-body ${
                item.level === 3 ? 'text-xs pl-5' : 'text-sm'
              } ${
                activeId === item.id
                  ? 'bg-library-gold/20 text-library-wood-foreground font-semibold'
                  : 'text-library-bronze-foreground hover:bg-library-gold/10 hover:text-library-wood-foreground'
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
    dark: 'reader-theme-dark bg-[#1a1614] border-[#382e2b] text-[#e5dcd3] shadow-xl',
    sepia: 'bg-[#f4ecd8] border-[#dfd0b5] text-[#4a3b2c] shadow-md',
  }[readingSettings.theme];


  return (
    <Layout>
      {/* Top Reading Progress Bar com Gradiente Dourado-Carmesim */}
      {progress > 0 && (
        <div
          aria-hidden
          className="fixed top-0 left-0 right-0 z-[60] h-1.5 bg-gradient-to-r from-library-gold via-library-vinho to-library-gold transition-[width] duration-150 shadow-golden"
          style={{ width: `${progress}%` }}
        />
      )}

      {/* Floating / Sticky Compact Reader Toolbar */}
      {showStickyHeader && (
        <div className="fixed top-14 left-0 right-0 z-30 bg-library-wood/95 backdrop-blur-md border-b border-library-bronze text-library-parchment shadow-md transition-all duration-300 py-2 px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <BookOpen className="h-4 w-4 text-library-gold shrink-0" />
            <span className="font-display-sm text-sm font-semibold truncate text-library-gold">
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
                <DrawerContent className="bg-library-parchment-surface border-library-bronze p-6" onCloseAutoFocus={onDrawerCloseAutoFocus}>
                  <DrawerHeader className="text-left pb-2 border-b border-library-bronze/30">
                    <DrawerTitle className="font-display text-lg text-library-wood-foreground">
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
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="font-body text-library-bronze-foreground hover:text-library-wood-foreground">
            {/* nome acessível fixo; contém o texto visível nos dois tamanhos (WCAG 2.5.3) */}
            <Link to={backToBook} aria-label="Voltar ao Catálogo">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {/* rótulo curto no celular: a fileira precisa caber em 360px */}
              <span className="hidden sm:inline">Voltar ao Catálogo</span>
              <span className="sm:hidden">Voltar</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            {/* Como Citar Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 font-body text-xs border-library-bronze text-library-wood-foreground hover:bg-library-gold/20"
              onClick={() => setCitationOpen(true)}
              aria-label="Como citar esta obra"
            >
              <GraduationCap className="h-3.5 w-3.5 sm:mr-1 text-library-gold" />
              <span className="hidden sm:inline">Como Citar</span>
            </Button>

            {/* Minhas Anotações Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 font-body text-xs border-library-bronze text-library-wood-foreground hover:bg-library-gold/20"
              onClick={() => setNotesOpen(true)}
              aria-label="Anotações"
            >
              <Bookmark className="h-3.5 w-3.5 sm:mr-1 text-library-gold" />
              <span className="hidden sm:inline">Anotações</span>
            </Button>

            {/* Mobile TOC Drawer Trigger */}
            {parsed.toc.length > 1 && (
              <div className="lg:hidden">
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="sm" aria-label="Índice" className="h-8 px-2.5 font-body text-xs border-library-bronze text-library-wood-foreground">
                      <List className="h-3.5 w-3.5 sm:mr-1 text-library-gold" />
                      <span className="hidden sm:inline">Índice</span>
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="bg-library-parchment-surface border-library-bronze p-6" onCloseAutoFocus={onDrawerCloseAutoFocus}>
                    <DrawerHeader className="text-left pb-2 border-b border-library-bronze/30">
                      <DrawerTitle className="font-display text-lg text-library-wood-foreground">
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
          <h1 className="font-heading text-2xl md:text-4xl text-library-wood-foreground leading-tight">{data.title}</h1>
        </div>

        <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-muted-foreground font-body mb-8 max-w-3xl mx-auto lg:mx-0 md:ml-9">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-library-gold" />
            ~{parsed.minutes} min de leitura
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-library-bronze-foreground/80">
            <BookMarked className="h-3.5 w-3.5" />
            Selecione uma frase para grifar ou criar card
          </span>
          {ttsSupported && (
            <div className="flex items-center gap-1.5 bg-library-wood text-library-gold px-3 py-1 rounded-full shadow-sm border border-library-bronze/40">
              <Volume2 className="h-3.5 w-3.5 text-library-gold shrink-0" />
              <span className="text-xs font-semibold font-body text-library-gold mr-1">Áudio</span>
              {ttsStatus === 'idle' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-library-gold hover:bg-library-gold/20 font-body rounded-full"
                  onClick={() => startSpeech(markdownToSpeechText(parsed.content))}
                  aria-label="Ouvir texto com síntese de voz"
                >
                  <Play className="h-3 w-3 mr-1 fill-library-gold" />
                  Ouvir
                </Button>
              )}
              {ttsStatus === 'unavailable' && (
                <>
                  <span className="text-[11px] font-body text-library-gold/90 px-1" role="status">
                    Sem voz instalada
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-library-gold hover:bg-library-gold/20 font-body rounded-full"
                    onClick={() => {
                      stopSpeech();
                      startSpeech(markdownToSpeechText(parsed.content));
                    }}
                    aria-label="Tentar ouvir novamente"
                  >
                    <Play className="h-3 w-3 mr-1 fill-library-gold" />
                    Tentar
                  </Button>
                </>
              )}
              {ttsStatus === 'playing' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-library-gold hover:bg-library-gold/20 font-body rounded-full"
                    onClick={pauseSpeech}
                    aria-label="Pausar áudio"
                  >
                    <Pause className="h-3 w-3 mr-1 fill-library-gold" />
                    Pausar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-library-gold hover:bg-library-gold/20 font-body rounded-full"
                    onClick={stopSpeech}
                    aria-label="Parar áudio"
                  >
                    <Square className="h-3 w-3 mr-1 fill-library-gold" />
                    Parar
                  </Button>
                </>
              )}
              {ttsStatus === 'paused' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-library-gold hover:bg-library-gold/20 font-body rounded-full"
                    onClick={resumeSpeech}
                    aria-label="Continuar áudio"
                  >
                    <Play className="h-3 w-3 mr-1 fill-library-gold" />
                    Continuar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-library-gold hover:bg-library-gold/20 font-body rounded-full"
                    onClick={stopSpeech}
                    aria-label="Parar áudio"
                  >
                    <Square className="h-3 w-3 mr-1 fill-library-gold" />
                    Parar
                  </Button>
                </>
              )}
            </div>
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

          {/* Main Content Area capped with max-w-prose-reading (65ch) */}
          <div className="min-w-0 flex-1 max-w-prose-reading mx-auto" ref={contentRef}>
            {parsed.provenance && (
              <div className="prose prose-sm prose-leitor max-w-none mb-8 p-4 rounded-lg bg-library-parchment-surface/60 border border-library-bronze/30 text-library-bronze-foreground">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{parsed.provenance}</ReactMarkdown>
              </div>
            )}

            <Card className={`transition-all duration-200 ${themeClasses}`}>
              <CardContent className="p-5 md:p-10">
                {paged ? (
                  <>
                    <div
                      ref={readerTopRef}
                      tabIndex={-1}
                      aria-label="Página do texto"
                      className="outline-none"
                      onTouchStart={onTouchStart}
                      onTouchEnd={onTouchEnd}
                    >
                      <PagedArticle
                        key={capituloAtual?.id}
                        page={pos.page}
                        onPagesChange={n => handlePagesChange(n, capAtivo)}
                        onPageRequest={handlePageRequest}
                        targetId={targetId}
                        onTargetResolved={handleTargetResolved}
                        measureKey={`${capituloAtual?.id}|${readingSettings.fontSize}|${readingSettings.fontFamily}`}
                        height={pageHeight}
                        viewportClassName="leitor-abertura"
                        className={articleClass}
                      >
                        {markdown}
                      </PagedArticle>
                    </div>

                    <nav
                      aria-label="Navegação entre páginas"
                      className="mt-4 pt-4 border-t border-library-bronze/40 flex items-center justify-between gap-3"
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={!prevPosition(pos)}
                        onClick={goPrev}
                        aria-label="Página anterior"
                        className="h-11 w-11 shrink-0 border-library-bronze/60"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>

                      <p aria-live="polite" className="min-w-0 text-center font-body">
                        <span className="block text-sm text-library-wood-foreground">
                          Página {Math.max(1, shownPage + 1)} de {pagesInChapter}
                        </span>
                        {totalCapitulos > 1 && (
                          <span className="block truncate text-xs text-muted-foreground">
                            Capítulo {capAtivo + 1} de {totalCapitulos}
                            {capituloAtual && capituloAtual.id !== 'inicio' ? ` · ${capituloAtual.title}` : ''}
                          </span>
                        )}
                      </p>

                      <Button
                        variant="outline"
                        size="icon"
                        disabled={!nextPosition(pos, pagesInChapter, totalCapitulos)}
                        onClick={goNext}
                        aria-label="Próxima página"
                        className="h-11 w-11 shrink-0 border-library-bronze/60"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </nav>
                  </>
                ) : (
                <>
                <article key={capituloAtual?.id} className={articleClass}>
                  {markdown}
                </article>

                {totalCapitulos > 1 && (
                  <nav
                    aria-label="Navegação entre capítulos"
                    className="mt-10 pt-6 border-t border-library-bronze/40 flex items-center justify-between gap-4"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={capAtivo === 0}
                      onClick={() => {
                        setPos({ chapter: Math.max(0, capAtivo - 1), page: 0 });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="border-library-bronze/60 font-body"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>

                    <span className="font-body text-xs text-muted-foreground">
                      Capítulo {capAtivo + 1} de {totalCapitulos}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={capAtivo >= totalCapitulos - 1}
                      onClick={() => {
                        setPos({ chapter: Math.min(totalCapitulos - 1, capAtivo + 1), page: 0 });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="border-library-bronze/60 font-body"
                    >
                      Próximo
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </nav>
                )}
                </>
                )}
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
