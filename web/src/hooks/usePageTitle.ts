import { useEffect } from 'react';

const SUFIXO = 'Scriptorium Divinum';

/**
 * 2.4.2 Título da página (nível A) — WCAG 2.2 / ABNT NBR 17225:2025.
 *
 * O `<title>` vivia só no `index.html`, estático: home, catálogo, ficha
 * da obra, leitor e busca carregavam todos a mesma string. Isso é
 * reprovação de 2.4.2 ("o título da página descreve o tema ou a
 * finalidade") e, de brinde, é o que o Search Console lê para decidir
 * o que é cada página.
 *
 * A regra de não repetir: cada URL recebe um título próprio, e a
 * navegação por deep link (inclusive `/busca?q=...`) deixa de ser
 * indistinguível no histórico e no leitor de tela.
 *
 * O que NÃO é responsabilidade daqui: `<meta description>` e
 * `rel=canonical`, que continuam pendentes (registrados no ROADMAP).
 */
export function usePageTitle(title?: string | null) {
  useEffect(() => {
    document.title = title ? `${title} — ${SUFIXO}` : `${SUFIXO} — Biblioteca Teológica Clássica`;
    // Sem restaurar o título anterior no cleanup, de propósito.
    //
    // A primeira versão fazia `return () => { document.title = anterior }`
    // e isso quebrava em toda navegação de rota: o cleanup da página que
    // SAI roda depois do efeito da página que ENTRA, e sobrescreve o
    // título novo com o antigo. O sintoma era `/busca?q=...` herdando o
    // título da home. Como toda rota define o seu, não há o que restaurar.
  }, [title]);
}
