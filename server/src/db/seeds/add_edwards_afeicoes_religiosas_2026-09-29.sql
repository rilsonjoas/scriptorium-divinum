-- Inserção de livro: Jonathan Edwards - Afeições Religiosas
DO $$
DECLARE
    v_author_id UUID;
BEGIN
    SELECT id INTO v_author_id FROM authors WHERE slug = 'jonathan-edwards';
    IF v_author_id IS NULL THEN
        INSERT INTO authors (id, name, slug, bio, birth_year, death_year, nationality, period, is_published, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'Jonathan Edwards',
            'jonathan-edwards',
            'Filósofo, teólogo, pregador do Grande Despertamento Americano e presidente de Princeton, uma das maiores mentes teológicas da história da Reforma.',
            1703,
            1758,
            'Americano',
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
        'Tratado sobre as Afeições Religiosas',
        'as-afeicoes-religiosas-jonathan-edwards',
        'A obra-prima do discernimento espiritual de Jonathan Edwards, analisando a natureza da verdadeira religião no coração, distinguindo a genuína obra da graça das falsas ilusões emocionais.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        1746,
        'Inglês',
        'Teologia Espiritual',
        'public_domain',
        'ready_for_curatorship',
        'server/texts/as-afeicoes-religiosas-jonathan-edwards.md',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        online_read_path = EXCLUDED.online_read_path,
        is_published = true,
        updated_at = NOW();
END $$;
