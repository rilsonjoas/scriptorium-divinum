ALTER TABLE "books" ADD COLUMN "license_type" varchar(50) DEFAULT 'public-domain' NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "attribution_text" text;