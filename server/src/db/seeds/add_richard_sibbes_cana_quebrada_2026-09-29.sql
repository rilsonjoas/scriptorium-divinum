-- ============================================================
-- Nova entrada: Richard Sibbes - A Cana Quebrada e o Pavio Fumegante (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'richard-sibbes',
  'Richard Sibbes',
  'Pregador puritano de Cambridge (1577–1635), cognominado "o Doce Doutor Sibbes" e "o Médico das Almas Feridas", cujos sermões afetuosos influenciaram Baxter, Owen e Spurgeon.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Teologia Pastoral']
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
  'A Cana Quebrada e o Pavio Fumegante',
  (SELECT id FROM authors WHERE slug = 'richard-sibbes'),
  'Português',
  'O mais terno e consolador tratado pastoral puritano, expondo com inigualável doçura a misericórdia paciente de Cristo para com as almas frágeis, contritas e tentadas pelo desânimo.',
  'a-cana-quebrada-richard-sibbes',
  'The Bruised Reed and Smoking Flax',
  '1630',
  2026,
  'inteligência artificial, a partir do original crítico cotejado',
  ARRAY['Inglês'],
  ARRAY['Puritanismo', 'Teologia Pastoral', 'Conforto Espiritual', 'Graça Divina'],
  ARRAY['richard-sibbes', 'a-cana-quebrada', 'puritanos', 'conforto-pastoral', 'misericordia'],
  '/texts/a-cana-quebrada-richard-sibbes.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição de Alexander Grosart (Banner of Truth). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
