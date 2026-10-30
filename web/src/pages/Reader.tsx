import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Eraser, Languages, List, Loader2, Minimize2, ScrollText, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { EdicaoFicha } from '@/components/reader/EdicaoFicha';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode, TouchEvent as ReactTouchEvent } from 'react';
import { useBookText, useBook } from '@/hooks/useDatabase';
import { useSpeech } from '@/hooks/useSpeech';
import { limparCallouts, splitProvenance } from '@/utils/readerText';
import { agruparCapitulosCurtos, splitIntoChapters } from '@/utils/chapters';
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
import { QuoteCardDialog } from '@/components/reader/QuoteCardDialog';
import { ReaderSelectionMenu } from '@/components/reader/ReaderSelectionMenu';
import { AcademicCitationDialog } from '@/components/reader/AcademicCitationDialog';
import { ReaderPanel } from '@/components/reader/ReaderPanel';
import { deleteHighlight, getBookHighlights, saveHighlight } from '@/utils/readingNotes';
import { acharTrecho } from '@/utils/destaquesDom';
import { ReadingSettingsPanel } from '@/components/reader/ReadingSettingsPanel';
import { ReaderBar, type PaletaBarra } from '@/components/reader/ReaderBar';
import { FootnoteRef } from '@/components/reader/FootnoteRef';
import { ALTURA_LINHA, LARGURA_CH, normalizarAjustes, type ReadingSettings } from '@/utils/readingSettings';
import { idDaNota, notasDoCapitulo } from '@/utils/footnotes';
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
  // Leitura imersiva (decisão de 2026-10-30): é o padrão ao abrir uma obra.
  // Some o cabeçalho/rodapé do site e o cartão; Esc ou o botão sai.
  const [foco, setFoco] = useState(true);
  // no modo imersivo, o topo só aparece com movimento do mouse, toque ou foco de teclado
  const [atividade, setAtividade] = useState(true);
  // barra flutuante: no celular, tocar no meio do texto mostra/esconde
  const [barraVisivel, setBarraVisivel] = useState(true);
  // ficha da edição: modal, para não tirar a pessoa da leitura imersiva
  const [fichaOpen, setFichaOpen] = useState(false);
  // sobe a cada grifo salvo ou apagado, para repintar os destaques
  const [destaquesV, setDestaquesV] = useState(0);
  // grifos achados na página (para clicar num trecho grifado e poder removê-lo)
  const destaquesNaTela = useRef<{ id: string; range: Range }[]>([]);
  const [removerDestaque, setRemoverDestaque] = useState<{ id: string; x: number; y: number } | null>(null);
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
      // converte ajustes antigos (fontSize em 4 níveis) e descarta lixo
      return normalizarAjustes(saved ? JSON.parse(saved) : null);
    } catch {
      return normalizarAjustes(null);
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
  const [selectionMenu, setSelectionMenu] = useState<{
    text: string;
    normalizedWord: string | null;
    wordCount: number;
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
    const chapters = agruparCapitulosCurtos(splitIntoChapters(content));
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

  // Quanto do topo da tela fica coberto: o cabeçalho do site (sticky, uma
  // linha no celular e duas no desktop; some no modo foco).
  const topObstruction = () => document.querySelector('header')?.getBoundingClientRect().height ?? 0;

  // Altura da página: a tela menos o topo coberto, o respiro do cartão e a
  // faixa da barra flutuante (~72px, embaixo).
  const [pageHeight, setPageHeight] = useState(480);
  // duas páginas lado a lado em telas largas (decisão de 2026-09-29)
  const [telaLarga, setTelaLarga] = useState(false);
  const textoCarregado = Boolean(data);
  useEffect(() => {
    const compute = () => {
      const respiroCartao = window.innerWidth >= 768 ? 32 : 16;
      // topo compacto do leitor (título e, em tradução por IA, o aviso): a
      // página tem de caber abaixo dele sem rolar, senão a barra flutuante
      // cobre o fim do texto (medido: 30–47px em 2026-09-29). Some no foco.
      const topoLeitor = [...document.querySelectorAll<HTMLElement>('[data-leitor-topo]')].reduce(
        (soma, el) => soma + el.getBoundingClientRect().height + parseFloat(getComputedStyle(el).marginBottom || '0'),
        0,
      );
      // imersivo: sem cartão; reserva 48px no topo (o topo transparente
      // aparece por cima dele) e 72px embaixo para a barra flutuante
      setPageHeight(
        foco
          ? Math.max(288, window.innerHeight - 48 - 72)
          : Math.max(288, window.innerHeight - topObstruction() - topoLeitor - 12 - 2 * respiroCartao - 88),
      );
      setTelaLarga(window.innerWidth >= 1280);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [foco, textoCarregado]);

  // Imersivo: mostra o topo ao mexer o mouse, tocar ou usar o teclado; some após 2,5 s parado
  useEffect(() => {
    if (!foco) return;
    let t: ReturnType<typeof setTimeout>;
    const acordar = () => {
      setAtividade(true);
      clearTimeout(t);
      t = setTimeout(() => setAtividade(false), 2500);
    };
    acordar();
    const eventos = ['mousemove', 'pointerdown', 'keydown', 'focusin'] as const;
    eventos.forEach(ev => window.addEventListener(ev, acordar, { passive: true }));
    return () => {
      clearTimeout(t);
      eventos.forEach(ev => window.removeEventListener(ev, acordar));
    };
  }, [foco]);

  // Modo foco: classe no body (o CSS esconde cabeçalho e rodapé) e Esc sai
  useEffect(() => {
    document.body.classList.toggle('leitura-foco', foco);
    if (!foco) return () => document.body.classList.remove('leitura-foco');
    const onKey = (e: KeyboardEvent) => {
      // com um modal ou painel aberto, o Esc fecha só ele
      if (e.key === 'Escape' && !e.defaultPrevented && !document.querySelector('[role="dialog"]')) setFoco(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('leitura-foco');
    };
  }, [foco]);

  // Ao virar a página, alinha o topo da área de leitura logo abaixo do que
  // cobre a tela (a pessoa pode ter rolado para ver a ficha acima).
  const keepReaderInView = useCallback(() => {
    // alinha o CARTÃO (com a borda), não o texto dentro dele
    const el = contentRef.current ?? readerTopRef.current;
    if (!el) return;
    const wanted = topObstruction() + 12;
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

  // Repinta os trechos grifados (API CSS Custom Highlight; sem suporte, o grifo só fica salvo)
  useEffect(() => {
    const f = () => setDestaquesV(v => v + 1);
    window.addEventListener('scriptorium:destaques', f);
    return () => window.removeEventListener('scriptorium:destaques', f);
  }, []);
  useEffect(() => {
    const css = (typeof CSS !== 'undefined' ? CSS : undefined) as unknown as { highlights?: Map<string, unknown> } | undefined;
    const Destaque = (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    const raiz = contentRef.current;
    if (!css?.highlights || !Destaque || !raiz || !data?.slug) return;
    const achados = getBookHighlights(data.slug)
      .map(h => ({ id: h.id, range: acharTrecho(raiz, h.text) }))
      .filter((h): h is { id: string; range: Range } => h.range !== null);
    destaquesNaTela.current = achados;
    css.highlights.set('destaque-usuario', new Destaque(...achados.map(h => h.range)));
    return () => {
      destaquesNaTela.current = [];
      css.highlights?.delete('destaque-usuario');
    };
  }, [data?.slug, capituloAtual?.id, destaquesV, paged, telaLarga, readingSettings.paginas, readingSettings.escala, readingSettings.fontFamily]);

  // O pill "Remover destaque" fecha ao clicar fora, rolar, virar a página ou apertar Esc
  useEffect(() => {
    if (!removerDestaque) return;
    const fechar = () => setRemoverDestaque(null);
    const fora = (e: Event) => {
      if (!(e.target as HTMLElement).closest('[data-remover-destaque]')) fechar();
    };
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && fechar();
    document.addEventListener('pointerdown', fora);
    document.addEventListener('keydown', tecla);
    window.addEventListener('scroll', fechar, true);
    return () => {
      document.removeEventListener('pointerdown', fora);
      document.removeEventListener('keydown', tecla);
      window.removeEventListener('scroll', fechar, true);
    };
  }, [removerDestaque]);
  useEffect(() => setRemoverDestaque(null), [pos.chapter, pos.page]);

  const handleHighlightSelection = () => {
    if (!selectionMenu || !data) return;
    saveHighlight({
      bookSlug: data.slug,
      text: selectionMenu.text,
      color: 'gold',
    });
    toast.success('Trecho grifado e salvo em suas anotações!');
    setSelectionMenu(null);
    window.getSelection()?.removeAllRanges();
  };

  useEffect(() => {
    const toc = parsed?.toc ?? [];
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
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
  const indiceDisponivel = (parsed?.toc.length ?? 0) > 1;
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
      } else if ((e.key === 'i' || e.key === 'I') && indiceDisponivel) {
        e.preventDefault();
        setDrawerOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paged, modalOpen, goNext, goPrev, indiceDisponivel]);

  useEffect(() => {
    setGlossaryQuery(null);
    setSelectionMenu(null);
    stopSpeech();
  }, [bookId, stopSpeech]);

  useEffect(() => {
    const onSelectEnd = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        return;
      }
      const container = contentRef.current;
      if (!container || !container.contains(sel.anchorNode)) return;

      const raw = sel.toString();
      if (!raw || !raw.trim()) return;

      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (!rect.width && !rect.height) return;
      const anchor = { top: rect.top, bottom: rect.bottom, left: rect.left };

      const trimmed = raw.trim();
      const wordCount = trimmed.split(/\s+/).length;
      const norm = wordCount === 1 ? normalizeWord(trimmed) : null;

      if (trimmed.length <= 1500) {
        setSelectionMenu({
          text: raw,
          normalizedWord: norm,
          wordCount,
          anchor,
        });
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
  const articleClass = `prose prose-lg prose-leitor max-w-none capitular-medieval ${paged ? '' : 'leitor-abertura'} ${fontClassFor(readingSettings.fontFamily)} prose-headings:font-heading prose-blockquote:border-library-bronze prose-blockquote:font-body prose-a:underline`;
  // tamanho e espaçamento vêm do painel Aa (escala em passos finos)
  const estiloTexto = { fontSize: `${1.125 * readingSettings.escala}rem`, lineHeight: ALTURA_LINHA[readingSettings.lineHeight] };
  const colunas: 1 | 2 = paged && readingSettings.paginas === 'auto' && telaLarga ? 2 : 1;

  // notas de rodapé do capítulo, para abrir em balão (ver FootnoteRef)
  const notas = capituloAtual ? notasDoCapitulo(capituloAtual.body) : new Map<string, string>();
  const componentes = {
    ...markdownComponents,
    a: ({ href, children, node: _node, ...rest }: { href?: string; children?: ReactNode; node?: unknown }) => {
      const id = idDaNota(href);
      if (id) return <FootnoteRef href={href} nota={notas.get(id)}>{children}</FootnoteRef>;
      return <a href={href} {...rest}>{children}</a>;
    },
  };
  const markdown = capituloAtual ? (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      // rótulos das notas em português (o padrão do remark-gfm é "Footnotes")
      remarkRehypeOptions={{ footnoteLabel: 'Notas', footnoteBackLabel: 'Voltar ao texto' }}
      components={componentes}
    >
      {limparCallouts(capituloAtual.body)}
    </ReactMarkdown>
  ) : null;
  const shownPage = pos.page === LAST_PAGE ? pagesInChapter - 1 : pos.page;

  // tempo que falta: fração do texto já lido (capítulos anteriores + parte do atual) sobre o total
  const minutosRestantes = (() => {
    if (!parsed || !paged) return null;
    const total = parsed.chapters.reduce((n, c) => n + c.body.length, 0);
    if (total === 0) return null;
    const antes = parsed.chapters.slice(0, capAtivo).reduce((n, c) => n + c.body.length, 0);
    const atual = (capituloAtual?.body.length ?? 0) * (Math.max(1, shownPage + 1) / Math.max(1, pagesInChapter));
    const falta = Math.max(0, 1 - (antes + atual) / total);
    return Math.max(1, Math.round(parsed.minutes * falta));
  })();

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

  // No celular, tocar no meio do texto mostra/esconde a barra (não em link,
  // botão, nota, nem ao terminar de selecionar texto para grifar).
  const onToqueTexto = (e: React.MouseEvent) => {
    if (window.innerWidth >= 768) return;
    if (!window.getSelection()?.isCollapsed) return;
    if ((e.target as HTMLElement).closest('a, button, input')) return;
    setBarraVisivel(v => !v);
  };

  const irParaFicha = () => setFichaOpen(true);

  // Clicar num trecho grifado oferece removê-lo; fora disso, no celular, alterna a barra
  const onCliqueNoTexto = (e: React.MouseEvent) => {
    if (window.getSelection()?.isCollapsed && !(e.target as HTMLElement).closest('a, button, input')) {
      const alvo = destaquesNaTela.current.find(({ range }) =>
        Array.from(range.getClientRects()).some(
          r => e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom,
        ),
      );
      if (alvo) {
        setRemoverDestaque({ id: alvo.id, x: e.clientX, y: e.clientY });
        return;
      }
    }
    onToqueTexto(e);
  };
  const traducaoIA = bookDetails?.translationIsAi ?? /intelig[êe]ncia artificial/i.test(parsed.provenance ?? '');

  const indexNav = (
    <>
      <ul className="space-y-1 pr-1">
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
              {item.text.replace(/[*_`]/g, '')}
            </button>
          </li>
        ))}
      </ul>
    </>
  );

  // A barra flutuante e o cartão seguem o tema do LEITOR; com as cores do
  // SITE, "Página 1 de 2" ficava claro sobre claro (site escuro + leitor
  // Claro/Sépia): 1,0–2,2:1, medido em 2026-09-29. Pergaminho segue o site.
  const paleta: PaletaBarra = {
    parchment: {
      fundo: 'bg-card/95 border-library-bronze/60',
      texto: 'text-library-wood-foreground',
      suave: 'text-muted-foreground',
      botao: 'text-library-wood-foreground hover:bg-library-gold/20',
    },
    light: {
      fundo: 'bg-white/95 border-gray-300',
      texto: 'text-gray-900',
      suave: 'text-gray-600',
      botao: 'text-gray-900 hover:bg-gray-100',
    },
    sepia: {
      fundo: 'bg-[#efe3c8]/95 border-[#cdb994]',
      texto: 'text-[#4a3b2c]',
      suave: 'text-[#6b5846]',
      botao: 'text-[#4a3b2c] hover:bg-[#e6d6b3]',
    },
    dark: {
      fundo: 'bg-[#26201d]/95 border-[#5a4a42]',
      texto: 'text-[#e5dcd3]',
      suave: 'text-[#bfb3a8]',
      botao: 'text-[#e5dcd3] hover:bg-[#332a26]',
    },
  }[readingSettings.theme];

  // imersivo: o tema vira o fundo da tela inteira, sem cartão
  const fundoImersivo = {
    parchment: 'reader-parchment parchment-bg bg-background text-foreground',
    light: 'bg-white text-gray-900',
    dark: 'reader-theme-dark bg-[#1a1614] text-[#e5dcd3]',
    sepia: 'bg-[#f4ecd8] text-[#4a3b2c]',
  }[readingSettings.theme];

  const themeClasses = {
    parchment: 'reader-parchment bg-card/95 parchment-bg border-library-bronze text-foreground',
    light: 'bg-white border-gray-200 text-gray-900 shadow-md',
    dark: 'reader-theme-dark bg-[#1a1614] border-[#382e2b] text-[#e5dcd3] shadow-xl',
    sepia: 'bg-[#f4ecd8] border-[#dfd0b5] text-[#4a3b2c] shadow-md',
  }[readingSettings.theme];

  // largura do cartão: coluna em caracteres (1 página / Rolagem) ou livro
  // aberto (2 páginas); `ch` na fonte do texto, por isso o fontSize no cartão
  const larguraCartao =
    colunas === 2
      ? `min(100%, calc(${2 * LARGURA_CH[readingSettings.largura]}ch + 3rem + ${foco ? '7rem' : '4rem'}))`
      : `min(100%, calc(${LARGURA_CH[readingSettings.largura]}ch + ${foco ? '7rem' : '4rem'}))`;

  const irCapitulo = (i: number) => {
    setPos({ chapter: Math.min(totalCapitulos - 1, Math.max(0, i)), page: 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      {progress > 0 && (
        <div
          aria-hidden
          className="fixed top-0 left-0 right-0 z-[60] h-1 bg-gradient-to-r from-library-gold via-library-vinho to-library-gold transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      )}

      <div
        className={
          foco
            ? `fixed inset-0 z-40 overflow-y-auto overflow-x-hidden ${fundoImersivo}`
            : 'container mx-auto px-3 sm:px-4 pt-3 pb-28'
        }
      >
        {foco && (
          <div
            className={`fixed top-0 inset-x-0 z-50 flex h-11 items-center gap-2 px-3 sm:px-5 text-sm font-body transition-opacity duration-300 ${paleta.fundo} border-0 border-b backdrop-blur-md ${paleta.texto} ${
              atividade ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Button asChild variant="ghost" size="sm" className={`shrink-0 h-8 px-2 ${paleta.botao}`}>
              <Link to={backToBook} aria-label="Voltar ao Catálogo">
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Voltar</span>
              </Link>
            </Button>
            <h1 className="min-w-0 truncate font-heading text-base">{data.title}</h1>
            {traducaoIA && (
              <button type="button" onClick={irParaFicha} className={`hidden md:inline-flex items-center gap-1 text-xs underline underline-offset-2 ${paleta.suave}`}>
                <Sparkles className="h-3 w-3" />
                Tradução por IA · detalhes
              </button>
            )}
            {bookDetails?.relatedEditionSlug && (
              <Link
                to={`/ler/${bookDetails.relatedEditionSlug}`}
                title={bookDetails.language === 'Inglês' ? 'Alternar para Edição em Português' : 'Alternar para Edição Original em Inglês'}
                className={`ml-auto inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs ${paleta.botao}`}
              >
                <Languages className="h-3.5 w-3.5" />
                {bookDetails.language === 'Inglês' ? 'Ler em PT' : 'Ler em EN'}
              </Link>
            )}
            <button
              type="button"
              onClick={() => setFoco(false)}
              className={`${bookDetails?.relatedEditionSlug ? '' : 'ml-auto'} inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs ${paleta.botao}`}
              aria-label="Sair da leitura imersiva"
            >
              <Minimize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        )}

        {/* Topo compacto: voltar, título e, em tradução por IA, o aviso */}
        {!foco && (<>
        <div data-leitor-topo className="mb-3 flex items-center gap-2 min-w-0">
          <Button asChild variant="ghost" size="sm" className="shrink-0 font-body text-library-bronze-foreground hover:text-library-wood-foreground">
            {/* nome acessível fixo; contém o texto visível nos dois tamanhos (WCAG 2.5.3) */}
            <Link to={backToBook} aria-label="Voltar ao Catálogo">
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Voltar</span>
            </Link>
          </Button>
          <h1 className="min-w-0 truncate font-heading text-lg md:text-2xl text-library-wood-foreground">{data.title}</h1>
          {bookDetails?.relatedEditionSlug && (
            <Button asChild variant="outline" size="sm" className="ml-auto h-7 px-2.5 text-xs border-library-gold/40 text-library-wood hover:bg-library-gold/15 font-body">
              <Link to={`/ler/${bookDetails.relatedEditionSlug}`} title={bookDetails.language === 'Inglês' ? 'Alternar para Edição em Português' : 'Alternar para Edição Original em Inglês'}>
                <Languages className="h-3.5 w-3.5 mr-1.5 text-library-gold" />
                <span>{bookDetails.language === 'Inglês' ? 'Ler em PT' : 'Ler em EN'}</span>
              </Link>
            </Button>
          )}
          <span className={bookDetails?.relatedEditionSlug ? "hidden lg:flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground font-body" : "ml-auto hidden md:flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground font-body"}>
            <Clock className="h-3.5 w-3.5 text-library-gold" />~{parsed.minutes} min
          </span>
        </div>
        {traducaoIA && (
          <p data-leitor-topo className="mb-3 flex items-center gap-1.5 text-xs font-body text-library-bronze-foreground">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            Tradução gerada por inteligência artificial.{' '}
            <button type="button" onClick={irParaFicha} className="underline underline-offset-2 hover:text-library-wood-foreground">
              Ver detalhes
            </button>
          </p>
        )}
        </>)}

        <div ref={contentRef} className="mx-auto" style={{ width: larguraCartao, fontSize: estiloTexto.fontSize }}>
          <Card className={foco ? 'border-0 shadow-none rounded-none bg-transparent text-inherit' : `transition-colors duration-200 ${themeClasses}`}>
            <CardContent className={foco ? `px-5 md:px-14 pt-12 ${paged ? 'pb-0' : 'pb-32'}` : 'p-4 md:p-8'} onClick={onCliqueNoTexto}>
              {paged ? (
                <div
                  ref={readerTopRef}
                  tabIndex={-1}
                  aria-label="Página do texto"
                  className="outline-none"
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  <PagedArticle
                    key={`${capituloAtual?.id}|${colunas}`}
                    page={pos.page}
                    onPagesChange={n => handlePagesChange(n, capAtivo)}
                    onPageRequest={handlePageRequest}
                    targetId={targetId}
                    onTargetResolved={handleTargetResolved}
                    measureKey={`${capituloAtual?.id}|${readingSettings.escala}|${readingSettings.fontFamily}|${readingSettings.lineHeight}|${readingSettings.largura}|${colunas}`}
                    height={pageHeight}
                    colunas={colunas}
                    viewportClassName="leitor-abertura"
                    className={articleClass}
                  >
                    <div style={{ lineHeight: estiloTexto.lineHeight }}>{markdown}</div>
                  </PagedArticle>
                </div>
              ) : (
                <article key={capituloAtual?.id} className={articleClass} style={{ lineHeight: estiloTexto.lineHeight }}>
                  {markdown}
                </article>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dados da obra: abaixo do leitor, fora do texto (decisão de 2026-09-29).
            Os blocos técnicos vêm do banco; o ensaio de abertura do arquivo fica
            recolhido enquanto for tradução por IA sem aprovação humana (EdicaoFicha). */}
        <Dialog open={fichaOpen} onOpenChange={setFichaOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border-library-bronze bg-library-parchment-surface p-0">
            <DialogTitle className="sr-only">Sobre esta edição</DialogTitle>
            <DialogDescription className="sr-only">Origem da obra, tradução, revisão e licença</DialogDescription>
            <EdicaoFicha
              book={bookDetails}
              contexto={parsed.provenance ? parsed.provenance.replace(/^#\s*Proveniência[^\n]*\n?/i, '') : null}
              linkObra={backToBook}
              emModal
            />
          </DialogContent>
        </Dialog>

        {removerDestaque && (
          <div
            data-remover-destaque
            className={`fixed z-[65] -translate-x-1/2 rounded-full border shadow-xl backdrop-blur-md p-1 ${paleta.fundo}`}
            style={{ left: Math.min(Math.max(removerDestaque.x, 90), window.innerWidth - 90), top: removerDestaque.y + 16 }}
          >
            <button
              type="button"
              autoFocus
              onClick={() => {
                deleteHighlight(removerDestaque.id);
                setRemoverDestaque(null);
                toast.success('Destaque removido.');
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-xs ${paleta.botao}`}
            >
              <Eraser className="h-3.5 w-3.5" />
              Remover destaque
            </button>
          </div>
        )}

        {foco && paged && (
          <>
            {([
              { lado: 'left-0', rotulo: 'Página anterior', ok: Boolean(prevPosition(pos)), ir: goPrev, Icone: ChevronLeft },
              { lado: 'right-0', rotulo: 'Próxima página', ok: Boolean(nextPosition(pos, pagesInChapter, totalCapitulos)), ir: goNext, Icone: ChevronRight },
            ] as const).map(({ lado, rotulo, ok, ir, Icone }) => (
              <button
                key={lado}
                type="button"
                tabIndex={-1}
                aria-label={rotulo}
                disabled={!ok}
                onClick={ir}
                className={`fixed ${lado} top-12 bottom-20 z-30 hidden w-12 items-center justify-center opacity-0 transition-opacity hover:opacity-70 disabled:pointer-events-none md:flex ${paleta.texto}`}
              >
                <Icone className="h-7 w-7" />
              </button>
            ))}
          </>
        )}

        <ReaderBar
          paleta={paleta}
          visivel={barraVisivel}
          status={paged ? `Página ${Math.max(1, shownPage + 1)} de ${pagesInChapter}` : `Capítulo ${capAtivo + 1} de ${totalCapitulos}`}
          statusCurto={paged ? `${Math.max(1, shownPage + 1)}/${pagesInChapter}` : `${capAtivo + 1}/${totalCapitulos}`}
          detalhe={
            paged && totalCapitulos > 1
              ? `Capítulo ${capAtivo + 1} de ${totalCapitulos}${capituloAtual && capituloAtual.id !== 'inicio' ? ` · ${capituloAtual.title}` : ''}${minutosRestantes !== null ? ` · ~${minutosRestantes} min restantes` : ''}`
              : undefined
          }
          rotuloVoltar={paged ? 'Página anterior' : 'Capítulo anterior'}
          rotuloAvancar={paged ? 'Próxima página' : 'Próximo capítulo'}
          podeVoltar={paged ? Boolean(prevPosition(pos)) : capAtivo > 0}
          podeAvancar={paged ? Boolean(nextPosition(pos, pagesInChapter, totalCapitulos)) : capAtivo < totalCapitulos - 1}
          onVoltar={paged ? goPrev : () => irCapitulo(capAtivo - 1)}
          onAvancar={paged ? goNext : () => irCapitulo(capAtivo + 1)}
          ajustes={<ReadingSettingsPanel settings={readingSettings} onChange={handleSettingsChange} />}
          onIndice={() => (parsed.toc.length > 1 ? setDrawerOpen(true) : setNotesOpen(true))}
          onInfo={irParaFicha}
          foco={foco}
          onFoco={() => setFoco(f => !f)}
          onCitar={() => setCitationOpen(true)}
          audio={
            ttsSupported
              ? {
                  status: ttsStatus,
                  onOuvir: () => {
                    stopSpeech();
                    startSpeech(markdownToSpeechText(parsed.content));
                  },
                  onPausar: pauseSpeech,
                  onContinuar: resumeSpeech,
                  onParar: stopSpeech,
                }
              : undefined
          }
        />

        <ReaderPanel
          open={drawerOpen || notesOpen}
          aba={notesOpen ? 'destaques' : 'indice'}
          onAba={aba => {
            setDrawerOpen(aba === 'indice');
            setNotesOpen(aba === 'destaques');
          }}
          onOpenChange={aberto => {
            if (!aberto) {
              setDrawerOpen(false);
              setNotesOpen(false);
            }
          }}
          titulo={data.title}
          bookSlug={data.slug}
          indice={parsed.toc.length > 1 ? indexNav : undefined}
          onCloseAutoFocus={onDrawerCloseAutoFocus}
        />

        {glossaryQuery && (
          <GlossaryPopover
            word={glossaryQuery.word}
            anchor={glossaryQuery.anchor}
            onClose={() => setGlossaryQuery(null)}
          />
        )}

        {selectionMenu && !cardOpen && (
          <ReaderSelectionMenu
            text={selectionMenu.text}
            normalizedWord={selectionMenu.normalizedWord}
            wordCount={selectionMenu.wordCount}
            anchor={selectionMenu.anchor}
            onOpenGlossary={(word, anchor) => {
              setSelectionMenu(null);
              setGlossaryQuery({ word, anchor });
            }}
            onCreateCard={() => {
              setCardOpen(true);
            }}
            onHighlight={handleHighlightSelection}
            onClose={() => setSelectionMenu(null)}
          />
        )}

        {selectionMenu && (
          <QuoteCardDialog
            open={cardOpen}
            quote={selectionMenu.text}
            slug={data?.slug}
            fallbackTitle={data?.title ?? 'Scriptorium Divinum'}
            onClose={() => {
              setCardOpen(false);
              setSelectionMenu(null);
              window.getSelection()?.removeAllRanges();
            }}
          />
        )}

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

      </div>
    </Layout>
  );
}
