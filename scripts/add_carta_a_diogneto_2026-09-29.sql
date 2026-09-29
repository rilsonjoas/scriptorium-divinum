-- ============================================================
-- Nova entrada: A Carta a Diogneto (tradução própria, do grego)
-- Data: 2026-09-29
--
-- Primeiro texto da "Frente 2" (docs/PESQUISA-CATALOGO-PT-2026-09-28.md):
-- tradução por IA de texto curto, original em domínio público, no
-- mesmo modelo dos Credos Ecumênicos (aviso de IA, original ao lado,
-- revisão humana). Texto grego conferido no Wikisource grego, cotejado
-- com a tradução inglesa de J. B. Lightfoot (1891, domínio público).
--
-- NÃO estava marcado como revisado: server/texts/carta-a-diogneto.md
-- diz "Revisão humana: pendente". Publica com o aviso visível (mesmo
-- padrão dos Credos antes da aprovação do Rilson), não esconde do
-- catálogo — a decisão de 2026-09-29 é só sobre obra SEM leitura
-- online, e esta tem.
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'mateto-autor-de-diogneto',
  'Autor de "A Carta a Diogneto"',
  'Autor desconhecido do II século, tradicionalmente chamado de "Mateto" (do grego "discípulo") por conjectura de editores modernos — o nome não aparece no texto nem é atestado por nenhuma fonte antiga. Os capítulos XI e XII da carta são de outra mão, provavelmente do III século.',
  ARRAY['Patrística', 'Apologética']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  license_type, attribution_text
)
VALUES (
  'A Carta a Diogneto',
  (SELECT id FROM authors WHERE slug = 'mateto-autor-de-diogneto'),
  'Português',
  'Uma defesa anônima do cristianismo do século II, respondendo a um pagão culto que queria entender por que os cristãos não adoravam os deuses gregos nem seguiam os costumes judaicos. Traz a célebre passagem "o que a alma é no corpo, isso são os cristãos no mundo". Tradução nova, gerada por inteligência artificial diretamente do grego, com o texto original ao lado de cada capítulo.',
  'carta-a-diogneto',
  'Πρὸς Διόγνητον',
  'II–III',
  2026,
  'inteligência artificial (Claude Sonnet 5, da Anthropic), a partir do grego original',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Apologética', 'Teologia'],
  ARRAY['apologética', 'perseguição', 'igreja primitiva', 'cristandade'],
  '/texts/carta-a-diogneto.md',
  'cc-by-sa-4.0',
  'Tradução gerada por IA (Claude Sonnet 5, da Anthropic) a partir do original grego em domínio público, conferida com a tradução inglesa de J. B. Lightfoot (The Apostolic Fathers, 1891). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
);

COMMIT;

-- Verificação:
-- SELECT b.slug, a.slug AS autor, b.license_type, b.online_read_path
--   FROM books b JOIN authors a ON a.id = b.author_id
--  WHERE b.slug = 'carta-a-diogneto';
