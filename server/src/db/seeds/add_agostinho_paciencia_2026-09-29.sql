-- ============================================================
-- Nova entrada: Santo Agostinho - Sobre a Paciência (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'agostinho-de-hipona',
  'Santo Agostinho de Hipona',
  'Bispo de Hipona, Doutor da Graça (354–430 d.C.) e o mais influente teólogo e filósofo do Ocidente cristão, autor de Confissões, A Cidade de Deus e Tratados sobre a Fé e as Virtudes.',
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
  'Sobre a Paciência',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Tratado patrístico de Santo Agostinho demonstrando que a verdadeira paciência na dor e na tribulação é dom sobrenatural da graça divina gerado pela caridade e não mera obstinação estóica.',
  'sobre-a-paciencia-agostinho',
  'De Patientia Liber Unus',
  '418',
  2026,
  'inteligência artificial, a partir do CCSL 41 e PL 40',
  ARRAY['Latim'],
  ARRAY['Patrística', 'Teologia Moral', 'Virtudes Cristãs', 'Graça Divina'],
  ARRAY['agostinho', 'paciencia', 'virtudes', 'graca', 'patristica'],
  '/texts/sobre-a-paciencia-agostinho.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do Corpus Christianorum Series Latina (CCSL 41). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
