-- ============================================================
-- Correção de dados em produção — Scriptorium Divinum
-- Data: 2026-08-22
-- Baseado na auditoria da API pública (32 obras):
--   * 6 download_links apontam para caminhos locais inexistentes
--     (/downloads/**) que retornam 404 no nginx.
--   * 41 categorias para 32 livros, com duplicatas EN/PT
--     (ex.: Patrística/Patristics, Reformation/Reforma Protestante).
--
-- Como executar (no VPS ou de onde o Postgres estiver acessível):
--   psql "$DATABASE_URL" -f scripts/fix_prod_data_2026-08-22.sql
--
-- Segurança: transação única — nada é aplicado pela metade.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1) Remover os 6 download_links falsos (404 confirmado em audit)
--    Obras afetadas mantêm a ficha bibliográfica; o botão some
--    até existir URL real (política: não anunciar o que não há).
-- ------------------------------------------------------------
DELETE FROM download_links dl
USING books b
WHERE dl.book_id = b.id
  AND dl.url IN (
    '/downloads/bunyan/o-peregrino.pdf',
    '/downloads/agostinho/confissoes.pdf',
    '/downloads/agostinho/confissoes.epub',
    '/downloads/tomas/compendio-teologia.pdf',
    '/downloads/calvino/institutas.pdf',
    '/downloads/agostinho/cidade-de-deus.pdf'
  );

-- ------------------------------------------------------------
-- 2) Consolidar categorias dos livros (EN → canônica PT),
--    com deduplicação. Mapeamento editorial decidido na auditoria.
-- ------------------------------------------------------------
UPDATE books
SET categories = (
  SELECT array_agg(
           CASE c.value
             WHEN 'Philosophy'          THEN 'Filosofia Cristã'
             WHEN 'Christian Philosophy' THEN 'Filosofia Cristã'
             WHEN 'Scholasticism'       THEN 'Escolástica'
             WHEN 'Patristics'          THEN 'Patrística'
             WHEN 'Reformation'         THEN 'Reforma Protestante'
             WHEN 'Puritanism'          THEN 'Puritanismo'
             WHEN 'Theology'            THEN 'Teologia'
             WHEN 'Autobiography'       THEN 'Autobiografia Espiritual'
             WHEN 'Catechism'           THEN 'Catecismo'
             WHEN 'Allegory'            THEN 'Alegoria'
             WHEN 'Devotional Literature' THEN 'Literatura Devocional'
             WHEN 'Monastic Rule'       THEN 'Regra Monástica'
             WHEN 'Apologetics'         THEN 'Apologética'
             ELSE c.value
           END
           ORDER BY c.ord)
  FROM unnest(categories) WITH ORDINALITY AS c(value, ord)
)
WHERE categories IS NOT NULL
  AND categories && ARRAY[
    'Philosophy','Christian Philosophy','Scholasticism','Patristics',
    'Reformation','Puritanism','Theology','Autobiography','Catechism',
    'Allegory','Devotional Literature','Monastic Rule','Apologetics'
  ];

-- Deduplicar apenas onde houver repetição real (mesma obra com EN+PT mapeados)
UPDATE books b
SET categories = (
  SELECT array_agg(DISTINCT v ORDER BY v) FROM unnest(b.categories) AS v
)
WHERE (SELECT count(*) FROM unnest(b.categories))
   <> (SELECT count(*) FROM (SELECT DISTINCT x FROM unnest(b.categories) AS x) d);

-- ------------------------------------------------------------
-- 3) Sincronizar a tabela `categories` com o acervo real:
--    remove órfãos, insere faltantes (slug sem acento, kebab-case).
-- ------------------------------------------------------------
DELETE FROM categories c
WHERE NOT EXISTS (
  SELECT 1 FROM books b WHERE c.name = ANY (b.categories)
);

INSERT INTO categories (name, slug)
SELECT name,
       lower(
         translate(
           replace(name, ' ', '-'),
           'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ',
           'aaaaaeeeeiiiiooooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN'
         )
       )
FROM (
  SELECT DISTINCT unnest(categories) AS name
  FROM books
  WHERE categories IS NOT NULL
) s
WHERE NOT EXISTS (
  SELECT 1 FROM categories c WHERE c.name = s.name
)
ON CONFLICT (name) DO NOTHING;

COMMIT;

-- ------------------------------------------------------------
-- 4) Verificação pós-execução (deve rodar fora da transação)
-- ------------------------------------------------------------
-- Nenhum link local restante (esperado: 0 linhas):
SELECT dl.url, b.title
FROM download_links dl JOIN books b ON b.id = dl.book_id
WHERE dl.url LIKE '/downloads/%';

-- Panorama de categorias consolidadas:
SELECT sub.category AS nome, count(*)::int AS obras,
       c.slug AS slug
FROM (SELECT unnest(categories) AS category FROM books) sub
LEFT JOIN categories c ON c.name = sub.category
GROUP BY 1, 3
ORDER BY obras DESC;
