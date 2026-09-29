-- ============================================================
-- Nova entrada: Santo Agostinho - A Utilidade da Fé (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'agostinho-de-hipona',
  'Santo Agostinho de Hipona',
  'Bispo de Hipona, Doutor da Graça (354–430 d.C.) e o mais influente teólogo e filósofo do Ocidente cristão, autor de Confissões, A Cidade de Deus e Tratados sobre a Fé e a Razão.',
  ARRAY['Patrística', 'Igreja Antiga', 'Teologia Cristã', 'Filosofia']
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
  'A Utilidade da Fé',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'O clássico tratado epistemológico e apologético de Santo Agostinho demonstrando a primazia da fé como passo indispensável para a purificação da mente e o alcance da verdadeira sabedoria.',
  'a-utilidade-da-fe-agostinho',
  'De Utilitate Credendi ad Honoratum',
  '391',
  2026,
  'inteligência artificial, a partir do Corpus Christianorum (CCSL 25)',
  ARRAY['Latim'],
  ARRAY['Patrística', 'Apologética', 'Epistemologia Cristã', 'Razão e Fé'],
  ARRAY['agostinho', 'utilidade-da-fe', 'credere-ut-intelligam', 'apologetica', 'patristica'],
  '/texts/a-utilidade-da-fe-agostinho.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do Corpus Christianorum Series Latina (CCSL 25). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
