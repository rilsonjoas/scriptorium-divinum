import { Search, BookOpen, Users, Library } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Header() {
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
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-library-bronze" />
              <Input
                placeholder="Buscar obras, autores..."
                className="pl-10 bg-library-parchment border-library-bronze text-foreground placeholder:text-library-bronze font-body"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-library-gold hover:text-primary-foreground hover:bg-library-bronze">
              Ajuda
            </Button>
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