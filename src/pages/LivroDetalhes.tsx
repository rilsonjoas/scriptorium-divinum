import { Layout } from '@/components/Layout';
import { books } from '@/data/books';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Download, Calendar, User, Globe, Languages, Tag, ArrowLeft } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';

const LivroDetalhes = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const book = books.find(b => b.id === bookId);

  if (!book) {
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
                  {book.coverImageUrl ? (
                    <img
                      src={book.coverImageUrl}
                      alt={`Capa de ${book.title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-library-gold" />
                    </div>
                  )}
                  {/* Ornamental corners */}
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-library-gold"></div>
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-library-gold"></div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {book.onlineReadPath && (
                    <Button asChild size="lg" className="w-full bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                      <Link to={`/ler/${book.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Ler Online
                      </Link>
                    </Button>
                  )}

                  {book.downloadLinks && book.downloadLinks.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-body text-sm font-medium text-foreground">Downloads:</h4>
                      {book.downloadLinks.map((link, index) => (
                        <Button
                          key={index}
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full border-library-bronze text-library-bronze hover:bg-library-bronze hover:text-primary-foreground font-body"
                        >
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-3 w-3" />
                            {link.format.toUpperCase()}
                            {link.source && ` (${link.source})`}
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* AdSense Block */}
                <div className="mt-6 p-4 bg-library-gold/10 rounded-lg border border-library-bronze/30">
                  <p className="text-xs text-center text-library-bronze font-body">
                    [ Espaço para Google AdSense ]
                  </p>
                </div>
              </CardContent>
            </Card>
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

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-body">
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
      </div>
    </Layout>
  );
};

export default LivroDetalhes;