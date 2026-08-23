import { Search, BookOpen, Users, Library, X, Loader2, Menu, HelpCircle, Info, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useSearch, useSiteSettings } from '@/hooks/useDatabase';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: settings } = useSiteSettings();

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
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery('');
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/livros', label: t('nav.catalogo'), icon: BookOpen },
    { to: '/autores', label: t('nav.autores'), icon: Users },
    { to: '/categorias', label: t('nav.categorias'), icon: Library },
    { to: '/dominio-publico', label: t('nav.dominioPublico'), icon: ShieldCheck },
    { to: '/sobre', label: t('nav.sobre'), icon: Info },
    { to: '/ajuda', label: t('nav.ajuda'), icon: HelpCircle },
  ];

  return (
    <header className="border-b border-library-bronze bg-gradient-leather text-primary-foreground sticky top-0 z-40 shadow-md">
      <div className="container mx-auto px-4 py-3 md:py-5">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Site Title */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shadow-golden shrink-0">
              <img
                src="/logo-header.png"
                alt="Scriptorium Divinum"
                className="w-full h-full object-cover"
                width={48}
                height={48}
              />
            </div>
            <div>
              <h1 className="font-display text-lg md:text-2xl font-semibold golden-foil leading-tight">
                {settings?.siteName ?? 'Scriptorium Divinum'}
              </h1>
              <p className="text-xs md:text-sm text-library-gold font-body opacity-90 hidden sm:block">
                Biblioteca Teológica Clássica
              </p>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-4" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-library-bronze" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(e.target.value.length > 2);
                }}
                placeholder={t('busca.placeholder')}
                className="pl-10 pr-10 bg-library-parchment border-library-bronze text-foreground placeholder:text-library-bronze font-body text-sm"
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
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

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
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="font-body text-library-bronze text-sm">
                          Nenhum resultado encontrado.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </form>
          </div>

          {/* Desktop Right Links & Mobile Menu Triggers */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Icon Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-library-gold hover:text-primary-foreground hover:bg-library-bronze/50"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Abrir busca"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile Drawer Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-library-gold hover:text-primary-foreground hover:bg-library-bronze/50"
                  aria-label="Abrir menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-library-wood border-library-bronze text-library-parchment w-80 p-6 flex flex-col justify-between">
                <div>
                  <SheetHeader className="text-left mb-6 border-b border-library-bronze/40 pb-4">
                    <SheetTitle className="font-display text-xl text-library-gold golden-foil">
                      Scriptorium Divinum
                    </SheetTitle>
                    <p className="text-xs text-library-gold/80 font-body">
                      Biblioteca Teológica Clássica
                    </p>
                  </SheetHeader>

                  {/* Mobile Search inside Drawer */}
                  <form onSubmit={handleSearchSubmit} className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-library-bronze" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('busca.placeholder')}
                      className="pl-10 bg-library-parchment text-foreground border-library-bronze font-body text-sm"
                    />
                  </form>

                  {/* Mobile Nav Links */}
                  <nav className="flex flex-col space-y-2">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-library-gold hover:bg-library-gold/15 hover:text-white transition-colors font-body text-base"
                        >
                          <Icon className="h-5 w-5 text-library-gold shrink-0" />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-6 border-t border-library-bronze/40 text-center text-xs text-library-gold/70 font-body">
                  &copy; {new Date().getFullYear()} Scriptorium Divinum
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-library-bronze/40">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-library-bronze" />
              <Input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('busca.placeholder')}
                className="pl-10 pr-10 bg-library-parchment text-foreground border-library-bronze font-body text-sm w-full"
              />
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-library-bronze"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center justify-center space-x-8 mt-4 pt-4 border-t border-library-bronze/30">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-2 text-library-gold hover:text-primary-foreground transition-colors font-body text-sm font-medium"
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}