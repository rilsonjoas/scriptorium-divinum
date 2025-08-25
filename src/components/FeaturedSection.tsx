import { books } from '@/data/books';
import { BookCard } from './BookCard';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturedSection() {
  const featuredBooks = books.filter(book => book.featured);

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
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
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