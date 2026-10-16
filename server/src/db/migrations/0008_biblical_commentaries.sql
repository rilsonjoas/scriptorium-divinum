CREATE TABLE "biblical_commentaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bible_book" varchar(100) NOT NULL,
	"chapter" integer NOT NULL,
	"verse_start" integer,
	"verse_end" integer,
	"book_id" uuid NOT NULL,
	"title" varchar(500) NOT NULL,
	"excerpt" text,
	"anchor_url" varchar(500) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "biblical_commentaries" ADD CONSTRAINT "biblical_commentaries_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_commentaries_bible_book_chapter" ON "biblical_commentaries" USING btree ("bible_book","chapter");--> statement-breakpoint
CREATE INDEX "idx_commentaries_book_id" ON "biblical_commentaries" USING btree ("book_id");