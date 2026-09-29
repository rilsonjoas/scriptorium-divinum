-- ============================================================
-- Nova entrada: Irmão Lourenço - A Prática da Presença de Deus (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'irmao-lourenco',
  'Irmão Lourenço da Ressurreição',
  'Irmão leigo carmelita descalço em Paris (1614–1691), ex-soldado cujo testemunho humilde e cartas sobre a prática contínua da presença amorosa de Deus tornaram-se um dos maiores tesouros ecumênicos da literatura espiritual.',
  ARRAY['Mística Carmelita', 'Espiritualidade Cristã', 'Vida Devocional']
)
ON CONFLICT (slug) DO UPDATE SET
  bio_summary = EXCLUDED.bio_summary;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai, human_review_approved_at,
  license_type, attribution_text
)
VALUES (
  'A Prática da Presença de Deus',
  (SELECT id FROM authors WHERE slug = 'irmao-lourenco'),
  'Português',
  'O clássico espiritual universal do humilde cozinheiro carmelita ensinando a arte de conversar incessantemente com Deus em meio às tarefas mais corriqueiras da vida cotidiana.',
  'a-pratica-da-presenca-de-deus-irmao-lourenco',
  'The Practice of the Presence of God (Manière de converser avec Dieu)',
  '1692',
  2026,
  'inteligência artificial, a partir da 1ª edição francesa de 1692',
  ARRAY['Francês'],
  ARRAY['Espiritualidade', 'Vida Devocional', 'Oração Contínua', 'Clássicos'],
  ARRAY['irmao-lourenco', 'presenca-de-deus', 'carmelo', 'simplicidade', 'oracao'],
  '/texts/a-pratica-da-presenca-de-deus-irmao-lourenco.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica francesa em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
