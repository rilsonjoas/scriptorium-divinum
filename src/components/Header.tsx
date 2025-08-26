import { Search, BookOpen, Users, Library, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useSearch } from '@/hooks/useDatabase';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: searchResults, isLoading: searchLoading, error: searchError } = useSearch(
    searchQuery, 
    searchQuery.length > 2
  );


  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/livros?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setSearchQuery('');
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery('');
  };
  return (
    <header className="border-b border-library-bronze bg-gradient-leather text-primary-foreground">
      <div className="container mx-auto px-4 py-6">
        {/* Logo and Site Title */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center shadow-golden">
              <Library className="h-6 w-6 text-library-wood" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold golden-foil">
                Scriptorium Divinum
              </h1>
              <p className="text-sm text-library-gold font-body opacity-90">
                Biblioteca Teológica Clássica
              </p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-library-bronze" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(e.target.value.length > 2);
                }}
                placeholder="Buscar obras, autores..."
                className="pl-10 pr-10 bg-library-parchment border-library-bronze text-foreground placeholder:text-library-bronze font-body"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowResults(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-library-bronze hover:text-library-wood"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {showResults && searchQuery.length > 2 && (
                <Card className="absolute top-full left-0 right-0 mt-2 bg-library-parchment border-library-bronze shadow-lg z-50 max-h-96 overflow-y-auto">
                  <CardContent className="p-4">
                    {searchLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-library-gold mr-2" />
                        <span className="font-body text-library-bronze text-sm">Buscando...</span>
                      </div>
                    ) : searchError ? (
                      <div className="text-center py-4">
                        <Search className="h-6 w-6 text-red-600 mx-auto mb-2" />
                        <p className="font-body text-red-600 text-sm">
                          Erro na busca: {searchError.message}
                        </p>
                      </div>
                    ) : searchResults && (searchResults.books.length > 0 || searchResults.authors.length > 0) ? (
                      <div className="space-y-4">
                        {/* Books Results */}
                        {searchResults.books.length > 0 && (
                          <div>
                            <h4 className="font-display font-semibold text-library-wood mb-2 text-sm">
                              Livros ({searchResults.books.length})
                            </h4>
                            <div className="space-y-2">
                              {searchResults.books.slice(0, 3).map((book) => (
                                <Link
                                  key={book.id}
                                  to={`/livros/${book.id}`}
                                  onClick={handleResultClick}
                                  className="block p-2 hover:bg-library-gold/10 rounded-md transition-colors"
                                >
                                  <div className="flex items-start gap-3">
                                    <BookOpen className="h-4 w-4 text-library-gold mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-body font-medium text-library-wood text-sm truncate">
                                        {book.title}
                                      </p>
                                      <p className="font-body text-library-bronze text-xs">
                                        Por {book.author.name}
                                      </p>
                                      {book.categories && book.categories.length > 0 && (
                                        <div className="flex gap-1 mt-1">
                                          {book.categories.slice(0, 2).map((category) => (
                                            <Badge key={category} variant="secondary" className="text-xs bg-library-bronze text-library-parchment">
                                              {category}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              ))}
                              {searchResults.books.length > 3 && (
                                <Link
                                  to={`/livros?search=${encodeURIComponent(searchQuery)}`}
                                  onClick={handleResultClick}
                                  className="block p-2 text-center text-library-bronze hover:text-library-wood text-xs font-body"
                                >
                                  Ver todos os {searchResults.books.length} livros →
                                </Link>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Authors Results */}
                        {searchResults.authors.length > 0 && (
                          <div>
                            <h4 className="font-display font-semibold text-library-wood mb-2 text-sm">
                              Autores ({searchResults.authors.length})
                            </h4>
                            <div className="space-y-2">
                              {searchResults.authors.slice(0, 2).map((author) => (
                                <Link
                                  key={author.id}
                                  to={`/autores/${author.slug}`}
                                  onClick={handleResultClick}
                                  className="block p-2 hover:bg-library-gold/10 rounded-md transition-colors"
                                >
                                  <div className="flex items-start gap-3">
                                    <Users className="h-4 w-4 text-library-gold mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-body font-medium text-library-wood text-sm">
                                        {author.name}
                                      </p>
                                      <p className="font-body text-library-bronze text-xs">
                                        {author.birthYear && author.deathYear 
                                          ? `${author.birthYear} - ${author.deathYear}`
                                          : author.birthYear 
                                            ? `c. ${author.birthYear}`
                                            : 'Período clássico'
                                        }
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                              {searchResults.authors.length > 2 && (
                                <Link
                                  to={"/autores"}
                                  onClick={handleResultClick}
                                  className="block p-2 text-center text-library-bronze hover:text-library-wood text-xs font-body"
                                >
                                  Ver todos os autores →
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : searchQuery.length > 2 ? (
                      <div className="text-center py-4">
                        <Search className="h-6 w-6 text-library-bronze mx-auto mb-2" />
                        <p className="font-body text-library-bronze text-sm">
                          Nenhum resultado encontrado para "{searchQuery}"
                        </p>
                        <p className="font-body text-library-bronze text-xs mt-1">
                          Tente termos diferentes ou pressione Enter para busca completa
                        </p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              )}
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <Link to="/ajuda">
              <Button variant="ghost" size="sm" className="text-library-gold hover:text-primary-foreground hover:bg-library-bronze">
                Ajuda
              </Button>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center space-x-8">
          <Link 
            to="/livros" 
            className="flex items-center space-x-2 text-library-gold hover:text-primary-foreground transition-colors font-body"
          >
            <BookOpen className="h-4 w-4" />
            <span>Catálogo</span>
          </Link>
          <Link 
            to="/autores" 
            className="flex items-center space-x-2 text-library-gold hover:text-primary-foreground transition-colors font-body"
          >
            <Users className="h-4 w-4" />
            <span>Autores</span>
          </Link>
          <Link 
            to="/categorias" 
            className="flex items-center space-x-2 text-library-gold hover:text-primary-foreground transition-colors font-body"
          >
            <Library className="h-4 w-4" />
            <span>Categorias</span>
          </Link>
          <Link 
            to="/dominio-publico" 
            className="flex items-center space-x-2 text-library-gold hover:text-primary-foreground transition-colors font-body"
          >
            <span>Domínio Público</span>
          </Link>
          <Link 
            to="/sobre" 
            className="flex items-center space-x-2 text-library-gold hover:text-primary-foreground transition-colors font-body"
          >
            <span>Sobre</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}