/** Rota do Lecionário (`lecionario.narniano.com`) que resolve sempre em
 *  America/Sao_Paulo quando chamada sem `?date` — decisão do cluster "A
 *  Biblioteca" (um único relógio: quem quer "hoje" chama sem `?date` e usa o
 *  campo `date` da resposta). Ver contrato em lecionario-web/src/lib/
 *  versiculo-do-dia.ts. Endpoint nunca responde 404 (pool fixo fora da
 *  cobertura RCL); erro de rede/5xx vira `null` — o card "some com graça". */
const LECIONARIO_URL = import.meta.env.VITE_LECIONARIO_URL?.replace(/\/+$/, '') ?? 'https://lecionario.narniano.com';

export interface Verse {
  type: 'gospel' | 'psalm' | 'first_reading' | 'second_reading' | 'fallback';
  reference: string;
  citation: string;
  text: string;
}

export interface VersiculoDoDia {
  /** Dia no fuso de referência (America/Sao_Paulo), YYYY-MM-DD. */
  date: string;
  verse: Verse;
  /** true quando o dia não tem leitura RCL e o pool fixo assumiu. */
  fallback: boolean;
  /** true quando a guarda anti-repetição trocou o versículo litúrgico. */
  shifted: boolean;
}

export function lecionarioHomeUrl(): string {
  return LECIONARIO_URL;
}

export async function fetchVersiculoDoDia(signal?: AbortSignal): Promise<VersiculoDoDia | null> {
  try {
    const res = await fetch(`${LECIONARIO_URL}/api/versiculo-do-dia`, { signal });
    if (!res.ok) return null;
    return (await res.json()) as VersiculoDoDia;
  } catch {
    return null;
  }
}