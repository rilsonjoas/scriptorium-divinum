/**
 * Manifesto do acervo: o estado declarado de cada arquivo de `server/texts/`.
 *
 * Existe porque o que está no ar mora no banco e o que está no git são os
 * arquivos, sem relação declarada entre os dois. Resultado antes disto: rascunho
 * pela metade, duplicatas e OCR ilegível ficando no repositório sem ninguém
 * decidir o que eram. Aqui toda decisão vira uma linha revisável no PR, e o CI
 * barra arquivo novo sem entrada.
 *
 * Estados:
 *  - publicada: no ar. Tem de estar em português (o site publica só em português).
 *  - oculta:    linha existe no banco e está escondida. Exige `motivo`.
 *  - fonte:     original em inglês/latim guardado de propósito. Sem linha no banco.
 *  - rascunho:  trabalho em andamento. Exige `dono` e `desde`; parado >30 dias vira aviso.
 *
 * Este módulo é puro (sem arquivo, sem banco): a leitura fica em scripts/verificar-acervo.ts.
 */
export type Estado = 'publicada' | 'oculta' | 'fonte' | 'rascunho';
export const ESTADOS: readonly Estado[] = ['publicada', 'oculta', 'fonte', 'rascunho'];

export interface EntradaManifesto {
  estado: Estado;
  motivo?: string;
  dono?: string;
  desde?: string;
  /** Quando a detecção (só inglês x português) erra, ex.: latim. Vale mais que a detecção. */
  idioma?: 'Português' | 'Inglês' | 'Latim';
}

export interface Manifesto {
  versao: number;
  descricao?: string;
  arquivos: Record<string, EntradaManifesto>;
}

export interface AchadoManifesto {
  nivel: 'ERRO' | 'AVISO';
  arquivo: string;
  mensagem: string;
}

export const DIAS_RASCUNHO = 30;

/** `emDisco`: nome do arquivo (sem `.md`) -> idioma detectado no texto. */
export function verificarManifesto(
  manifesto: Manifesto,
  emDisco: Record<string, { idioma: 'Português' | 'Inglês' }>,
  hoje: Date = new Date(),
): AchadoManifesto[] {
  const achados: AchadoManifesto[] = [];
  const erro = (arquivo: string, mensagem: string) => achados.push({ nivel: 'ERRO', arquivo, mensagem });

  for (const nome of Object.keys(emDisco)) {
    if (!(nome in manifesto.arquivos)) {
      erro(nome, 'arquivo sem entrada no manifesto: declare o estado em server/texts/MANIFESTO.json (publicada, oculta, fonte ou rascunho)');
    }
  }

  for (const [nome, e] of Object.entries(manifesto.arquivos)) {
    const disco = emDisco[nome];
    if (!disco) {
      erro(nome, 'entrada do manifesto cujo arquivo não existe em server/texts: remova a entrada');
      continue;
    }
    if (!ESTADOS.includes(e.estado)) {
      erro(nome, `estado inválido "${String(e.estado)}" (use ${ESTADOS.join(', ')})`);
      continue;
    }
    if (e.estado === 'oculta' && !e.motivo?.trim()) erro(nome, 'estado "oculta" exige o campo motivo');
    if (e.estado === 'rascunho') {
      if (!e.dono?.trim() || !e.desde?.trim()) {
        erro(nome, 'estado "rascunho" exige dono e desde (AAAA-MM-DD)');
      } else {
        const dias = Math.floor((hoje.getTime() - new Date(e.desde).getTime()) / 86_400_000);
        if (dias > DIAS_RASCUNHO) {
          achados.push({ nivel: 'AVISO', arquivo: nome, mensagem: `rascunho parado há ${dias} dias (dono: ${e.dono}): publique, oculte ou remova` });
        }
      }
    }
    const emPortugues = e.idioma ? e.idioma === 'Português' : disco.idioma === 'Português';
    if (e.estado === 'publicada' && !emPortugues) {
      erro(nome, 'estado "publicada" mas o texto não está em português: o site publica só em português');
    }
    if (e.estado === 'fonte' && emPortugues) {
      erro(nome, 'estado "fonte" mas o texto está em português: publique, ou declare como "oculta" com o motivo');
    }
  }
  return achados;
}
