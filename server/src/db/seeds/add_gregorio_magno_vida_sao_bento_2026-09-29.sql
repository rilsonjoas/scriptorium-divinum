-- ============================================================
-- Nova entrada: São Gregório Magno - Vida e Milagres de São Bento (Diálogos Livro II) (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-gregorio-magno',
  'São Gregório Magno',
  'Papa, Doutor da Igreja e um dos quatro grandes Padres da Igreja Ocidental (c. 540–604 d.C.), monge beneditino, estadista e autor de clássicos como a Regra Pastoral e os Diálogos.',
  ARRAY['Patrística', 'Monasticismo Beneditino', 'Igreja Antiga', 'Teologia Pastoral']
)
ON CONFLICT (slug) DO UPDATE SET
  bio_summary = EXCLUDED.bio_summary,
  name = EXCLUDED.name;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai, human_review_approved_at,
  license_type, attribution_text
)
VALUES (
  'Vida e Milagres de São Bento (Diálogos Livro II)',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-magno'),
  'Português',
  'A biografia clássica e espiritual de São Bento de Núrsia, narrada por São Gregório Magno no Livro II dos Diálogos, fundamento e modelo supremo da hagiografia e espiritualidade monástica ocidental.',
  'vida-de-sao-bento-dialogos-gregorio-magno',
  'Dialogorum Libri IV - Liber II: De Vita et Miraculis Venerabilis Benedicti',
  '593',
  2026,
  'inteligência artificial, a partir do original crítico cotejado',
  ARRAY['Latim'],
  ARRAY['Patrística', 'Hagiografia', 'Monasticismo', 'Espiritualidade'],
  ARRAY['gregorio-magno', 'sao-bento', 'dialogos', 'monasticismo', 'patristica'],
  '/texts/vida-de-sao-bento-dialogos-gregorio-magno.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de Sources Chrétiennes (SC 260) e PL 66. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
