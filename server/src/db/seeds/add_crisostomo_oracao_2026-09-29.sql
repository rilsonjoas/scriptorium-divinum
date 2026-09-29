-- Inserção de autor e livro: São João Crisóstomo - Tratado sobre a Oração
DO $$
DECLARE
    v_author_id UUID;
BEGIN
    SELECT id INTO v_author_id FROM authors WHERE slug = 'sao-joao-crisostomo';
    IF v_author_id IS NULL THEN
        INSERT INTO authors (id, name, slug, bio, birth_year, death_year, nationality, period, is_published, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'São João Crisóstomo',
            'sao-joao-crisostomo',
            'Arcebispo de Constantinopla, Doutor da Igreja e um dos maiores oradores da história cristã, célebre por sua eloquência doutrinária e zelo pastoral.',
            347,
            407,
            'Grego / Antioquino',
            'Patrística',
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
        'Tratado sobre a Oração',
        'tratado-sobre-a-oracao-crisostomo',
        'Um dos mais profundos e calorosos tratados patrísticos sobre o poder, a necessidade e as disposições espirituais da oração contínua na vida do cristão.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        390,
        'Grego',
        'Patrística',
        'public_domain',
        'ready_for_curatorship',
        'server/texts/tratado-sobre-a-oracao-crisostomo.md',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        online_read_path = EXCLUDED.online_read_path,
        is_published = true,
        updated_at = NOW();
END $$;
