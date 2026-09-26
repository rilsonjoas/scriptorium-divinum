import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookCard } from '@/components/BookCard';
import { SafeImage } from '@/components/SafeImage';
import { ArrowLeft, Calendar, Loader2, User, BookOpen, ScrollText, Landmark, Award } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useAuthorWithBooks } from '@/hooks/useDatabase';
import { getAuthorRichInfo } from '@/data/authorsRichData';
import { useTranslation } from 'react-i18next';

const AutorDetalhes = () => {
  const { t } = useTranslation();
  const { authorSlug } = useParams<{ authorSlug: string }>();
  const { data: author, isLoading, error } = useAuthorWithBooks(authorSlug || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-library-gold mr-3" />
            <span className="font-body text-library-bronze-foreground text-lg">{t('autor.carregando')}</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !author) {
    return <Navigate to="/404" replace />;
  }

  const richInfo = getAuthorRichInfo(author.slug);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* NAVEGAÇÃO DE VOLTA */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="font-body text-library-bronze-foreground hover:text-library-wood-foreground">
            <Link to="/autores">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('autor.voltarAutores')}
            </Link>
          </Button>
        </div>

        {/* CARTÃO PRINCIPAL DO AUTOR (LAYOUT TONDO & BIBLIOTECA CLÁSSICA) */}
        <Card className="bg-card/95 backdrop-blur-sm border-library-bronze shadow-book parchment-bg mb-10 overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* MOLDURA CIRCULAR TONDO DOURADA */}
              <div className="frame-tondo w-36 h-36 md:w-44 md:h-44 flex-shrink-0 group">
                <SafeImage
                  src={author.portraitImageUrl}
                  alt={`Retrato de ${author.name}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  fallback={
                    <div className="w-full h-full flex items-center justify-center bg-library-wood/20">
                      <User className="h-16 w-16 text-library-gold" />
                    </div>
                  }
                />
              </div>

              {/* DADOS DE IDENTIFICAÇÃO DO AUTOR */}
              <div className="text-center md:text-left flex-1 min-w-0">
                {richInfo?.historicalPeriod && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-library-gold/20 text-library-wood-foreground border border-library-dourado/40 mb-3 font-body">
                    <Landmark className="h-3.5 w-3.5 text-library-gold shrink-0" />
                    {richInfo.historicalPeriod}
                  </span>
                )}

                <h1 className="font-display text-3xl md:text-4xl font-bold text-library-wood-foreground mb-2 break-words">
                  {author.name}
                </h1>

                {/* ANOS DE VIDA */}
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground mb-4 font-body">
                  <Calendar className="h-4 w-4 text-library-bronze-foreground" />
                  <span className="font-medium">
                    {author.birthYear && author.deathYear
                      ? `${author.birthYear} — ${author.deathYear} d.C.`
                      : author.birthYear
                        ? `c. ${author.birthYear}`
                        : 'Período Clássico'}
                  </span>
                </div>

                {/* TAGS DE TRADIÇÃO E TEMAS CHAVE */}
                <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mb-4">
                  {author.denominationOrTradition?.map((tradition) => (
                    <span
                      key={tradition}
                      className="px-2.5 py-0.5 text-xs bg-library-wood text-library-gold rounded-full font-body font-medium shadow-xs"
                    >
                      {tradition}
                    </span>
                  ))}
                  {richInfo?.keyThemes?.map((theme) => (
                    <span
                      key={theme}
                      className="px-2.5 py-0.5 text-xs bg-library-parchment-surface text-library-wood-foreground border border-library-bronze/40 rounded-full font-body"
                    >
                      {theme}
                    </span>
                  ))}
                </div>

                {/* RESUMO BIOGRÁFICO PADRÃO */}
                {author.bioSummary && (
                  <p className="font-body text-base text-muted-foreground leading-relaxed max-w-3xl">
                    {author.bioSummary}
                  </p>
                )}
              </div>
            </div>

            {/* BANNER DA CITAÇÃO DE ASSINATURA (.signature-quote) */}
            {richInfo?.signatureQuote && (
              <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-library-wood/10 via-library-gold/15 to-library-wood/10 border-y-2 border-library-dourado/40 text-center relative shadow-xs">
                <span className="text-2xl text-library-gold block mb-1">❦</span>
                <blockquote className="signature-italic text-lg md:text-xl text-library-wood-foreground max-w-3xl mx-auto leading-relaxed">
                  “{richInfo.signatureQuote}”
                </blockquote>
                <cite className="block mt-2 font-body text-xs md:text-sm font-semibold uppercase tracking-widest text-library-bronze-foreground">
                  — {author.name}, <span className="italic font-normal lowercase">{richInfo.signatureQuoteSource}</span>
                </cite>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SEÇÃO ACADÊMICA: CONTEXTO HISTÓRICO & CONTRIBUIÇÕES */}
        {richInfo && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* HISTÓRIA E CONTEXTO */}
            <Card className="border-library-bronze parchment-bg bg-card/90 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-heading text-xl font-semibold text-library-wood-foreground mb-4 flex items-center gap-2">
                  <ScrollText className="h-5 w-5 text-library-gold" />
                  {t('autor.vidaEContexto')}
                </h3>
                <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                  {richInfo.historicalContext}
                </p>
              </CardContent>
            </Card>

            {/* PRINCIPAIS CONTRIBUIÇÕES E LEGADO */}
            <Card className="border-library-bronze parchment-bg bg-card/90 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-heading text-xl font-semibold text-library-wood-foreground mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-library-gold" />
                  {t('autor.principaisContribuicoes')}
                </h3>
                <ul className="space-y-3 mb-4">
                  {richInfo.majorContributions.map((contrib, idx) => (
                    <li key={idx} className="font-body text-xs md:text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-library-gold font-bold">•</span>
                      <span>{contrib}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-library-bronze/30">
                  <p className="font-body text-xs md:text-sm italic text-library-bronze-foreground">
                    <strong className="font-semibold not-italic text-library-wood-foreground">{t('autor.legadoOcidental')}</strong> {richInfo.legacySummary}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CATÁLOGO DE OBRAS DO AUTOR NO SCRIPTORIUM */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-semibold text-library-wood-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-library-gold" />
            {t('autor.obrasDe', { name: author.name })}
          </h2>
          <span className="font-body text-xs font-semibold px-3 py-1 bg-library-wood text-library-gold rounded-full">
            {author.books?.length || 0} {author.books?.length === 1 ? t('autor.obra') : t('autor.obras')}
          </span>
        </div>

        {author.books && author.books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {author.books.map((book) => (
              <BookCard key={book.id} book={{ ...book, author }} variant="list" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card/60 rounded-lg border border-dashed border-library-bronze">
            <BookOpen className="h-10 w-10 text-library-gold/50 mx-auto mb-3" />
            <p className="font-body text-library-bronze-foreground text-base">
              {t('autor.semObras')}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AutorDetalhes;
