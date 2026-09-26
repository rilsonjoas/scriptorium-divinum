import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Estados de carregamento e erro do catálogo.
 *
 * Bloco B (2026-09-25). Antes, cada página repetia o mesmo par:
 * spinner + "Carregando catálogo..." centralizado, e um bloco de erro
 * em `red-100`/`red-600` crus (fora do design system) que despejava
 * `error.message` — que é jargão ("Failed to fetch") — e ainda
 * resolvia com `window.location.reload()`, descartando a sessão inteira
 * para refazer uma query.
 *
 * O esqueleto reproduz a silhueta do `BookCard` (capa 64x96, duas
 * linhas de título, uma de autor) para que a grade não "pule" quando o
 * conteúdo chega.
 *
 * Acessibilidade (WCAG 2.2 A/AA = conformidade regular da
 * ABNT NBR 17225:2025):
 * - 4.1.3 Mensagens de status: o carregamento é anunciado por texto
 *   `sr-only` + `aria-busy`, e não só pelo movimento do spinner.
 * - 3.3.1 Identificação de erro: o erro é descrito em texto, e o
 *   `role="alert"` faz o leitor de tela anúncio-lo assim que aparece.
 * - 3.3.3 Sugestão de correção: a mensagem diz o que fazer, não
 *   "aconteceu um erro".
 */

/** Uma pastilha de esqueleto: a silhueta de um card. */
function CardSkeleton() {
  return (
    <div className="rounded-lg border border-library-bronze/40 bg-card/60 p-4">
      {/* capa 64x96, mesma proporção do BookCard */}
      <Skeleton className="mx-auto h-24 w-16 rounded-lg" />
      <Skeleton className="mt-4 h-4 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <Skeleton className="mt-3 h-3 w-1/3" />
    </div>
  );
}

interface CatalogSkeletonProps {
  /** quantos cards fantasma mostrar */
  count?: number;
  /** o que está carregando, para o leitor de tela anunciar */
  label?: string;
}

export function CatalogSkeleton({ count = 6, label = 'Carregando catálogo' }: CatalogSkeletonProps) {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-4">
      <span className="sr-only">{label}…</span>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

interface ErrorStateProps {
  /** o que o usuário queria fazer, em linguagem de gente */
  what?: string;
  /** o que ele pode fazer agora. Verbo + objeto, como no padrão. */
  action?: string;
  onRetry?: () => void;
}

export function ErrorState({
  what = 'Não conseguimos carregar o catálogo.',
  action = 'Tentar novamente',
  onRetry,
}: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-4 py-16 text-center">
      <div
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full border border-library-bronze/50 bg-library-crimson/10"
      >
        <AlertCircle className="h-8 w-8 text-library-crimson-foreground" />
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold text-library-wood-foreground">{what}</h3>
        <p className="font-body text-library-bronze-foreground mt-1 max-w-md">
          Isso costuma ser a conexão. Confira a internet e tente de novo — nada foi perdido.
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="font-body border-library-bronze">
          <RefreshCw className="mr-2 h-4 w-4" />
          {action}
        </Button>
      )}
    </div>
  );
}
