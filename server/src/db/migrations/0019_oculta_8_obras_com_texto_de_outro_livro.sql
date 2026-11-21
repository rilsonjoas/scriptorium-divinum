-- ==============================================================================
-- Oculta 8 obras cujo arquivo de texto não é a obra anunciada (2026-11-21)
--
-- Achado numa varredura do acervo (densidade de vocabulário teológico e proporção de
-- palavras do português por obra, depois leitura de amostra do meio de cada arquivo
-- suspeito). O texto servido por estas obras pertence a OUTROS livros, importados sob o
-- título e o autor errados:
--
--   tratado-do-amor-de-deus-francisco-de-sales    romance de ficção científica
--   o-castelo-interior-teresa-de-avila            texto em finlandês (romance)
--   a-cana-quebrada-richard-sibbes                romance em francês/português
--   santo-viver-jeremy-taylor                     história da guerra franco-prussiana
--   soliloquio-da-alma-tomas-de-kempis            memórias da corte prussiana (1902)
--   preces-privatae-lancelot-andrewes             romance da Primeira Guerra
--   o-tratado-da-oracao-do-senhor-thomas-watson   romance
--   o-padre-do-campo-george-herbert               estudo sobre as igrejas de Jerusalém
--
-- Regra do acervo: conteúdo sem certeza não fica como fato. Ocultar é reversível (a chave
-- `published` volta pelo painel ou por migration quando o texto certo for importado).
-- Nenhuma citação do acervo aponta para estas obras (conferido em 2026-11-21).
--
-- Só mexe em quem ainda está publicada; idempotente. Tira do destaque também. O estado
-- correspondente está em server/texts/MANIFESTO.json (`oculta`, com o motivo).
-- ==============================================================================

UPDATE books
SET published = false,
    featured = false,
    updated_at = now()
WHERE published = true
  AND slug IN (
    'tratado-do-amor-de-deus-francisco-de-sales',
    'o-castelo-interior-teresa-de-avila',
    'a-cana-quebrada-richard-sibbes',
    'santo-viver-jeremy-taylor',
    'soliloquio-da-alma-tomas-de-kempis',
    'preces-privatae-lancelot-andrewes',
    'o-tratado-da-oracao-do-senhor-thomas-watson',
    'o-padre-do-campo-george-herbert'
  );
