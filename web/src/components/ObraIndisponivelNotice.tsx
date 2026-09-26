import { Link } from 'react-router-dom';
import { BookOpen, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBook } from '@/hooks/useDatabase';

interface ObraIndisponivelNoticeProps {
  /** slug da edição original (latim/inglês), quando existe no acervo */
  relatedEditionSlug?: string | null;
}

/**
 * Estado explícito de obra sem texto disponível.
 *
 * Sete obras do acervo são traduções portuguesas cujo texto nunca foi
 * vinculado. O site não prometia nada — o botão "Ler Online" é
 * condicionado a `textAvailable` — mas também não explicava o silêncio:
 * o leitor caía numa página com capa, autor e descrição, e nenhuma
 * explicação de por que não havia o que ler. É a diferença entre
 * "acabou" e "isto aqui não existe".
 *
 * Quando existe a edição original no acervo, o aviso **aponta para
 * ela** em vez de ser beco sem saída. Quando não existe, diz só a
 * verdade, sem inventar link.
 *
 * A edição original é buscada pela API, que já resolve por slug — não
 * há campo de título guardado no frontend, e guardar seria duplicar
 * dado que o servidor tem.
 */
export function ObraIndisponivelNotice({ relatedEditionSlug }: ObraIndisponivelNoticeProps) {
  const { data: original } = useBook(relatedEditionSlug || '');

  return (
    <section
      aria-label="Estado da obra"
      className="rounded-lg border border-library-bronze/60 bg-library-gold/5 p-4 space-y-3"
    >
      <p className="font-body text-sm text-library-wood-foreground flex items-start gap-2">
        <Languages className="h-4 w-4 shrink-0 mt-0.5 text-library-bronze-foreground" />
        <span>
          <strong className="font-semibold">
            Esta obra ainda não está disponível para leitura online.
          </strong>{' '}
          A tradução em português não foi vinculada ao acervo, e não vamos
          oferecer o que não temos.
        </span>
      </p>

      {relatedEditionSlug && original && (
        <Button asChild variant="outline" size="sm" className="w-full border-library-bronze font-body">
          <Link to={`/ler/${original.slug || original.id}`}>
            <BookOpen className="mr-2 h-4 w-4" />
            Ler a edição original em {original.language}
          </Link>
        </Button>
      )}
    </section>
  );
}
