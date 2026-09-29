import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCategories } from '@/hooks/useDatabase';
import { Category } from '@/types';
import { 
  BookOpen, Clock, Compass, Layers, Feather, Scroll, Church, Heart, 
  Flame, Shield, Sparkles, ArrowRight, Loader2 
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { SectionLabel } from '@/components/SectionLabel';

interface AxisGroup {
  id: 'tradicoes' | 'generos' | 'temas';
  label: string;
  icon: any;
  desc: string;
  slugs: string[];
}

const AXES: AxisGroup[] = [
  {
    id: 'tradicoes',
    label: 'Grandes Tradições & Épocas',
    icon: Compass,
    desc: 'Navegue pelos dois milênios da história da Igreja, da Patrística antiga aos clássicos modernos.',
    slugs: [
      'patristica',
      'tradicao-oriental',
      'escolastica-e-medieval',
      'reforma-protestante',
      'puritanismo',
      'renovacao-catolica',
      'tradicao-anglicana',
      'classicos-modernos'
    ]
  },
  {
    id: 'generos',
    label: 'Formas & Gêneros Literários',
    icon: Scroll,
    desc: 'Escolha a sua forma de leitura: tratados teológicos, oratória sacra, liturgia, cartas ou catecismos.',
    slugs: [
      'tratados-teologicos',
      'espiritualidade',
      'sermoes',
      'epistolas',
      'credos-e-confissoes',
      'liturgia-e-oracao',
      'comentarios-biblicos',
      'apologetica-e-filosofia',
      'alegorias-e-literatura'
    ]
  },
  {
    id: 'temas',
    label: 'Grandes Temas Teológicos',
    icon: Layers,
    desc: 'Explore a doutrina cristã organizada por seus eixos espirituais e teológicos centrais.',
    slugs: [
      'graca-e-justificacao',
      'cristologia',
      'trindade-e-espirito-santo',
      'oracao-e-contemplacao',
      'combate-espiritual',
      'amor-divino-e-virtudes',
      'eclesiologia-e-sacramentos',
      'providencia-e-escatologia'
    ]
  }
];

function getCategoryIcon(slug: string) {
  switch (slug) {
    case 'patristica':
    case 'escolastica-e-medieval':
      return <Church className="w-5 h-5 text-library-dourado" />;
    case 'tradicao-oriental':
    case 'espiritualidade':
      return <Flame className="w-5 h-5 text-amber-500" />;
    case 'reforma-protestante':
    case 'puritanismo':
      return <BookOpen className="w-5 h-5 text-emerald-500" />;
    case 'renovacao-catolica':
    case 'amor-divino-e-virtudes':
      return <Heart className="w-5 h-5 text-rose-500" />;
    case 'tradicao-anglicana':
    case 'liturgia-e-oracao':
      return <Feather className="w-5 h-5 text-blue-500" />;
    case 'credos-e-confissoes':
    case 'apologetica-e-filosofia':
      return <Shield className="w-5 h-5 text-purple-500" />;
    case 'oracao-e-contemplacao':
    case 'trindade-e-espirito-santo':
      return <Sparkles className="w-5 h-5 text-library-dourado" />;
    default:
      return <Layers className="w-5 h-5 text-library-dourado" />;
  }
}

export default function Categorias() {
  usePageTitle('As Estantes & Categorias Canônicas');
  const navigate = useNavigate();
  const location = useLocation();
  const { data: categories, isLoading } = useCategories();

  const [activeTab, setActiveTab] = useState<'tradicoes' | 'generos' | 'temas'>('tradicoes');

  useEffect(() => {
    if (location.hash === '#temas') {
      setActiveTab('temas');
    } else if (location.hash === '#generos') {
      setActiveTab('generos');
    }
  }, [location.hash]);

  const currentAxis = AXES.find((a) => a.id === activeTab) || AXES[0];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <SectionLabel tone="gold" className="justify-center mb-3">
            Taxonomia Canônica em 3 Eixos
          </SectionLabel>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-library-wood-foreground mb-4">
            As Estantes do Scriptorium
          </h1>
          <p className="font-body text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Uma classificação clássica e transparente para orientar a sua pesquisa e devoção através das grandes tradições, formas literárias e temas da teologia cristã.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {AXES.map((axis) => {
            const Icon = axis.icon;
            const isActive = activeTab === axis.id;
            return (
              <button
                key={axis.id}
                onClick={() => setActiveTab(axis.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-heading text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                  isActive
                    ? 'bg-library-gold text-library-wood border-library-dourado shadow-golden scale-105'
                    : 'bg-card border-library-bronze/60 text-library-wood-foreground hover:border-library-dourado hover:bg-library-gold/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{axis.label}</span>
              </button>
            );
          })}
        </div>

        {/* Axis Description */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="font-body text-sm text-muted-foreground italic">
            {currentAxis.desc}
          </p>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-library-gold mr-3" />
            <span className="font-body text-library-bronze-foreground">Carregando estantes...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentAxis.slugs.map((slug) => {
              const catData = categories?.find((c) => c.slug === slug);
              if (!catData) return null;

              return (
                <div
                  key={catData.slug}
                  onClick={() => navigate(`/categorias/${catData.slug}`)}
                  className="group flex flex-col justify-between bg-card/95 hover:bg-card border border-library-bronze/70 hover:border-library-dourado rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-book hover:shadow-golden cursor-pointer parchment-bg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-library-gold/15 flex items-center justify-center">
                        {getCategoryIcon(catData.slug)}
                      </div>
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-library-gold/10 border border-library-bronze/40 text-library-dourado-texto">
                        {catData.bookCount} {catData.bookCount === 1 ? 'obra' : 'obras'}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-library-wood-foreground group-hover:text-library-dourado-texto transition-colors mb-2">
                      {catData.name}
                    </h3>

                    <p className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {catData.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-library-bronze/20 flex items-center justify-between text-xs font-heading font-semibold text-library-dourado-texto group-hover:text-library-dourado">
                    <span>Explorar Estante</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
