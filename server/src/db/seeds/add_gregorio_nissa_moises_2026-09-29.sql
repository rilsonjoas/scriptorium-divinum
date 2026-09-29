-- ============================================================
-- Nova entrada: São Gregório de Nissa - A Vida de Moisés (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'gregorio-de-nissa',
  'São Gregório de Nissa',
  'Bispo de Nissa, teólogo, místico e Padre Capadócio (c. 335–395 d.C.), irmão mais novo de São Basílio Magno e amigo íntimo de São Gregório de Nazianzo. Considerado o maior pensador especulativo e o pai da teologia mística cristã oriental, Gregório de Nissa formulou a doutrina do progresso espiritual infinito (epektasis) e da união mística com Deus nas trevas luminosas da fé.',
  ARRAY['Patrística Grega', 'Padres Capadócios', 'Teologia Mística', 'Espiritualidade Cristã']
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
  'A Vida de Moisés',
  (SELECT id FROM authors WHERE slug = 'gregorio-de-nissa'),
  'Português',
  'A obra-prima suprema da teologia mística e espiritual da patrística grega. São Gregório de Nissa utiliza a jornada histórica de Moisés (do Egito à Sarça Ardente, do Sinai à Nuvem Divina) como alegoria magistral da ascensão da alma em direção a Deus. Desenvolve a célebre doutrina da epektasis (o crescimento infinito e insaciável na virtude e no amor divino) e da contemplação nas trevas luminosas da transcendência de Deus.',
  'a-vida-de-moises-gregorio-de-nissa',
  'Περὶ τοῦ βίου Μωϋσέως (De Vita Moysis)',
  '390',
  2026,
  'inteligência artificial, a partir do original grego clássico',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Teologia Mística', 'Espiritualidade', 'Vida Cristã', 'Hermenêutica Bíblica'],
  ARRAY['gregorio-de-nissa', 'vida-de-moises', 'epektasis', 'mistica', 'capadocios', 'patristica'],
  '/texts/a-vida-de-moises-gregorio-de-nissa.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de W. Jaeger e Sources Chrétiennes (SC 1bis). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
