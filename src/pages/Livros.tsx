import { Layout } from '@/components/Layout';
import { BookCard } from '@/components/BookCard';
import { books } from '@/data/books';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useState } from 'react';

const Livros = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract unique categories
  const categories = Array.from(
    new Set(books.flatMap(book => book.categories || []))
  );

  // Filter books based on search and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      book.categories?.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

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
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
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
              }}
              className="font-body text-library-bronze hover:text-library-wood"
            >
              <Filter className="h-4 w-4 mr-1" />
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Books Grid/List */}
        {filteredBooks.length > 0 ? (
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
              Tente ajustar os filtros ou termos de busca.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="font-body"
            >
              Ver todas as obras
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Livros;