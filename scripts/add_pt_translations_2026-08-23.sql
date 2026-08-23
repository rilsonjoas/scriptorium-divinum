-- ============================================================
-- Fase 2 do acervo: traduções portuguesas antigas + novos autores
-- Data: 2026-08-23 (após aprovação do Rilson)
--
-- 1. O Peregrino (PT) e Confissões (PT) ganham leitura online
-- 2. Novos autores: Tomás de Kempis e Padre Manuel Bernardes
-- 3. Imitação de Cristo e Os Últimos Fins do Homem entram como
--    ficha + download do escaneamento (OCR ainda não revisado
--    para leitura online — política: botão só com texto bom)
--
-- Fontes: Internet Archive; detalhes em PESQUISA-OBRAS-FAROIS.md
-- ============================================================

BEGIN;

-- 1) Leitura online para as fichas existentes
UPDATE books SET online_read_path = '/texts/o-peregrino-pt.md'
WHERE slug = 'o-peregrino';

UPDATE books SET online_read_path = '/texts/confissoes-garnier-1905-pt.md'
WHERE slug = 'confissoes';

-- 2) Autores novos
INSERT INTO authors (slug, name, birth_year, death_year, bio_summary, denomination_or_tradition)
VALUES (
  'tomas-de-kempis',
  'Tomás de Kempis',
  1380,
  1471,
  'Cânone regular agostiniano alemão do movimento da Devotio Moderna. Atribui-se-lhe a obra devocional mais difundida da cristandade depois da Bíblia, Da Imitação de Cristo.',
  ARRAY['Devotio Moderna', 'Catolicismo']
), (
  'padre-manuel-bernardes',
  'Padre Manuel Bernardes',
  1644,
  1710,
  'Sacerdote português de Lisboa, chamado "o príncipe dos prosadores portugueses". Autor de Nova Floresta e de tratados ascéticos de profunda influência na espiritualidade lusófona.',
  ARRAY['Catolicismo', 'Barroco']
);

-- 3) Livros novos (ficha + scan; sem leitura online por enquanto)
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, translator, categories, cover_image_url
)
VALUES
  (
    'Imitação de Cristo',
    (SELECT id FROM authors WHERE slug = 'tomas-de-kempis'),
    'Português',
    'O clássico devocional mais lido da história cristã depois da Bíblia, em tradução portuguesa anônima publicada em Paris (1848). Edição atual corresponde ao escaneamento integral disponível para download; versão para o leitor online aguarda revisão do OCR.',
    'imitacao-de-cristo',
    'De Imitatione Christi',
    'c. 1418',
    'anônimo (1848)',
    ARRAY['Literatura Devocional', 'Espiritualidade', 'Clássicos'],
    NULL
  ),
  (
    'Os Últimos Fins do Homem',
    (SELECT id FROM authors WHERE slug = 'padre-manuel-bernardes'),
    'Português',
    'Tratado espiritual do padre Manuel Bernardes sobre salvação e condenação eterna, dividido em dois livros: da providência singular de Deus na salvação das almas e das causas gerais da perdição. Edição de 1768 escaneada; leitura online aguarda revisão do OCR da ortografia setecentista.',
    'os-ultimos-fins-do-homem',
    'Os ultimos fins do homem, salvaçam, e condenaçam eterna',
    '1688',
    'texto original (sem tradução)',
    ARRAY['Literatura Devocional', 'Espiritualidade', 'História da Igreja'],
    NULL
  );

-- 4) Downloads reais (escaneamentos integrais no Internet Archive)
INSERT INTO download_links (book_id, format, url, source)
SELECT b.id, v.format, v.url, 'Internet Archive'
FROM books b
JOIN (VALUES
  ('o-peregrino', 'pdf', 'https://archive.org/download/o-peregrino-ou-a-viagem-do-christao-a-ci/O_peregrino_ou_A_Viagem_do_christao_a_ci.pdf'),
  ('confissoes', 'pdf', 'https://archive.org/download/confissoes-do-grande-doutor-da-igreja-santo-agostinho-1905/Confiss%C3%B5es%20do%20grande%20doutor%20da%20Igreja%20Santo%20Agostinho%20(1905).pdf'),
  ('imitacao-de-cristo', 'pdf', 'https://archive.org/download/imitaodechri00thom/imitaodechri00thom.pdf'),
  ('os-ultimos-fins-do-homem', 'pdf', 'https://archive.org/download/osultimosfinsdoh00bernuoft/osultimosfinsdoh00bernuoft.pdf')
) AS v(slug, format, url) ON v.slug = b.slug;

COMMIT;

-- Verificação:
-- SELECT slug, online_read_path IS NOT NULL AS tem_leitor FROM books WHERE slug IN ('o-peregrino','confissoes','imitacao-de-cristo','os-ultimos-fins-do-homem');
