-- Inserção de livro: John Bunyan - Graça Abundante
DO $$
DECLARE
    v_author_id UUID;
BEGIN
    SELECT id INTO v_author_id FROM authors WHERE slug = 'john-bunyan';
    IF v_author_id IS NULL THEN
        INSERT INTO authors (id, name, slug, bio, birth_year, death_year, nationality, period, is_published, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'John Bunyan',
            'john-bunyan',
            'Pregador puritano inglês, célebre autor de O Peregrino e A Guerra Santa, cuja autobiografia espiritual Graça Abundante é uma das obras mais comoventes da literatura cristã.',
            1628,
            1688,
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
        'Graça Abundante ao Principal dos Pecadores',
        'graca-abundante-john-bunyan',
        'A monumental autobiografia espiritual de John Bunyan narrando a sua dramática conversão, o combate contra o desespero e a vitória da superabundante graça de Deus.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        1666,
        'Inglês',
        'Autobiografia Espiritual',
        'public_domain',
        'ready_for_curatorship',
        'server/texts/graca-abundante-john-bunyan.md',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        online_read_path = EXCLUDED.online_read_path,
        is_published = true,
        updated_at = NOW();
END $$;
