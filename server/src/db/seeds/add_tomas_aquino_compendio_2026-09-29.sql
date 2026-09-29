-- ============================================================
-- Nova entrada: Santo Tomás de Aquino - Compêndio de Teologia (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'tomas-de-aquino',
  'Santo Tomás de Aquino',
  'Frade dominicano, filósofo e teólogo italiano (1225–1274 d.C.), Santo Tomás de Aquino é proclamado o Doutor Angélico e o Doutor Comum da Igreja Católica, sendo a figura culminante da Escolástica medieval. Autor da monumental "Suma Teológica" e da "Suma contra os Gentios", seu "Compêndio de Teologia" (Compendium Theologiae, 1273 d.C.) sintetiza com incomparável clareza, concisão e densidade metafísica os mistérios da Fé (Unidade divina, Trindade, Criação e Encarnação), Esperança e Caridade.',
  ARRAY['Escolástica Medieval', 'Tradição Dominicana', 'Doutores da Igreja', 'Teologia Sistemática']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai, human_review_approved_at,
  license_type, attribution_text
)
VALUES (
  'Compêndio de Teologia',
  (SELECT id FROM authors WHERE slug = 'tomas-de-aquino'),
  'Português',
  'Obra de maturidade de Santo Tomás de Aquino dedicada ao seu secretário Frei Reinaldo de Piperno. Sintetiza com clareza admirável toda a teologia escolástica: as provas da existência de Deus e da Sua essência pura (Actus Purus), as processões trinitárias do Verbo e do Espírito Santo, a criação ex nihilo, o governo da Providência divina e a salvação pela Encarnação e Paixão de Cristo.',
  'compendio-de-teologia-tomas-de-aquino',
  'Compendium Theologiae ad Fratrem Raynaldum',
  '1273',
  2026,
  'inteligência artificial, a partir do original latino clássico',
  ARRAY['Latim'],
  ARRAY['Teologia Sistemática', 'Escolástica', 'Filosofia e Ética', 'História da Igreja'],
  ARRAY['tomas-de-aquino', 'escolastica', 'teologia-dogmatica', 'trindade', 'criacao', 'encarnacao', 'doutores-da-igreja'],
  '/texts/compendio-de-teologia-tomas-de-aquino.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica leonina e Corpus Thomisticum. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
