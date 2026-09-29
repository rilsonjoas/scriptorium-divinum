-- ============================================================
-- Nova entrada: Richard Baxter - O Descanso Eterno dos Santos (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'richard-baxter',
  'Richard Baxter',
  'Teólogo puritano, líder eclesiástico e escritor pastoral inglês (1615–1691), autor de O Pastor Renovado e O Descanso Eterno dos Santos, um dos autores mais lidos e influentes da tradição protestante.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Teologia Pastoral', 'Espiritualidade']
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
  'O Descanso Eterno dos Santos',
  (SELECT id FROM authors WHERE slug = 'richard-baxter'),
  'Português',
  'A célebre e comovente obra puritana de Richard Baxter sobre a meditação na bem-aventurança do céu, o descanso da alma em Deus e a esperança da glória eterna.',
  'o-descanso-eterno-dos-santos-richard-baxter',
  'The Saints'' Everlasting Rest',
  '1650',
  2026,
  'inteligência artificial, a partir da edição clássica puritana',
  ARRAY['Inglês'],
  ARRAY['Tradição Puritana', 'Escatologia e Céu', 'Vida Cristã', 'Meditação Espiritual'],
  ARRAY['richard-baxter', 'descanso-eterno', 'puritanos', 'ceu', 'vida-crista'],
  '/texts/o-descanso-eterno-dos-santos-richard-baxter.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica puritana (Banner of Truth). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
