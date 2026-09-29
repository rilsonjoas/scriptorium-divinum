-- ============================================================
-- Nova entrada: Santo Anselmo de Cantuária - Cur Deus Homo (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'anselmo-de-cantuaria',
  'Santo Anselmo de Cantuária',
  'Monge beneditino, arcebispo de Cantuária, teólogo, filósofo e Doutor da Igreja (1033–1109 d.C.). Considerado o "pai da Escolástica", Anselmo consagrou o método da fé em busca de compreensão (fides quaerens intellectum). Suas duas obras mais célebres — o "Proslogion" (com a demonstração ontológica de Deus) e o "Cur Deus Homo" (com a teologia clássica da satisfação vicária da Redenção) — moldaram para sempre a história do pensamento cristão.',
  ARRAY['Escolástica', 'Monástica Beneditina', 'Doutores da Igreja', 'Filosofia Cristã']
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
  'Por que Deus se fez Homem? (Cur Deus Homo)',
  (SELECT id FROM authors WHERE slug = 'anselmo-de-cantuaria'),
  'Português',
  'O tratado teológico supremo de Santo Anselmo sobre o mistério da Encarnação e da Redenção. Desenvolve com rigor lógico e filosófico a clássica doutrina da satisfação: por que a justiça e a honra infinitas de Deus exigiam uma reparação que nenhum homem finito poderia prestar, tornando estritamente necessária a Encarnação do Verbo divino como o Deus-Homem (Deus-Homo), cuja morte voluntária e inocente redime a humanidade.',
  'cur-deus-homo-anselmo',
  'Cur Deus Homo',
  '1098',
  2026,
  'inteligência artificial, a partir do texto latino clássico',
  ARRAY['Latim'],
  ARRAY['Escolástica', 'Teologia Sistemática', 'Soteriologia', 'Cristologia', 'Filosofia Cristã'],
  ARRAY['anselmo-de-cantuaria', 'cur-deus-homo', 'encarnacao', 'redencao', 'satisfacao', 'escolastica'],
  '/texts/cur-deus-homo-anselmo.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de F. S. Schmitt (Opera Omnia) e Sources Chrétiennes (SC 91). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
