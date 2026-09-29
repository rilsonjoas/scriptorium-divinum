-- ============================================================
-- Nova entrada: A Encarnação do Verbo - Atanásio (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'atanasio-de-alexandria',
  'Santo Atanásio de Alexandria',
  'Bispo e Patriarca de Alexandria no século IV (c. 296–373 d.C.), Atanásio foi o principal baluarte da ortodoxia nicena contra a heresia ariana. Conhecido historicamente como o "Pai da Ortodoxia" e "Athanasius contra mundum", sofreu cinco exílios em defesa da consubstancialidade (homoousios) e plena divindade do Filho de Deus. Seu tratado "A Encarnação do Verbo" (De Incarnatione Verbi Dei) é considerado uma das maiores obras-primas da teologia patrística e cristã.',
  ARRAY['Patrística Grega', 'Igreja Antiga', 'Ortodoxia Nicena']
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
  'A Encarnação do Verbo',
  (SELECT id FROM authors WHERE slug = 'atanasio-de-alexandria'),
  'Português',
  'Obra-prima da teologia patrística redigida por Santo Atanásio de Alexandria por volta de 318 d.C., este tratado expõe por que o Verbo eterno de Deus Se fez homem para resgatar a humanidade da corrupção da morte e restaurar a imagem divina no homem. Com profunda beleza literária e rigor teológico, articula o triunfo da ressurreição, refuta as objeções de judeus e filósofos gentios e demonstra a eficácia vivificante de Cristo no mundo.',
  'a-encarnacao-do-verbo',
  'De Incarnatione Verbi Dei (Περὶ τῆς ἐνανθρωπήσεως τοῦ Λόγου)',
  'c. 318',
  2026,
  'inteligência artificial, a partir do original grego clássico',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Cristologia', 'Teologia Sistemática'],
  ARRAY['atanasio', 'patristica', 'encarnacao', 'cristologia', 'logos', 'redencao', 'ressurreicao', 'doutrina'],
  '/texts/a-encarnacao-do-verbo.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA diretamente a partir do grego clássico (De Incarnatione Verbi Dei), cotejada com a edição crítica de Archibald Robertson (NPNF, vol. 4). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
