-- ============================================================
-- Nova entrada: Santo Atanásio - Vida de Santo Antão (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'atanasio-de-alexandria',
  'Santo Atanásio de Alexandria',
  'Patriarca de Alexandria, Confessor da Fé e Doutor da Igreja (c. 296–373 d.C.), campeão da ortodoxia nicena contra o arianismo e autor da biografia fundacional do monasticismo cristão.',
  ARRAY['Patrística', 'Igreja Antiga', 'Ortodoxia Nicena', 'Monasticismo']
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
  'Vida de Santo Antão do Deserto',
  (SELECT id FROM authors WHERE slug = 'atanasio-de-alexandria'),
  'Português',
  'A biografia clássica de Santo Antão, escrita por Santo Atanásio, que deu origem à hagiografia ocidental e inspirou a conversão de Santo Agostinho e o movimento monástico universal.',
  'vida-de-santo-antao-atanasio',
  'Vita Antonii (Βίος καὶ πολιτεία τοῦ ὁσίου πατρὸς ἡμῶν Ἀντωνίου)',
  '357',
  2026,
  'inteligência artificial, a partir de Sources Chrétiennes (SC 400)',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Hagiografia', 'Monasticismo', 'Espiritualidade'],
  ARRAY['atanasio', 'santo-antao', 'deserto', 'vida-monastica', 'patristica'],
  '/texts/vida-de-santo-antao-atanasio.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de Sources Chrétiennes (SC 400). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
