-- ============================================================
-- Nova entrada: São Cirilo de Alexandria - Cartas a Nestório (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-cirilo-de-alexandria',
  'São Cirilo de Alexandria',
  'Patriarca de Alexandria, Doutor da Igreja e campeão do Concílio Ecumênico de Éfeso (c. 376–444 d.C.), defensor intrépido da união hipostática de Cristo e do dogma da Theotokos.',
  ARRAY['Patrística', 'Cristologia Alexandrina', 'Concílios Ecumênicos', 'Ortodoxia']
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
  'Cartas Dogmáticas a Nestório e os Doze Anátemas',
  (SELECT id FROM authors WHERE slug = 'sao-cirilo-de-alexandria'),
  'Português',
  'Os textos dogmáticos capitais de São Cirilo de Alexandria aprovados no Concílio de Éfeso (431 d.C.), proclamando a união hipostática de Cristo e a maternidade divina de Maria (Theotokos).',
  'cartas-a-nestorio-cirilo-alexandria',
  'Epistulae Dogmaticae ad Nestorium et Anathematismi',
  '431',
  2026,
  'inteligência artificial, a partir do Acta Conciliorum Oecumenicorum (ACO I)',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Cristologia', 'Concílios Ecumênicos', 'Teologia Dogmática'],
  ARRAY['cirilo-alexandria', 'nestorianismo', 'theotokos', 'uniao-hipostatica', 'efeso'],
  '/texts/cartas-a-nestorio-cirilo-alexandria.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto crítico de Éfeso em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
