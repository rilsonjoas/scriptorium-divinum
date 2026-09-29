-- ============================================================
-- Nova entrada: John Flavel - A Guarda do Coração (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'john-flavel',
  'John Flavel',
  'Pastor presbiteriano puritano inglês (c. 1627–1691), ministro em Dartmouth, Devon. Renomado por sua calorosa piedade afetuosa, habilidade de perscrutar a psicologia do coração humano e consolar os aflitos nas aflições. Seus tratados devocionais — como "A Guarda do Coração" (Keeping the Heart), "A Fonte da Vida" e "O Mistério da Providência" — tornaram-se clássicos amados da espiritualidade cristã universal.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Teologia Pastoral', 'Espiritualidade Cristã']
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
  'A Guarda do Coração',
  (SELECT id FROM authors WHERE slug = 'john-flavel'),
  'Português',
  'A obra devocional clássica de John Flavel sobre Provérbios 4.23 ("Sobre tudo o que se deve guardar, guarda o teu coração"). Expõe com profunda sabedoria pastoral como vigiar e orientar a cidadela interior da alma nas diferentes estações da vida (na prosperidade, na aflição, na perseguição, nas tentações e na hora da morte), alcançando a paz perene na comunhão com Cristo.',
  'a-guarda-do-coracao-john-flavel',
  'Keeping the Heart (A Saint Indeed)',
  '1668',
  2026,
  'inteligência artificial, a partir do original inglês clássico de Londres',
  ARRAY['Inglês'],
  ARRAY['Tradição Puritana', 'Vida Cristã', 'Espiritualidade', 'Teologia Pastoral', 'Oração'],
  ARRAY['john-flavel', 'guarda-do-coracao', 'puritanos', 'vigilancia', 'proverbios-4', 'piedade'],
  '/texts/a-guarda-do-coracao-john-flavel.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica de 1668 (Banner of Truth). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
