import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useBooks, useCategories } from '@/hooks/useDatabase';
import { Book } from '@/types';
import { ArrowLeft, BookOpen, Layers, Compass, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePageTitle } from '@/hooks/usePageTitle';
import { SectionLabel } from '@/components/SectionLabel';
import { FaithCard } from '@/components/home/FaithCard';

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const { data: categories, isLoading: isCatLoading } = useCategories();
  const { data: books, isLoading: isBooksLoading } = useBooks();

  const category = categories?.find((c) => c.slug === categorySlug);
  const catName = category?.name || (categorySlug ? categorySlug.replace(/-/g, ' ') : 'Categoria');

  usePageTitle(`${catName} — Estante Canônica`);

  // Filter books that match this category name
  const booksInCategory = (books?.items || []).filter((b) =>
    b.categories?.some(
      (c) =>
        c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-') ===
        categorySlug || c === catName
    )
  );

  const isLoading = isCatLoading || isBooksLoading;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/categorias')}
            className="text-xs text-muted-foreground hover:text-library-wood-foreground pl-0 gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para todas as estantes</span>
          </Button>
        </div>

        {/* Category Hero Header */}
        <div className="bg-card border border-library-bronze/70 rounded-2xl p-6 sm:p-10 mb-10 shadow-book parchment-bg relative overflow-hidden">
          <div className="max-w-3xl">
            <SectionLabel tone="gold" className="mb-3">
              Estante Canônica
            </SectionLabel>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-library-wood-foreground mb-4">
              {catName}
            </h1>
            {category?.description && (
              <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                {category.description}
              </p>
            )}

            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1 rounded-full bg-library-gold/15 border border-library-dourado/40 text-library-dourado-texto">
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {isLoading
                  ? 'Carregando acervo...'
                  : `${booksInCategory.length} ${booksInCategory.length === 1 ? 'obra clássica' : 'obras clássicas'}`}
              </span>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-library-gold mr-3" />
            <span className="font-body text-library-bronze-foreground">Carregando obras da estante...</span>
          </div>
        ) : booksInCategory.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-bold text-library-wood-foreground">
                Obras Disponíveis nesta Coleção
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {booksInCategory.map((book) => (
                <FaithCard
                  key={book.id}
                  book={book}
                  tagline={book.author?.name}
                  era={book.publicationYearOriginal}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-card/40 border border-library-bronze/40 rounded-xl p-8">
            <BookOpen className="w-12 h-12 text-library-bronze mx-auto mb-3 opacity-60" />
            <h3 className="font-heading text-lg font-bold text-library-wood-foreground mb-1">
              Nenhuma obra encontrada nesta estante no momento
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Estamos continuamente expandindo e traduzindo novas obras clássicas para o acervo.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/livros">Ver todo o catálogo</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
