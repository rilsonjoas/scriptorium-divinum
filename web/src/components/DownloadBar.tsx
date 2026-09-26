import { useMemo } from 'react';
import { BookOpen, Download, FileText, FileType2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadMarkdownFile, generateObsidianMarkdown } from '@/utils/exportMarkdown';
import { downloadTxtFile, generateCleanTxt } from '@/utils/exportTxt';
import { buildEpub, downloadEpubFile } from '@/utils/exportEpub';

export interface DownloadLink {
  format: string;
  url: string;
  source?: string | null;
}

interface DownloadBarProps {
  title: string;
  author: string;
  slug?: string;
  provenance?: string | null;
  publicationYear?: string | number;
  /** texto completo da obra, quando disponível no cliente (para gerar .md/.txt/.epub) */
  content?: string | null;
  /** links hospedados (pdf, epub de origem...) vindos do banco */
  downloadLinks?: DownloadLink[];
  className?: string;
}

const FORMAT_LABEL: Record<string, string> = {
  pdf: 'PDF',
  epub: 'ePub',
  txt: 'TXT',
  md: 'Markdown',
  markdown: 'Markdown',
};

/**
 * Downloads de primeira classe.
 *
 * Bloco B (2026-09-25): os formatos gerados no cliente (.md, .txt,
 * .epub) viviam escondidos dentro do diálogo "Como Citar" — lugar
 * illogical, porque quem quer baixar não está citando. Aqui eles ficam
 * ao lado dos links hospedados, com o PDF quando existe, na mesma
 * barra, com rótulo e ícone padronizados.
 */
export function DownloadBar({
  title,
  author,
  slug,
  provenance,
  publicationYear,
  content,
  downloadLinks,
  className,
}: DownloadBarProps) {
  // links hospedados, sem duplicar formato que geramos no cliente
  const hospedados = useMemo(
    () =>
      (downloadLinks ?? []).filter((l) => {
        const f = l.format.toLowerCase();
        // pdf e formatos exóticos ficam; epub/txt/md hosting saem
        // porque geramos localmente e o hospedado quase sempre e um
        // link de origem, nao o arquivo final
        return f === 'pdf';
      }),
    [downloadLinks],
  );

  const temGeravel = Boolean(content && content.trim());
  if (!hospedados.length && !temGeravel) return null;

  const base = slug || 'obra';

  return (
    <section
      aria-label="Baixar a obra"
      className={
        className ??
        'rounded-lg border border-library-bronze/50 bg-card/60 p-4 space-y-3'
      }
    >
      <h3 className="font-display text-base font-semibold text-library-wood-foreground flex items-center gap-2">
        <Download className="h-4 w-4 text-library-bronze-foreground" />
        Baixar a obra
      </h3>

      <div className="flex flex-wrap gap-2">
        {hospedados.map((link, i) => (
          <Button key={`${link.url}-${i}`} asChild variant="outline" size="sm" className="border-library-bronze/60 font-body">
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <FileType2 className="h-3.5 w-3.5 mr-1 text-library-bronze-foreground" />
              {FORMAT_LABEL[link.format.toLowerCase()] ?? link.format.toUpperCase()}
              {link.source ? ` · ${link.source}` : ''}
            </a>
          </Button>
        ))}

        {temGeravel && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="border-library-bronze/60 font-body"
              onClick={() => {
                const epub = buildEpub({ title, author, content: content!, slug, provenance, publicationYear });
                downloadEpubFile(`${base}-scriptorium.epub`, epub);
              }}
            >
              <BookOpen className="h-3.5 w-3.5 mr-1 text-library-bronze-foreground" />
              ePub
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-library-bronze/60 font-body"
              onClick={() => {
                const txt = generateCleanTxt({ title, author, content: content!, slug, provenance, publicationYear });
                downloadTxtFile(`${base}-scriptorium.txt`, txt);
              }}
            >
              <FileText className="h-3.5 w-3.5 mr-1 text-library-bronze-foreground" />
              TXT
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-library-bronze/60 font-body"
              onClick={() => {
                const md = generateObsidianMarkdown({ title, author, content: content!, slug, provenance, publicationYear });
                downloadMarkdownFile(`${base}-scriptorium.md`, md);
              }}
            >
              <Download className="h-3.5 w-3.5 mr-1 text-library-bronze-foreground" />
              Markdown
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
