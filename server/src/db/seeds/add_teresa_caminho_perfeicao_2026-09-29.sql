-- Inserção de livro: Santa Teresa de Ávila - Caminho de Perfeição
DO $$
DECLARE
    v_author_id UUID;
BEGIN
    SELECT id INTO v_author_id FROM authors WHERE slug = 'santa-teresa-de-avila';
    IF v_author_id IS NULL THEN
        INSERT INTO authors (id, name, slug, bio, birth_year, death_year, nationality, period, is_published, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'Santa Teresa de Ávila',
            'santa-teresa-de-avila',
            'Doutora da Igreja, reformadora do Carmelo Descalço, mestra suprema da oração e da mística cristã ocidental.',
            1515,
            1582,
            'Espanhola',
            'Mística Cristã',
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
        'Caminho de Perfeição',
        'caminho-de-perfeicao-teresa-de-avila',
        'O manual prático e espiritual de Santa Teresa sobre a disciplina da oração, as virtudes fundamentais da vida consagrada e a contemplação através do Pai-Nosso.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        1566,
        'Espanhol',
        'Mística Cristã',
        'public_domain',
        'ready_for_curatorship',
        'server/texts/caminho-de-perfeicao-teresa-de-avila.md',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        online_read_path = EXCLUDED.online_read_path,
        is_published = true,
        updated_at = NOW();
END $$;
