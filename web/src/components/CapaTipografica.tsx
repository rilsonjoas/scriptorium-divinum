import { CAPA_A, CAPA_L, layoutCapa } from '@/utils/capa';

const TINTA = '#2c1e13';
const BRONZE = '#8a6a3f';
const OURO = '#b08d3e';
const FUNDO = '#f4ecdc';
const SERIFA = "Georgia, 'Times New Roman', serif";

interface CapaTipograficaProps {
  titulo: string;
  autor?: string;
  className?: string;
}

/** Capa desenhada a partir de título e autor (ver utils/capa.ts). */
export function CapaTipografica({ titulo, autor = '', className }: CapaTipograficaProps) {
  const l = layoutCapa(titulo);
  const meio = CAPA_L / 2;
  return (
    <svg
      viewBox={`0 0 ${CAPA_L} ${CAPA_A}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Capa de ${titulo}`}
      className={className}
    >
      <rect width={CAPA_L} height={CAPA_A} fill={FUNDO} />
      <rect x="18" y="18" width={CAPA_L - 36} height={CAPA_A - 36} fill="none" stroke={BRONZE} strokeWidth="5" />
      <rect x="30" y="30" width={CAPA_L - 60} height={CAPA_A - 60} fill="none" stroke={OURO} strokeWidth="1.5" />
      <text x={meio} y="86" textAnchor="middle" fontFamily={SERIFA} fontSize="17" letterSpacing="7" fontWeight="bold" fill={OURO}>
        SCRIPTORIUM DIVINUM
      </text>
      <line x1={meio - 55} y1="104" x2={meio + 55} y2="104" stroke={BRONZE} strokeWidth="1.5" />
      <text x={meio} y={l.tituloY} textAnchor="middle" fontFamily={SERIFA} fontWeight="bold" fontSize={l.tamanho} fill={TINTA}>
        {l.linhas.map((linha, i) => (
          <tspan key={i} x={meio} dy={i === 0 ? 0 : l.alturaLinha}>
            {linha}
          </tspan>
        ))}
      </text>
      <text x={meio} y={l.tituloY + l.blocoAltura + 10} textAnchor="middle" fontSize="26" fill={OURO}>
        ✦
      </text>
      <text x={meio} y={l.tituloY + l.blocoAltura + 56} textAnchor="middle" fontFamily={SERIFA} fontStyle="italic" fontSize="24" fill={BRONZE}>
        {autor}
      </text>
      <text x={meio} y={CAPA_A - 66} textAnchor="middle" fontFamily={SERIFA} fontSize="15" letterSpacing="4" fill={BRONZE}>
        scriptorium.narniano.com
      </text>
    </svg>
  );
}
