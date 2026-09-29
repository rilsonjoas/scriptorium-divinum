-- Inserção de livro: São Boaventura - A Árvore da Vida
DO $$
DECLARE
    v_author_id UUID;
BEGIN
    SELECT id INTO v_author_id FROM authors WHERE slug = 'sao-boaventura';
    IF v_author_id IS NULL THEN
        INSERT INTO authors (id, name, slug, bio, birth_year, death_year, nationality, period, is_published, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'São Boaventura',
            'sao-boaventura',
            'Doutor Seráfico, cardeal franciscano, filósofo e místico medieval de primeira grandeza, autor do Itinerário da Mente para Deus.',
            1221,
            1274,
            'Italiano',
            'Escolástica',
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
        'A Árvore da Vida',
        'arvore-da-vida-boaventura',
        'Uma das mais poéticas e profundas obras místicas da tradição franciscana, meditando sobre a Encarnação, a Paixão e a Ressurreição gloriosa de Jesus Cristo.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        1260,
        'Latim',
        'Mística Medieval',
        'public_domain',
        'ready_for_curatorship',
        'server/texts/arvore-da-vida-boaventura.md',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        online_read_path = EXCLUDED.online_read_path,
        is_published = true,
        updated_at = NOW();
END $$;
