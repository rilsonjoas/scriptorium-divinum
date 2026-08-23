import { Button } from '@/components/ui/button';
import { BookOpen, Users, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBooks, useAuthors, useSiteSettings } from '@/hooks/useDatabase';

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-library-gold/15 border border-library-gold/30 text-library-gold font-body text-xs mb-6 shadow-golden">
            <span className="text-library-gold">✦</span>
            <span>Biblioteca Teológica Clássica em Domínio Público</span>
            <span className="text-library-gold">✦</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 golden-foil leading-tight">
            {settings?.siteName ?? 'Scriptorium Divinum'}
          </h1>

          <p className="font-heading text-lg md:text-2xl text-library-gold mb-6 italic">
            "In principio erat Verbum"
          </p>

          <p className="font-body text-base md:text-lg text-library-gold/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            {settings?.siteDescription ??
              'Uma biblioteca digital dedicada a preservar e tornar acessível o vasto tesouro da teologia cristã em domínio público. Explore obras clássicas dos Padres da Igreja, reformadores e grandes teólogos da história da cristandade.'}
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Button
              asChild
              size="lg"
              className="bg-library-gold hover:bg-library-gold/90 text-library-wood font-body shadow-golden text-base px-6"
            >
              <Link to="/livros">
                <BookOpen className="mr-2 h-5 w-5" />
                Explorar Catálogo
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-library-gold bg-library-wood/90 text-library-gold hover:bg-library-gold hover:text-library-wood font-semibold font-body text-base px-6 shadow-golden"
            >
              <Link to="/autores">
                <Users className="mr-2 h-5 w-5" />
                Ver Autores Clássicos
              </Link>
            </Button>
          </div>

          {/* Estante Teológica 3D (Physical Bookshelf Preview) */}
          {featuredBooksList.length > 0 && (
            <div className="mb-14 hidden sm:block">
              <p className="text-xs font-body text-library-gold/80 tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
                <span>✦</span> Estante Teológica em Destaque <span>✦</span>
              </p>
              <div className="bg-gradient-to-r from-library-leather via-library-wood to-library-leather p-4 rounded-xl border-2 border-library-gold/40 shadow-deep relative">
                <div className="flex justify-center items-end gap-3 md:gap-5 overflow-x-auto py-3 px-2">
                  {featuredBooksList.map((book) => (
                    <Link
                      key={book.id}
                      to={`/livros/${book.id}`}
                      className="group relative transition-all duration-300 hover:-translate-y-4 shrink-0"
                      title={`${book.title} — ${book.author.name}`}
                    >
                      <div className="w-12 md:w-16 h-48 md:h-56 bg-gradient-to-r from-library-leather via-library-wood to-library-leather border-l-4 border-library-gold rounded-r-md shadow-book relative flex flex-col justify-between p-2 overflow-hidden border-t border-b border-r border-library-bronze/50 group-hover:border-library-gold">
                        <div className="writing-mode-vertical-rl text-orientation-mixed h-full flex items-center justify-center">
                          <span className="text-library-gold font-heading text-xs font-semibold transform rotate-180 truncate max-h-36">
                            {book.title}
                          </span>
                        </div>
                        <div className="w-2 h-2 bg-library-gold rounded-full mx-auto" />
                      </div>
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-library-wood border border-library-gold text-library-gold text-[10px] font-body px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                        {book.title}
                      </div>
                    </Link>
                  ))}
                </div>
                {/* Prateleira de Madeira base */}
                <div className="h-3 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 rounded-b-lg border-t border-library-gold/60 shadow-md"></div>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="group bg-library-wood/40 border border-library-gold/20 p-4 rounded-lg backdrop-blur-sm hover:border-library-gold/50 transition-colors">
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

            <div className="group bg-library-wood/40 border border-library-gold/20 p-4 rounded-lg backdrop-blur-sm hover:border-library-gold/50 transition-colors">
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

            <div className="group bg-library-wood/40 border border-library-gold/20 p-4 rounded-lg backdrop-blur-sm hover:border-library-gold/50 transition-colors">
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