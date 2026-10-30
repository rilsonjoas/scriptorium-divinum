import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Book } from '@/types';
import { limparCallouts } from '@/utils/readerText';

/**
 * "Sobre esta edição": ficha em três blocos, cada um com um papel.
 *
 *  1. A obra original  — título, língua e ano do original (só o que existe).
 *  2. Esta edição      — idioma, como o texto foi feito, revisão e licença.
 *  3. Contexto         — o ensaio de abertura do arquivo, quando houver.
 *
 * Os blocos 1 e 2 vêm do banco, então são sempre exatos. O ensaio de abertura é
 * texto livre dentro do arquivo; em tradução por IA sem aprovação humana ele
 * fica recolhido e rotulado como texto de IA, porque ninguém conferiu as
 * afirmações dele (docs/GERENCIAR-ACERVO.md, "Tom e proveniência"). O usuário
 * final só precisa saber que é texto de IA; o estado interno da revisão não é
 * exibido enquanto estiver pendente.
 */

const LICENCAS: Record<string, string> = {
  'public-domain': 'Domínio público',
  'cc-by-sa-4.0': 'CC BY-SA 4.0',
  'cc-by-4.0': 'CC BY 4.0',
  'cc0': 'CC0 (domínio público)',
};

function rotuloLicenca(tipo?: string | null): string | null {
  if (!tipo) return null;
  return LICENCAS[tipo] ?? tipo;
}

function dataBr(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('pt-BR');
}

interface Props {
  book?: Pick<
    Book,
    | 'originalTitle'
    | 'originalLanguages'
    | 'publicationYearOriginal'
    | 'language'
    | 'translator'
    | 'translationIsAi'
    | 'humanReviewApprovedAt'
    | 'licenseType'
    | 'attributionText'
  > | null;
  /** Ensaio de abertura (bloco "Proveniência" do arquivo), sem o cabeçalho. */
  contexto?: string | null;
  linkObra: string;
  /** dentro de um modal: sem moldura própria, o modal já é a moldura */
  emModal?: boolean;
}

function Linha({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
      <dt className="font-body text-xs font-semibold text-library-bronze-foreground">{rotulo}</dt>
      <dd className="font-body text-sm text-library-wood-foreground">{children}</dd>
    </div>
  );
}

export function EdicaoFicha({ book, contexto, linkObra, emModal = false }: Props) {
  const ia = Boolean(book?.translationIsAi);
  const revisadoEm = dataBr(book?.humanReviewApprovedAt);
  const revisaoAprovada = Boolean(book?.humanReviewApprovedAt);
  const licenca = rotuloLicenca(book?.licenseType);

  const original: string[] = [];
  if (book?.originalTitle) original.push(book.originalTitle);
  if (book?.originalLanguages?.length) original.push(`em ${book.originalLanguages.join(', ')}`);
  if (book?.publicationYearOriginal) original.push(book.publicationYearOriginal);

  // Ensaio recolhido só quando é tradução por IA que ninguém revisou.
  const recolherContexto = ia && !revisaoAprovada;

  return (
    <section
      id="ficha-da-obra"
      aria-labelledby="ficha-da-obra-titulo"
      className={
        emModal
          ? 'p-6 pt-10'
          : 'mx-auto mt-10 max-w-3xl scroll-mt-24 rounded-lg border border-library-bronze/40 bg-library-parchment-surface/60 p-5 md:p-6'
      }
    >
      <h2 id="ficha-da-obra-titulo" className="font-heading text-xl text-library-wood-foreground mb-4">
        Sobre esta edição
      </h2>

      {book && (
        <dl className="space-y-3">
          {original.length > 0 && <Linha rotulo="Obra original">{original.join(' · ')}</Linha>}
          <Linha rotulo="Esta edição">
            {book.language}
            {ia ? ', tradução gerada por inteligência artificial' : book.translator ? `, ${book.translator}` : ''}
          </Linha>
          {ia && revisaoAprovada && (
            <Linha rotulo="Revisão">Revisão humana aprovada{revisadoEm ? ` em ${revisadoEm}` : ''}.</Linha>
          )}
          {licenca && <Linha rotulo="Licença">{licenca}</Linha>}
          {book.attributionText && <Linha rotulo="Atribuição">{book.attributionText}</Linha>}
        </dl>
      )}

      {contexto && (
        <div className="mt-5 border-t border-library-bronze/30 pt-4">
          {recolherContexto ? (
            <details>
              <summary className="cursor-pointer font-body text-sm font-semibold text-library-wood-foreground">
                Contexto histórico (texto introdutório gerado por IA)
              </summary>
              <div className="prose prose-sm prose-leitor mt-3 max-w-none text-library-bronze-foreground">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{limparCallouts(contexto)}</ReactMarkdown>
              </div>
            </details>
          ) : (
            <div className="prose prose-sm prose-leitor max-w-none text-library-bronze-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{limparCallouts(contexto)}</ReactMarkdown>
            </div>
          )}
        </div>
      )}

      <p className="mt-5 font-body text-sm text-library-bronze-foreground">
        Encontrou um erro ou um problema de direitos?{' '}
        <Link to="/sobre#contribuir" className="underline underline-offset-2 hover:text-library-wood-foreground">
          Avise-nos
        </Link>
        .
      </p>
      <Link
        to={linkObra}
        className="mt-3 inline-block font-body text-sm text-library-bronze-foreground underline underline-offset-2 hover:text-library-wood-foreground"
      >
        Ver a página da obra
      </Link>
    </section>
  );
}
