-- ============================================================
-- Nova entrada: 1 Clemente aos Coríntios (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'clemente-de-roma',
  'São Clemente de Roma',
  'Bispo de Roma no final do século I (c. 35–99 d.C.) e um dos principais Pais Apostólicos, Clemente foi contemporâneo e colaborador dos apóstolos Pedro e Paulo (mencionado em Fp 4.3). Sua Primeira Epístola aos Coríntios (c. 96 d.C.) é o documento cristão extrabíblico mais antigo preservado, testemunha de primeira ordem sobre a sucessão apostólica, a justificação pela fé, a harmonia cósmica e a liturgia da Igreja Primitiva.',
  ARRAY['Patrística Grega', 'Pais Apostólicos', 'Igreja Antiga']
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
  'Primeira Epístola aos Coríntios (1 Clemente)',
  (SELECT id FROM authors WHERE slug = 'clemente-de-roma'),
  'Português',
  'Escrita por volta de 96 d.C. pela Igreja de Roma à Igreja de Corinto, 1 Clemente é o mais antigo escrito cristão preservado após o Novo Testamento. Articula com maestria o combate à divisão e ao ciúme, traz a primeira formulação patrística da sucessão apostólica, une a justificação gratuita pela fé ao ardor pelas boas obras e culmina na célebre Grande Oração Cósmica e Intercessória pelos governantes.',
  'primeira-epistola-de-clemente',
  'Κλήμεντος πρὸς Κορινθίους Α´ (Clementis ad Corinthios Epistula I)',
  'c. 96',
  2026,
  'inteligência artificial, a partir do original grego clássico',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Pais Apostólicos', 'Eclesiologia', 'História da Igreja'],
  ARRAY['clemente', 'roma', 'corintios', 'patristica', 'pais-apostolicos', 'sucessao-apostolica', 'justificacao', 'ordem', 'liturgia'],
  '/texts/primeira-epistola-de-clemente.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto grego clássico da recensão crítica de J. B. Lightfoot (The Apostolic Fathers, 1890). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
