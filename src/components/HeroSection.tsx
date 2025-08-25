import { Button } from '@/components/ui/button';
import { BookOpen, Search, Users, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with classical library atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-library-wood via-library-leather to-library-emerald opacity-95"></div>
      
      {/* Ornamental pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 golden-foil leading-tight">
            Scriptorium Divinum
          </h1>
          
          <p className="font-heading text-xl md:text-2xl text-library-gold mb-4 italic">
            "In principio erat Verbum"
          </p>
          
          <p className="font-body text-lg text-library-gold/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Uma biblioteca digital dedicada a preservar e tornar acessível o vasto tesouro 
            da teologia cristã em domínio público. Explore obras clássicas dos Padres da Igreja, 
            reformadores, e grandes teólogos da história da cristandade.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-library-gold hover:bg-library-gold/90 text-library-wood font-body shadow-golden">
              <Link to="/livros">
                <BookOpen className="mr-2 h-5 w-5" />
                Explorar Catálogo
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-library-gold text-library-gold hover:bg-library-gold hover:text-library-wood font-body">
              <Link to="/busca">
                <Search className="mr-2 h-5 w-5" />
                Busca Avançada
              </Link>
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="w-16 h-16 bg-library-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-library-gold/30 transition-colors">
                <BookOpen className="h-8 w-8 text-library-gold" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-library-gold mb-2">150+</h3>
              <p className="font-body text-library-gold/80">Obras Clássicas</p>
            </div>
            
            <div className="group">
              <div className="w-16 h-16 bg-library-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-library-gold/30 transition-colors">
                <Users className="h-8 w-8 text-library-gold" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-library-gold mb-2">50+</h3>
              <p className="font-body text-library-gold/80">Autores Históricos</p>
            </div>
            
            <div className="group">
              <div className="w-16 h-16 bg-library-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-library-gold/30 transition-colors">
                <Download className="h-8 w-8 text-library-gold" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-library-gold mb-2">100%</h3>
              <p className="font-body text-library-gold/80">Acesso Gratuito</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-library-gold to-transparent"></div>
    </section>
  );
}