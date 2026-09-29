-- ============================================================
-- Nova entrada: Blaise Pascal - Memorial e Pensamentos (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'blaise-pascal',
  'Blaise Pascal',
  'Físico, matemático, inventor e filósofo cristão francês (1623–1662), Blaise Pascal é uma das maiores mentes da história ocidental. Notável pelo princípio hidrostático de Pascal e pelas primeiras calculadoras mecânicas, após uma profunda experiência mística em 1654 (o "Memorial do Fogo") consagrou o seu gênio à apologética cristã. Sua obra imortal "Pensamentos" (Pensées) revolucionou a antropologia e a teologia com reflexões inigualáveis sobre a miséria e grandeza do homem ("o caniço pensante"), a aposta da fé (Le pari) e a ordem do coração ("O coração tem razões que a razão desconhece").',
  ARRAY['Filosofia Cristã', 'Apologética', 'Século XVII', 'Literatura Clássica']
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
  'Memorial e Pensamentos Escolhidos',
  (SELECT id FROM authors WHERE slug = 'blaise-pascal'),
  'Português',
  'Monumento da literatura e da filosofia cristã mundial. Contém o arrebatador "Memorial do Fogo" de 1654 ("Deus de Abraão, de Isaque e de Jacó, não dos filósofos..."), a célebre definição do homem como "um caniço pensante", a distinção entre as razões do coração e a razão especulativa, o argumento da aposta (Le pari) e a proclamação de Jesus Cristo como o único centro onde se harmonizam a grandeza e a miséria humanas.',
  'pensamentos-e-memorial-blaise-pascal',
  'Pensées sur la religion et sur quelques autres sujets',
  '1670',
  2026,
  'inteligência artificial, a partir do original francês clássico',
  ARRAY['Francês'],
  ARRAY['Filosofia e Ética', 'Apologética', 'Espiritualidade', 'História da Igreja'],
  ARRAY['blaise-pascal', 'pensees', 'memorial', 'canico-pensante', 'aposta-de-pascal', 'apologetica', 'filosofia-crista'],
  '/texts/pensamentos-e-memorial-blaise-pascal.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do autógrafo da BNF e das edições de Louis Lafuma e Philippe Sellier. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
