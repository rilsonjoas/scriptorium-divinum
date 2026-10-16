-- ==============================================================================
-- Dados do acervo: curadoria e ocultação (2026-10-16)
--
-- REGRA DO ACERVO (docs/GERENCIAR-ACERVO.md): seed só cria; mudança numa obra
-- que já existe é migration única; o painel de admin manda no resto. Antes, os
-- seeds reescreviam `published`, `title`, `description` e outros campos a cada
-- deploy e desfaziam qualquer edição feita pelo painel.
--
-- 1. Curadoria que vivia em dois seeds de UPDATE (ativar_imitacao_de_cristo e
--    populate_curatorship_status), reaplicados a cada deploy. Roda uma vez aqui.
-- 2. Decisão do autor de 2026-10-16: só obras em português no ar por enquanto.
--    Ficam ocultas as edições em inglês e em latim, o tratado das Relíquias de
--    Calvino (arquivo corrompido), o Proslogion (revisão pendente) e o Breve
--    Catecismo de Westminster (texto majoritariamente em inglês; traduzir
--    depois). Para voltar a publicar qualquer uma: chave "Publicada" no painel
--    de admin. Nenhum seed republica mais.
-- 3. O público só precisa saber que a obra é texto de IA, não o estado interno
--    da revisão: sai a frase "Revisão humana: pendente." da atribuição.
--
-- Em banco novo (sem obras ainda) esta migration não encontra o que ocultar:
-- aplicar a ocultação depois dos seeds, com os dois UPDATE do item 2.
-- ==============================================================================

-- 1. Curadoria
UPDATE books
SET
  online_read_path = '/texts/imitacao-de-cristo.md',
  published = true,
  featured = true,
  translation_is_ai = false,
  human_review_approved_at = COALESCE(human_review_approved_at, NOW()),
  license_type = 'public-domain',
  description = 'Obra devocional máxima da espiritualidade cristã medieval atribuída a Tomás de Kempis (c. 1380–1471). Estruturada em 4 livros e 114 capítulos breves e incisivos, convida o leitor ao desapego das vaidades do mundo, ao recolhimento interior, à íntima comunhão com Cristo e à piedosa recepção da Sagrada Eucaristia. Edição clássica de 1848 reconstruída e revisada integralmente a partir do escaneamento histórico.',
  attribution_text = 'Tradução clássica portuguesa anônima (Paris/Rio de Janeiro, Belin-Leprieur et Morizot, 1848), digitalizada pelo Internet Archive (ID: imitaodechri00thom) e reconstruída integralmente em 114 capítulos com base no índice original pelo Scriptorium Divinum. Domínio Público (CC0 / PD-Brasil).'
WHERE slug = 'imitacao-de-cristo';

UPDATE books
SET translation_is_ai = true,
    human_review_approved_at = '2026-09-29 12:00:00+00',
    published = true
WHERE slug = 'credos-ecumenicos';
UPDATE books
SET translation_is_ai = true,
    human_review_approved_at = NULL,
    published = true
WHERE slug = 'carta-a-diogneto';

-- 2. Ocultação (só português por enquanto)
UPDATE books SET published = false WHERE language IS DISTINCT FROM 'Português';

UPDATE books SET published = false
WHERE slug IN (
  'tratado-sobre-as-reliquias-calvino',  -- arquivo corrompido
  'proslogion',                          -- revisão pendente
  'breve-catecismo-westminster'          -- texto majoritariamente em inglês; traduzir depois
);

-- 3. O usuário final só precisa saber que a obra é texto de IA. A frase
-- "Revisão humana: pendente." sai da atribuição exibida ao público (o estado da
-- revisão continua em human_review_approved_at e no painel). A aprovação, quando
-- existe, segue sendo mostrada.
UPDATE books
SET attribution_text = replace(attribution_text, ' Revisão humana: pendente.', '')
WHERE attribution_text LIKE '% Revisão humana: pendente.%';

UPDATE books
SET description = replace(description, ' (revisão humana pendente)', '')
WHERE description LIKE '%(revisão humana pendente)%';
