-- SQL Script untuk Create Table News & News Images
-- Jalankan script ini di PostgreSQL database Anda

-- 1. Create table news
CREATE TABLE IF NOT EXISTS "news" (
    "id" text PRIMARY KEY NOT NULL,
    "title" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL UNIQUE,
    "excerpt" text NOT NULL,
    "content" text NOT NULL,
    "featured_image" text NOT NULL,
    "published_at" timestamp,
    "status" varchar(20) DEFAULT 'draft' NOT NULL,
    "category" varchar(100),
    "tags" jsonb,
    "author_id" text NOT NULL,
    "view_count" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT news_author_id_users_id_fk FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- 2. Create table news_images
CREATE TABLE IF NOT EXISTS "news_images" (
    "id" text PRIMARY KEY NOT NULL,
    "news_id" text NOT NULL,
    "image_url" text NOT NULL,
    "caption" text,
    "order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT news_images_news_id_news_id_fk FOREIGN KEY ("news_id") REFERENCES "news"("id") ON DELETE CASCADE
);

-- 3. Create indexes for better performance (optional but recommended)
CREATE INDEX IF NOT EXISTS news_slug_idx ON "news"("slug");
CREATE INDEX IF NOT EXISTS news_status_idx ON "news"("status");
CREATE INDEX IF NOT EXISTS news_published_at_idx ON "news"("published_at");
CREATE INDEX IF NOT EXISTS news_author_id_idx ON "news"("author_id");
CREATE INDEX IF NOT EXISTS news_images_news_id_idx ON "news_images"("news_id");

-- Verification queries (run after creating tables)
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('news', 'news_images');
-- SELECT * FROM news LIMIT 1;
-- SELECT * FROM news_images LIMIT 1;
