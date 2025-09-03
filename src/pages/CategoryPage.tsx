import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { BookCard } from '@/components/BookCard';
import { useBooks } from '@/hooks/useDatabase';
import { Book } from '@/types';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const categoryDetails = {
  'patristica': {
    name: 'Patrística',
    description: 'Obras dos Padres da Igreja, que estabeleceram as bases doutrinárias do cristianismo primitivo. Esta categoria inclui textos fundamentais dos primeiros séculos da Igreja Cristã.',
    period: 'Séc. I - VIII',
    longDescription: 'A Patrística representa o período formativo da teologia cristã, quando os Padres da Igreja desenvolveram as doutrinas fundamentais que ainda hoje orientam a fé cristã. Estes autores enfrentaram grandes desafios teológicos, defenderam a ortodoxia contra heresias e estabeleceram as bases para o desenvolvimento posterior da teologia sistemática.'
  },
  'autobiografia-espiritual': {
    name: 'Autobiografia Espiritual',
    description: 'Relatos pessoais de jornadas espirituais e experiências de conversão.',
    period: 'Diversas épocas',
    longDescription: 'As autobiografias espirituais oferecem insights únicos sobre a experiência pessoal da fé, desde as lutas interiores até os momentos de iluminação divina. Estas obras inspiram e orientam leitores em suas próprias jornadas espirituais.'
  },
  'filosofia-crista': {
    name: 'Filosofia Cristã',
    description: 'Obras que integram o pensamento filosófico com a doutrina cristã.',
    period: 'Séc. II - presente',
    longDescription: 'A filosofia cristã busca harmonizar a razão com a fé, explorando questões fundamentais sobre a existência, a natureza de Deus, a ética e o propósito da vida humana através da lente da revelação cristã.'
  },
  'comentario-biblico': {
    name: 'Comentário Bíblico',
    description: 'Interpretações e análises detalhadas das Escrituras Sagradas.',
    period: 'Diversas épocas',
    longDescription: 'Os comentários bíblicos oferecem análises profundas e interpretações eruditas das Escrituras, auxiliando na compreensão do texto sagrado em seus contextos histórico, literário e teológico.'
  },
  'teologia': {
    name: 'Teologia',
    description: 'Estudos sistemáticos sobre Deus e a doutrina cristã.',
    period: 'Diversas épocas',
    longDescription: 'A teologia sistemática organiza e analisa as verdades da fé cristã de forma ordenada e coerente, abordando temas como a natureza de Deus, a salvação, a Igreja e a escatologia.'
  },
  'espiritualidade': {
    name: 'Espiritualidade',
    description: 'Obras dedicadas ao desenvolvimento da vida espiritual e devoção.',
    period: 'Diversas épocas',
    longDescription: 'As obras de espiritualidade orientam o crescimento na vida interior, oferecendo práticas devocionais, métodos de oração e princípios para o desenvolvimento da relação pessoal com Deus.'
  },
  'meditacoes': {
    name: 'Meditações',
    description: 'Reflexões contemplativas sobre temas espirituais e religiosos.',
    period: 'Diversas épocas',
    longDescription: 'As meditações espirituais proporcionam material para a reflexão profunda e a contemplação, ajudando os leitores a aprofundar sua compreensão dos mistérios da fé e a cultivar uma vida de oração mais rica.'
  },
  'contra-reforma': {
    name: 'Contra-Reforma',
    description: 'Obras do movimento de renovação católica dos séculos XVI e XVII.',
    period: 'Séc. XVI - XVII',
    longDescription: 'O período da Contra-Reforma produziu uma rica literatura teológica e espiritual em resposta aos desafios da Reforma Protestante, enfatizando a renovação interior da Igreja e a clarificação doutrinal.'
  }
};

function getBooksInCategory(categorySlug: string, books: Book[] = []): Book[] {
  return books.filter(book => 
    book.categories?.some(cat => 
      cat.toLowerCase().replace(/[^a-z]/g, '-') === categorySlug ||
      cat.toLowerCase() === categorySlug.replace('-', ' ')
    )
  );
}

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const { data: books, isLoading } = useBooks();

  const category = categorySlug ? categoryDetails[categorySlug as keyof typeof categoryDetails] : null;

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-library-bronze rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
              <BookOpen className="h-8 w-8 text-library-parchment" />
            </div>
            <h1 className="font-display text-2xl font-bold text-library-wood mb-2">
              Categoria não encontrada
            </h1>
            <p className="text-library-bronze font-body mb-6">
              A categoria solicitada não existe em nosso catálogo.
            </p>
            <Button 
              onClick={() => navigate('/categorias')}
              className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar às Categorias
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const booksInCategory = getBooksInCategory(categorySlug!, books || []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/categorias')}
            className="mb-4 text-library-bronze hover:text-library-wood font-body"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar às Categorias
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-library-wood" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-library-wood golden-foil">
                {category.name}
              </h1>
              {category.period && (
                <p className="text-library-bronze font-body text-lg">
                  {category.period}
                </p>
              )}
            </div>
          </div>
          
          <div className="max-w-4xl">
            <p className="text-lg text-library-bronze font-body mb-4">
              {category.description}
            </p>
            <p className="text-library-bronze font-body leading-relaxed">
              {category.longDescription}
            </p>
          </div>
        </div>

        {/* Books Count */}
        <div className="mb-8">
          <div className="bg-library-parchment border border-library-bronze rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-library-gold" />
                <span className="font-body text-library-wood">
                  {isLoading ? 'Carregando...' : `${booksInCategory.length} ${booksInCategory.length === 1 ? 'obra encontrada' : 'obras encontradas'}`}
                </span>
              </div>
              {!isLoading && booksInCategory.length > 0 && (
                <span className="text-sm text-library-bronze font-body">
                  Explore nossa seleção cuidadosamente curada
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-library-bronze font-body text-lg">
              Carregando obras...
            </p>
          </div>
        ) : booksInCategory.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {booksInCategory.map((book) => (
              <BookCard key={book.id} book={book} variant="compact" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-library-bronze rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
              <BookOpen className="h-8 w-8 text-library-parchment" />
            </div>
            <h2 className="font-display text-xl font-semibold text-library-wood mb-2">
              Ainda não temos obras nesta categoria
            </h2>
            <p className="text-library-bronze font-body text-lg mb-2">
              Nossa biblioteca está em constante crescimento.
            </p>
            <p className="text-library-bronze font-body text-sm opacity-75">
              Visite nossa página novamente em breve para ver novas adições.
            </p>
          </div>
        )}

        {/* Call to Action */}
        {booksInCategory.length > 0 && (
          <div className="mt-16 bg-gradient-leather rounded-lg p-8 text-center">
            <h3 className="font-display text-xl font-semibold text-library-gold mb-3">
              Contribua com nossa biblioteca
            </h3>
            <p className="text-library-parchment font-body mb-4">
              Conhece uma obra importante de {category.name.toLowerCase()} que não está em nossa coleção? 
              Gostaríamos de ouvir suas sugestões.
            </p>
            <Button 
              onClick={() => navigate('/contribuir')}
              className="bg-library-gold text-library-wood hover:bg-opacity-90 font-body"
            >
              Sugerir Obra
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}