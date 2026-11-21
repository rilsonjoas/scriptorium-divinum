-- ==============================================================================
-- Faixa A: grava a edição-fonte confirmada do Catecismo de Heidelberg (2026-11-21)
--
-- Confirmada contra o volume declarado (Philip Schaff, The Creeds of Christendom, vol. III, CCEL, que traz a
-- pergunta 1 em alemão, latim e inglês: "What is thy only comfort in life and in death?"). Dentro da verificação
-- da faixa A (docs/PROVENIENCIA-ACERVO.md), foi a única obra que se pôde confirmar; as demais aguardam a fonte
-- antiga (parte dela no Project Gutenberg, fora do ar na ocasião). Não é parecer jurídico.
-- Só altera atribuição de obra ainda publicada e de tradução por IA. Idempotente.
-- ==============================================================================

UPDATE books
SET attribution_text = 'Tradução gerada por IA a partir de Philip Schaff, The Creeds of Christendom, vol. III (CCEL), em domínio público. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.',
    updated_at = now()
WHERE slug = 'catecismo-de-heidelberg' AND translation_is_ai AND published;
