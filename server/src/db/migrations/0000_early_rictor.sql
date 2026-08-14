CREATE TABLE "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"birth_year" integer,
	"death_year" integer,
	"bio_summary" text,
	"portrait_image_url" varchar(500),
	"denomination_or_tradition" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "authors_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255),
	"title" varchar(500) NOT NULL,
	"original_title" varchar(500),
	"author_id" uuid NOT NULL,
	"publication_year_original" varchar(50),
	"publication_year_translation" integer,
	"translator" varchar(255),
	"language" varchar(100) DEFAULT 'Português' NOT NULL,
	"original_languages" text[],
	"description" text NOT NULL,
	"categories" text[],
	"tags" text[],
	"cover_image_url" varchar(500),
	"online_read_path" varchar(500),
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "books_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "download_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid NOT NULL,
	"format" varchar(20) NOT NULL,
	"url" varchar(500) NOT NULL,
	"source" varchar(255),
	"file_size" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "table_of_contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid NOT NULL,
	"title" varchar(500) NOT NULL,
	"anchor" varchar(255),
	"level" integer DEFAULT 1 NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "download_links" ADD CONSTRAINT "download_links_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "table_of_contents" ADD CONSTRAINT "table_of_contents_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_authors_slug" ON "authors" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_authors_name" ON "authors" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_books_author_id" ON "books" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "idx_books_featured" ON "books" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "idx_books_slug" ON "books" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_download_links_book_id" ON "download_links" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "idx_table_of_contents_book_id" ON "table_of_contents" USING btree ("book_id");