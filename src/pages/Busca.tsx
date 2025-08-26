import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, BookOpen, Users, Loader2, X } from 'lucide-react';
import { useSearch, useCategories, useAuthors } from '@/hooks/useDatabase';
import { useSearchParams } from 'react-router-dom';

export default function Busca() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);

  const { data: categories } = useCategories();
  const { data: authors } = useAuthors();
  
  const { data: searchResults, isLoading, error } = useSearch(
    query,
    hasSearched && query.length > 0
  );

  // Update query from URL params
  useEffect(() => {
    const queryFromUrl = searchParams.get('q');
    if (queryFromUrl && queryFromUrl !== query) {
      setQuery(queryFromUrl);
      setHasSearched(true);
    }
  }, [searchParams]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      setHasSearched(true);
      setSearchParams({ q: query.trim() });
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedAuthor('all');
    setHasSearched(false);
    setSearchParams({});
  };

  // Filter results based on category and author
  const filteredResults = searchResults ? {
    books: searchResults.books.filter(book => {
      const matchesCategory = selectedCategory === 'all' || 
        book.categories?.includes(selectedCategory);
      const matchesAuthor = selectedAuthor === 'all' || 
        book.author.id === selectedAuthor;
      return matchesCategory && matchesAuthor;
    }),
    authors: searchResults.authors.filter(author => 
      selectedAuthor === 'all' || author.id === selectedAuthor
    )
  } : null;

  const totalResults = filteredResults ? 
    filteredResults.books.length + filteredResults.authors.length : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-library-wood mb-4 golden-foil">
            Busca Avançada
          </h1>
          <p className="text-lg text-library-bronze font-body max-w-3xl mx-auto">
            Encontre obras, autores e temas específicos em nossa biblioteca teológica digital.
          </p>
        </div>

        {/* Search Form */}
        <Card className="border-library-bronze bg-library-parchment mb-8">
          <CardHeader>
            <CardTitle className="font-display text-library-wood flex items-center gap-2">
              <Search className="h-5 w-5" />
              Parâmetros de Busca
            </CardTitle>
            <CardDescription className="font-body text-library-bronze">
              Use os filtros abaixo para refinar sua pesquisa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-library-bronze" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Digite sua busca: título, autor, palavra-chave..."
                  className="pl-10 font-body"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-library-bronze hover:text-library-wood"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button type="submit" className="bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </form>

            {/* Filters */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Category Filter */}
              <div>
                <label className="font-body text-sm font-medium text-library-wood mb-2 block">
                  Filtrar por Categoria
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="font-body">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories?.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Author Filter */}
              <div>
                <label className="font-body text-sm font-medium text-library-wood mb-2 block">
                  Filtrar por Autor
                </label>
                <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                  <SelectTrigger className="font-body">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os autores</SelectItem>
                    {authors?.map(author => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            {(hasSearched || selectedCategory !== 'all' || selectedAuthor !== 'all') && (
              <div className="flex justify-center">
                <Button variant="outline" onClick={clearSearch} className="font-body">
                  <Filter className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold text-library-wood">
                Resultados da Busca
              </h2>
              {!isLoading && (
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-library-gold text-library-wood font-body">
                    {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
                  </Badge>
                  {query && (
                    <span className="text-sm text-library-bronze font-body">
                      para: "{query}"
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-library-gold mr-3" />
                <span className="font-body text-library-bronze text-lg">Buscando...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-red-700 mb-2">
                  Erro na Busca
                </h3>
                <p className="font-body text-muted-foreground">{error.message}</p>
              </div>
            )}

            {/* Results */}
            {!isLoading && !error && filteredResults && (
              <div className="space-y-8">
                {/* Books Results */}
                {filteredResults.books.length > 0 && (
                  <div>
                    <h3 className="font-display text-xl font-semibold text-library-wood mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-library-gold" />
                      Livros ({filteredResults.books.length})
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      {filteredResults.books.map((book) => (
                        <BookCard key={book.id} book={book} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Authors Results */}
                {filteredResults.authors.length > 0 && (
                  <div>
                    <h3 className="font-display text-xl font-semibold text-library-wood mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-library-gold" />
                      Autores ({filteredResults.authors.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredResults.authors.map((author) => (
                        <Card key={author.id} className="border-library-bronze bg-library-parchment hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <h4 className="font-display font-semibold text-library-wood mb-2">
                              {author.name}
                            </h4>
                            <p className="font-body text-library-bronze text-sm mb-3">
                              {author.birthYear && author.deathYear 
                                ? `${author.birthYear} - ${author.deathYear}`
                                : author.birthYear 
                                  ? `c. ${author.birthYear}`
                                  : 'Período clássico'
                              }
                            </p>
                            {author.denominationOrTradition && author.denominationOrTradition.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {author.denominationOrTradition.slice(0, 2).map((tradition) => (
                                  <Badge key={tradition} variant="secondary" className="text-xs bg-library-bronze text-library-parchment">
                                    {tradition}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <Button asChild size="sm" className="bg-library-wood hover:bg-library-bronze text-library-gold font-body w-full">
                              <a href={`/autores/${author.slug}`}>
                                Ver Obras
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {totalResults === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-library-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-library-bronze" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-library-wood mb-2">
                      Nenhum resultado encontrado
                    </h3>
                    <p className="font-body text-library-bronze mb-4">
                      Tente termos diferentes ou remova alguns filtros.
                    </p>
                    <Button variant="outline" onClick={clearSearch} className="font-body">
                      Limpar Busca
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Search Tips */}
        {!hasSearched && (
          <Card className="border-library-bronze bg-library-parchment">
            <CardHeader>
              <CardTitle className="font-display text-library-wood">Dicas de Busca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-display font-semibold text-library-wood mb-2">Por Título:</h4>
                  <p className="font-body text-library-bronze text-sm">
                    "Confissões", "Epístola", "Sete Palavras"
                  </p>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-library-wood mb-2">Por Autor:</h4>
                  <p className="font-body text-library-bronze text-sm">
                    "Agostinho", "Belarmino", "Tomás de Aquino"
                  </p>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-library-wood mb-2">Por Tema:</h4>
                  <p className="font-body text-library-bronze text-sm">
                    "filosofia", "teologia", "espiritualidade", "patrística"
                  </p>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-library-wood mb-2">Palavras-chave:</h4>
                  <p className="font-body text-library-bronze text-sm">
                    "cruz", "graça", "conversão", "meditação"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}