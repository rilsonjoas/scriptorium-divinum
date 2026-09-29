-- ============================================================
-- Nova entrada: Thomas Watson - A Doutrina do Arrependimento (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'thomas-watson',
  'Thomas Watson',
  'Pastor puritano, pregador e escritor devocional inglês (c. 1620–1686), ministro de St. Stephen Walbrook em Londres. Célebre pelo estilo aforístico vívido, clareza expositiva e calor espiritual profundo, Watson legou tratados clássicos fundamentais para a espiritualidade cristã como "A Doutrina do Arrependimento", "A Fé Prática" e "Todas as Coisas Cooperam para o Bem".',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Teologia Pastoral', 'Devocional']
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
  'A Doutrina do Arrependimento',
  (SELECT id FROM authors WHERE slug = 'thomas-watson'),
  'Português',
  'O clássico tratado puritano de Thomas Watson sobre a graça do arrependimento evangélico. Disseca com profundidade psicológica e rigor bíblico os seis ingredientes necessários da contrição genuína (Visão, Tristeza, Confissão, Vergonha, Ódio e Conversão do pecado a Deus), alertando contra os enganos do remorso puramente carnal e conduzindo a alma aflita à consolação do perdão em Cristo.',
  'a-doutrina-do-arrependimento-thomas-watson',
  'The Doctrine of Repentance',
  '1668',
  2026,
  'inteligência artificial, a partir do original inglês clássico de Londres',
  ARRAY['Inglês'],
  ARRAY['Tradição Puritana', 'Vida Cristã', 'Teologia Pastoral', 'Arrependimento', 'Espiritualidade'],
  ARRAY['thomas-watson', 'doutrina-do-arrependimento', 'puritanos', 'contrite', 'evangelho', 'graca'],
  '/texts/a-doutrina-do-arrependimento-thomas-watson.md',
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
