-- Inserção de autor e livro: Tertuliano - Apologético
DO $$
DECLARE
    v_author_id UUID;
BEGIN
    SELECT id INTO v_author_id FROM authors WHERE slug = 'tertuliano';
    IF v_author_id IS NULL THEN
        INSERT INTO authors (id, name, slug, bio, birth_year, death_year, nationality, period, is_published, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'Tertuliano',
            'tertuliano',
            'Padre da Igreja Cartaginês, célebre jurista, teólogo e apologista cristão de língua latina no Norte da África, criador de terminologias teológicas fundamentais.',
            155,
            220,
            'Cartaginês / Romano',
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
        'Apologético',
        'apologetico-tertuliano',
        'A monumental defesa jurídica e teológica do cristianismo diante dos magistrados do Império Romano, famosa pela proclamação de que o sangue dos mártires é semente da Igreja.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        197,
        'Latim',
        'Patrística',
        'public_domain',
        'ready_for_curatorship',
        'server/texts/apologetico-tertuliano.md',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        online_read_path = EXCLUDED.online_read_path,
        is_published = true,
        updated_at = NOW();
END $$;
