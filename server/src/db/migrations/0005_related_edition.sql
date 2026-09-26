-- 0005: relação entre edições da mesma obra
--
-- Sete obras estavam no catálogo sem nenhum texto disponível: são as
-- traduções portuguesas cujo texto nunca foi vinculados. O site não
-- prometia nada (o botão "Ler Online" é condicionado a textAvailable),
-- mas também não explicava o silêncio — o leitor caía numa página de
-- obra com capa e descrição e nenhuma explicação de por que não havia
-- o que ler.
--
-- Decisão (Rilson, 2026-09-26): manter as sete no acervo com estado
-- explícito, e apontar para a edição original que JÁ está catalogada e
-- legível. A relação vive aqui, em dado — não num mapa no frontend, que
-- apodrece e mente.
--
-- Cinco das sete têm contraparte no acervo. Duas não têm
-- ("Imitação de Cristo" e "Os Últimos Fins do Homem" não têm edição em
-- latim/inglês no catálogo) e ficam com a coluna nula: o estado
-- explícito aparece, o link para edição original não.

ALTER TABLE "books"
	ADD COLUMN IF NOT EXISTS "related_edition_slug" varchar(255);

-- segurança: a coluna só pode apontar para um slug que exista de fato
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'books_related_edition_slug_fkey'
	) THEN
		ALTER TABLE "books"
			ADD CONSTRAINT "books_related_edition_slug_fkey"
			FOREIGN KEY ("related_edition_slug")
			REFERENCES "books"("slug")
			ON DELETE SET NULL
			ON UPDATE CASCADE;
	END IF;
END $$;

CREATE INDEX IF NOT EXISTS "books_related_edition_slug_idx"
	ON "books" ("related_edition_slug");

-- As cinco com contraparte. Feito por slug e não por título porque o
-- título original é truncado de formas diferentes entre as edições
-- ("Compendium Theologiae" vs "Compendium theologiae ad fratrem
-- Reginaldum") e casar por string solta seria frágil.
UPDATE "books" SET "related_edition_slug" = 'the-city-of-god'
	WHERE slug = 'a-cidade-de-deus';

UPDATE "books" SET "related_edition_slug" = 'compendium-theologiae'
	WHERE slug = 'compendio-da-suma-teologica';

UPDATE "books" SET "related_edition_slug" = 'institutes-of-the-christian-religion'
	WHERE slug = 'institutas-da-religiao-crista';

UPDATE "books" SET "related_edition_slug" = 'thoughts-pensees'
	WHERE slug = 'pensamentos';

UPDATE "books" SET "related_edition_slug" = 'proslogium-monologium-cur-deus-homo'
	WHERE slug = 'por-que-deus-se-fez-homem';
