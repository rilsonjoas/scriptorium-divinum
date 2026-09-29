-- ============================================================
-- Nova entrada: João Calvino - A Vida do Cristão (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'joao-calvino',
  'João Calvino',
  'Teólogo reformador francês, pastor em Genebra e jurista (1509–1564). Uma das figuras mais lúcidas e influentes de toda a história cristã, Calvino sistematizou a teologia bíblica reformada em sua monumental obra "Institutas da Religião Cristã" e em seus profundos comentários bíblicos. O tratado "A Vida do Cristão" (extraído do Livro III das Institutas) consagrou o padrão clássico de piedade, abnegação e discipulado reformado.',
  ARRAY['Reforma Protestante', 'Tradição Reformada', 'Teologia Sistemática', 'Piedade Cristã']
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
  'A Vida do Cristão',
  (SELECT id FROM authors WHERE slug = 'joao-calvino'),
  'Português',
  'O clássico manual de espiritualidade e discipulado de João Calvino, extraído dos capítulos 6 a 10 do Livro III das Institutas. Expõe com clareza e vigor bíblico o chamado à santidade evangélica, a necessidade fundamental da abnegação de si mesmo (não pertencemos a nós mesmos, mas a Deus), a pedagogia do carregar a cruz e a meditação na vida futura como guia para o uso sóbrio das realidades presentes.',
  'a-vida-do-cristao-calvino',
  'De Vita Hominis Christiani',
  '1559',
  2026,
  'inteligência artificial, a partir do texto latino clássico das Institutas',
  ARRAY['Latim'],
  ARRAY['Reforma Protestante', 'Tradição Reformada', 'Vida Cristã', 'Espiritualidade', 'Ética Cristã'],
  ARRAY['joao-calvino', 'vida-do-cristao', 'abnegacao', 'santidade', 'piedade', 'reforma'],
  '/texts/a-vida-do-cristao-calvino.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição definitiva de 1559 das Institutas (Opera Calvini). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
