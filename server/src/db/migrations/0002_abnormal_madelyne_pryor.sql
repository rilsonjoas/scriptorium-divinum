CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"site_name" varchar(255) DEFAULT 'Scriptorium Divinum' NOT NULL,
	"site_description" text DEFAULT 'Explore o vasto tesouro da teologia cristã em domínio público' NOT NULL,
	"contact_email" varchar(255) DEFAULT 'contato@scriptorium-divinum.com' NOT NULL,
	"featured_books_count" integer DEFAULT 3 NOT NULL,
	"books_per_page" integer DEFAULT 20 NOT NULL,
	"maintenance_mode" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_site_settings_id" ON "site_settings" USING btree ("id");
--> statement-breakpoint
INSERT INTO "site_settings" ("id") VALUES ('00000000-0000-0000-0000-000000000001') ON CONFLICT ("id") DO NOTHING;