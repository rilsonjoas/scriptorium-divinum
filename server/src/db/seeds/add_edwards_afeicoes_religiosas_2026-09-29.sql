-- ============================================================
-- Nova entrada: Jonathan Edwards - Tratado sobre as Afeições Religiosas (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'jonathan-edwards',
  'Jonathan Edwards',
  'Filósofo, teólogo, líder do Primeiro Grande Despertamento e presidente do College of New Jersey / Princeton (1703–1758), considerado a mais fulgurante mente teológica da história das Américas.',
  ARRAY['Tradição Reformada', 'Puritanismo Colonial', 'Filosofia Cristã', 'Avivamento']
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
  'Tratado sobre as Afeições Religiosas',
  (SELECT id FROM authors WHERE slug = 'jonathan-edwards'),
  'Português',
  'A obra-prima de discernimento espiritual de Jonathan Edwards, examinando a natureza da verdadeira religião do coração e distinguindo com precisão cirúrgica a genuína obra da graça das meras ilusões passageiras.',
  'as-afeicoes-religiosas-jonathan-edwards',
  'A Treatise Concerning Religious Affections',
  '1746',
  2026,
  'inteligência artificial, a partir do original crítico cotejado',
  ARRAY['Inglês'],
  ARRAY['Tradição Reformada', 'Discernimento Espiritual', 'Teologia dos Avivamentos', 'Vida Cristã'],
  ARRAY['jonathan-edwards', 'afeicoes-religiosas', 'avivamento', 'graca-salvadora', 'puritanos'],
  '/texts/as-afeicoes-religiosas-jonathan-edwards.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica da Yale University Press (Vol. 2). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
