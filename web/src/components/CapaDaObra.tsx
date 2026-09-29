import { SafeImage } from '@/components/SafeImage';
import { CapaTipografica } from '@/components/CapaTipografica';
import { usaCapaTipografica } from '@/utils/capa';

interface CapaDaObraProps {
  titulo: string;
  autor?: string;
  coverImageUrl?: string | null;
}

/**
 * Capa de uma obra: a imagem quando há capa de verdade; senão (ou se a
 * imagem falhar) a capa tipográfica desenhada na hora. Ocupa o contêiner.
 */
export function CapaDaObra({ titulo, autor, coverImageUrl }: CapaDaObraProps) {
  const tipografica = <CapaTipografica titulo={titulo} autor={autor} className="w-full h-full" />;
  if (usaCapaTipografica(coverImageUrl)) return tipografica;
  return <SafeImage src={coverImageUrl ?? undefined} alt={`Capa de ${titulo}`} className="w-full h-full object-cover" fallback={tipografica} />;
}
