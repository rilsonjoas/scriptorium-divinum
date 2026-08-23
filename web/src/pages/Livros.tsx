import { Layout } from '@/components/Layout';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List, Loader2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useBooks, useCategories, useSiteSettings } from '@/hooks/useDatabase';
import { useSearchParams } from 'react-router-dom';
import { AdSlot } from '@/components/ads/AdSlot';
import { Star } from 'lucide-react';
import { listFavorites } from '@/utils/favorites';

const Livros = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [soFavoritos, setSoFavoritos] = useState(false);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  useEffect(() => {
    setFavoritos(listFavorites());
  }, []);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Update search term from URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl && searchFromUrl !== searchTerm) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams, searchTerm]);

  const { data: settings } = useSiteSettings();
  const { data: books, isLoading: booksLoading, error: booksError } = useBooks({
    limit: settings?.booksPerPage,
  });
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Filter books based on search and category
  const filteredBooks = useMemo(() => {
    if (!books?.items) return [];
    
    return books.items.filter(book => {
      const matchesSearch = searchTerm === '' || 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        book.categories?.includes(selectedCategory);

      const matchesFavoritos = !soFavoritos || favoritos.includes(book.slug ?? '');

      return matchesSearch && matchesCategory && matchesFavoritos;
    });
  }, [books, searchTerm, selectedCategory, soFavoritos, favoritos]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-library-wood mb-4">
            Catálogo de Obras
          </h1>
          <div className="chapter-divider max-w-md mx-auto mb-6"></div>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore nossa coleção cuidadosamente curada de obras teológicas clássicas, 
            todas em domínio público e disponíveis gratuitamente.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-card/50 rounded-lg border border-library-bronze p-6 mb-8 parchment-bg">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <button
              type="button"
              onClick={() => setSoFavoritos(v => !v)}
              aria-pressed={soFavoritos}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-body transition-colors ${
                soFavoritos
                  ? 'border-library-gold bg-library-gold/20 text-library-wood'
                  : 'border-library-bronze text-library-bronze hover:bg-library-gold/10'
              }`}
              title="Mostrar apenas favoritos"
            >
              <Star className={`h-4 w-4 ${soFavoritos ? 'fill-library-gold text-library-gold' : ''}`} />
              Favoritos
            </button>
            {/* Search */}
            <div className="flex-1">
              <label className="font-body text-sm font-medium text-foreground mb-2 block">
                Buscar obras
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-library-bronze" />
                <Input
                  placeholder="Título, autor ou palavra-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-body"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-64">
              <label className="font-body text-sm font-medium text-foreground mb-2 block">
                Categoria
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categoriesLoading ? (
                    <SelectItem value="__loading__" disabled>Carregando...</SelectItem>
                  ) : categories?.map(category => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="font-body"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="font-body"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-body text-muted-foreground">
            {filteredBooks.length} obra{filteredBooks.length !== 1 ? 's' : ''} encontrada{filteredBooks.length !== 1 ? 's' : ''}
          </p>
          {(searchTerm || selectedCategory !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSearchParams({});
              }}
              className="font-body text-library-bronze hover:text-library-wood"
            >
              <Filter className="h-4 w-4 mr-1" />
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Books Grid/List */}
        {booksLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-library-gold mr-3" />
            <span className="font-body text-library-bronze text-lg">Carregando catálogo...</span>
          </div>
        ) : booksError ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-red-700 mb-2">
              Erro ao carregar o catálogo
            </h3>
            <p className="font-body text-muted-foreground mb-4">
              {booksError.message}
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="font-body"
            >
              Tentar novamente
            </Button>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
              : "space-y-4"
          }>
            {filteredBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                variant={viewMode === 'list' ? 'list' : 'grid'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-library-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-library-bronze" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
              Nenhuma obra encontrada
            </h3>
            <p className="font-body text-muted-foreground mb-4">
              {(books?.total ?? books?.items?.length ?? 0) === 0 
                ? 'O catálogo ainda não possui obras cadastradas.'
                : 'Tente ajustar os filtros ou termos de busca.'
              }
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSearchParams({});
              }}
              className="font-body"
            >
              Ver todas as obras
            </Button>
          </div>
        )}
        <div className="py-8">
          <AdSlot slotId="7957729645" />
        </div>
      </div>
    </Layout>
  );
};

export default Livros;