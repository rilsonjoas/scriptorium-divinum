-- Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_authors_updated_at ON authors;
CREATE TRIGGER update_authors_updated_at
    BEFORE UPDATE ON authors
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_books_updated_at ON books;
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_download_links_updated_at ON download_links;
CREATE TRIGGER update_download_links_updated_at
    BEFORE UPDATE ON download_links
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Full-text search for books in Portuguese
DROP FUNCTION IF EXISTS search_books(TEXT);
CREATE OR REPLACE FUNCTION search_books(search_query TEXT)
RETURNS TABLE(
    id UUID,
    slug VARCHAR(255),
    title VARCHAR(500),
    original_title VARCHAR(500),
    author_id UUID,
    publication_year_original VARCHAR(50),
    publication_year_translation INTEGER,
    translator VARCHAR(255),
    language VARCHAR(100),
    original_languages TEXT[],
    description TEXT,
    categories TEXT[],
    tags TEXT[],
    cover_image_url VARCHAR(500),
    online_read_path VARCHAR(500),
    featured BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.id, b.slug, b.title, b.original_title, b.author_id,
        b.publication_year_original, b.publication_year_translation,
        b.translator, b.language, b.original_languages, b.description,
        b.categories, b.tags, b.cover_image_url, b.online_read_path,
        b.featured, b.created_at, b.updated_at,
        ts_rank(
            to_tsvector('portuguese',
                coalesce(b.title, '') || ' ' ||
                coalesce(b.original_title, '') || ' ' ||
                coalesce(b.description, '') || ' ' ||
                coalesce(array_to_string(b.categories, ' '), '') || ' ' ||
                coalesce(array_to_string(b.tags, ' '), '')
            ),
            plainto_tsquery('portuguese', search_query)
        ) as rank
    FROM books b
    WHERE to_tsvector('portuguese',
        coalesce(b.title, '') || ' ' ||
        coalesce(b.original_title, '') || ' ' ||
        coalesce(b.description, '') || ' ' ||
        coalesce(array_to_string(b.categories, ' '), '') || ' ' ||
        coalesce(array_to_string(b.tags, ' '), '')
    ) @@ plainto_tsquery('portuguese', search_query)
    ORDER BY rank DESC, b.created_at DESC;
END;
$$ LANGUAGE plpgsql;
