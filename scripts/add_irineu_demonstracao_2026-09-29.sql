-- ============================================================
-- Nova entrada: Santo Irineu de Lyon - Demonstração da Pregação Apostólica (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'irineu-de-lyon',
  'Santo Irineu de Lyon',
  'Bispo de Lyon, mártir e Padre da Igreja (c. 130–202 d.C.), Irineu foi discípulo direto de São Policarpo de Esmirna (que por sua vez foi instruído pelo Apóstolo João). Considerado o primeiro grande teólogo sistemático da Igreja primitiva, Irineu articulou a doutrina da sucessão apostólica, a canonicidade dos quatro Evangelhos e a célebre teologia da recapitulação (anakephalaiosis), demonstrando como Cristo restaura e renova toda a criação.',
  ARRAY['Patrística Grega', 'Padres Apostólicos', 'Apologética Antiga', 'Teologia Sistemática']
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
  'Demonstração da Pregação Apostólica',
  (SELECT id FROM authors WHERE slug = 'irineu-de-lyon'),
  'Português',
  'O catecismo patrístico mais antigo preservado da Igreja primitiva. Composto por Santo Irineu no final do século II, expõe de forma concisa e luminosa a Regra da Fé Trinitária, a criação do cosmos pelas duas mãos de Deus (o Filho e o Espírito Santo), a queda de Adão, a recapitulação universal realizada na carne e na Cruz de Cristo e a demonstração contundente do cumprimento das profecias veterotestamentárias.',
  'demonstracao-da-pregacao-apostolica',
  'Επίδειξις τοῦ ἀποστολικοῦ κηρύγματος (Epideixis)',
  '190',
  2026,
  'inteligência artificial, a partir do texto clássico preservado em armênio e grego',
  ARRAY['Grego', 'Armênio'],
  ARRAY['Patrística', 'Teologia Sistemática', 'Apologética', 'História da Igreja'],
  ARRAY['irineu-de-lyon', 'epideixis', 'pregacao-apostolica', 'recapitulacao', 'trindade', 'patristica'],
  '/texts/demonstracao-da-pregacao-apostolica.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica de J. Armitage Robinson e Sources Chrétiennes (SC 406). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
