-- Inserção de livro: São Gregório Magno - Vida de São Bento (Diálogos Livro II)
DO $$
DECLARE
    v_author_id UUID;
BEGIN
    SELECT id INTO v_author_id FROM authors WHERE slug = 'sao-gregorio-magno';
    IF v_author_id IS NULL THEN
        INSERT INTO authors (id, name, slug, bio, birth_year, death_year, nationality, period, is_published, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'São Gregório Magno',
            'sao-gregorio-magno',
            'Papa, Doutor da Igreja e um dos maiores estadistas e pastores da história cristã, autor da Regra Pastoral e dos Diálogos.',
            540,
            604,
            'Romano / Italiano',
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
        'Vida e Milagres de São Bento',
        'vida-de-sao-bento-dialogos-gregorio-magno',
        'A biografia clássica e espiritual de São Bento de Núrsia, narrada por São Gregório Magno no Livro II dos Diálogos, fundamento da hagiografia e espiritualidade ocidental.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        593,
        'Latim',
        'Patrística',
        'public_domain',
        'ready_for_curatorship',
        'server/texts/vida-de-sao-bento-dialogos-gregorio-magno.md',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        online_read_path = EXCLUDED.online_read_path,
        is_published = true,
        updated_at = NOW();
END $$;
