-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create authors table
CREATE TABLE IF NOT EXISTS authors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    birth_year INTEGER,
    death_year INTEGER,
    bio_summary TEXT,
    portrait_image_url VARCHAR(500),
    denomination_or_tradition TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    original_title VARCHAR(500),
    author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    publication_year_original VARCHAR(50),
    publication_year_translation INTEGER,
    translator VARCHAR(255),
    language VARCHAR(100) NOT NULL DEFAULT 'Português',
    original_languages TEXT[],
    description TEXT NOT NULL,
    categories TEXT[],
    tags TEXT[],
    cover_image_url VARCHAR(500),
    online_read_path VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create download_links table
CREATE TABLE IF NOT EXISTS download_links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    format VARCHAR(10) NOT NULL CHECK (format IN ('pdf', 'epub', 'mobi', 'txt', 'online')),
    url VARCHAR(500) NOT NULL,
    source VARCHAR(255),
    file_size BIGINT, -- size in bytes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table_of_contents table
CREATE TABLE IF NOT EXISTS table_of_contents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    anchor VARCHAR(255),
    level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 6),
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug);
CREATE INDEX IF NOT EXISTS idx_books_author_id ON books(author_id);
CREATE INDEX IF NOT EXISTS idx_books_featured ON books(featured);
CREATE INDEX IF NOT EXISTS idx_books_categories ON books USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_books_tags ON books USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_download_links_book_id ON download_links(book_id);
CREATE INDEX IF NOT EXISTS idx_table_of_contents_book_id ON table_of_contents(book_id);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_books_search ON books USING GIN(to_tsvector('portuguese', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_authors_search ON authors USING GIN(to_tsvector('portuguese', name || ' ' || COALESCE(bio_summary, '')));

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_authors_updated_at 
    BEFORE UPDATE ON authors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at 
    BEFORE UPDATE ON books 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_download_links_updated_at 
    BEFORE UPDATE ON download_links 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_of_contents ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since it's a public library)
CREATE POLICY "Allow public read access on authors" 
    ON authors FOR SELECT 
    TO PUBLIC 
    USING (true);

CREATE POLICY "Allow public read access on books" 
    ON books FOR SELECT 
    TO PUBLIC 
    USING (true);

CREATE POLICY "Allow public read access on download_links" 
    ON download_links FOR SELECT 
    TO PUBLIC 
    USING (true);

CREATE POLICY "Allow public read access on table_of_contents" 
    ON table_of_contents FOR SELECT 
    TO PUBLIC 
    USING (true);

-- Insert some sample data based on your existing data
INSERT INTO authors (slug, name, birth_year, death_year, bio_summary, denomination_or_tradition) VALUES
('santo-agostinho', 'Santo Agostinho', 354, 430, 'Bispo de Hipona e um dos mais influentes Padres da Igreja, conhecido por suas obras teológicas e filosóficas profundas.', ARRAY['Católica', 'Patrística']),
('sao-roberto-belarmino', 'São Roberto Belarmino', 1542, 1621, 'Cardeal jesuíta italiano, teólogo e Doutor da Igreja, conhecido por suas controvérsias e escritos sobre espiritualidade.', ARRAY['Católica', 'Jesuíta', 'Contra-Reforma'])
ON CONFLICT (slug) DO NOTHING;

-- Get author IDs for inserting books
DO $$
DECLARE
    agostinho_id UUID;
    belarmino_id UUID;
    book_id_1 UUID;
    book_id_2 UUID;
    book_id_3 UUID;
BEGIN
    SELECT id INTO agostinho_id FROM authors WHERE slug = 'santo-agostinho';
    SELECT id INTO belarmino_id FROM authors WHERE slug = 'sao-roberto-belarmino';
    
    -- Generate UUIDs for books
    book_id_1 := uuid_generate_v4();
    book_id_2 := uuid_generate_v4();
    book_id_3 := uuid_generate_v4();
    
    INSERT INTO books (
        id, title, original_title, author_id, publication_year_original, 
        publication_year_translation, translator, language, original_languages,
        description, categories, tags, cover_image_url, online_read_path, featured
    ) VALUES
    (
        book_id_1,
        'Confissões',
        'Confessiones',
        agostinho_id,
        '397-400',
        1890,
        'J. Oliveira Santos',
        'Português',
        ARRAY['Latim'],
        'Uma das obras mais influentes da literatura cristã, as Confissões de Santo Agostinho narram sua conversão ao cristianismo e exploram temas profundos sobre a natureza humana, o tempo e a relação com Deus.',
        ARRAY['Patrística', 'Autobiografia Espiritual', 'Filosofia Cristã'],
        ARRAY['conversão', 'filosofia', 'tempo', 'memória', 'pecado', 'graça'],
        '/images/covers/confissoes.jpg',
        '/texts/agostinho-confissoes.md',
        true
    ),
    (
        book_id_2,
        'A Primeira Epístola de São João Comentada',
        NULL,
        agostinho_id,
        '407',
        1920,
        NULL,
        'Português',
        ARRAY['Latim'],
        'Comentários profundos de Santo Agostinho sobre a Primeira Epístola de São João, explorando temas como o amor divino, a comunhão cristã e a natureza do pecado.',
        ARRAY['Patrística', 'Comentário Bíblico', 'Teologia'],
        ARRAY['amor', 'comunhão', 'epístolas', 'exegese'],
        '/images/covers/epistola-joao.jpg',
        '/texts/agostinho-epistola-joao.md',
        true
    ),
    (
        book_id_3,
        'As Sete Palavras de Cristo na Cruz',
        NULL,
        belarmino_id,
        '1618',
        1925,
        NULL,
        'Português',
        ARRAY['Latim'],
        'Meditações profundas sobre as sete últimas palavras de Jesus Cristo na cruz, oferecendo reflexões espirituais sobre o significado da Paixão.',
        ARRAY['Espiritualidade', 'Meditações', 'Contra-Reforma'],
        ARRAY['crucificação', 'paixão', 'meditação', 'Jesus Cristo'],
        '/images/covers/sete-palavras.jpg',
        '/texts/belarmino-sete-palavras.md',
        false
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert download links using the generated UUIDs
    INSERT INTO download_links (book_id, format, url, source) VALUES
    (book_id_1, 'pdf', '/downloads/agostinho/confissoes.pdf', 'Internet Archive'),
    (book_id_1, 'epub', '/downloads/agostinho/confissoes.epub', NULL),
    (book_id_2, 'pdf', '/downloads/agostinho/epistola-joao.pdf', 'Internet Archive'),
    (book_id_3, 'pdf', '/downloads/belarmino/sete-palavras.pdf', 'Internet Archive')
    ON CONFLICT DO NOTHING;
END $$;