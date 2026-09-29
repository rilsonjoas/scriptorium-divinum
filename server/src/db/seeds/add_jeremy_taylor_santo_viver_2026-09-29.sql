-- Inserção de autor e livro: Jeremy Taylor - Santo Viver
DO $$
DECLARE
    v_author_id UUID;
BEGIN
    SELECT id INTO v_author_id FROM authors WHERE slug = 'jeremy-taylor';
    IF v_author_id IS NULL THEN
        INSERT INTO authors (id, name, slug, bio, birth_year, death_year, nationality, period, is_published, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'Jeremy Taylor',
            'jeremy-taylor',
            'Bispo e célebre teólogo anglicano, apelidado de "o Shakespeare da Teologia" e "o Crisóstomo da Igreja da Inglaterra" por sua incomparável eloquência devocional.',
            1613,
            1667,
            'Inglês',
            'Tradição Anglicana',
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
        'Regras e Exercícios do Santo Viver',
        'santo-viver-jeremy-taylor',
        'O mais influente clássico devocional anglicano sobre a santificação do tempo, a prática da presença de Deus e a vida santa em meio às responsabilidades cotidianas.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        1650,
        'Inglês',
        'Espiritualidade Cristã',
        'public_domain',
        'ready_for_curatorship',
        'server/texts/santo-viver-jeremy-taylor.md',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        online_read_path = EXCLUDED.online_read_path,
        is_published = true,
        updated_at = NOW();
END $$;
