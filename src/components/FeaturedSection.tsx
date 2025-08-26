import { BookCard } from './BookCard';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFeaturedBooks } from '@/hooks/useDatabase';

export function FeaturedSection() {
  const { data: featuredBooks, isLoading, error } = useFeaturedBooks(3);

  return (
    <section className="py-16 bg-gradient-to-br from-library-parchment to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-semibold text-library-wood mb-4">
            Obras em Destaque
          </h2>
          <div className="chapter-divider max-w-md mx-auto"></div>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore algumas das mais importantes obras da literatura teológica cristã, 
            cuidadosamente preservadas em domínio público.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-library-gold mr-3" />
              <span className="font-body text-library-bronze">Carregando obras em destaque...</span>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-red-600" />
              </div>
              <p className="font-body text-red-600 mb-2">Erro ao carregar obras em destaque</p>
              <p className="font-body text-sm text-muted-foreground">{error.message}</p>
            </div>
          ) : featuredBooks && featuredBooks.length > 0 ? (
            featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-library-bronze rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <BookOpen className="h-8 w-8 text-library-parchment" />
              </div>
              <p className="font-body text-library-bronze">Nenhuma obra em destaque encontrada.</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-library-wood hover:bg-library-bronze text-library-gold font-body">
            <Link to="/livros">
              <BookOpen className="mr-2 h-4 w-4" />
              Ver Todo o Catálogo
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}