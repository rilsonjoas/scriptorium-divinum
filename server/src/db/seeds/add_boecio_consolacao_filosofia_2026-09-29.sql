-- Inserção de autor e livro: Severino Boécio - A Consolação da Filosofia
DO $$
DECLARE
    v_author_id UUID;
BEGIN
    SELECT id INTO v_author_id FROM authors WHERE slug = 'severino-boecio';
    IF v_author_id IS NULL THEN
        INSERT INTO authors (id, name, slug, bio, birth_year, death_year, nationality, period, is_published, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'Severino Boécio',
            'severino-boecio',
            'Filósofo romano cristão, estadista, teólogo e mártir, autor de A Consolação da Filosofia, elo fundamental entre a antiguidade clássica e o pensamento medieval.',
            477,
            524,
            'Romano / Italiano',
            'Patrística Tardia / Escolástica',
            true,
            NOW(),
            NOW()
        )
        RETURNING id INTO v_author_id;
    END IF;

    INSERT INTO books (
        id, author_id, title, slug, description, cover_url,
        published_year, original_language, category,
        status, curatorship_status, online_read_path,
        is_published, created_at, updated_at
    )
    VALUES (
        gen_random_uuid(),
        v_author_id,
        'A Consolação da Filosofia',
        'a-consolacao-da-filosofia-boecio',
        'Uma das mais lidas e influentes obras da história ocidental, escrita no cárcere, integrando sabedoria filosófica clássica e esperança cristã sobre a Providência e a liberdade moral.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        524,
        'Latim',
        'Filosofia Cristã',
        'public_domain',
        'ready_for_curatorship',
        'server/texts/a-consolacao-da-filosofia-boecio.md',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        online_read_path = EXCLUDED.online_read_path,
        is_published = true,
        updated_at = NOW();
END $$;
