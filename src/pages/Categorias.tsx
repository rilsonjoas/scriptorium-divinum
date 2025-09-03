import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookCard } from '@/components/BookCard';
import { useBooks } from '@/hooks/useDatabase';
import { Book, Category } from '@/types';
import { BookOpen, Clock, Globe, Heart, ArrowRight } from 'lucide-react';

const categories: Category[] = [
  {
    slug: 'patristica',
    name: 'Patrística',
    description: 'Obras dos Padres da Igreja, que estabeleceram as bases doutrinárias do cristianismo primitivo.',
    period: 'Séc. I - VIII'
  },
  {
    slug: 'autobiografia-espiritual',
    name: 'Autobiografia Espiritual',
    description: 'Relatos pessoais de jornadas espirituais e experiências de conversão.',
    period: 'Diversas épocas'
  },
  {
    slug: 'filosofia-crista',
    name: 'Filosofia Cristã',
    description: 'Obras que integram o pensamento filosófico com a doutrina cristã.',
    period: 'Séc. II - presente'
  },
  {
    slug: 'comentario-biblico',
    name: 'Comentário Bíblico',
    description: 'Interpretações e análises detalhadas das Escrituras Sagradas.',
    period: 'Diversas épocas'
  },
  {
    slug: 'teologia',
    name: 'Teologia',
    description: 'Estudos sistemáticos sobre Deus e a doutrina cristã.',
    period: 'Diversas épocas'
  },
  {
    slug: 'espiritualidade',
    name: 'Espiritualidade',
    description: 'Obras dedicadas ao desenvolvimento da vida espiritual e devoção.',
    period: 'Diversas épocas'
  },
  {
    slug: 'meditacoes',
    name: 'Meditações',
    description: 'Reflexões contemplativas sobre temas espirituais e religiosos.',
    period: 'Diversas épocas'
  },
  {
    slug: 'contra-reforma',
    name: 'Contra-Reforma',
    description: 'Obras do movimento de renovação católica dos séculos XVI e XVII.',
    period: 'Séc. XVI - XVII'
  }
];

function getCategoryIcon(slug: string) {
  switch (slug) {
    case 'patristica':
      return <Clock className="h-5 w-5" />;
    case 'autobiografia-espiritual':
      return <Heart className="h-5 w-5" />;
    case 'filosofia-crista':
      return <Globe className="h-5 w-5" />;
    default:
      return <BookOpen className="h-5 w-5" />;
  }
}

function getBooksInCategory(categoryName: string, books: Book[] = []): Book[] {
  return books.filter(book => 
    book.categories?.some(cat => 
      cat.toLowerCase().replace(/[^a-z]/g, '-') === categoryName ||
      cat.toLowerCase() === categoryName.replace('-', ' ')
    )
  );
}

export default function Categorias() {
  const navigate = useNavigate();
  const { data: books } = useBooks();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-library-wood mb-4 golden-foil">
            Categorias Teológicas
          </h1>
          <p className="text-lg text-library-bronze font-body max-w-3xl">
            Explore nossa biblioteca organizada por áreas temáticas, desde os primeiros Padres da Igreja 
            até os grandes teólogos da história cristã.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => {
            const booksInCategory = getBooksInCategory(category.slug, books || []);
            
            return (
              <Card 
                key={category.slug}
                className="cursor-pointer transition-all duration-300 hover:shadow-lg border-library-bronze bg-library-parchment hover:ring-2 hover:ring-library-gold hover:shadow-golden group"
                onClick={() => navigate(`/categorias/${category.slug}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-library-gold rounded-lg flex items-center justify-center text-library-wood">
                      {getCategoryIcon(category.slug)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="font-display text-lg text-library-wood group-hover:text-library-gold transition-colors">
                        {category.name}
                      </CardTitle>
                      {category.period && (
                        <Badge variant="secondary" className="text-xs bg-library-bronze text-library-parchment">
                          {category.period}
                        </Badge>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-library-bronze group-hover:text-library-gold transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                  <CardDescription className="font-body text-library-bronze text-sm leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-library-bronze">
                    <span className="font-body">
                      {booksInCategory.length} {booksInCategory.length === 1 ? 'obra' : 'obras'}
                    </span>
                    <span className="text-xs group-hover:text-library-gold transition-colors">
                      Ver categoria →
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>


        <div className="mt-16 bg-gradient-leather rounded-lg p-8 text-center">
          <h3 className="font-display text-xl font-semibold text-library-gold mb-3">
            Sugerir Nova Categoria
          </h3>
          <p className="text-library-parchment font-body mb-4">
            Conhece uma área teológica importante que não está representada? 
            Gostaríamos de ouvir suas sugestões.
          </p>
          <button className="bg-library-gold text-library-wood px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors font-body">
            Enviar Sugestão
          </button>
        </div>
      </div>
    </Layout>
  );
}