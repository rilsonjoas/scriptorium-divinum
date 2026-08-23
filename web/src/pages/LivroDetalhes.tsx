import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Download, Calendar, User, Globe, Languages, Tag, ArrowLeft, Loader2, Star, ShoppingBag, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { isFavorite, toggleFavorite } from '@/utils/favorites';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useBook } from '@/hooks/useDatabase';
import { SafeImage } from '@/components/SafeImage';
import { AdSlot } from '@/components/ads/AdSlot';
import { AcademicCitationDialog } from '@/components/reader/AcademicCitationDialog';

const AMAZON_AFFILIATE_TAG = import.meta.env.VITE_AMAZON_TAG ?? 'rilson-20';

const LivroDetalhes = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { data: book, isLoading, error } = useBook(bookId || '');

  const [fav, setFav] = useState(false);
  const [citationOpen, setCitationOpen] = useState(false);
  useEffect(() => {
    if (book?.slug) setFav(isFavorite(book.slug));
  }, [book?.slug]);

  const scanIdentifier = (() => {
    const link = book?.downloadLinks?.find(l => l.url.includes('archive.org/download/'));
    if (!link) return null;
    const m = link.url.match(/archive\.org\/download\/([^/]+)\//);
    return m ? decodeURIComponent(m[1]) : null;
  })();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-library-gold mr-3" />
            <span className="font-body text-library-bronze text-lg">Carregando detalhes da obra...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !book) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="font-body text-library-bronze hover:text-library-wood">
            <Link to="/livros">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Catálogo
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Actions */}
          <div className="lg:col-span-1">
            <Card className="bg-card/95 backdrop-blur-sm border-library-bronze shadow-book parchment-bg">
              <CardContent className="p-6">
                {/* Cover Image */}
                <div className="w-full h-80 bg-gradient-leather rounded-lg shadow-golden border-2 border-library-bronze relative overflow-hidden mb-6">
                  <SafeImage
                    src={book.coverImageUrl}
                    alt={`Capa de ${book.title}`}
                    className="w-full h-full object-cover"
                    fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-library-gold" />
                      </div>
                    }
                  />
                  {/* Ornamental corners */}
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-library-gold"></div>
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-library-gold"></div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {book.textAvailable && (
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-library-gold hover:bg-library-gold/90 text-library-wood font-semibold font-body shadow-golden text-base py-3"
                    >
                      <Link to={`/ler/${book.slug || book.id}`}>
                        <BookOpen className="mr-2 h-5 w-5" />
                        Ler Online
                      </Link>
                    </Button>
                  )}

                  {book.downloadLinks && book.downloadLinks.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-body text-sm font-semibold text-foreground">Downloads:</h4>
                      {book.downloadLinks.map((link, index) => (
                        <Button
                          key={index}
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full border-2 border-library-wood/80 bg-card text-library-wood hover:bg-library-wood hover:text-library-gold font-semibold font-body shadow-sm"
                        >
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-3.5 w-3.5 text-library-crimson" />
                            {link.format.toUpperCase()}
                            {link.source && ` (${link.source})`}
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}

                  {!book.textAvailable && scanIdentifier && (
                    <details className="rounded-lg border-2 border-library-bronze bg-library-gold/5">
                      <summary className="cursor-pointer select-none px-3 py-2 font-body text-sm font-semibold text-library-wood flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-library-gold" />
                        Ler o escaneamento online
                      </summary>
                      <div className="p-2">
                        <iframe
                          src={`https://archive.org/embed/${scanIdentifier}`}
                          title={`Escaneamento de ${book.title}`}
                          className="w-full rounded border border-library-bronze/30"
                          style={{ height: '70vh' }}
                          allowFullScreen
                          loading="lazy"
                        />
                        <p className="text-xs text-muted-foreground font-body mt-1">
                          Leitura do escaneamento original, via Internet Archive.
                        </p>
                      </div>
                    </details>
                  )}

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-2 border-library-bronze bg-card text-library-wood hover:bg-library-wood hover:text-library-gold font-semibold font-body shadow-sm"
                  >
                    <a
                      href={`https://www.amazon.com.br/s?k=${encodeURIComponent(`${book.title} ${book.author.name}`)}&tag=${AMAZON_AFFILIATE_TAG}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4 text-library-bronze" />
                      Edição impressa (Amazon)
                    </a>
                  </Button>

                  <Button
                    onClick={() => setCitationOpen(true)}
                    variant="outline"
                    size="sm"
                    className="w-full border-2 border-library-gold bg-library-gold/15 text-library-wood hover:bg-library-gold hover:text-library-wood font-semibold font-body shadow-sm"
                  >
                    <GraduationCap className="mr-2 h-4 w-4 text-library-crimson" />
                    Como Citar esta Obra
                  </Button>
                </div>

                {book.licenseType && book.licenseType !== 'public-domain' && (
                  <div className="mt-4 p-3 rounded-lg border border-library-bronze/40 bg-library-gold/10">
                    <p className="text-xs text-library-bronze font-body">
                      Publicado sob licença aberta (não é domínio público simples).
                      {book.attributionText && <> {book.attributionText}</>}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <AcademicCitationDialog
              open={citationOpen}
              onOpenChange={setCitationOpen}
              title={book.title}
              author={book.author.name}
              translator={book.translator}
              publicationYear={book.publicationYearOriginal}
              slug={book.slug}
            />
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Title and Basic Info */}
              <div>
                <h1 className="font-display text-4xl font-bold text-library-wood mb-2">
                  {book.title}
                </h1>
                {book.originalTitle && (
                  <p className="font-heading text-xl text-muted-foreground italic mb-4">
                    {book.originalTitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-body">
                  {book.slug && (
                    <button
                      type="button"
                      onClick={() => setFav(toggleFavorite(book.slug!))}
                      aria-pressed={fav}
                      className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 transition-colors font-body ${
                        fav
                          ? 'border-library-gold bg-library-gold/20 text-library-wood'
                          : 'border-library-bronze/50 text-library-bronze hover:bg-library-gold/10'
                      }`}
                      title={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Star className={`h-4 w-4 ${fav ? 'fill-library-gold text-library-gold' : ''}`} />
                      {fav ? 'Nos favoritos' : 'Favoritar'}
                    </button>
                  )}
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <Link
                      to={`/autores/${book.author.slug}`}
                      className="text-library-bronze hover:text-library-wood transition-colors"
                    >
                      {book.author.name}
                    </Link>
                  </div>
                  {book.publicationYearOriginal && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Publicado em {book.publicationYearOriginal}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>{book.language}</span>
                  </div>
                  {book.originalLanguages && book.originalLanguages.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Languages className="h-4 w-4" />
                      <span>Original em {book.originalLanguages.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Translation Info */}
              {book.translator && (
                <Card className="bg-library-gold/5 border-library-bronze/30">
                  <CardContent className="p-4">
                    <h3 className="font-body text-sm font-medium text-foreground mb-1">Tradução</h3>
                    <p className="font-body text-sm text-muted-foreground">
                      Traduzido por {book.translator}
                      {book.publicationYearTranslation && ` em ${book.publicationYearTranslation}`}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card className="bg-card/95 backdrop-blur-sm border-library-bronze shadow-book parchment-bg">
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                    Sobre a Obra
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {book.description}
                  </p>
                </CardContent>
              </Card>

              {/* Categories and Tags */}
              {(book.categories || book.tags) && (
                <Card className="bg-card/95 backdrop-blur-sm border-library-bronze shadow-book parchment-bg">
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                      Classificação
                    </h3>
                    
                    {book.categories && book.categories.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-body text-sm font-medium text-foreground mb-2 flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          Categorias
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {book.categories.map((category) => (
                            <span
                              key={category}
                              className="px-3 py-1 text-sm bg-library-gold/20 text-library-bronze rounded-md font-body"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {book.tags && book.tags.length > 0 && (
                      <div>
                        <h4 className="font-body text-sm font-medium text-foreground mb-2">
                          Palavras-chave
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {book.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-library-bronze/10 text-library-bronze rounded font-body"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Author Bio */}
              <Card className="bg-card/95 backdrop-blur-sm border-library-bronze shadow-book parchment-bg">
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                    Sobre o Autor
                  </h3>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-leather rounded-full shadow-golden border-2 border-library-bronze relative overflow-hidden">
                      {book.author.portraitImageUrl ? (
                        <img
                          src={book.author.portraitImageUrl}
                          alt={`Retrato de ${book.author.name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="h-6 w-6 text-library-gold" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-body font-medium text-foreground mb-1">
                        {book.author.name}
                      </h4>
                      <p className="font-body text-sm text-muted-foreground mb-2">
                        {book.author.birthYear && book.author.deathYear 
                          ? `${book.author.birthYear} - ${book.author.deathYear}`
                          : book.author.birthYear 
                            ? `c. ${book.author.birthYear}`
                            : 'Período clássico'
                        }
                      </p>
                      {book.author.bioSummary && (
                        <p className="font-body text-sm text-muted-foreground leading-relaxed">
                          {book.author.bioSummary}
                        </p>
                      )}
                      <Button 
                        asChild 
                        variant="ghost" 
                        size="sm" 
                        className="mt-3 p-0 h-auto font-body text-library-bronze hover:text-library-wood"
                      >
                        <Link to={`/autores/${book.author.slug}`}>
                          Ver mais obras deste autor →
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="py-8">
          <AdSlot slotId="5170899723" />
        </div>
      </div>
    </Layout>
  );
};

export default LivroDetalhes;