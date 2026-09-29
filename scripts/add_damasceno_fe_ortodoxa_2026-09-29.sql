-- ============================================================
-- Nova entrada: São João Damasceno - Exposição Exata da Fé Ortodoxa (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'joao-damasceno',
  'São João Damasceno',
  'Monge, presbítero, teólogo e Doutor da Igreja (c. 676–749 d.C.), natural de Damasco. Considerado o último grande Padre da Igreja oriental, João Damasceno realizou a síntese dogmática suprema de toda a teologia patrística grega em sua monumental obra "A Fonte do Conhecimento" (cujo tratado culminante é a "Exposição Exata da Fé Ortodoxa"). Foi também o grande defensor da legitimidade teológica dos santos ícones durante a crise iconoclasta.',
  ARRAY['Patrística Grega', 'Teologia Bizantina', 'Doutores da Igreja', 'Ortodoxia Cristã']
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
  'Exposição Exata da Fé Ortodoxa',
  (SELECT id FROM authors WHERE slug = 'joao-damasceno'),
  'Português',
  'A síntese dogmática definitiva da teologia patrística do Oriente cristão. Dividida em quatro grandes seções temáticas, São João Damasceno articula com clareza incomparável a teologia da Trindade (a incognoscibilidade da essência e a perichoresis das Hipóstases), a criação cósmica e a antropologia, a cristologia das duas naturezas e vontades em Cristo, e a eclesiologia dos sacramentos e da vida futura.',
  'exposicao-da-fe-ortodoxa-damasceno',
  'Ἔκδοσις ἀκριβὴς τῆς ὀρθοδόξου πίστεως (De Fide Orthodoxa)',
  '743',
  2026,
  'inteligência artificial, a partir do texto grego crítico clássico',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Teologia Dogmática', 'Cristologia', 'História da Igreja', 'Teologia Trinitária'],
  ARRAY['joao-damasceno', 'fe-ortodoxa', 'de-fide-orthodoxa', 'trindade', 'cristologia', 'patristica'],
  '/texts/exposicao-da-fe-ortodoxa-damasceno.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de B. Kotter e Sources Chrétiennes. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
