-- ==============================================================================
-- Unifica 17 autores duplicados e cria os aliases de slug (2026-11-21)
--
-- Decisão do autor (2026-11-21): "precisamos unificar". O mesmo autor existia com dois slugs
-- (`agostinho-de-hipona` e `santo-agostinho`, `joao-crisostomo` e `sao-joao-crisostomo`...), porque
-- cada seed de obra inseria o autor pelo slug que o autor do seed escolheu, sem olhar o que já
-- existia. Critério do slug canônico: o que tem mais obras; empate, o de biografia mais longa;
-- Teresa de Ávila fica com `teresa-de-avila` (o nome exibido). O nome pedido em `nome` vale quando
-- o duplicado tem a forma mais correta (São Tomás de Aquino; São Boaventura de Bagnoregio).
--
-- O que faz, para cada par (canônico, duplicado):
--   1. move as obras do duplicado para o canônico;
--   2. completa o canônico com o que só o duplicado tinha (anos, retrato, tradição; biografia se
--      a do duplicado for mais longa);
--   3. grava o slug antigo em `author_slug_aliases`, para a URL antiga continuar abrindo (a API
--      resolve o alias e o site redireciona);
--   4. apaga o duplicado.
-- Idempotente: se o duplicado já não existe (ou o canônico não existe), pula o par.
--
-- ATENÇÃO: os seeds `server/src/db/seeds/add_*.sql` rodam a cada deploy e inserem o autor pelo
-- slug. Todos agora usam o slug canônico (um teste garante isso); um seed novo que insira um
-- slug antigo recriaria o duplicado.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS author_slug_aliases (
  alias      varchar(255) PRIMARY KEY,
  author_id  uuid NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_author_slug_aliases_author_id ON author_slug_aliases (author_id);

DO $$
DECLARE
  par record;
  canon authors%ROWTYPE;
  dup authors%ROWTYPE;
BEGIN
  FOR par IN
    SELECT * FROM (VALUES
      ('padre-antonio-vieira', 'antonio-vieira', NULL),
      ('teresa-de-avila', 'teresa-de-jesus', NULL),
      ('agostinho-de-hipona', 'santo-agostinho', NULL),
      ('anselmo-de-cantuaria', 'santo-anselmo-de-cantuaria', NULL),
      ('sao-tomas-de-aquino', 'tomas-de-aquino', 'São Tomás de Aquino'),
      ('bento-de-nursia', 'sao-bento-de-nursia', NULL),
      ('bernardo-de-claraval', 'sao-bernardo-de-claraval', NULL),
      ('gregorio-de-nazianzo', 'sao-gregorio-de-nazianzo', NULL),
      ('sao-gregorio-de-nissa', 'gregorio-de-nissa', NULL),
      ('gregorio-magno', 'sao-gregorio-magno', NULL),
      ('joao-crisostomo', 'sao-joao-crisostomo', NULL),
      ('joao-da-cruz', 'sao-joao-da-cruz', NULL),
      ('justino-martir', 'sao-justino-martir', NULL),
      ('vicente-de-lerins', 'sao-vicente-de-lerins', NULL),
      ('boaventura-de-bagnoregio', 'sao-boaventura', 'São Boaventura de Bagnoregio'),
      ('boecio', 'severino-boecio', NULL),
      ('felipe-melancton', 'philipp-melanchthon', NULL)
    ) AS t(canonico, duplicado, nome)
  LOOP
    SELECT * INTO canon FROM authors WHERE slug = par.canonico;
    IF NOT FOUND THEN CONTINUE; END IF;
    SELECT * INTO dup FROM authors WHERE slug = par.duplicado;
    IF NOT FOUND THEN CONTINUE; END IF;

    UPDATE books SET author_id = canon.id WHERE author_id = dup.id;

    UPDATE authors SET
      name = COALESCE(par.nome, name),
      birth_year = COALESCE(birth_year, dup.birth_year),
      death_year = COALESCE(death_year, dup.death_year),
      portrait_image_url = COALESCE(portrait_image_url, dup.portrait_image_url),
      denomination_or_tradition = COALESCE(denomination_or_tradition, dup.denomination_or_tradition),
      bio_summary = CASE
        WHEN length(coalesce(dup.bio_summary, '')) > length(coalesce(bio_summary, '')) THEN dup.bio_summary
        ELSE bio_summary
      END,
      updated_at = now()
    WHERE id = canon.id;

    INSERT INTO author_slug_aliases (alias, author_id) VALUES (dup.slug, canon.id)
    ON CONFLICT (alias) DO NOTHING;

    DELETE FROM authors WHERE id = dup.id;
  END LOOP;
END $$;
