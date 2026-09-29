-- ============================================================
-- Nova entrada: Hugo de São Vítor - Didascalicon (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'hugo-de-sao-vitor',
  'Hugo de São Vítor',
  'Cônego regular de Santo Agostinho, filósofo, teólogo e místico medieval (c. 1096–1141 d.C.), mestre da célebre Abadia de São Vítor em Paris, cognominado "o segundo Agostinho". Sua obra capital "Didascalicon" estabeleceu a pedagogia e a hermenêutica clássicas do Renascimento do século XII, harmonizando as artes liberais com o estudo das Sagradas Escrituras e a contemplação mística.',
  ARRAY['Teologia Medieval', 'Escola Vitorina', 'Mística Cristã', 'Pedagogia e Hermenêutica']
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
  'Didascalicon: Da Arte de Ler',
  (SELECT id FROM authors WHERE slug = 'hugo-de-sao-vitor'),
  'Português',
  'O monumento clássico da pedagogia e hermenêutica cristã medieval. Hugo de São Vítor expõe a divisão universal do saber e as artes liberais como caminho de restauração da imagem divina no homem desfigurado pela ignorância, formulando a regra áurea da humildade no estudo e a célebre metodologia dos três sentidos bíblicos (História, Alegoria e Tropologia) que culmina na contemplação mística.',
  'didascalicon-hugo-de-sao-vitor',
  'Didascalicon de Studio Legendi',
  '1128',
  2026,
  'inteligência artificial, a partir do texto latino clássico',
  ARRAY['Latim'],
  ARRAY['Teologia Medieval', 'Hermenêutica Bíblica', 'Pedagogia', 'Filosofia Cristã', 'Espiritualidade'],
  ARRAY['hugo-de-sao-vitor', 'didascalicon', 'leitura-sagrada', 'artes-liberais', 'hermeneutica', 'idade-media'],
  '/texts/didascalicon-hugo-de-sao-vitor.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de C. H. Buttimer e Sources Chrétiennes (SC 372). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
