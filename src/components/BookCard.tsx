import { Book } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Download, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  variant?: 'grid' | 'spine' | 'list' | 'compact';
}

export function BookCard({ book, variant = 'grid' }: BookCardProps) {
  if (variant === 'compact') {
    return (
      <Card className="group bg-card/95 backdrop-blur-sm border-library-bronze shadow-book hover:shadow-deep transition-all duration-300 hover:-translate-y-1 parchment-bg">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-3">
            {/* Book Cover - Smaller and centered */}
            <div className="flex-shrink-0 w-16 h-24 bg-gradient-leather rounded-lg shadow-golden border-2 border-library-bronze relative overflow-hidden mx-auto">
              {book.coverImageUrl ? (
                <img
                  src={book.coverImageUrl}
                  alt={`Capa de ${book.title}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-library-gold" />
                </div>
              )}
              <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-library-gold"></div>
              <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-library-gold"></div>
            </div>

            {/* Book Info */}
            <div className="text-center">
              <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-library-bronze transition-colors mb-1 line-clamp-2">
                {book.title}
              </h3>
              {book.originalTitle && (
                <p className="font-body text-xs text-muted-foreground italic mb-2 line-clamp-1">
                  {book.originalTitle}
                </p>
              )}

              <div className="text-xs text-muted-foreground mb-2 font-body">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <User className="h-3 w-3" />
                  <span className="line-clamp-1">{book.author.name}</span>
                </div>
                {book.publicationYearOriginal && (
                  <div className="flex items-center justify-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{book.publicationYearOriginal}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-3 line-clamp-2 font-body">
                {book.description}
              </p>

              {/* Categories - Show only first 2 */}
              {book.categories && book.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3 justify-center">
                  {book.categories.slice(0, 2).map((category) => (
                    <span
                      key={category}
                      className="px-2 py-0.5 text-xs bg-library-gold/20 text-library-bronze rounded-md font-body"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col space-y-2">
                <Button asChild size="sm" className="bg-library-wood hover:bg-library-bronze text-library-gold font-body w-full">
                  <Link to={`/livros/${book.id}`}>
                    <BookOpen className="h-3 w-3 mr-1" />
                    Ver Detalhes
                  </Link>
                </Button>
                <div className="flex space-x-1">
                  {book.onlineReadPath && (
                    <Button asChild variant="outline" size="sm" className="border-library-bronze text-library-bronze hover:bg-library-bronze hover:text-primary-foreground font-body flex-1 text-xs">
                      <Link to={`/ler/${book.id}`}>
                        <BookOpen className="h-3 w-3 mr-1" />
                        Ler
                      </Link>
                    </Button>
                  )}
                  {book.downloadLinks && book.downloadLinks.length > 0 && (
                    <Button variant="ghost" size="sm" className="text-library-bronze hover:text-library-wood font-body flex-1 text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'spine') {
    return (
      <div className="book-spine w-16 h-80 relative group cursor-pointer transform hover:scale-105 transition-all duration-300">
        <div className="w-full h-full bg-gradient-to-r from-library-leather via-library-wood to-library-leather border-l-4 border-library-gold shadow-book rounded-r-lg">
          <div className="writing-mode-vertical-rl text-orientation-mixed h-full flex items-center justify-center p-4">
            <span className="text-library-gold font-heading text-sm font-medium transform rotate-180">
              {book.title}
            </span>
          </div>
          <div className="absolute bottom-4 left-2 w-2 h-2 bg-library-gold rounded-full"></div>
          <div className="absolute bottom-8 left-2 w-2 h-2 bg-library-gold rounded-full"></div>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-library-wood/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-lg flex flex-col items-center justify-center p-2 text-center">
          <span className="text-library-gold font-body text-xs mb-2 line-clamp-3">
            {book.title}
          </span>
          <span className="text-library-gold/80 font-body text-xs">
            {book.author.name}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card className="group bg-card/95 backdrop-blur-sm border-library-bronze shadow-book hover:shadow-deep transition-all duration-300 hover:-translate-y-1 parchment-bg">
      <CardContent className="p-6">
        <div className="flex space-x-4">
          {/* Book Cover */}
          <div className="flex-shrink-0 w-24 h-32 bg-gradient-leather rounded-lg shadow-golden border-2 border-library-bronze relative overflow-hidden">
            {book.coverImageUrl ? (
              <img
                src={book.coverImageUrl}
                alt={`Capa de ${book.title}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-library-gold" />
              </div>
            )}
            {/* Ornamental corner */}
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-library-gold"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-library-gold"></div>
          </div>

          {/* Book Info */}
          <div className="flex-1">
            <div className="mb-3">
              <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-library-bronze transition-colors mb-1">
                {book.title}
              </h3>
              {book.originalTitle && (
                <p className="font-body text-sm text-muted-foreground italic">
                  {book.originalTitle}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3 font-body">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{book.author.name}</span>
              </div>
              {book.publicationYearOriginal && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{book.publicationYearOriginal}</span>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 font-body">
              {book.description}
            </p>

            {/* Categories */}
            {book.categories && book.categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {book.categories.slice(0, 3).map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 text-xs bg-library-gold/20 text-library-bronze rounded-md font-body"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              <Button asChild size="sm" className="bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                <Link to={`/livros/${book.id}`}>
                  <BookOpen className="h-3 w-3 mr-1" />
                  Detalhes
                </Link>
              </Button>
              {book.onlineReadPath && (
                <Button asChild variant="outline" size="sm" className="border-library-bronze text-library-bronze hover:bg-library-bronze hover:text-primary-foreground font-body">
                  <Link to={`/ler/${book.id}`}>
                    <BookOpen className="h-3 w-3 mr-1" />
                    Ler Online
                  </Link>
                </Button>
              )}
              {book.downloadLinks && book.downloadLinks.length > 0 && (
                <Button variant="ghost" size="sm" className="text-library-bronze hover:text-library-wood font-body">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}