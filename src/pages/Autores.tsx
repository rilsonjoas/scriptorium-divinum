import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Calendar, BookOpen, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthors, useBooks } from '@/hooks/useDatabase';
import { useMemo } from 'react';

const Autores = () => {
  const { data: authors, isLoading: authorsLoading, error: authorsError } = useAuthors();
  const { data: books, isLoading: booksLoading } = useBooks();

  // Count books per author
  const authorsWithBookCount = useMemo(() => {
    if (!authors || !books) return [];
    
    return authors.map(author => ({
      ...author,
      bookCount: books.filter(book => book.author.id === author.id).length
    }));
  }, [authors, books]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-library-wood mb-4">
            Autores Clássicos
          </h1>
          <div className="chapter-divider max-w-md mx-auto mb-6"></div>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça os grandes pensadores e teólogos da história cristã cujas obras 
            preservamos em nossa biblioteca digital.
          </p>
        </div>

        {/* Authors Grid */}
        {authorsLoading || booksLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-library-gold mr-3" />
            <span className="font-body text-library-bronze text-lg">Carregando autores...</span>
          </div>
        ) : authorsError ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-red-700 mb-2">
              Erro ao carregar autores
            </h3>
            <p className="font-body text-muted-foreground mb-4">
              {authorsError.message}
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="font-body"
            >
              Tentar novamente
            </Button>
          </div>
        ) : authorsWithBookCount.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorsWithBookCount.map((author) => (
            <Card key={author.slug} className="group bg-card/95 backdrop-blur-sm border-library-bronze shadow-book hover:shadow-deep transition-all duration-300 hover:-translate-y-1 parchment-bg">
              <CardContent className="p-6">
                {/* Author Portrait */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-24 h-24 bg-gradient-leather rounded-full shadow-golden border-4 border-library-bronze relative overflow-hidden mb-4">
                    {author.portraitImageUrl ? (
                      <img
                        src={author.portraitImageUrl}
                        alt={`Retrato de ${author.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-8 w-8 text-library-gold" />
                      </div>
                    )}
                    {/* Decorative corner */}
                    <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-library-gold"></div>
                    <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-library-gold"></div>
                  </div>

                  <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-library-bronze transition-colors text-center mb-2">
                    {author.name}
                  </h3>
                </div>

                {/* Life Period */}
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-3 font-body">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {author.birthYear && author.deathYear 
                      ? `${author.birthYear} - ${author.deathYear}`
                      : author.birthYear 
                        ? `c. ${author.birthYear}`
                        : 'Período clássico'
                    }
                  </span>
                </div>

                {/* Tradition/Denomination */}
                {author.denominationOrTradition && author.denominationOrTradition.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 mb-4">
                    {author.denominationOrTradition.slice(0, 2).map((tradition) => (
                      <span
                        key={tradition}
                        className="px-2 py-1 text-xs bg-library-gold/20 text-library-bronze rounded-md font-body"
                      >
                        {tradition}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bio Summary */}
                {author.bioSummary && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3 font-body text-center">
                    {author.bioSummary}
                  </p>
                )}

                {/* Book Count */}
                <div className="flex items-center justify-center space-x-2 text-sm text-library-bronze mb-4 font-body">
                  <BookOpen className="h-3 w-3" />
                  <span>
                    {author.bookCount} obra{author.bookCount !== 1 ? 's' : ''} disponível{author.bookCount !== 1 ? 'eis' : ''}
                  </span>
                </div>

                {/* Action Button */}
                <div className="text-center">
                  <Button 
                    asChild 
                    size="sm" 
                    className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
                  >
                    <Link to={`/autores/${author.slug}`}>
                      Ver Obras
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-library-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-library-bronze" />
            </div>
            <h3 className="font-display text-xl font-semibold text-library-wood mb-2">
              Nenhum autor encontrado
            </h3>
            <p className="font-body text-muted-foreground">
              Ainda não há autores cadastrados na biblioteca.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="ornament"></div>
          <h2 className="font-heading text-2xl font-semibold text-library-wood mb-4">
            Contribua para a Preservação
          </h2>
          <p className="font-body text-muted-foreground mb-6 max-w-2xl mx-auto">
            Conhece outras obras clássicas que deveriam estar em nossa biblioteca? 
            Ajude-nos a expandir este tesouro da literatura teológica cristã.
          </p>
          <Button asChild variant="outline" className="border-library-bronze text-library-bronze hover:bg-library-bronze hover:text-primary-foreground font-body">
            <Link to="/contribuir">
              Como Contribuir
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Autores;