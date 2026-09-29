-- ============================================================
-- Nova entrada: São João Clímaco - A Escada do Paraíso (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-joao-climaco',
  'São João Clímaco',
  'Abade do Mosteiro de Santa Catarina no Monte Sinai (c. 579–649 d.C.), mestre clássico da ascese e da espiritualidade hesicasta oriental, autor do clássico universal A Escada do Paraíso.',
  ARRAY['Patrística Bizantina', 'Mística Hesicasta', 'Philokalia', 'Monasticismo']
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
  'A Escada do Paraíso',
  (SELECT id FROM authors WHERE slug = 'sao-joao-climaco'),
  'Português',
  'O monumento supremo da ascese e da contemplação da Igreja Oriental, estruturando os 30 degraus da purificação das paixões, a vigilância mental e a união beatífica no amor divino.',
  'a-escada-do-paraiso-joao-climaco',
  'Scala Paradisi (Κλῖμαξ τοῦ Παραδείσου)',
  '620',
  2026,
  'inteligência artificial, a partir da Patrologia Graeca (PG 88)',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Mística Oriental', 'Philokalia', 'Espiritualidade'],
  ARRAY['joao-climaco', 'escada-do-paraiso', 'hesicasmo', 'sinai', 'philokalia'],
  '/texts/a-escada-do-paraiso-joao-climaco.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da Patrologia Graeca (PG 88). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
