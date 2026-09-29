-- ============================================================
-- Nova entrada: Severino Boécio - A Consolação da Filosofia (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'severino-boecio',
  'Severino Boécio',
  'Filósofo romano cristão, estadista, teólogo e mártir (c. 477–524 d.C.), autor de A Consolação da Filosofia, elo fundamental e insubstituível entre a antiguidade clássica e a Idade Média.',
  ARRAY['Filosofia Cristã', 'Patrística Tardia', 'Tradição Clássica']
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
  'A Consolação da Filosofia',
  (SELECT id FROM authors WHERE slug = 'severino-boecio'),
  'Português',
  'Uma das obras mais influentes e lidas de toda a civilização ocidental, composta na prisão antes do martírio, integrando sabedoria filosófica clássica e transcendência divina sobre a Providência e o Sumo Bem.',
  'a-consolacao-da-filosofia-boecio',
  'De Consolatione Philosophiae',
  '524',
  2026,
  'inteligência artificial, a partir do original crítico cotejado',
  ARRAY['Latim'],
  ARRAY['Filosofia Cristã', 'Clássicos Universais', 'Providência', 'Ética'],
  ARRAY['boecio', 'consolacao-da-filosofia', 'providencia', 'fortuna', 'sumo-bem'],
  '/texts/a-consolacao-da-filosofia-boecio.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do CCSL 94. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
