-- ============================================================
-- Nova entrada: G.K. Chesterton - Ortodoxia (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'g-k-chesterton',
  'G.K. Chesterton',
  'Ensaísta, filósofo, jornalista e apologista britânico (1874–1936), cognominado "o Príncipe do Paradoxo", autor de clássicos monumentais como Ortodoxia, O Homem Eterno e as histórias do Padre Brown.',
  ARRAY['Apologética Cristã', 'Tradição Católica / Ecumênica', 'Filosofia e Literatura']
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
  'Ortodoxia',
  (SELECT id FROM authors WHERE slug = 'g-k-chesterton'),
  'Português',
  'A obra-prima autobiográfica e apologética de G.K. Chesterton, demonstrando com brilhantismo e humor que a fé cristã ortodoxa é a única chave racional que preserva a liberdade, a imaginação e a sanidade humana.',
  'ortodoxia-chesterton',
  'Orthodoxy',
  '1908',
  2026,
  'inteligência artificial, a partir da edição original britânica de John Lane (1908)',
  ARRAY['Inglês'],
  ARRAY['Apologética Cristã', 'Filosofia Cristã', 'Mere Christianity', 'Clássicos'],
  ARRAY['chesterton', 'ortodoxia', 'apologetica', 'paradoxo', 'mere-christianity'],
  '/texts/ortodoxia-chesterton.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição original de John Lane (1908) em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
