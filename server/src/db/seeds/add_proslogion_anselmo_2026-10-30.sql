-- Publica o Proslogion de Anselmo (texto integral, server/texts/proslogion-anselmo.md).
-- O arquivo `proslogion.md` (versão curta, ~2,2 mil palavras) NÃO entra: é abreviação
-- da mesma obra. Tradução por IA sem revisão humana atestada (human_review_approved_at fica NULL).
--
-- Idempotente: só INSERE (ON CONFLICT (slug) DO NOTHING). Metadados seguem os do Monologion.
BEGIN;

INSERT INTO authors (slug, name)
VALUES ('anselmo-de-cantuaria', 'Santo Anselmo de Cantuária')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
SELECT
  'Proslogion',
  a.id,
  'Português',
  'Texto integral em português, traduzido por inteligência artificial.',
  'proslogion-anselmo',
  'Proslogium sive Fides Quaerens Intellectum',
  '1078',
  2026,
  'Scriptorium Divinum (tradução por IA)',
  ARRAY['Escolástica & Mística Medieval', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação'],
  ARRAY['anselmo', 'proslogion', 'existencia-de-deus', 'argumento-ontologico', 'escolastica'],
  '/texts/proslogion-anselmo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público (edição CCEL / Open Court). Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
FROM authors a
WHERE a.slug = 'anselmo-de-cantuaria'
ON CONFLICT (slug) DO NOTHING;

COMMIT;
