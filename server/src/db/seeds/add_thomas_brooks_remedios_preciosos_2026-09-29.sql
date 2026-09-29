-- ============================================================
-- Nova entrada: Thomas Brooks - Remédios Preciosos (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'thomas-brooks',
  'Thomas Brooks',
  'Pregador puritano inglês de Londres (1608–1680), mestre da teologia pastoral e da cura d''almas, autor do célebre tratado Remédios Preciosos contra as Ciladas de Satanás.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Teologia Pastoral', 'Guerra Espiritual']
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
  'Remédios Preciosos contra as Ciladas de Satanás',
  (SELECT id FROM authors WHERE slug = 'thomas-brooks'),
  'Português',
  'O clássico manual puritano de combate espiritual dissecando as artimanhas, ardis e tentações de Satanás e apresentando remédios bíblicos para a guarda e vitória da alma.',
  'remedios-preciosos-contra-satanas-thomas-brooks',
  'Precious Remedies Against Satan''s Devices',
  '1652',
  2026,
  'inteligência artificial, a partir da edição puritana de Londres (1652)',
  ARRAY['Inglês'],
  ARRAY['Tradição Puritana', 'Teologia Pastoral', 'Guerra Espiritual', 'Santificação'],
  ARRAY['thomas-brooks', 'remedios-preciosos', 'puritanos', 'combate-espiritual', 'santificacao'],
  '/texts/remedios-preciosos-contra-satanas-thomas-brooks.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica puritana (Banner of Truth). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
