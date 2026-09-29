-- Seed para obra 'Instruções Espirituais: Sobre a Humildade e a Consciência' de São Doroteu de Gaza
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-doroteu-de-gaza',
  'São Doroteu de Gaza',
  'Abade e mestre espiritual no deserto da Palestina (séc. VI d.C.), autor de conferências espirituais célebres pela clareza psicológica e doçura pastoral.',
  ARRAY['Igreja Primitiva', 'Padres do Deserto', 'Tradição Oriental']::text[]
)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    bio_summary = EXCLUDED.bio_summary,
    denomination_or_tradition = EXCLUDED.denomination_or_tradition,
    updated_at = NOW();

INSERT INTO books (
  title, author_id, language, description, slug,
  original_title, publication_year_original, publication_year_translation,
  translator, original_languages, categories, tags,
  online_read_path, featured, published, translation_is_ai,
  human_review_approved_at, license_type, attribution_text
)
SELECT
  'Instruções Espirituais: Sobre a Humildade e a Consciência',
  a.id,
  'Português',
  'Ensinamentos práticos e profundos de São Doroteu de Gaza sobre a guarda da consciência, a renúncia ao auto-julgamento e a verdadeira humildade cristã.',
  'instrucoes-espirituais-doroteu-de-gaza',
  'Doctrinae Diversae',
  '560 d.C.',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego']::text[],
  ARRAY['Igreja Primitiva & Patrística', 'Tradição Oriental & Bizantina', 'Espiritualidade & Vida Interior', 'Combate Espiritual & Penitência']::text[],
  ARRAY['Humildade', 'Consciência', 'Padres do Deserto', 'Filocalia', 'Paz Interior']::text[],
  '/texts/instrucoes-espirituais-doroteu-de-gaza.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'sao-doroteu-de-gaza'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
