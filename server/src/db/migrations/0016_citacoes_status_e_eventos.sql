CREATE TABLE "quote_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quote_id" uuid NOT NULL,
	"acao" varchar(12) NOT NULL,
	"antes" jsonb,
	"depois" jsonb,
	"motivo" text,
	"admin_id" uuid,
	"em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quote_events_acao_check" CHECK ("quote_events"."acao" IN ('criou','editou','ocultou','reativou','verificou'))
);
--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "status" varchar(12) DEFAULT 'ativa' NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "motivo_ocultacao" text;--> statement-breakpoint
CREATE INDEX "idx_quote_events_quote" ON "quote_events" USING btree ("quote_id","em");--> statement-breakpoint
CREATE INDEX "idx_quotes_ativas" ON "quotes" USING btree ("author") WHERE "quotes"."status" = 'ativa';--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_status_check" CHECK ("quotes"."status" IN ('rascunho','ativa','oculta'));--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_ativa_exige_fonte" CHECK ("quotes"."status" <> 'ativa' OR coalesce(btrim("quotes"."source"), '') <> '');