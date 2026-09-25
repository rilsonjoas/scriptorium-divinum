import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Copy, Quote, GraduationCap, Download, FileText, BookOpen } from 'lucide-react';
import { generateObsidianMarkdown, downloadMarkdownFile } from '@/utils/exportMarkdown';
import { generateCleanTxt, downloadTxtFile } from '@/utils/exportTxt';
import { buildEpub, downloadEpubFile } from '@/utils/exportEpub';

interface AcademicCitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  author: string;
  translator?: string;
  publicationYear?: string | number;
  slug?: string;
  provenance?: string;
  content?: string;
}

export function AcademicCitationDialog({
  open,
  onOpenChange,
  title,
  author,
  translator,
  publicationYear,
  slug,
  provenance,
  content,
}: AcademicCitationDialogProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const accessDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const fullUrl = slug
    ? `https://scriptoriumdivinum.com/ler/${slug}`
    : 'https://scriptoriumdivinum.com';

  // Format Author Name for ABNT (LASTNAME, Firstname)
  const formatAbntAuthor = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].toUpperCase();
    const last = parts.pop()!;
    return `${last.toUpperCase()}, ${parts.join(' ')}`;
  };

  const abntAuthor = formatAbntAuthor(author);
  const translatorText = translator ? ` Tradução de ${translator}.` : '';
  const yearText = publicationYear ? ` (${publicationYear}).` : '';

  const citations = {
    abnt: `${abntAuthor}. ${title}.${yearText}${translatorText} Scriptorium Divinum - Biblioteca Teológica Clássica, ${currentYear}. Disponível em: <${fullUrl}>. Acesso em: ${accessDate}.`,
    chicago: `${author}. ${title}.${translator ? ` Traduzido por ${translator}.` : ''} Scriptorium Divinum, ${currentYear}. ${fullUrl}.`,
    apa: `${author}. (${publicationYear || currentYear}). ${title}${translator ? ` (Trad. ${translator})` : ''}. Scriptorium Divinum. ${fullUrl}`,
    bibtex: `@online{${slug || 'obra'}_scriptorium,
  author = {${author}},
  title = {${title}},
  year = {${publicationYear || currentYear}},
  publisher = {Scriptorium Divinum},
  url = {${fullUrl}},
  urldate = {${new Date().toISOString().split('T')[0]}}
}`,
  };

  const handleCopy = (text: string, formatKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatKey);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleExportObsidian = () => {
    if (!content) return;
    const md = generateObsidianMarkdown({
      title,
      author,
      content,
      slug,
      provenance,
      publicationYear,
    });
    downloadMarkdownFile(`${slug || 'obra'}-scriptorium.md`, md);
  };

  const handleExportTxt = () => {
    if (!content) return;
    const txt = generateCleanTxt({
      title,
      author,
      content,
      slug,
      provenance,
      publicationYear,
    });
    downloadTxtFile(`${slug || 'obra'}-scriptorium.txt`, txt);
  };

  const handleExportEpub = () => {
    if (!content) return;
    const epub = buildEpub({
      title,
      author,
      content,
      slug,
      provenance,
      publicationYear,
    });
    downloadEpubFile(`${slug || 'obra'}-scriptorium.epub`, epub);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-library-parchment-surface border-library-bronze text-foreground p-6 shadow-2xl">
        <DialogHeader className="border-b border-library-bronze/30 pb-4">
          <DialogTitle className="font-display text-xl text-library-wood-foreground flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-library-gold" />
            Citação Acadêmica & Exportação
          </DialogTitle>
          <DialogDescription className="font-body text-xs text-library-bronze-foreground">
            Referências formatadas para artigos acadêmicos, trabalhos teológicos e monografias.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-5">
          <Tabs defaultValue="abnt" className="w-full">
            <TabsList className="grid grid-cols-4 bg-library-wood/10 border border-library-bronze/30 p-1 font-body text-xs">
              <TabsTrigger value="abnt" className="data-[state=active]:bg-library-wood data-[state=active]:text-library-gold">
                ABNT NBR 6023
              </TabsTrigger>
              <TabsTrigger value="chicago" className="data-[state=active]:bg-library-wood data-[state=active]:text-library-gold">
                Chicago 17th
              </TabsTrigger>
              <TabsTrigger value="apa" className="data-[state=active]:bg-library-wood data-[state=active]:text-library-gold">
                APA 7th
              </TabsTrigger>
              <TabsTrigger value="bibtex" className="data-[state=active]:bg-library-wood data-[state=active]:text-library-gold">
                BibTeX
              </TabsTrigger>
            </TabsList>

            {Object.entries(citations).map(([key, text]) => (
              <TabsContent key={key} value={key} className="mt-4">
                <div className="relative bg-card/80 p-4 rounded-lg border border-library-bronze/40 font-body text-sm text-library-wood-foreground leading-relaxed">
                  <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm select-all">{text}</pre>
                  <Button
                    size="sm"
                    className="absolute top-2 right-2 h-7 px-2.5 gap-1 bg-library-wood hover:bg-library-bronze text-library-gold font-body text-xs"
                    onClick={() => handleCopy(text, key)}
                  >
                    {copiedFormat === key ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Export to Obsidian Option */}
          {content && (
            <div className="pt-4 border-t border-library-bronze/30 space-y-3 bg-library-gold/10 p-4 rounded-lg border border-library-gold/30">
              <div>
                <h4 className="font-display font-semibold text-sm text-library-wood-foreground flex items-center gap-1.5">
                  <Quote className="h-4 w-4 text-library-gold" />
                  Exportar o texto completo
                </h4>
                <p className="font-body text-xs text-library-bronze-foreground">
                  Baixe em Markdown (`.md`) para Obsidian/Notion, TXT puro ou ePub para leitores de livro.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  onClick={handleExportObsidian}
                  size="sm"
                  className="bg-library-wood hover:bg-library-bronze text-library-gold font-body text-xs gap-1.5 w-full"
                >
                  <Download className="h-3.5 w-3.5" />
                  Markdown `.md`
                </Button>
                <Button
                  onClick={handleExportTxt}
                  size="sm"
                  className="bg-library-wood hover:bg-library-bronze text-library-gold font-body text-xs gap-1.5 w-full"
                >
                  <FileText className="h-3.5 w-3.5" />
                  TXT puro
                </Button>
                <Button
                  onClick={handleExportEpub}
                  size="sm"
                  className="bg-library-wood hover:bg-library-bronze text-library-gold font-body text-xs gap-1.5 w-full"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  ePub
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
