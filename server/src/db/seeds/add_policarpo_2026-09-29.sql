-- ============================================================
-- Nova entrada: Policarpo aos Filipenses e Martírio (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'policarpo-de-esmirna',
  'São Policarpo de Esmirna',
  'Bispo de Esmirna no século II (c. 69–155 d.C.) e um dos mais veneráveis Pais Apostólicos, Policarpo foi discípulo direto do Apóstolo João e mestre de Santo Irineu de Lyon. Destacou-se pela fidelidade intransigente à tradição apostólica contra as heresias gnósticas e pelo seu heroico martírio aos 86 anos de idade, queimado na fogueira em Esmirna por recusar blasfemar contra Cristo.',
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
  'Epístola aos Filipenses e o Martírio de São Policarpo',
  (SELECT id FROM authors WHERE slug = 'policarpo-de-esmirna'),
  'Português',
  'Volume que reúne os dois testemunhos clássicos do bispo de Esmirna: a Epístola aos Filipenses (c. 110 d.C.), repleta de citações paulinas e exortações à santidade, e o Martírio de Policarpo (c. 155 d.C.), o mais antigo relato detalhado de martírio da história cristã, celebre pela imorredoura confissão: "Oitenta e seis anos eu O servi e Ele nunca me fez mal algum; como posso blasfemar contra o meu Rei que me salvou?".',
  'epistola-e-martirio-de-policarpo',
  'Πρὸς Φιλιππησίους / Μαρτύριον τοῦ Ἁγίου Πολυκάρπου',
  'c. 110–155',
  2026,
  'inteligência artificial, a partir do original grego clássico',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Pais Apostólicos', 'Martírio', 'História da Igreja'],
  ARRAY['policarpo', 'esmirna', 'filipenses', 'patristica', 'pais-apostolicos', 'martirio', 'testemunho', 'igreja-antiga'],
  '/texts/epistola-e-martirio-de-policarpo.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto grego clássico da recensão crítica de J. B. Lightfoot (The Apostolic Fathers, 1889/1891). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
