-- ============================================================
-- Acervo em português: obras escritas em português (sem tradução)
-- Data: 2026-09-28 — pesquisa em docs/PESQUISA-CATALOGO-PT-2026-09-28.md
--
-- Leitura online (texto gerado por scripts/archive_ocr_to_md.py, divisão
-- conferida contra o índice impresso de cada edição):
--   1. Bernardes, Nova Floresta (Antologia Portuguesa, vol. I, 1920)
--   2. Bernardes, Estímulo Prático, Luz e Calor... (Antologia, vol. II, 1920)
--   3. Frei Luís de Sousa, Vida de D. Frei Bartolomeu dos Mártires (Antologia, 1921)
--   4. Frei Tomé de Jesus, Trabalhos de Jesus, tomo I (1865)
-- Os volumes da Antologia Portuguesa são SELEÇÕES (org. Agostinho de
-- Campos, †1944: títulos próprios, trechos abreviados, ortografia
-- atualizada) — dito na descrição e no título, não só na proveniência.
--
-- Ficha + download do escaneamento (OCR ainda sem revisão para leitura,
-- mesma política da Imitação de Cristo):
--   5. Vieira, Sermões selectos, vol. II (1872)
--   6. D. Frei Amador Arrais, Diálogos (1846)
--
-- Fica de fora por ora: Vieira, O Chrysostomo portuguez (1878), compilado
-- por Antonio Honorati/Onorati — data de morte não encontrada; pela regra
-- do Rilson ("sem certeza, não publica") aguarda confirmação.
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, birth_year, death_year, bio_summary, denomination_or_tradition)
VALUES
  ('frei-luis-de-sousa', 'Frei Luís de Sousa', 1555, 1632,
   'Manuel de Sousa Coutinho, que tomou o nome de Frei Luís de Sousa ao entrar na Ordem dos Pregadores. Considerado um dos maiores prosadores da língua portuguesa, escreveu a Vida de D. Frei Bartolomeu dos Mártires e a História de São Domingos.',
   ARRAY['Catolicismo', 'Dominicano']),
  ('frei-tome-de-jesus', 'Frei Tomé de Jesus', 1529, 1582,
   'Frade agostiniano português. Capturado na batalha de Alcácer-Quibir (1578), escreveu no cativeiro em Marrocos os Trabalhos de Jesus, meditação sobre os sofrimentos de Cristo que se tornou clássico da espiritualidade portuguesa. Morreu cativo.',
   ARRAY['Catolicismo', 'Agostiniano']),
  ('amador-arrais', 'D. Frei Amador Arrais', 1530, 1600,
   'Frade carmelita e bispo de Portalegre. Autor dos Diálogos (1589), obra de moral e espiritualidade em forma de conversa, uma das referências da prosa doutrinal portuguesa do séc. XVI.',
   ARRAY['Catolicismo', 'Carmelita'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path, license_type
)
VALUES
  ('Nova Floresta (Antologia)',
   (SELECT id FROM authors WHERE slug = 'padre-manuel-bernardes'), 'Português',
   'Seleção de 38 trechos da Nova Floresta, a enciclopédia de exemplos, anedotas e reflexões morais do Padre Manuel Bernardes, na Antologia Portuguesa organizada por Agostinho de Campos (1920). Os títulos dos trechos, as abreviações e a ortografia atualizada são do organizador.',
   'bernardes-nova-floresta-antologia', 'Nova Floresta, ou Silva de vários apophthegmas e ditos sentenciosos',
   '1706–1728', 1920, 'texto original (seleção de Agostinho de Campos)',
   ARRAY['Português'], ARRAY['Literatura Devocional', 'Clássicos', 'Espiritualidade'],
   ARRAY['bernardes', 'nova-floresta', 'antologia', 'barroco'],
   '/texts/bernardes-antologia-nova-floresta.md', 'public-domain'),
  ('Estímulo Prático, Luz e Calor e outros escritos (Antologia)',
   (SELECT id FROM authors WHERE slug = 'padre-manuel-bernardes'), 'Português',
   'Segundo volume da seleção de Bernardes na Antologia Portuguesa (1920): 34 trechos da Nova Floresta, do Estímulo Prático, de Luz e Calor, dos Últimos Fins do Homem e dos Exercícios Espirituais, mais uma série de transcrições breves. Seleção e ortografia atualizada de Agostinho de Campos.',
   'bernardes-estimulo-luz-e-calor-antologia', 'Estímulo Prático; Luz e Calor; Últimos Fins do Homem; Exercícios Espirituais',
   'séc. XVII–XVIII', 1920, 'texto original (seleção de Agostinho de Campos)',
   ARRAY['Português'], ARRAY['Literatura Devocional', 'Clássicos', 'Espiritualidade'],
   ARRAY['bernardes', 'luz-e-calor', 'antologia', 'barroco'],
   '/texts/bernardes-antologia-estimulo-luz-e-calor.md', 'public-domain'),
  ('Vida de D. Frei Bartolomeu dos Mártires (Antologia)',
   (SELECT id FROM authors WHERE slug = 'frei-luis-de-sousa'), 'Português',
   'A vida do arcebispo de Braga que marcou o Concílio de Trento e se tornou modelo de pastor, contada por Frei Luís de Sousa numa das obras-primas da prosa portuguesa. Seleção em 33 capítulos da Antologia Portuguesa (1921), com títulos e ortografia atualizada de Agostinho de Campos.',
   'vida-do-arcebispo-antologia', 'Vida de D. Frei Bartolomeu dos Mártires',
   '1619', 1921, 'texto original (seleção de Agostinho de Campos)',
   ARRAY['Português'], ARRAY['Hagiografia', 'Clássicos', 'História da Igreja'],
   ARRAY['frei-luis-de-sousa', 'bartolomeu-dos-martires', 'trento', 'braga'],
   '/texts/sousa-vida-do-arcebispo-antologia.md', 'public-domain'),
  ('Trabalhos de Jesus',
   (SELECT id FROM authors WHERE slug = 'frei-tome-de-jesus'), 'Português',
   'Os cinquenta “Trabalhos” de Cristo, da Encarnação à morte na Cruz, meditados por Frei Tomé de Jesus no cativeiro em Marrocos, cada um seguido de exercício de oração. Primeira e Segunda Parte completas, com a Vida do autor por D. Frei Aleixo de Meneses e o posfácio de Inocêncio Francisco da Silva. Ortografia da edição de 1865.',
   'trabalhos-de-jesus', 'Trabalhos de Jesus',
   '1602–1609', NULL, 'texto original (sem tradução)',
   ARRAY['Português'], ARRAY['Literatura Devocional', 'Espiritualidade', 'Clássicos'],
   ARRAY['tome-de-jesus', 'paixao', 'meditacao', 'alcacer-quibir'],
   '/texts/tome-de-jesus-trabalhos-de-jesus-1.md', 'public-domain'),
  ('Sermões selectos (vol. II)',
   (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'), 'Português',
   'Segundo volume dos Sermões selectos do Padre Antônio Vieira (Lisboa, Rolland & Semiond, 1872). Disponível para download do escaneamento integral; a leitura online aguarda a revisão do texto (OCR).',
   'vieira-sermoes-selectos-2', 'Sermões selectos',
   'séc. XVII', 1872, 'texto original (sem tradução)',
   ARRAY['Português'], ARRAY['Sermões', 'Literatura Barroca', 'Clássicos'],
   ARRAY['antonio-vieira', 'sermoes', 'barroco'],
   NULL, 'public-domain'),
  ('Diálogos',
   (SELECT id FROM authors WHERE slug = 'amador-arrais'), 'Português',
   'Os Diálogos de D. Frei Amador Arrais, bispo de Portalegre: conversas sobre moral, fé e vida cristã, uma das obras centrais da prosa doutrinal portuguesa do séc. XVI. Segunda impressão (Lisboa, 1846), disponível para download do escaneamento; a leitura online aguarda a revisão do texto (OCR).',
   'arrais-dialogos', 'Diálogos',
   '1589', 1846, 'texto original (sem tradução)',
   ARRAY['Português'], ARRAY['Literatura Devocional', 'Espiritualidade', 'Clássicos'],
   ARRAY['amador-arrais', 'dialogos', 'renascimento'],
   NULL, 'public-domain');

INSERT INTO download_links (book_id, format, url, source)
SELECT b.id, 'pdf', v.url, 'Internet Archive'
FROM books b
JOIN (VALUES
  ('bernardes-nova-floresta-antologia', 'https://archive.org/download/novaflorestaesti01bernuoft/novaflorestaesti01bernuoft.pdf'),
  ('bernardes-estimulo-luz-e-calor-antologia', 'https://archive.org/download/novaflorestaesti02bernuoft/novaflorestaesti02bernuoft.pdf'),
  ('vida-do-arcebispo-antologia', 'https://archive.org/download/obrassou01sousuoft/obrassou01sousuoft.pdf'),
  ('trabalhos-de-jesus', 'https://archive.org/download/trabalhosdejesus00thom/trabalhosdejesus00thom.pdf'),
  ('vieira-sermoes-selectos-2', 'https://archive.org/download/sermesselectos00vieigoog/sermesselectos00vieigoog.pdf'),
  ('arrais-dialogos', 'https://archive.org/download/dialogosrevistos00arrauoft/dialogosrevistos00arrauoft.pdf')
) AS v(slug, url) ON v.slug = b.slug;

COMMIT;

-- Verificação:
-- SELECT b.slug, a.slug, b.online_read_path, count(d.id) AS downloads
--   FROM books b JOIN authors a ON a.id = b.author_id LEFT JOIN download_links d ON d.book_id = b.id
--  WHERE b.slug IN ('bernardes-nova-floresta-antologia','bernardes-estimulo-luz-e-calor-antologia',
--                   'vida-do-arcebispo-antologia','trabalhos-de-jesus','vieira-sermoes-selectos-2','arrais-dialogos')
--  GROUP BY 1,2,3;
