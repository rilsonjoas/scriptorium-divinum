import { Link } from 'react-router-dom';
import { BookOpen, Users, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteSettings, useBooks, useAuthors } from '@/hooks/useDatabase';

export function HeroSection() {
  const { data: settings } = useSiteSettings();
  const { data: booksData } = useBooks({ limit: 1 });
  const { data: authors } = useAuthors();

  const totalBooks = booksData?.total ?? 181;
  const totalAuthors = authors?.length ?? 48;

  return (
    <section className="relative py-12 sm:py-20 bg-gradient-hero border-b border-library-dourado/30 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10 bg-repeat pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(212, 175, 55, 0.2) 2px, transparent 0)`,
          backgroundSize: '50px 50px',
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge de Destaque */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-library-gold/15 border border-library-dourado/30 text-library-dourado-leitura dark:text-library-gold font-body text-[11px] sm:text-xs mb-4 sm:mb-6 shadow-golden max-w-full truncate">
            <span className="text-library-dourado-leitura dark:text-library-gold shrink-0">✦</span>
            <span className="truncate">Biblioteca Teológica Clássica em Domínio Público</span>
            <span className="text-library-dourado-leitura dark:text-library-gold shrink-0">✦</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 golden-foil leading-tight tracking-tight">
            {settings?.siteName ?? 'Scriptorium Divinum'}
          </h1>

          <p className="font-heading text-base sm:text-xl md:text-2xl text-library-dourado-leitura dark:text-library-gold mb-4 sm:mb-6 italic">
            "In principio erat Verbum"
          </p>

          <p className="font-body text-sm sm:text-base md:text-lg text-library-dourado-leitura dark:text-library-gold/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            {settings?.siteDescription ??
              'O Grande Hall da tradição cristã em língua portuguesa. Da Patrística antiga à Escolástica, da Reforma e Puritanismo à Renovação Católica e aos grandes avivamentos: uma biblioteca clássica, gratuita e aberta, como um presente permanente para a Igreja no Brasil.'}
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-14 px-4 sm:px-0">
            <Button
              asChild
              size="lg"
              className="bg-library-gold hover:bg-library-gold/90 text-library-wood font-body shadow-golden text-sm sm:text-base px-6 py-2.5 sm:py-3 w-full sm:w-auto"
            >
              <Link to="/livros">
                <BookOpen className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                Explorar Catálogo
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-library-dourado bg-library-wood/90 text-library-gold hover:bg-library-gold hover:text-library-wood font-semibold font-body text-sm sm:text-base px-6 py-2.5 sm:py-3 w-full sm:w-auto shadow-golden"
            >
              <Link to="/autores">
                <Users className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                Ver Autores Clássicos
              </Link>
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="group bg-card/70 dark:bg-library-wood/40 border border-library-bronze/40 dark:border-library-dourado/20 p-4 rounded-lg backdrop-blur-sm hover:border-library-dourado/50 transition-colors">
              <div className="w-12 h-12 bg-library-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-library-gold/30 transition-colors">
                <BookOpen className="h-6 w-6 text-library-dourado-leitura dark:text-library-gold" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-library-dourado-leitura dark:text-library-gold mb-1">
                {totalBooks > 0 ? `${totalBooks}` : "..."}
              </h3>
              <p className="font-body text-xs text-library-dourado-leitura dark:text-library-gold/80">
                Obra{totalBooks !== 1 ? "s" : ""} Clássica{totalBooks !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="group bg-card/70 dark:bg-library-wood/40 border border-library-bronze/40 dark:border-library-dourado/20 p-4 rounded-lg backdrop-blur-sm hover:border-library-dourado/50 transition-colors">
              <div className="w-12 h-12 bg-library-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-library-gold/30 transition-colors">
                <Users className="h-6 w-6 text-library-dourado-leitura dark:text-library-gold" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-library-dourado-leitura dark:text-library-gold mb-1">
                {totalAuthors > 0 ? `${totalAuthors}` : "..."}
              </h3>
              <p className="font-body text-xs text-library-dourado-leitura dark:text-library-gold/80">
                Autor{totalAuthors !== 1 ? "es" : ""} Histórico{totalAuthors !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="group bg-card/70 dark:bg-library-wood/40 border border-library-bronze/40 dark:border-library-dourado/20 p-4 rounded-lg backdrop-blur-sm hover:border-library-dourado/50 transition-colors">
              <div className="w-12 h-12 bg-library-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-library-gold/30 transition-colors">
                <Download className="h-6 w-6 text-library-dourado-leitura dark:text-library-gold" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-library-dourado-leitura dark:text-library-gold mb-1">
                100%
              </h3>
              <p className="font-body text-xs text-library-dourado-leitura dark:text-library-gold/80">Domínio Público Gratuito</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
