import { useBooks, useCategories, useAuthors } from '@/hooks/useDatabase';
import { BookOpen, Users, Layers, ShieldCheck } from 'lucide-react';

export function CorpusMetricsSection() {
  const { data: books } = useBooks();
  const { data: categories } = useCategories();
  const { data: authors } = useAuthors();

  const totalBooks = books?.total ?? books?.items?.length ?? 181;
  const totalAuthors = authors?.length ?? 50;
  const totalCategories = categories?.length ?? 25;

  const stats = [
    {
      label: 'Obras Clássicas',
      value: `${totalBooks}`,
      desc: 'Textos integrais para leitura e estudo',
      icon: BookOpen
    },
    {
      label: 'Autores Canônicos',
      value: `${totalAuthors}`,
      desc: 'Dos Padres Apostólicos aos clássicos modernos',
      icon: Users
    },
    {
      label: 'Categorias Canônicas',
      value: `${totalCategories}`,
      desc: 'Tradições, gêneros literários e temas teológicos',
      icon: Layers
    },
    {
      label: '100% Gratuito & Livre',
      value: 'Domínio Público',
      desc: 'Sem assinaturas, taxas ou barreiras',
      icon: ShieldCheck
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-card/70 border-b border-library-bronze/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.label}
                className="bg-card border border-library-bronze/60 rounded-xl p-5 text-center shadow-sm"
              >
                <div className="w-9 h-9 mx-auto mb-3 rounded-full bg-library-gold/15 flex items-center justify-center text-library-dourado">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-library-wood-foreground mb-1">
                  {st.value}
                </div>
                <div className="font-heading text-xs sm:text-sm font-semibold text-library-dourado-texto uppercase tracking-wider mb-1">
                  {st.label}
                </div>
                <div className="font-body text-[11px] sm:text-xs text-muted-foreground leading-snug">
                  {st.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
