-- Inserção de autor e livro: Richard Sibbes - A Cana Quebrada
DO $$
DECLARE
    v_author_id UUID;
BEGIN
    SELECT id INTO v_author_id FROM authors WHERE slug = 'richard-sibbes';
    IF v_author_id IS NULL THEN
        INSERT INTO authors (id, name, slug, bio, birth_year, death_year, nationality, period, is_published, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'Richard Sibbes',
            'richard-sibbes',
            'Pregador puritano de Cambridge, apelidado de "o Doce Doutor Sibbes" e "o Médico das Almas Feridas", cuja obra influenciou decisivamente Richard Baxter e Charles Spurgeon.',
            1577,
            1635,
            'Inglês',
            'Puritanismo / Reforma',
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
        'A Cana Quebrada e o Pavio Fumegante',
        'a-cana-quebrada-richard-sibbes',
        'O mais consolador tratado pastoral da era puritana, expondo com incomparável doçura a misericórdia infalível de Cristo para com os fracos, atribulados e arrependidos.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        1630,
        'Inglês',
        'Teologia Pastoral',
        'public_domain',
        'ready_for_curatorship',
        'server/texts/a-cana-quebrada-richard-sibbes.md',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        online_read_path = EXCLUDED.online_read_path,
        is_published = true,
        updated_at = NOW();
END $$;
