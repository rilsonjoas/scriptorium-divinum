import { Button } from '@/components/ui/button';
import { BookOpen, Users, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBooks, useAuthors, useSiteSettings } from '@/hooks/useDatabase';
import { SectionLabel } from '@/components/SectionLabel';

export function HeroSection() {
  const { data: books } = useBooks();
  const { data: authors } = useAuthors();
  const { data: settings } = useSiteSettings();

  const totalBooks = books?.total ?? books?.items?.length ?? 0;
  const totalAuthors = authors?.length || 0;
  const featuredBooksList = books?.items?.slice(0, 6) || [];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden border-b border-library-bronze">
      {/* Background with classical library atmosphere & Vitral Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-library-wood via-library-leather to-library-emerald opacity-95"></div>
      <div className="absolute inset-0 liturgic-glow pointer-events-none"></div>

      {/* Ornamental pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge de Destaque */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-library-gold/15 border border-library-dourado/30 text-library-gold font-body text-[11px] sm:text-xs mb-4 sm:mb-6 shadow-golden max-w-full truncate">
            <span className="text-library-gold shrink-0">✦</span>
            <span className="truncate">Biblioteca Teológica Clássica em Domínio Público</span>
            <span className="text-library-gold shrink-0">✦</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 golden-foil leading-tight tracking-tight">
            {settings?.siteName ?? 'Scriptorium Divinum'}
          </h1>

          <p className="font-heading text-base sm:text-xl md:text-2xl text-library-gold mb-4 sm:mb-6 italic">
            "In principio erat Verbum"
          </p>

          <p className="font-body text-sm sm:text-base md:text-lg text-library-gold/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            {settings?.siteDescription ??
              'Uma biblioteca digital dedicada a preservar e tornar acessível o vasto tesouro da teologia cristã em domínio público. Explore obras clássicas dos Padres da Igreja, reformadores e grandes teólogos da história da cristandade.'}
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

          {/* Estante Teológica 3D (Physical Bookshelf Preview) */}
          {featuredBooksList.length > 0 && (
            <div className="mb-14 block">
              <SectionLabel tone="gold" className="justify-center mb-4 flex items-center justify-center gap-2">
                <span aria-hidden="true">✦</span> Estante Teológica em Destaque <span aria-hidden="true">✦</span>
              </SectionLabel>
              <div className="bg-gradient-to-r from-library-leather via-library-wood to-library-leather p-4 rounded-xl border-2 border-library-dourado/40 shadow-deep relative">
                <div className="flex justify-start sm:justify-center items-end gap-3 md:gap-5 overflow-x-auto snap-x scrollbar-none py-3 px-2">
                  {featuredBooksList.map((book) => (
                    <Link
                      key={book.id}
                      to={`/livros/${book.id}`}
                      className="group relative transition-all duration-300 hover:-translate-y-4 shrink-0"
                      title={`${book.title} — ${book.author.name}`}
                    >
                      <div className="w-12 md:w-16 h-48 md:h-56 bg-gradient-to-r from-library-leather via-library-wood to-library-leather border-l-4 border-library-dourado rounded-r-md shadow-book relative flex flex-col justify-between p-2 overflow-hidden border-t border-b border-r border-library-bronze/50 group-hover:border-library-dourado">
                        <div className="writing-mode-vertical-rl text-orientation-mixed h-full flex items-center justify-center">
                          <span className="text-library-gold font-heading text-xs font-semibold transform rotate-180 truncate max-h-36">
                            {book.title}
                          </span>
                        </div>
                        <div className="w-2 h-2 bg-library-gold rounded-full mx-auto" />
                      </div>
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-library-wood border border-library-dourado text-library-gold text-[10px] font-body px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                        {book.title}
                      </div>
                    </Link>
                  ))}
                </div>
                {/* Prateleira de Madeira base */}
                <div className="h-3 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 rounded-b-lg border-t border-library-dourado/60 shadow-md"></div>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="group bg-library-wood/40 border border-library-dourado/20 p-4 rounded-lg backdrop-blur-sm hover:border-library-dourado/50 transition-colors">
              <div className="w-12 h-12 bg-library-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-library-gold/30 transition-colors">
                <BookOpen className="h-6 w-6 text-library-gold" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-library-gold mb-1">
                {totalBooks > 0 ? `${totalBooks}` : "..."}
              </h3>
              <p className="font-body text-xs text-library-gold/80">
                Obra{totalBooks !== 1 ? "s" : ""} Clássica{totalBooks !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="group bg-library-wood/40 border border-library-dourado/20 p-4 rounded-lg backdrop-blur-sm hover:border-library-dourado/50 transition-colors">
              <div className="w-12 h-12 bg-library-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-library-gold/30 transition-colors">
                <Users className="h-6 w-6 text-library-gold" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-library-gold mb-1">
                {totalAuthors > 0 ? `${totalAuthors}` : "..."}
              </h3>
              <p className="font-body text-xs text-library-gold/80">
                Autor{totalAuthors !== 1 ? "es" : ""} Histórico{totalAuthors !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="group bg-library-wood/40 border border-library-dourado/20 p-4 rounded-lg backdrop-blur-sm hover:border-library-dourado/50 transition-colors">
              <div className="w-12 h-12 bg-library-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-library-gold/30 transition-colors">
                <Download className="h-6 w-6 text-library-gold" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-library-gold mb-1">
                100%
              </h3>
              <p className="font-body text-xs text-library-gold/80">Domínio Público Gratuito</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}