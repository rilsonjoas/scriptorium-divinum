import { Link } from 'react-router-dom';
import { useBooks } from '@/hooks/useDatabase';
import { SectionLabel } from '@/components/SectionLabel';
import { FaithCard } from './FaithCard';
import { ArrowRight, Loader2 } from 'lucide-react';

export function FaithCollectionSection() {
  const { data: books, isLoading } = useBooks();

  // Curated list of standout classical slugs across traditions
  const curatedSlugs = [
    'confissoes',
    'a-encarnacao-do-verbo',
    'a-imitacao-de-cristo',
    'subida-do-monte-carmelo',
    'da-liberdade-do-cristao',
    'a-santa-ceia',
    'o-coracao-de-cristo-thomas-goodwin',
    'o-pastor-renovado',
    'castelo-interior',
    'sermao-de-sexagesima',
    'pensamentos-pascal',
    'coletas-livro-de-oracao-comum-1662'
  ];

  const allItems = books?.items || [];
  const curatedBooks = curatedSlugs
    .map((s) => allItems.find((b) => b.slug === s))
    .filter(Boolean);

  // Fallback to featured or first items if some slugs are not found
  const displayBooks = curatedBooks.length >= 6 ? curatedBooks : allItems.slice(0, 12);

  return (
    <section className="py-14 md:py-20 bg-background border-b border-library-bronze/40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
          <div>
            <SectionLabel tone="gold" className="mb-2">
              Curadoria & Leituras Fundamentais
            </SectionLabel>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-library-wood-foreground">
              Obras Fundamentais no Acervo
            </h2>
            <p className="font-body text-sm sm:text-base text-muted-foreground mt-1 max-w-xl">
              Textos canônicos que moldaram o pensamento e a piedade da cristandade.
            </p>
          </div>
          <Link
            to="/livros"
            className="mt-4 md:mt-0 inline-flex items-center text-xs sm:text-sm font-semibold text-library-dourado hover:underline gap-1 self-start"
          >
            Explorar todas as 181+ obras <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-library-gold mr-3" />
            <span className="font-body text-library-bronze-foreground">Carregando acervo curado...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayBooks.map((book: any) => (
              <FaithCard
                key={book.id}
                book={book}
                tagline={book.author?.name}
                era={book.publicationYearOriginal}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/livros"
            className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-library-dourado/60 hover:border-library-dourado bg-card text-library-wood-foreground hover:text-library-dourado-texto font-heading font-semibold text-sm shadow-sm hover:shadow-golden transition-all gap-2"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
