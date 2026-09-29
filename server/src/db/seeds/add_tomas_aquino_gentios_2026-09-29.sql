-- ============================================================
-- Nova entrada: Santo Tomás de Aquino - Suma contra os Gentios (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'tomas-de-aquino',
  'Santo Tomás de Aquino',
  'Doutor Angélico, frade dominicano, filósofo e teólogo (1225–1274 d.C.), autor da Suma Teológica e da Suma contra os Gentios, monumento máximo da síntese entre a fé cristã e a filosofia clássica.',
  ARRAY['Escolástica', 'Tradição Dominicana', 'Teologia Sistemática', 'Filosofia Cristã']
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
  'Suma contra os Gentios (Livro I: A Verdade da Fé e a Razão)',
  (SELECT id FROM authors WHERE slug = 'tomas-de-aquino'),
  'Português',
  'A obra-prima apologética e filosófica de Santo Tomás de Aquino, expondo a harmonia inabalável entre a razão natural e a Revelação divina sobre a existência e os atributos de Deus.',
  'suma-contra-os-gentios-tomas-de-aquino',
  'Summa contra Gentiles - Liber I (De Deo)',
  '1264',
  2026,
  'inteligência artificial, a partir da Editio Leonina (Tomus XIII)',
  ARRAY['Latim'],
  ARRAY['Escolástica', 'Apologética', 'Filosofia Cristã', 'Teologia Filosófica'],
  ARRAY['tomas-de-aquino', 'suma-contra-gentios', 'escolastica', 'razao-e-fe', 'filosofia'],
  '/texts/suma-contra-os-gentios-tomas-de-aquino.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da Editio Leonina em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
