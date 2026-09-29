-- Inserção de autor e livro: Lancelot Andrewes - Preces Privatae
DO $$
DECLARE
    v_author_id UUID;
BEGIN
    SELECT id INTO v_author_id FROM authors WHERE slug = 'lancelot-andrewes';
    IF v_author_id IS NULL THEN
        INSERT INTO authors (id, name, slug, bio, birth_year, death_year, nationality, period, is_published, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'Lancelot Andrewes',
            'lancelot-andrewes',
            'Bispo de Winchester, renomado erudito em línguas bíblicas e patrísticas, principal tradutor e revisor da King James Bible (1611) e autor das célebres Preces Privatae.',
            1555,
            1626,
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
        'Preces Privatae (Orações Privadas)',
        'preces-privatae-lancelot-andrewes',
        'O íntimo diário de orações e meditações de um dos maiores teólogos e linguistas bíblicos da Inglaterra, tecido diretamente a partir dos Salmos, dos Santos Padres e da Liturgia Clássica.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        1648,
        'Grego/Latim',
        'Devocional Clássico',
        'public_domain',
        'ready_for_curatorship',
        'server/texts/preces-privatae-lancelot-andrewes.md',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        online_read_path = EXCLUDED.online_read_path,
        is_published = true,
        updated_at = NOW();
END $$;
