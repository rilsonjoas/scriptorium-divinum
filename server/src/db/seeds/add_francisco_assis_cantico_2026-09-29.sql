-- ============================================================
-- Nova entrada: São Francisco de Assis - Cântico das Criaturas (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-francisco-de-assis',
  'São Francisco de Assis',
  'O Poverello de Assis, fundador da Ordem dos Frades Menores (1181–1226 d.C.), poeta e místico cuja vida de pobreza evangélica, fraternidade cósmica e amor a Cristo marcou para sempre a cristandade.',
  ARRAY['Espiritualidade Franciscana', 'Mística Medieval', 'Poesia Sacra']
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
  'Cântico das Criaturas e Admoestações',
  (SELECT id FROM authors WHERE slug = 'sao-francisco-de-assis'),
  'Português',
  'O célebre poema cósmico do Irmão Sol e as vinte e oito admoestações espirituais de São Francisco de Assis sobre a humildade, a pobreza evangélica e a paz do coração.',
  'cantico-das-criaturas-sao-francisco',
  'Cantico delle Creature et Admonitiones',
  '1225',
  2026,
  'inteligência artificial, a partir das Fontes Franciscanae',
  ARRAY['Italiano'],
  ARRAY['Mística Franciscana', 'Poesia Cristã', 'Espiritualidade', 'Clássicos'],
  ARRAY['francisco-de-assis', 'cantico-das-criaturas', 'irmao-sol', 'franciscanos', 'pobreza'],
  '/texts/cantico-das-criaturas-sao-francisco.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir das Fontes Franciscanae em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
