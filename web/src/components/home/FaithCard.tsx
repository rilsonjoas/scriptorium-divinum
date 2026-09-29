import { Link } from 'react-router-dom';
import { Book } from '@/types';
import { bookPath } from '@/lib/bookRoutes';
import { ArrowRight, BookOpen } from 'lucide-react';

interface FaithCardProps {
  book: Book;
  tagline?: string;
  era?: string;
}

export function FaithCard({ book, tagline, era }: FaithCardProps) {
  const displayTagline = tagline || book.author?.name || 'Clássico da Tradição';
  const displayEra = era || (book.publicationYearOriginal ? `${book.publicationYearOriginal}` : 'Tradição Cristã');

  return (
    <Link
      to={bookPath(book)}
      className="group flex flex-col justify-between bg-card/90 hover:bg-card border border-library-bronze/60 hover:border-library-dourado rounded-lg p-5 transition-all duration-300 shadow-sm hover:shadow-golden relative overflow-hidden text-left"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-library-bronze/40 group-hover:bg-library-dourado transition-colors"></div>
      
      <div>
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-library-bronze-foreground/80 mb-2 font-mono tracking-wider">
          <span className="font-semibold text-library-bronze-foreground truncate max-w-[65%]">{displayTagline}</span>
          <span className="shrink-0">{displayEra}</span>
        </div>

        <h3 className="font-heading text-lg sm:text-xl font-bold text-library-wood-foreground group-hover:text-library-dourado-texto transition-colors mb-2 leading-snug">
          <em>{book.title}</em>
        </h3>

        <p className="font-body text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
          {book.description}
        </p>
      </div>

      <div className="pt-2 border-t border-library-bronze/20 flex items-center justify-between text-xs font-heading font-semibold text-library-dourado-texto group-hover:text-library-dourado transition-colors">
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Ler Obra
        </span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
