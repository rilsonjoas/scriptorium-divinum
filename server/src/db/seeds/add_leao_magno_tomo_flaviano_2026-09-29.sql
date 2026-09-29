-- ============================================================
-- Nova entrada: São Leão Magno - Tomo a Flaviano (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-leao-magno',
  'São Leão Magno',
  'Papa, Doutor da Igreja e um dos maiores estadistas e teólogos da Antiguidade cristã (c. 400–461 d.C.), autor do célebre Tomo a Flaviano que definiu a cristologia dogmática do Concílio Ecumênico de Calcedônia.',
  ARRAY['Patrística', 'Cristologia Calcedoniana', 'Igreja Antiga', 'Magistério']
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
  'Tomo a Flaviano',
  (SELECT id FROM authors WHERE slug = 'sao-leao-magno'),
  'Português',
  'O clássico documento cristológico de São Leão Magno que fundamentou o Concílio de Calcedônia (451 d.C.), proclamando as duas naturezas (divina e humana) na única Pessoa de Jesus Cristo.',
  'tomo-a-flaviano-sao-leao-magno',
  'Epistola Dogmatica ad Flavianum (Tomus Leonis)',
  '449',
  2026,
  'inteligência artificial, a partir do Acta Conciliorum Oecumenicorum e PL 54',
  ARRAY['Latim'],
  ARRAY['Patrística', 'Cristologia', 'Concílios Ecumênicos', 'Teologia Dogmática'],
  ARRAY['leao-magno', 'tomo-a-flaviano', 'calcedonia', 'cristologia', 'patristica'],
  '/texts/tomo-a-flaviano-sao-leao-magno.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto crítico de Calcedônia em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
