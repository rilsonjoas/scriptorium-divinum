-- ============================================================
-- Nova entrada: G.K. Chesterton - O Homem Eterno (2026-09-29)
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
  'O Homem Eterno',
  (SELECT id FROM authors WHERE slug = 'g-k-chesterton'),
  'Português',
  'A monumental obra de Chesterton que influenciou decisivamente a conversão de C.S. Lewis, refutando o reducionismo materialista sobre a origem do homem e apresentando Cristo como o centro vivo da história cósmica.',
  'o-homem-eterno-chesterton',
  'The Everlasting Man',
  '1925',
  2026,
  'inteligência artificial, a partir da edição de Hodder & Stoughton (1925)',
  ARRAY['Inglês'],
  ARRAY['Apologética Cristã', 'História e Filosofia', 'Mere Christianity', 'Cristologia'],
  ARRAY['chesterton', 'o-homem-eterno', 'apologetica', 'c-s-lewis', 'mere-christianity'],
  '/texts/o-homem-eterno-chesterton.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição original britânica de Hodder & Stoughton (1925) em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
