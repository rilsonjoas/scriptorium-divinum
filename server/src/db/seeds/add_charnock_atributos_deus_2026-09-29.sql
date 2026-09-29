-- ============================================================
-- Nova entrada: Stephen Charnock - Atributos de Deus (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'stephen-charnock',
  'Stephen Charnock',
  'Teólogo puritano de Oxford e capelão (1628–1680), autor do mais profundo e monumental tratado teológico da língua inglesa sobre a existência e as infinitas perfeições de Deus.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Teologia Sistemática', 'Teologia Própria']
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
  'A Existência e os Atributos de Deus',
  (SELECT id FROM authors WHERE slug = 'stephen-charnock'),
  'Português',
  'O cume da teologia puritana clássica analisando a existência divina, o ateísmo prático e os sublimes atributos da eternidade, imutabilidade, onipresença e santidade de Deus.',
  'a-existencia-e-os-atributos-de-deus-charnock',
  'Discourses upon the Existence and Attributes of God',
  '1682',
  2026,
  'inteligência artificial, a partir da edição puritana de Londres (1682)',
  ARRAY['Inglês'],
  ARRAY['Tradição Puritana', 'Teologia Sistemática', 'Teologia Própria', 'Atributos Divinos'],
  ARRAY['charnock', 'atributos-de-deus', 'puritanos', 'teologia-sistematica', 'santidade'],
  '/texts/a-existencia-e-os-atributos-de-deus-charnock.md',
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
