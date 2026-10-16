-- ============================================================================
-- Catálogo Universal do Scriptorium Divinum (2026) — versão revisada em 2026-10-16
--
-- Regras desta versão (a anterior falhava com violação de chave estrangeira e,
-- no migrate.js, derrubava em cascata todos os seeds seguintes):
--   * Só INSERE obras que ainda não existem (ON CONFLICT (slug) DO NOTHING).
--     Nada de obra já publicada é alterado: título, idioma e publicação ficam.
--   * Obras que repetem uma já publicada (mesmo arquivo, mesmo conteúdo, ou
--     partes de uma obra que já existe inteira) não entram.
--   * Ficam de fora, até serem traduzidas por inteiro: apologia-da-confissao-de-augsburgo
--     (13% do texto em inglês) e suma-teologica-segunda-parte-da-segunda-parte
--     (bloco de ~22 mil palavras em inglês).
--   * related_edition_slug é ligado numa segunda fase, depois de todas as obras
--     existirem, sempre nos dois sentidos e sem sobrescrever vínculo existente.
--   * Idioma, flag de IA, licença e atribuição vêm do próprio texto e dos
--     metadados do arquivo, não de um valor padrão.
--   * Autores novos só os necessários, com nome limpo e sem biografia inventada.
-- ============================================================================

BEGIN;

-- 1. Autores novos (apenas os necessários)
INSERT INTO authors (slug, name, birth_year, death_year)
VALUES ('sulpicio-severo', 'Sulpício Severo', NULL, NULL)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, birth_year, death_year)
VALUES ('sao-jeronimo', 'São Jerônimo', NULL, NULL)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, birth_year, death_year)
VALUES ('taciano-o-sirio', 'Taciano o Sírio', NULL, NULL)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, birth_year, death_year)
VALUES ('rufino-de-aquileia', 'Rufino de Aquileia', NULL, NULL)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, birth_year, death_year)
VALUES ('santo-hilario-de-poitiers', 'Santo Hilário de Poitiers', NULL, NULL)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, birth_year, death_year)
VALUES ('sao-teofilo-de-antioquia', 'São Teófilo de Antioquia', NULL, NULL)
ON CONFLICT (slug) DO NOTHING;

-- 2. Obras novas
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Catequese dos Não Instruídos',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'a-catequese-dos-nao-instruidos-agostinho',
  'De Catechizandis Rudibus',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Pedagogia Catequética'],
  ARRAY['santo-agostinho-de-hipona', 'a-catequese-dos-nao-instruidos-agostinho', 'classicos-cristaos'],
  '/texts/a-catequese-dos-nao-instruidos-agostinho.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Cidade de Deus',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'a-cidade-de-deus-agostinho',
  'De Civitate Dei contra Paganos',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['tradicao-classica-crista', 'a-cidade-de-deus-agostinho', 'classicos-cristaos'],
  '/texts/a-cidade-de-deus-agostinho.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Criação do Homem',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nissa'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'a-criacao-do-homem-gregorio-de-nissa',
  'De Hominis Opificio',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Grega e Antropologia Teológica'],
  ARRAY['sao-gregorio-de-nissa', 'a-criacao-do-homem-gregorio-de-nissa', 'classicos-cristaos'],
  '/texts/a-criacao-do-homem-gregorio-de-nissa.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Demetriano',
  (SELECT id FROM authors WHERE slug = 'cipriano-de-cartago'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'a-demetriano-cipriano',
  'Ad Demetrianum',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Apologética'],
  ARRAY['sao-cipriano-de-cartago', 'a-demetriano-cipriano', 'classicos-cristaos'],
  '/texts/a-demetriano-cipriano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Donato',
  (SELECT id FROM authors WHERE slug = 'cipriano-de-cartago'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'a-donato-cipriano',
  'Ad Donatum',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Conversão Cristã'],
  ARRAY['sao-cipriano-de-cartago', 'a-donato-cipriano', 'classicos-cristaos'],
  '/texts/a-donato-cipriano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Escápula',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'a-escapula-tertuliano',
  'Ad Scapulam',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Apologética'],
  ARRAY['tertuliano', 'a-escapula-tertuliano', 'classicos-cristaos'],
  '/texts/a-escapula-tertuliano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Fé e o Símbolo',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'a-fe-e-o-simbolo-agostinho',
  'De Fide et Symbolo',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Dogmática'],
  ARRAY['santo-agostinho-de-hipona', 'a-fe-e-o-simbolo-agostinho', 'classicos-cristaos'],
  '/texts/a-fe-e-o-simbolo-agostinho.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'À Nobreza Cristã da Nação Alemã sobre a Reforma do Estado Cristão',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'a-nobreza-crista-da-nacao-alema-lutero',
  'An den christlichen Adel',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Teologia Reformada e Eclesiologia'],
  ARRAY['martinho-lutero', 'a-nobreza-crista-da-nacao-alema-lutero', 'classicos-cristaos'],
  '/texts/a-nobreza-crista-da-nacao-alema-lutero.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Oração do Senhor',
  (SELECT id FROM authors WHERE slug = 'cipriano-de-cartago'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'a-oracao-do-senhor-cipriano',
  'De Dominica Oratione',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Espiritualidade'],
  ARRAY['sao-cipriano-de-cartago', 'a-oracao-do-senhor-cipriano', 'classicos-cristaos'],
  '/texts/a-oracao-do-senhor-cipriano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Tradição Apostólica',
  (SELECT id FROM authors WHERE slug = 'hipolito-de-roma'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'a-tradicao-apostolica-hipolito',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Antiga / Liturgia e Ordenação'],
  ARRAY['santo-hipolito-de-roma', 'a-tradicao-apostolica-hipolito', 'classicos-cristaos'],
  '/texts/a-tradicao-apostolica-hipolito.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Aos Jovens sobre a Utilidade da Literatura Clássica',
  (SELECT id FROM authors WHERE slug = 'basilio-de-cesareia'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'aos-jovens-sobre-a-literatura-grega-basilio',
  'Ad Adolescentes',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Grega e Educação Cristã'],
  ARRAY['sao-basilio-magno', 'aos-jovens-sobre-a-literatura-grega-basilio', 'classicos-cristaos'],
  '/texts/aos-jovens-sobre-a-literatura-grega-basilio.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'As Instituições Cenobíticas e os Remédios para os Oito Vícios Principais',
  (SELECT id FROM authors WHERE slug = 'sao-joao-cassiano'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'as-instituicoes-cenobiticas-joao-cassiano',
  'De Institutis Coenobiorum',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Monasticismo e Espiritualidade Cristã'],
  ARRAY['sao-joao-cassiano', 'as-instituicoes-cenobiticas-joao-cassiano', 'classicos-cristaos'],
  '/texts/as-instituicoes-cenobiticas-joao-cassiano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Cartas sobre São Martinho de Tours',
  (SELECT id FROM authors WHERE slug = 'sulpicio-severo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'cartas-sobre-sao-martinho-sulpicio-severo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Latim'],
  ARRAY['Epistolário / Hagiografia / Testemunho Patrístico'],
  ARRAY['sulpicio-severo', 'cartas-sobre-sao-martinho-sulpicio-severo', 'classicos-cristaos'],
  '/texts/cartas-sobre-sao-martinho-sulpicio-severo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Catequeses Batismais - Parte 1 (Prólogo e Catequeses 1 a 10)',
  (SELECT id FROM authors WHERE slug = 'cirilo-de-jerusalem'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'catequeses-batismais-parte-1-cirilo-de-jerusalem',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Catequese Sacramental / Teologia Batismal / Exposição do Credo de Jerusalém'],
  ARRAY['sao-cirilo-de-jerusalem', 'catequeses-batismais-parte-1-cirilo-de-jerusalem', 'classicos-cristaos'],
  '/texts/catequeses-batismais-parte-1-cirilo-de-jerusalem.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Catequeses Batismais - Parte 2 (Catequeses 11 a 18)',
  (SELECT id FROM authors WHERE slug = 'cirilo-de-jerusalem'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'catequeses-batismais-parte-2-cirilo-de-jerusalem',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Catequese Sacramental / Cristologia / Pneumatologia e Escatologia do Credo'],
  ARRAY['sao-cirilo-de-jerusalem', 'catequeses-batismais-parte-2-cirilo-de-jerusalem', 'classicos-cristaos'],
  '/texts/catequeses-batismais-parte-2-cirilo-de-jerusalem.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Comentário sobre a Epístola aos Gálatas',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'comentario-sobre-galatas-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Teologia Paulina / Graça e Justificação'],
  ARRAY['sao-joao-crisostomo', 'comentario-sobre-galatas-joao-crisostomo', 'classicos-cristaos'],
  '/texts/comentario-sobre-galatas-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Contra a Mentira',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'contra-a-mentira-agostinho',
  'Contra Mendacium',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Teologia Moral'],
  ARRAY['santo-agostinho', 'contra-a-mentira-agostinho', 'classicos-cristaos'],
  '/texts/contra-a-mentira-agostinho.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Contra as Heresias: Livro III — A Tradição Apostólica, a Sucessão Eclesiástica e os Quatro Evangelhos',
  (SELECT id FROM authors WHERE slug = 'irineu-de-lyon'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'contra-as-heresias-livro-3-ireneu',
  'Adversus Haereses',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Antiga e Apologética'],
  ARRAY['santo-ireneu-de-lyon', 'contra-as-heresias-livro-3-ireneu', 'classicos-cristaos'],
  '/texts/contra-as-heresias-livro-3-ireneu.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Contra as Heresias: Livro IV — A Unidade da Antiga e Nova Aliança na Lei e no Evangelho',
  (SELECT id FROM authors WHERE slug = 'irineu-de-lyon'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'contra-as-heresias-livro-4-ireneu',
  'Adversus Haereses',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Antiga e Apologética'],
  ARRAY['santo-ireneu-de-lyon', 'contra-as-heresias-livro-4-ireneu', 'classicos-cristaos'],
  '/texts/contra-as-heresias-livro-4-ireneu.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Contra as Heresias: Livro V — A Ressurreição da Carne e o Reino dos Justos',
  (SELECT id FROM authors WHERE slug = 'irineu-de-lyon'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'contra-as-heresias-livro-5-ireneu',
  'Adversus Haereses',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Antiga e Escatologia'],
  ARRAY['santo-ireneu-de-lyon', 'contra-as-heresias-livro-5-ireneu', 'classicos-cristaos'],
  '/texts/contra-as-heresias-livro-5-ireneu.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Perpétua Virgindade da Bem-Aventurada Maria: Contra Helvídio',
  (SELECT id FROM authors WHERE slug = 'sao-jeronimo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'contra-helvidio-perpetua-virgindade-de-maria-jeronimo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Mariologia'],
  ARRAY['sao-jeronimo', 'contra-helvidio-perpetua-virgindade-de-maria-jeronimo', 'classicos-cristaos'],
  '/texts/contra-helvidio-perpetua-virgindade-de-maria-jeronimo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Contra Práxeas',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'contra-praxeas-tertuliano',
  'Adversus Praxean',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Teologia Trinitária'],
  ARRAY['tertuliano', 'contra-praxeas-tertuliano', 'classicos-cristaos'],
  '/texts/contra-praxeas-tertuliano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Continência',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'da-continencia-agostinho',
  'De Continentia',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['santo-agostinho', 'da-continencia-agostinho', 'classicos-cristaos'],
  '/texts/da-continencia-agostinho.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Fé nas Coisas Invisíveis',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'da-fe-nas-coisas-invisiveis-agostinho',
  'De Fide Rerum Quae Non Videntur',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Apologética'],
  ARRAY['santo-agostinho', 'da-fe-nas-coisas-invisiveis-agostinho', 'classicos-cristaos'],
  '/texts/da-fe-nas-coisas-invisiveis-agostinho.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Idolatria',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'da-idolatria-tertuliano',
  'De Idololatria',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Apologética'],
  ARRAY['tertuliano', 'da-idolatria-tertuliano', 'classicos-cristaos'],
  '/texts/da-idolatria-tertuliano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Mentira',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'da-mentira-agostinho',
  'De Mendacio',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Teologia Moral'],
  ARRAY['santo-agostinho', 'da-mentira-agostinho', 'classicos-cristaos'],
  '/texts/da-mentira-agostinho.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Natureza do Bem',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'da-natureza-do-bem-agostinho',
  'De Natura Boni',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Metafísica Cristã'],
  ARRAY['santo-agostinho', 'da-natureza-do-bem-agostinho', 'classicos-cristaos'],
  '/texts/da-natureza-do-bem-agostinho.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Oração e da Vida Contemplativa',
  (SELECT id FROM authors WHERE slug = 'sao-tomas-de-aquino'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'da-oracao-e-vida-contemplativa-tomas-de-aquino',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['prefacio', 'da-oracao-e-vida-contemplativa-tomas-de-aquino', 'classicos-cristaos'],
  '/texts/da-oracao-e-vida-contemplativa-tomas-de-aquino.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Paciência',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'da-paciencia-tertuliano',
  'De Patientia',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['tertuliano', 'da-paciencia-tertuliano', 'classicos-cristaos'],
  '/texts/da-paciencia-tertuliano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Santa Virgindade',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'da-santa-virgindade-agostinho',
  'De Sancta Virginitate',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Ascetismo'],
  ARRAY['santo-agostinho', 'da-santa-virgindade-agostinho', 'classicos-cristaos'],
  '/texts/da-santa-virgindade-agostinho.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'De Magistro',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'de-magistro',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['nota-introdutoria', 'de-magistro', 'classicos-cristaos'],
  '/texts/de-magistro.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Diálogo contra os Luciferianos',
  (SELECT id FROM authors WHERE slug = 'sao-jeronimo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'dialogo-contra-os-luciferianos-jeronimo',
  'Dialogus contra Luciferianos',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Eclesiologia'],
  ARRAY['sao-jeronimo', 'dialogo-contra-os-luciferianos-jeronimo', 'classicos-cristaos'],
  '/texts/dialogo-contra-os-luciferianos-jeronimo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Diálogos sobre os Padres do Deserto e São Martinho de Tours',
  (SELECT id FROM authors WHERE slug = 'sulpicio-severo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'dialogos-sobre-sao-martinho-sulpicio-severo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Latim'],
  ARRAY['Hagiografia / Diálogos / Monaquismo Comparado'],
  ARRAY['sulpicio-severo', 'dialogos-sobre-sao-martinho-sulpicio-severo', 'classicos-cristaos'],
  '/texts/dialogos-sobre-sao-martinho-sulpicio-severo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Didaquê',
  (SELECT id FROM authors WHERE slug = 'igreja-antiga'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'didaque-doutrina-dos-doze-apostolos',
  'O Ensino dos Doze Apóstolos',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['introducao', 'didaque-doutrina-dos-doze-apostolos', 'classicos-cristaos'],
  '/texts/didaque-doutrina-dos-doze-apostolos.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Discurso aos Gregos: Apologia contra os Filósofos Pagãos',
  (SELECT id FROM authors WHERE slug = 'taciano-o-sirio'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'discurso-aos-gregos-taciano',
  'Oratio ad Graecos',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Antiga e Apologética'],
  ARRAY['taciano-o-sirio', 'discurso-aos-gregos-taciano', 'classicos-cristaos'],
  '/texts/discurso-aos-gregos-taciano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Do Bem da Viuvez',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'do-bem-da-viuvez-agostinho',
  'De Bono Viduitatis',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['santo-agostinho', 'do-bem-da-viuvez-agostinho', 'classicos-cristaos'],
  '/texts/do-bem-da-viuvez-agostinho.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Do Bem do Matrimônio',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'do-bem-do-matrimonio-agostinho',
  'De Bono Coniugali',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Teologia da Família'],
  ARRAY['santo-agostinho', 'do-bem-do-matrimonio-agostinho', 'classicos-cristaos'],
  '/texts/do-bem-do-matrimonio-agostinho.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Do Cuidado Devido aos Mortos',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'do-cuidado-devido-aos-mortos-agostinho',
  'De Cura pro Mortuis Gerenda',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Escatologia'],
  ARRAY['santo-agostinho', 'do-cuidado-devido-aos-mortos-agostinho', 'classicos-cristaos'],
  '/texts/do-cuidado-devido-aos-mortos-agostinho.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Do Trabalho dos Monges',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'do-trabalho-dos-monges-agostinho',
  'De Opere Monachorum',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Monasticismo'],
  ARRAY['santo-agostinho', 'do-trabalho-dos-monges-agostinho', 'classicos-cristaos'],
  '/texts/do-trabalho-dos-monges-agostinho.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Dos Espetáculos',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'dos-espetaculos-tertuliano',
  'De Spectaculis',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['tertuliano', 'dos-espetaculos-tertuliano', 'classicos-cristaos'],
  '/texts/dos-espetaculos-tertuliano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Exortação ao Martírio',
  (SELECT id FROM authors WHERE slug = 'cipriano-de-cartago'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'exortacao-ao-martirio-cipriano',
  'Exhortatio ad Martyrium',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Espiritualidade do Martírio'],
  ARRAY['sao-cipriano-de-cartago', 'exortacao-ao-martirio-cipriano', 'classicos-cristaos'],
  '/texts/exortacao-ao-martirio-cipriano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Exposição do Símbolo dos Apóstolos',
  (SELECT id FROM authors WHERE slug = 'rufino-de-aquileia'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'exposicao-do-simbolo-dos-apostolos-rufino',
  'Commentarius in Symbolum Apostolorum',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Dogmática'],
  ARRAY['rufino-de-aquileia', 'exposicao-do-simbolo-dos-apostolos-rufino', 'classicos-cristaos'],
  '/texts/exposicao-do-simbolo-dos-apostolos-rufino.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Hexaemeron: Homilias sobre os Seis Dias da Criação',
  (SELECT id FROM authors WHERE slug = 'basilio-de-cesareia'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'hexaemeron-homilias-sobre-a-criacao-basilio-magno',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Cosmologia Teológica / Exegese do Gênesis / Filosofia Cristã da Criação'],
  ARRAY['sao-basilio-magno', 'hexaemeron-homilias-sobre-a-criacao-basilio-magno', 'classicos-cristaos'],
  '/texts/hexaemeron-homilias-sobre-a-criacao-basilio-magno.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias e Escritos Espirituais',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'homilias-e-escritos-espirituais-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['folhas-de-sao-joao-crisostomo', 'homilias-e-escritos-espirituais-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-e-escritos-espirituais-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre as Estátuas ao Povo de Antioquia - Parte 1',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'homilias-sobre-as-estatuas-parte-1-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Homilética Patrística / Oratória Sagrada / Teologia Pastoral em Época de Calamidade'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-as-estatuas-parte-1-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-as-estatuas-parte-1-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre as Estátuas ao Povo de Antioquia - Parte 2',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'homilias-sobre-as-estatuas-parte-2-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Homilética Patrística / Oratória Sagrada / Teologia Pastoral em Época de Calamidade'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-as-estatuas-parte-2-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-as-estatuas-parte-2-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Epístola aos Colossenses',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'homilias-sobre-colossenses-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Cristologia Paulina / Vida Mística'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-colossenses-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-colossenses-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Epístola aos Efésios',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'homilias-sobre-efesios-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Eclesiologia / Teologia Dogmática e Moral'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-efesios-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-efesios-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Epístola a Filemom',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'homilias-sobre-filemom-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Teologia Moral / Fraternidade Evangélica'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-filemom-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-filemom-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Epístola aos Filipenses',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'homilias-sobre-filipenses-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Cristologia / Espiritualidade e Alegria Cristã'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-filipenses-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-filipenses-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Epístola aos Hebreus - Parte 1 (Homilias 1 a 17)',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'homilias-sobre-hebreus-parte-1-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Cristologia Sacerdotal / Teologia da Aliança'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-hebreus-parte-1-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-hebreus-parte-1-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Epístola aos Hebreus - Parte 2 (Homilias 18 a 34)',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'homilias-sobre-hebreus-parte-2-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Teologia Sacrificial / A Galeria da Fé e Perseverança'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-hebreus-parte-2-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-hebreus-parte-2-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Primeira Epístola aos Tessalonicenses',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'homilias-sobre-primeira-tessalonicenses-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Teologia Paulina / Esperança e Ressurreição'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-primeira-tessalonicenses-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-primeira-tessalonicenses-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Primeira Epístola a Timóteo',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'homilias-sobre-primeira-timoteo-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Teologia Pastoral / Ordem e Disciplina Eclesial'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-primeira-timoteo-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-primeira-timoteo-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Segunda Epístola aos Tessalonicenses',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'homilias-sobre-segunda-tessalonicenses-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Escatologia Bíblica / Parusia e Fidelidade'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-segunda-tessalonicenses-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-segunda-tessalonicenses-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Segunda Epístola a Timóteo',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'homilias-sobre-segunda-timoteo-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Teologia Pastoral / O Bom Combate da Fé'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-segunda-timoteo-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-segunda-timoteo-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Epístola a Tito',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'homilias-sobre-tito-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Teologia Pastoral / Homilética Patrística'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-tito-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-tito-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'As Institutas da Religião Cristã',
  (SELECT id FROM authors WHERE slug = 'joao-calvino'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'institutas-da-religiao-crista',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Teologia Sistemática e Reforma'],
  ARRAY['joao-calvino', 'institutas-da-religiao-crista', 'classicos-cristaos'],
  '/texts/institutas-da-religiao-crista.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Bem da Paciência',
  (SELECT id FROM authors WHERE slug = 'cipriano-de-cartago'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'o-bem-da-paciencia-cipriano',
  'De Bono Patientiae',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['sao-cipriano-de-cartago', 'o-bem-da-paciencia-cipriano', 'classicos-cristaos'],
  '/texts/o-bem-da-paciencia-cipriano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Catecismo Maior',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'o-catecismo-maior-martinho-lutero',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Confissões Luteranas / Catequese Dogmática'],
  ARRAY['martinho-lutero', 'o-catecismo-maior-martinho-lutero', 'classicos-cristaos'],
  '/texts/o-catecismo-maior-martinho-lutero.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Grande Discurso Catequético',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nissa'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'o-grande-discurso-catequetico-gregorio-de-nissa',
  'Oratio Catechetica Magna',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Grega e Dogmática'],
  ARRAY['sao-gregorio-de-nissa', 'o-grande-discurso-catequetico-gregorio-de-nissa', 'classicos-cristaos'],
  '/texts/o-grande-discurso-catequetico-gregorio-de-nissa.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Hábito das Virgens',
  (SELECT id FROM authors WHERE slug = 'cipriano-de-cartago'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'o-habito-das-virgens-cipriano',
  'De Habitu Virginum',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['sao-cipriano-de-cartago', 'o-habito-das-virgens-cipriano', 'classicos-cristaos'],
  '/texts/o-habito-das-virgens-cipriano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Páginas Douradas de São João Crisóstomo',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'paginas-douradas-sao-joao-crisostomo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Homilética e Espiritualidade Patrística'],
  ARRAY['sao-joao-crisostomo', 'paginas-douradas-sao-joao-crisostomo', 'classicos-cristaos'],
  '/texts/paginas-douradas-sao-joao-crisostomo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Pensamentos',
  (SELECT id FROM authors WHERE slug = 'blaise-pascal'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'pensamentos-blaise-pascal',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Francês'],
  ARRAY['Apologética e Filosofia Cristã / Antropologia Teológica'],
  ARRAY['blaise-pascal', 'pensamentos-blaise-pascal', 'classicos-cristaos'],
  '/texts/pensamentos-blaise-pascal.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Resposta aos Judeus',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'resposta-aos-judeus-tertuliano',
  'Adversus Judaeos',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Apologética'],
  ARRAY['tertuliano', 'resposta-aos-judeus-tertuliano', 'classicos-cristaos'],
  '/texts/resposta-aos-judeus-tertuliano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermões sobre o Mistério da Natividade e Encarnação do Senhor',
  (SELECT id FROM authors WHERE slug = 'sao-leao-magno'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sermoes-sobre-a-natividade-sao-leao-magno',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Latim'],
  ARRAY['Teologia Dogmática / Cristologia / Homilética Litúrgica'],
  ARRAY['sao-leao-magno', 'sermoes-sobre-a-natividade-sao-leao-magno', 'classicos-cristaos'],
  '/texts/sermoes-sobre-a-natividade-sao-leao-magno.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermões sobre o Mistério Pascal',
  (SELECT id FROM authors WHERE slug = 'sao-leao-magno'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sermoes-sobre-o-misterio-pascal-sao-leao-magno',
  'Paixão, Ressurreição e Ascensão do Senhor',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Latim'],
  ARRAY['Sermões Dogmáticos / Teologia Litúrgica / Cristologia e Redenção'],
  ARRAY['sao-leao-magno', 'sermoes-sobre-o-misterio-pascal-sao-leao-magno', 'classicos-cristaos'],
  '/texts/sermoes-sobre-o-misterio-pascal-sao-leao-magno.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermões sobre Pentecostes, os Santos Apóstolos e as Bem-Aventuranças',
  (SELECT id FROM authors WHERE slug = 'sao-leao-magno'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sermoes-sobre-pentecostes-e-os-santos-sao-leao-magno',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Latim'],
  ARRAY['Pneumatologia / Eclesiologia / Hagiografia e Ética Evangélica'],
  ARRAY['sao-leao-magno', 'sermoes-sobre-pentecostes-e-os-santos-sao-leao-magno', 'classicos-cristaos'],
  '/texts/sermoes-sobre-pentecostes-e-os-santos-sao-leao-magno.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Alma e a Ressurreição',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nissa'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-a-alma-e-a-ressurreicao-gregorio-de-nissa',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Escrituração Dialógica / Imortalidade da Alma / Escatologia e Ressurreição'],
  ARRAY['sao-gregorio-de-nissa', 'sobre-a-alma-e-a-ressurreicao-gregorio-de-nissa', 'classicos-cristaos'],
  '/texts/sobre-a-alma-e-a-ressurreicao-gregorio-de-nissa.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Alma e a Ressurreição',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nissa'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-a-alma-e-a-ressurreicao-gregorio-nissa',
  'De Anima et Resurrectione — Diálogo com Santa Macrina',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Grega e Filosofia Cristã'],
  ARRAY['sao-gregorio-de-nissa', 'sobre-a-alma-e-a-ressurreicao-gregorio-nissa', 'classicos-cristaos'],
  '/texts/sobre-a-alma-e-a-ressurreicao-gregorio-nissa.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Carne de Cristo',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-a-carne-de-cristo-tertuliano',
  'De Carne Christi',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Cristologia'],
  ARRAY['tertuliano', 'sobre-a-carne-de-cristo-tertuliano', 'classicos-cristaos'],
  '/texts/sobre-a-carne-de-cristo-tertuliano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Criação do Homem',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nissa'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-a-criacao-do-homem-gregorio-de-nissa',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Grego'],
  ARRAY['Antropologia Teológica / Imago Dei / Ressurreição e Escatologia'],
  ARRAY['sao-gregorio-de-nissa', 'sobre-a-criacao-do-homem-gregorio-de-nissa', 'classicos-cristaos'],
  '/texts/sobre-a-criacao-do-homem-gregorio-de-nissa.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Mortalidade',
  (SELECT id FROM authors WHERE slug = 'cipriano-de-cartago'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-a-mortalidade-cipriano',
  'De Mortalitate',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Consolação Cristã'],
  ARRAY['sao-cipriano-de-cartago', 'sobre-a-mortalidade-cipriano', 'classicos-cristaos'],
  '/texts/sobre-a-mortalidade-cipriano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Oração e a Vida Contemplativa',
  (SELECT id FROM authors WHERE slug = 'sao-tomas-de-aquino'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-a-oracao-e-a-vida-contemplativa-tomas-de-aquino',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Latim'],
  ARRAY['Teologia Espiritual e Mística / Vida Contemplativa e Oração'],
  ARRAY['santo-tomas-de-aquino', 'sobre-a-oracao-e-a-vida-contemplativa-tomas-de-aquino', 'classicos-cristaos'],
  '/texts/sobre-a-oracao-e-a-vida-contemplativa-tomas-de-aquino.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Oração',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-a-oracao-tertuliano',
  'De Oratione',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Espiritualidade'],
  ARRAY['tertuliano', 'sobre-a-oracao-tertuliano', 'classicos-cristaos'],
  '/texts/sobre-a-oracao-tertuliano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Ressurreição da Carne',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-a-ressurreicao-da-carne-tertuliano',
  'De Resurrectione Carnis',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Escatologia'],
  ARRAY['tertuliano', 'sobre-a-ressurreicao-da-carne-tertuliano', 'classicos-cristaos'],
  '/texts/sobre-a-ressurreicao-da-carne-tertuliano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Virgindade',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nissa'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-a-virgindade-gregorio-de-nissa',
  'De Virginitate',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Grega e Ascética'],
  ARRAY['sao-gregorio-de-nissa', 'sobre-a-virgindade-gregorio-de-nissa', 'classicos-cristaos'],
  '/texts/sobre-a-virgindade-gregorio-de-nissa.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre as Boas Obras e as Esmolas',
  (SELECT id FROM authors WHERE slug = 'cipriano-de-cartago'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-as-boas-obras-e-as-esmolas-cipriano',
  'De Opere et Eleemosynis',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['sao-cipriano-de-cartago', 'sobre-as-boas-obras-e-as-esmolas-cipriano', 'classicos-cristaos'],
  '/texts/sobre-as-boas-obras-e-as-esmolas-cipriano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre as Virgens',
  (SELECT id FROM authors WHERE slug = 'ambrosio-de-milao'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-as-virgens-ambrosio-de-milao',
  'De Virginibus ad Marcellinam',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Ascetismo'],
  ARRAY['santo-ambrosio-de-milao', 'sobre-as-virgens-ambrosio-de-milao', 'classicos-cristaos'],
  '/texts/sobre-as-virgens-ambrosio-de-milao.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre as Viúvas',
  (SELECT id FROM authors WHERE slug = 'ambrosio-de-milao'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-as-viuvas-ambrosio-de-milao',
  'De Viduis',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['santo-ambrosio-de-milao', 'sobre-as-viuvas-ambrosio-de-milao', 'classicos-cristaos'],
  '/texts/sobre-as-viuvas-ambrosio-de-milao.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre Homens Ilustres',
  (SELECT id FROM authors WHERE slug = 'sao-jeronimo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-homens-ilustres-jeronimo',
  'De Viris Illustribus',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Patrologia Histórica'],
  ARRAY['sao-jeronimo', 'sobre-homens-ilustres-jeronimo', 'classicos-cristaos'],
  '/texts/sobre-homens-ilustres-jeronimo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre o Batismo',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-o-batismo-tertuliano',
  'De Baptismo',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Teologia Sacramental'],
  ARRAY['tertuliano', 'sobre-o-batismo-tertuliano', 'classicos-cristaos'],
  '/texts/sobre-o-batismo-tertuliano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre o Espírito Santo',
  (SELECT id FROM authors WHERE slug = 'ambrosio-de-milao'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-o-espirito-santo-ambrosio-de-milao',
  'De Spiritu Sancto',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Latim'],
  ARRAY['Pneumatologia Patrística / Teologia Trinitária / Cristologia Dogmática'],
  ARRAY['santo-ambrosio-de-milao', 'sobre-o-espirito-santo-ambrosio-de-milao', 'classicos-cristaos'],
  '/texts/sobre-o-espirito-santo-ambrosio-de-milao.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre o Zelo e a Inveja',
  (SELECT id FROM authors WHERE slug = 'cipriano-de-cartago'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-o-zelo-e-a-inveja-cipriano',
  'De Zelo et Livore',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['sao-cipriano-de-cartago', 'sobre-o-zelo-e-a-inveja-cipriano', 'classicos-cristaos'],
  '/texts/sobre-o-zelo-e-a-inveja-cipriano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre os Caídos',
  (SELECT id FROM authors WHERE slug = 'cipriano-de-cartago'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-os-caidos-cipriano',
  'De Lapsis',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Disciplina Eclesiástica'],
  ARRAY['sao-cipriano-de-cartago', 'sobre-os-caidos-cipriano', 'classicos-cristaos'],
  '/texts/sobre-os-caidos-cipriano.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre os Deveres do Clero - Livro I',
  (SELECT id FROM authors WHERE slug = 'ambrosio-de-milao'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-os-deveres-do-clero-livro-1-ambrosio-de-milao',
  'De Officiis Ministrorum Liber I',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Latim'],
  ARRAY['Ética Cristã / Teologia Pastoral / Filosofia Moral Patrística'],
  ARRAY['santo-ambrosio-de-milao', 'sobre-os-deveres-do-clero-livro-1-ambrosio-de-milao', 'classicos-cristaos'],
  '/texts/sobre-os-deveres-do-clero-livro-1-ambrosio-de-milao.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre os Deveres do Clero - Livros II e III',
  (SELECT id FROM authors WHERE slug = 'ambrosio-de-milao'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-os-deveres-do-clero-livros-2-e-3-ambrosio-de-milao',
  'De Officiis Ministrorum Libri II & III',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Latim'],
  ARRAY['Ética Cristã / Teologia Pastoral / Filosofia Moral Patrística'],
  ARRAY['santo-ambrosio-de-milao', 'sobre-os-deveres-do-clero-livros-2-e-3-ambrosio-de-milao', 'classicos-cristaos'],
  '/texts/sobre-os-deveres-do-clero-livros-2-e-3-ambrosio-de-milao.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre os Sínodos, ou Da Fé dos Orientais',
  (SELECT id FROM authors WHERE slug = 'santo-hilario-de-poitiers'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'sobre-os-sinodos-hilario-de-poitiers',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Latim'],
  ARRAY['Teologia Dogmática / Cristologia / História Conciliar'],
  ARRAY['santo-hilario-de-poitiers', 'sobre-os-sinodos-hilario-de-poitiers', 'classicos-cristaos'],
  '/texts/sobre-os-sinodos-hilario-de-poitiers.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Suma Teológica — Primeira Parte da Segunda Parte',
  (SELECT id FROM authors WHERE slug = 'sao-tomas-de-aquino'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'suma-teologica-primeira-parte-da-segunda-parte',
  'Prima Secundae',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Teologia Moral e Escolástica'],
  ARRAY['santo-tomas-de-aquino', 'suma-teologica-primeira-parte-da-segunda-parte', 'classicos-cristaos'],
  '/texts/suma-teologica-primeira-parte-da-segunda-parte.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Suma Teológica — Primeira Parte',
  (SELECT id FROM authors WHERE slug = 'sao-tomas-de-aquino'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'suma-teologica-primeira-parte',
  'Prima Pars',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Teologia Sistemática e Escolástica'],
  ARRAY['santo-tomas-de-aquino', 'suma-teologica-primeira-parte', 'classicos-cristaos'],
  '/texts/suma-teologica-primeira-parte.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Suma Teológica — Terceira Parte',
  (SELECT id FROM authors WHERE slug = 'sao-tomas-de-aquino'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'suma-teologica-terceira-parte',
  'Tertia Pars',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Cristologia e Teologia Sacramental'],
  ARRAY['santo-tomas-de-aquino', 'suma-teologica-terceira-parte', 'classicos-cristaos'],
  '/texts/suma-teologica-terceira-parte.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Tradição Apostólica',
  (SELECT id FROM authors WHERE slug = 'hipolito-de-roma'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'tradicao-apostolica-hipolito',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['nota-prefatoria', 'tradicao-apostolica-hipolito', 'classicos-cristaos'],
  '/texts/tradicao-apostolica-hipolito.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratado a Autólico: Apologia da Fé Cristã e da Criação',
  (SELECT id FROM authors WHERE slug = 'sao-teofilo-de-antioquia'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'tratado-a-autolico-teofilo-antioquia',
  'Ad Autolycum',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Antiga e Apologética'],
  ARRAY['sao-teofilo-de-antioquia', 'tratado-a-autolico-teofilo-antioquia', 'classicos-cristaos'],
  '/texts/tratado-a-autolico-teofilo-antioquia.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratados Patrísticos Fundamentais - Parte 1',
  (SELECT id FROM authors WHERE slug = 'cipriano-de-cartago'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'tratados-patristicos-parte-1-cipriano-de-cartago',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Latim'],
  ARRAY['Eclesiologia Patrística / Espiritualidade / Disciplina Eclesiástica'],
  ARRAY['sao-cipriano-de-cartago', 'tratados-patristicos-parte-1-cipriano-de-cartago', 'classicos-cristaos'],
  '/texts/tratados-patristicos-parte-1-cipriano-de-cartago.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratados Patrísticos Fundamentais - Parte 2',
  (SELECT id FROM authors WHERE slug = 'cipriano-de-cartago'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'tratados-patristicos-parte-2-cipriano-de-cartago',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Latim'],
  ARRAY['Espiritualidade Patrística / Moral Cristã / Teologia do Martírio'],
  ARRAY['sao-cipriano-de-cartago', 'tratados-patristicos-parte-2-cipriano-de-cartago', 'classicos-cristaos'],
  '/texts/tratados-patristicos-parte-2-cipriano-de-cartago.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Vida de Santo Hilarião',
  (SELECT id FROM authors WHERE slug = 'sao-jeronimo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'vida-de-santo-hilariao-jeronimo',
  'Vita Sancti Hilarionis',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Hagiografia Monástica'],
  ARRAY['sao-jeronimo', 'vida-de-santo-hilariao-jeronimo', 'classicos-cristaos'],
  '/texts/vida-de-santo-hilariao-jeronimo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Vida de São Malaquias de Armagh',
  (SELECT id FROM authors WHERE slug = 'bernardo-de-claraval'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'vida-de-sao-malaquias-bernardo-de-claraval',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['tradicao-classica-crista', 'vida-de-sao-malaquias-bernardo-de-claraval', 'classicos-cristaos'],
  '/texts/vida-de-sao-malaquias-bernardo-de-claraval.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Vida de São Malaquias, o Monge Cativo',
  (SELECT id FROM authors WHERE slug = 'sao-jeronimo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'vida-de-sao-malaquias-jeronimo',
  'Vita Malchi',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Hagiografia Monástica'],
  ARRAY['sao-jeronimo', 'vida-de-sao-malaquias-jeronimo', 'classicos-cristaos'],
  '/texts/vida-de-sao-malaquias-jeronimo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Vida de São Martinho de Tours',
  (SELECT id FROM authors WHERE slug = 'sulpicio-severo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'vida-de-sao-martinho-sulpicio-severo',
  NULL,
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  ARRAY['Latim'],
  ARRAY['Hagiografia / Espiritualidade / Monaquismo Primitivo'],
  ARRAY['sulpicio-severo', 'vida-de-sao-martinho-sulpicio-severo', 'classicos-cristaos'],
  '/texts/vida-de-sao-martinho-sulpicio-severo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Vida de São Paulo, o Primeiro Eremita',
  (SELECT id FROM authors WHERE slug = 'sao-jeronimo'),
  'Português',
  'Texto integral em português, traduzido por inteligência artificial (revisão humana pendente).',
  'vida-de-sao-paulo-eremita-jeronimo',
  'Vita Sancti Pauli',
  2026,
  'Scriptorium Divinum (tradução por IA, revisão humana pendente)',
  NULL,
  ARRAY['Patrística Latina e Hagiografia Monástica'],
  ARRAY['sao-jeronimo', 'vida-de-sao-paulo-eremita-jeronimo', 'classicos-cristaos'],
  '/texts/vida-de-sao-paulo-eremita-jeronimo.md',
  false,
  true,
  true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público; a edição-fonte não foi auditada. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Edições vinculadas (fase 2: todas as obras já existem; nos dois sentidos)
UPDATE books SET related_edition_slug = 'the-city-of-god' WHERE slug = 'a-cidade-de-deus-agostinho' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'the-consolation-of-philosophy' WHERE slug = 'a-consolacao-da-filosofia-boecio' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'the-holy-war' WHERE slug = 'a-guerra-santa-john-bunyan' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'the-apostolic-tradition-of-hippolytus' WHERE slug = 'a-tradicao-apostolica-hipolito' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'commentary-on-the-epistle-to-the-galatians' WHERE slug = 'comentario-aos-galatas-lutero' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'comentario-aos-galatas-lutero' WHERE slug = 'commentary-on-the-epistle-to-the-galatians' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'da-liberdade-do-cristao' WHERE slug = 'concerning-christian-liberty' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'the-confessions-of-st-augustine' WHERE slug = 'confissoes' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'concerning-christian-liberty' WHERE slug = 'da-liberdade-do-cristao' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'grace-abounding-to-the-chief-of-sinners' WHERE slug = 'graca-abundante-john-bunyan' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'graca-abundante-john-bunyan' WHERE slug = 'grace-abounding-to-the-chief-of-sinners' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'institutes-of-the-christian-religion' WHERE slug = 'institutas-da-religiao-crista' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'institutas-da-religiao-crista' WHERE slug = 'institutes-of-the-christian-religion' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'paginas-douradas-sao-joao-crisostomo' WHERE slug = 'leaves-from-st-john-chrysostom' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'the-large-catechism' WHERE slug = 'o-catecismo-maior-martinho-lutero' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'the-saints-everlasting-rest' WHERE slug = 'o-descanso-eterno-dos-santos-richard-baxter' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'the-pilgrims-progress' WHERE slug = 'o-peregrino' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'sobre-a-oracao-e-a-vida-contemplativa-tomas-de-aquino' WHERE slug = 'on-prayer-and-the-contemplative-life' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'leaves-from-st-john-chrysostom' WHERE slug = 'paginas-douradas-sao-joao-crisostomo' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'thoughts-pensees' WHERE slug = 'pensamentos-blaise-pascal' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'on-prayer-and-the-contemplative-life' WHERE slug = 'sobre-a-oracao-e-a-vida-contemplativa-tomas-de-aquino' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'vida-de-sao-malaquias-bernardo-de-claraval' WHERE slug = 'st-bernard-of-clairvauxs-life-of-st-malachy-of-armagh' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'summa-theologica-part-i-prima-pars' WHERE slug = 'suma-teologica-primeira-parte' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'summa-theologica-part-i-ii-pars-prima-secundae' WHERE slug = 'suma-teologica-primeira-parte-da-segunda-parte' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'summa-theologica-part-iii-tertia-pars' WHERE slug = 'suma-teologica-terceira-parte' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'suma-teologica-primeira-parte-da-segunda-parte' WHERE slug = 'summa-theologica-part-i-ii-pars-prima-secundae' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'suma-teologica-primeira-parte' WHERE slug = 'summa-theologica-part-i-prima-pars' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'suma-teologica-terceira-parte' WHERE slug = 'summa-theologica-part-iii-tertia-pars' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'a-tradicao-apostolica-hipolito' WHERE slug = 'the-apostolic-tradition-of-hippolytus' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'a-cidade-de-deus-agostinho' WHERE slug = 'the-city-of-god' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'confissoes' WHERE slug = 'the-confessions-of-st-augustine' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'a-consolacao-da-filosofia-boecio' WHERE slug = 'the-consolation-of-philosophy' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'a-guerra-santa-john-bunyan' WHERE slug = 'the-holy-war' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'o-catecismo-maior-martinho-lutero' WHERE slug = 'the-large-catechism' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'o-peregrino' WHERE slug = 'the-pilgrims-progress' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'o-descanso-eterno-dos-santos-richard-baxter' WHERE slug = 'the-saints-everlasting-rest' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'didaque' WHERE slug = 'the-teaching-of-the-twelve-apostles-didache' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'pensamentos-blaise-pascal' WHERE slug = 'thoughts-pensees' AND related_edition_slug IS NULL;
UPDATE books SET related_edition_slug = 'st-bernard-of-clairvauxs-life-of-st-malachy-of-armagh' WHERE slug = 'vida-de-sao-malaquias-bernardo-de-claraval' AND related_edition_slug IS NULL;

COMMIT;
