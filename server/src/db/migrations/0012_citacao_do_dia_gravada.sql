CREATE TABLE "daily_quotes" (
	"date_key" varchar(10) PRIMARY KEY NOT NULL,
	"quote_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_quotes" ADD CONSTRAINT "daily_quotes_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
-- Congela a escolha atual: grava, para a janela de ±30 dias de hoje (fuso de São Paulo), exatamente
-- o que a fórmula antiga (`daySeed % total`, ordenado por id) dava. Assim a frase de hoje NÃO muda no
-- deploy. `daySeed` = dias desde 1970-01-01; `row_number() ... - 1` = posição na ordem por id.
INSERT INTO "daily_quotes" ("date_key", "quote_id")
SELECT to_char(g.d, 'YYYY-MM-DD'), q.id
FROM generate_series(
       (now() AT TIME ZONE 'America/Sao_Paulo')::date - 30,
       (now() AT TIME ZONE 'America/Sao_Paulo')::date + 30,
       interval '1 day'
     ) AS g(d)
CROSS JOIN (SELECT count(*)::int AS n FROM "quotes") c
JOIN (SELECT id, (row_number() OVER (ORDER BY id) - 1)::int AS rn FROM "quotes") q
  ON q.rn = ((g.d::date - DATE '1970-01-01') % c.n)
WHERE c.n > 0
ON CONFLICT ("date_key") DO NOTHING;
