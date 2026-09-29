-- ============================================================
-- Nova entrada: Felipe Melâncton - Loci Communes (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'felipe-melancton',
  'Felipe Melâncton',
  'Humanista, reformador luterano, teólogo e pedagogo alemão (1497–1560), cognominado "o Preceptor da Alemanha" (Praeceptor Germaniae). Amigo íntimo e colaborador intelectual de Martinho Lutero, redigiu a célebre "Confissão de Augsburgo" (1530) e o primeiro compêndio sistemático da teologia protestante, os "Loci Communes Theologici" (1521).',
  ARRAY['Reforma Protestante', 'Luteranismo', 'Teologia Sistemática', 'Humanismo Cristão']
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
  'Lugares Comuns Teológicos (Loci Communes)',
  (SELECT id FROM authors WHERE slug = 'felipe-melancton'),
  'Português',
  'A primeira teologia sistemática da Reforma Protestante, publicada por Felipe Melâncton em 1521. Formula o princípio célebre de que "conhecer a Cristo é conhecer os Seus benefícios", expõe a distinção fundamental entre Lei e Evangelho, a justificação gratuita pela fé e o papel das boas obras como fruto do amor cristão libertado da condenação.',
  'loci-communes-melancton',
  'Loci Communes Theologici',
  '1521',
  2026,
  'inteligência artificial, a partir do texto latino clássico da edição príncipe de 1521',
  ARRAY['Latim'],
  ARRAY['Reforma Protestante', 'Teologia Sistemática', 'História da Igreja', 'Soteriologia', 'Teologia Luterana'],
  ARRAY['felipe-melancton', 'loci-communes', 'lei-e-evangelho', 'justificacao', 'sola-fide', 'reforma'],
  '/texts/loci-communes-melancton.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do Corpus Reformatorum (CR 21). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
