-- ============================================================
-- Nova entrada: Santo Agostinho - A Doutrina Cristã (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'agostinho-de-hipona',
  'Santo Agostinho de Hipona',
  'Bispo de Hipona, teólogo, filósofo e Doutor da Igreja (354–430 d.C.). Considerado o maior e mais influente Padre da Igreja latina, Agostinho moldou decisivamente toda a teologia cristã ocidental. Suas obras capitais abrangem as "Confissões", "A Cidade de Deus", "A Trindade" e o tratado fundacional de hermenêutica e retórica sacra "A Doutrina Cristã" (De Doctrina Christiana).',
  ARRAY['Patrística Latina', 'Doutores da Igreja', 'Filosofia Cristã', 'Teologia Bíblica']
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
  'A Doutrina Cristã',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'O clássico definitivo de Santo Agostinho sobre a hermenêutica bíblica e a homilética cristã (De Doctrina Christiana). Desenvolve a fundamental distinção entre fruição e uso (frui et uti), o princípio de que o fim supremo de toda a Escritura é o duplo amor de Deus e do próximo, as regras para interpretar os sinais literais e figurados da Bíblia ("o ouro dos egípcios"), e os três estilos de pregação (simples, moderado e sublime) para instruir, deleitar e mover a alma.',
  'a-doutrina-crista-agostinho',
  'De Doctrina Christiana',
  '397',
  2026,
  'inteligência artificial, a partir do texto latino clássico',
  ARRAY['Latim'],
  ARRAY['Patrística', 'Hermenêutica Bíblica', 'Teologia Pastoral', 'Homilética', 'Filosofia Cristã'],
  ARRAY['agostinho-de-hipona', 'doutrina-crista', 'de-doctrina-christiana', 'hermeneutica', 'pregacao', 'patristica'],
  '/texts/a-doutrina-crista-agostinho.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de J. Martin (CCSL 32) e Bibliothèque Augustinienne (BA 11/2). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
