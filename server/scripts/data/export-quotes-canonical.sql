-- Gera o conteúdo de quotes-canonical.json a partir do banco (só SELECT), com os mesmos campos e a mesma
-- ordem do export (`exportarCanonico`, src/db/quotes-canonical.ts), inclusive a ordenação por ponto de código (COLLATE "C"). Uso, no seu terminal:
--   ssh narniano@debian13-4gb-narniano 'docker exec -i postgres-shared psql -U postgres -d scriptorium_divinum_db -At' \
--     < server/scripts/data/export-quotes-canonical.sql > /tmp/quotes.json
-- e depois formate com `node -e` (JSON.stringify(x, null, 2) + "\n") e grave em quotes-canonical.json.
SELECT json_agg(
  json_build_object(
    'id', id,
    'author', author,
    'text', text,
    'source', source,
    'dominioPublico', dominio_publico,
    'scriptoriumUrl', scriptorium_url,
    'theme', theme,
    'fonteUrl', fonte_url,
    'verificadoEm', verificado_em,
    'status', status,
    'motivoOcultacao', motivo_ocultacao
  ) ORDER BY author COLLATE "C", text COLLATE "C"
) FROM quotes;
