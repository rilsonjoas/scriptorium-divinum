import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { SectionLabel } from '@/components/SectionLabel';
import { useCategories } from '@/hooks/useDatabase';

export function FaithShelvesSection() {
  const { data: categories } = useCategories();

  const traditionShelves = [
    {
      slug: 'patristica',
      title: 'Igreja Primitiva & Patrística',
      period: 'Séc. I – VIII',
      desc: 'Padres Apostólicos, Apologistas, Capadócios e Padres do Deserto.',
      authors: 'Agostinho · Atanásio · Justino · Irineu · Crisóstomo · Leão Magno'
    },
    {
      slug: 'tradicao-oriental',
      title: 'Tradição Oriental & Bizantina',
      period: 'Séc. IV – XV',
      desc: 'A teologia da luz incriada, os hinos sírios e a mística da Filocalia.',
      authors: 'Efrém da Síria · Máximo Confessor · João Damasceno · Simeão o Novo Teólogo'
    },
    {
      slug: 'escolastica-e-medieval',
      title: 'Escolástica & Mística Medieval',
      period: 'Séc. XI – XV',
      desc: 'A síntese da fé e razão e o cume da espiritualidade monástica.',
      authors: 'Tomás de Aquino · Anselmo · Boaventura · Bernardo de Claraval · Tomás de Kempis'
    },
    {
      slug: 'reforma-protestante',
      title: 'Reforma Protestante',
      period: 'Séc. XVI – XVII',
      desc: 'A recuperação da justificação pela fé e os monumentos reformados.',
      authors: 'Martinho Lutero · João Calvino · Felipe Melâncton · Ulrico Zuínglio'
    },
    {
      slug: 'puritanismo',
      title: 'Puritanismo & Piedade Reformada',
      period: 'Séc. XVII',
      desc: 'A cura das almas, a comunhão íntima com a Trindade e a santidade bíblica.',
      authors: 'John Bunyan · John Owen · Richard Sibbes · Richard Baxter · Thomas Goodwin'
    },
    {
      slug: 'renovacao-catolica',
      title: 'Renovação Católica & Mística Ibérica',
      period: 'Séc. XVI – XVIII',
      desc: 'A mística carmelita, salesiana e a grandiosa oratória em língua portuguesa.',
      authors: 'Teresa de Ávila · João da Cruz · Francisco de Sales · Pe. António Vieira'
    },
    {
      slug: 'tradicao-anglicana',
      title: 'Tradição Anglicana & Devocional',
      period: 'Séc. XVI – XVIII',
      desc: 'A beleza da santidade litúrgica, o Livro de Oração Comum e os poetas sagrados.',
      authors: 'Thomas Cranmer · John Donne · George Herbert · Jeremy Taylor'
    },
    {
      slug: 'classicos-modernos',
      title: 'Clássicos Modernos & Avivamentos',
      period: 'Séc. XVIII – XX',
      desc: 'O fogo dos grandes avivamentos e a apologética que inspirou gerações.',
      authors: 'Jonathan Edwards · Blaise Pascal · G. K. Chesterton · C. S. Lewis'
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-background border-b border-library-bronze/40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
          <div>
            <SectionLabel tone="gold" className="mb-2">
              As Grandes Coleções
            </SectionLabel>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-library-wood-foreground">
              As Estantes da Tradição
            </h2>
            <p className="font-body text-sm sm:text-base text-muted-foreground mt-1 max-w-xl">
              Navegue pelos séculos de reflexão, devoção e oração da Igreja universal.
            </p>
          </div>
          <Link
            to="/categorias"
            className="mt-4 md:mt-0 inline-flex items-center text-xs sm:text-sm font-semibold text-library-dourado hover:underline gap-1 self-start"
          >
            Ver todas as categorias & eixos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {traditionShelves.map((shelf) => {
            const catData = categories?.find((c) => c.slug === shelf.slug);
            const count = catData?.bookCount ?? null;

            return (
              <Link
                key={shelf.slug}
                to={`/categorias/${shelf.slug}`}
                className="group flex flex-col justify-between bg-card border border-library-bronze/60 hover:border-library-dourado rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-golden relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-library-bronze-foreground mb-2">
                    <span className="uppercase tracking-wider">{shelf.period}</span>
                    {count !== null && (
                      <span className="px-2 py-0.5 rounded-full bg-library-gold/10 border border-library-bronze/40 font-semibold text-library-dourado-texto">
                        {count} {count === 1 ? 'obra' : 'obras'}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-library-wood-foreground group-hover:text-library-dourado-texto transition-colors mb-2">
                    {shelf.title}
                  </h3>

                  <p className="font-body text-xs text-muted-foreground leading-relaxed mb-4">
                    {shelf.desc}
                  </p>
                </div>

                <div>
                  <div className="text-[11px] font-body italic text-library-bronze-foreground/90 mb-3 pt-3 border-t border-library-bronze/20 truncate">
                    {shelf.authors}
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-library-dourado-texto group-hover:text-library-dourado">
                    <span>Explorar Estante</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
