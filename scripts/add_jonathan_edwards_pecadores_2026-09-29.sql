-- ============================================================
-- Nova entrada: Jonathan Edwards - Pecadores nas Mãos de um Deus Irado (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'jonathan-edwards',
  'Jonathan Edwards',
  'Teólogo, pastor puritano e filósofo norte-americano (1703–1758), Jonathan Edwards é amplamente considerado uma das maiores mentes teológicas e filosóficas da história do cristianismo de língua inglesa. Líder central do Primeiro Grande Despertamento espiritual no século XVIII, suas obras — como "Afeições Religiosas", "A Liberdade da Vontade" e seu célebre sermão de Enfield (1741) — unem rigor analítico, erudição reformada e fervor evangelístico.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Grande Despertamento', 'Teologia Filosófica']
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
  'Pecadores nas Mãos de um Deus Irado',
  (SELECT id FROM authors WHERE slug = 'jonathan-edwards'),
  'Português',
  'O sermão mais famoso da história do mundo de língua inglesa e do Primeiro Grande Despertamento, pregado em Enfield em 8 de julho de 1741 sobre Deuteronômio 32.35 ("A seu tempo o seu pé resvalará"). Demonstra com impressionante intensidade bíblica a soberania de Deus, a fragilidade da vida humana e a necessidade urgente de arrependimento e fé em Jesus Cristo.',
  'pecadores-nas-maos-de-um-deus-irado',
  'Sinners in the Hands of an Angry God',
  '1741',
  2026,
  'inteligência artificial, a partir do original inglês clássico',
  ARRAY['Inglês'],
  ARRAY['Sermões', 'Tradição Puritana', 'Teologia Pastoral', 'História da Igreja'],
  ARRAY['jonathan-edwards', 'puritanos', 'grande-despertamento', 'sermao', 'graca', 'evangelho', 'reforma'],
  '/texts/pecadores-nas-maos-de-um-deus-irado.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição canônica de The Works of Jonathan Edwards (Yale / Banner of Truth). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
