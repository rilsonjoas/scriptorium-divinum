import { useState, type ReactNode } from 'react';

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallback: ReactNode;
}

/**
 * <img> que cai pro fallback quando `src` é vazio OU quando o arquivo
 * não existe de verdade (onError) — o banco pode ter uma URL de capa/
 * retrato preenchida (não-nula) mas apontando pra um arquivo que nunca
 * foi enviado ao servidor; sem isso, o navegador só mostra um ícone de
 * imagem quebrada sobre o fundo. Achado real 2026-08-16 (Compêndio de
 * Teologia, capa de São Tomás de Aquino).
 */
export function SafeImage({ src, alt, className, fallback }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <>{fallback}</>;
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}
