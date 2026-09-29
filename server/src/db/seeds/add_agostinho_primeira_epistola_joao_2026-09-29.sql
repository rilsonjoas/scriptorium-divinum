-- ============================================================
-- Nova entrada: Santo Agostinho de Hipona - Tratado sobre a Primeira Epístola de São João (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'agostinho-de-hipona',
  'Santo Agostinho de Hipona',
  'Bispo de Hipona, Doutor da Graça (354–430 d.C.) e o mais influente teólogo e filósofo do Ocidente cristão, autor de Confissões, A Cidade de Deus e Tratados sobre São João.',
  ARRAY['Patrística', 'Igreja Antiga', 'Teologia Cristã', 'Filosofia']
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
  'Tratado sobre a Primeira Epístola de São João',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Uma das mais sublimes e conhecidas exposições patrísticas sobre a essência do amor divino ("Deus é amor") e a fraternidade cristã, célebre pela máxima: Ama e faz o que quiseres.',
  'tratado-primeira-epistola-sao-joao-agostinho',
  'In Epistolam Joannis ad Parthos Tractatus X',
  '407',
  2026,
  'inteligência artificial, a partir do original crítico cotejado',
  ARRAY['Latim'],
  ARRAY['Patrística', 'Comentário Bíblico', 'Amor Cristão', 'Espiritualidade'],
  ARRAY['agostinho', 'primeira-epistola-joao', 'caridade', 'dilige-et-quod-vis-fac', 'patristica'],
  '/texts/tratado-primeira-epistola-sao-joao-agostinho.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do CCSL 36 e PL 35. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
