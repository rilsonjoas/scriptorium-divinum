-- ============================================================
-- Nova entrada: Martinho Lutero - Comentário aos Gálatas (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'martinho-lutero',
  'Martinho Lutero',
  'Monge agostiniano, doutor em teologia e iniciador da Reforma Protestante (1483–1546), autor do Comentário aos Gálatas, obra seminal sobre a distinção entre Lei e Evangelho e a justificação pela fé.',
  ARRAY['Reforma Protestante', 'Tradição Luterana', 'Comentário Bíblico', 'Teologia Sistemática']
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
  'Comentário à Carta aos Gálatas',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'A obra-prima exegética de Martinho Lutero expondo a justificação passiva pela fé somente, a distinção entre Lei e Evangelho e a liberdade cristã na Carta de Paulo aos Gálatas.',
  'comentario-aos-galatas-lutero',
  'In Epistolam S. Pauli ad Galatas Commentarius',
  '1535',
  2026,
  'inteligência artificial, a partir da Weimarer Ausgabe (WA 40/I)',
  ARRAY['Latim'],
  ARRAY['Reforma Protestante', 'Comentário Bíblico', 'Justificação pela Fé', 'Teologia Paulina'],
  ARRAY['lutero', 'galatas', 'justificacao', 'lei-e-evangelho', 'reforma'],
  '/texts/comentario-aos-galatas-lutero.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da Weimarer Ausgabe (WA 40/I). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
