CREATE TABLE "quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author" varchar(255) NOT NULL,
	"text" text NOT NULL,
	"source" varchar(500),
	"dominio_publico" boolean DEFAULT false NOT NULL,
	"scriptorium_work_id" uuid,
	"scriptorium_url" varchar(500),
	"theme" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_settings" ALTER COLUMN "contact_email" SET DEFAULT 'scriptorium@narniano.com';--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_scriptorium_work_id_books_id_fk" FOREIGN KEY ("scriptorium_work_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_quotes_author" ON "quotes" USING btree ("author");