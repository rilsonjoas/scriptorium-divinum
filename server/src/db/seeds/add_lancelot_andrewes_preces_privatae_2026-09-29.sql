-- ============================================================
-- Nova entrada: Lancelot Andrewes - Preces Privatae (Orações Privadas) (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'lancelot-andrewes',
  'Lancelot Andrewes',
  'Bispo de Winchester (1555–1626), célebre poliglota e hebraísta, principal líder dos tradutores da Bíblia King James (1611) e autor das comoventes e ricas Preces Privatae.',
  ARRAY['Tradição Anglicana', 'Patrística e Bíblia', 'Liturgia e Oração']
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
  'Preces Privatae (Orações Privadas)',
  (SELECT id FROM authors WHERE slug = 'lancelot-andrewes'),
  'Português',
  'O íntimo diário de orações em grego e latim de um dos maiores eruditos bíblicos da Inglaterra, tecido inteiramente a partir dos Salmos, dos Santos Padres e da liturgia ancestral da Igreja.',
  'preces-privatae-lancelot-andrewes',
  'Preces Privatae Quotidianae',
  '1648',
  2026,
  'inteligência artificial, a partir do original crítico cotejado',
  ARRAY['Grego', 'Latim'],
  ARRAY['Tradição Anglicana', 'Oração e Liturgia', 'Devocional', 'Espiritualidade'],
  ARRAY['lancelot-andrewes', 'preces-privatae', 'oracoes-diarias', 'king-james', 'anglicanismo'],
  '/texts/preces-privatae-lancelot-andrewes.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de F. E. Brightman. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
