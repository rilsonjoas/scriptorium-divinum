import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookCard } from '@/components/BookCard';
import { SafeImage } from '@/components/SafeImage';
import { ArrowLeft, Calendar, Loader2, User } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useAuthorWithBooks } from '@/hooks/useDatabase';

const AutorDetalhes = () => {
  const { authorSlug } = useParams<{ authorSlug: string }>();
  const { data: author, isLoading, error } = useAuthorWithBooks(authorSlug || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-library-gold mr-3" />
            <span className="font-body text-library-bronze text-lg">Carregando autor...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !author) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="font-body text-library-bronze hover:text-library-wood">
            <Link to="/autores">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Autores
            </Link>
          </Button>
        </div>

        <Card className="bg-card/95 backdrop-blur-sm border-library-bronze shadow-book parchment-bg mb-10">
          <CardContent className="p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 flex-shrink-0 bg-gradient-leather rounded-full shadow-golden border-4 border-library-bronze relative overflow-hidden">
              <SafeImage
                src={author.portraitImageUrl}
                alt={`Retrato de ${author.name}`}
                className="w-full h-full object-cover"
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-12 w-12 text-library-gold" />
                  </div>
                }
              />
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="font-display text-3xl font-bold text-library-wood mb-2">{author.name}</h1>

              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground mb-4 font-body">
                <Calendar className="h-3 w-3" />
                <span>
                  {author.birthYear && author.deathYear
                    ? `${author.birthYear} - ${author.deathYear}`
                    : author.birthYear
                      ? `c. ${author.birthYear}`
                      : 'Período clássico'}
                </span>
              </div>

              {author.denominationOrTradition && author.denominationOrTradition.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-1 mb-4">
                  {author.denominationOrTradition.map((tradition) => (
                    <span
                      key={tradition}
                      className="px-2 py-1 text-xs bg-library-gold/20 text-library-bronze rounded-md font-body"
                    >
                      {tradition}
                    </span>
                  ))}
                </div>
              )}

              {author.bioSummary && (
                <p className="font-body text-muted-foreground max-w-2xl">{author.bioSummary}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <h2 className="font-heading text-2xl font-semibold text-library-wood mb-6">
          Obras de {author.name}
        </h2>

        {author.books && author.books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {author.books.map((book) => (
              <BookCard key={book.id} book={{ ...book, author }} variant="list" />
            ))}
          </div>
        ) : (
          <p className="font-body text-muted-foreground text-center py-8">
            Nenhuma obra cadastrada ainda para este autor.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default AutorDetalhes;
