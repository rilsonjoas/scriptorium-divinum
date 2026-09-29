import { Link } from 'react-router-dom';
import { BookOpen, Compass, Layers, Search, ArrowRight } from 'lucide-react';
import { SectionLabel } from '@/components/SectionLabel';

export function FaithDoorsSection() {
  const doors = [
    {
      title: 'Ler Acervo',
      subtitle: 'Obras Fundamentais',
      desc: 'Encontre e leia as mais célebres obras da fé cristã em texto integral.',
      to: '/livros',
      icon: BookOpen,
      badge: '181+ Obras'
    },
    {
      title: 'As Estantes',
      subtitle: 'Grandes Tradições',
      desc: 'Da Patrística antiga à Escolástica, da Reforma à Mística e ao Puritanismo.',
      to: '/categorias',
      icon: Compass,
      badge: '8 Tradições'
    },
    {
      title: 'Tópicos & Doutrina',
      subtitle: 'Grandes Temas',
      desc: 'Trindade, Cristologia, Graça, Oração, Sacramentos e Vida Espiritual.',
      to: '/categorias#temas',
      icon: Layers,
      badge: '8 Temas Centrais'
    },
    {
      title: 'Pesquisa Global',
      subtitle: 'Busca no Texto',
      desc: 'Pesquise termos, passagens e conceitos através de todo o corpus teológico.',
      to: '/busca',
      icon: Search,
      badge: 'Texto Completo'
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-card/40 border-b border-library-bronze/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <SectionLabel tone="gold" className="justify-center mb-3">
            O Ponto de Partida
          </SectionLabel>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-library-wood-foreground">
            As Quatro Portas da Casa
          </h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mt-2">
            Escolha por onde começar a sua jornada pela herança comum dos santos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {doors.map((door) => {
            const Icon = door.icon;
            return (
              <Link
                key={door.title}
                to={door.to}
                className="group flex flex-col justify-between p-6 bg-card/95 border border-library-bronze/70 hover:border-library-dourado rounded-xl transition-all duration-300 shadow-book hover:shadow-golden parchment-bg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-library-gold/15 flex items-center justify-center text-library-dourado group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-library-bronze/50 text-library-bronze-foreground bg-background/50">
                      {door.badge}
                    </span>
                  </div>

                  <p className="text-xs font-heading font-semibold text-library-dourado-texto tracking-wider mb-1">
                    {door.subtitle}
                  </p>
                  <h3 className="font-display text-xl font-bold text-library-wood-foreground mb-2 group-hover:text-library-dourado-texto transition-colors">
                    {door.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {door.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-library-bronze/20 flex items-center justify-between text-xs font-semibold text-library-dourado-texto group-hover:text-library-dourado">
                  <span>Entrar</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
