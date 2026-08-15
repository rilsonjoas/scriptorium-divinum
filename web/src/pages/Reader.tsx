import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Loader2, ScrollText } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useBookText } from '@/hooks/useDatabase';

function splitProvenance(text: string): { provenance: string | null; content: string } {
  const index = text.indexOf('\n---\n');
  if (index === -1) return { provenance: null, content: text };
  return {
    provenance: text.slice(0, index),
    content: text.slice(index + 5),
  };
}

const Reader = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { data, isLoading, error } = useBookText(bookId || '');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="font-body text-library-bronze hover:text-library-wood">
            <Link to={bookId ? `/livros/${bookId}` : '/livros'}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Catálogo
            </Link>
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-library-gold mr-3" />
            <span className="font-body text-library-bronze text-lg">Preparando a leitura...</span>
          </div>
        )}

        {!isLoading && (error || !data) && (
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
        )}

        {!isLoading && data && (() => {
          const { provenance, content } = splitProvenance(data.text);
          return (
            <>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-library-gold" />
                <h1 className="font-heading text-3xl md:text-4xl text-library-wood">{data.title}</h1>
              </div>

              <Card className="bg-card/95 backdrop-blur-sm border-library-bronze shadow-book parchment-bg">
                <CardContent className="p-6 md:p-10">
                  {provenance && (
                    <div className="prose prose-sm max-w-none mb-8 p-4 rounded-lg bg-library-parchment/60 border border-library-bronze/30 text-library-bronze">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{provenance}</ReactMarkdown>
                    </div>
                  )}
                  <div className="prose prose-lg max-w-none font-reading prose-headings:font-heading prose-headings:text-library-wood prose-a:text-library-bronze prose-blockquote:border-library-bronze prose-blockquote:font-body prose-strong:text-library-wood">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </>
          );
        })()}
      </div>
    </Layout>
  );
};

export default Reader;
