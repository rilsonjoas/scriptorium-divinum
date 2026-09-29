-- Inserção de livro: Santo Agostinho - Tratado sobre a Primeira Epístola de São João
DO $$
DECLARE
    v_author_id UUID;
BEGIN
    SELECT id INTO v_author_id FROM authors WHERE slug = 'santo-agostinho';
    IF v_author_id IS NULL THEN
        INSERT INTO authors (id, name, slug, bio, birth_year, death_year, nationality, period, is_published, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'Santo Agostinho',
            'santo-agostinho',
            'Bispo de Hipona, Doutor da Graça e um dos maiores teólogos e filósofos de toda a história ocidental.',
            354,
            430,
            'Numídio / Romano',
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
        'Tratado sobre a Primeira Epístola de São João',
        'tratado-primeira-epistola-sao-joao-agostinho',
        'Uma das mais belas exposições teológicas e pastorais de Agostinho sobre o mistério da caridade divina, célebre pela máxima: Ama e faz o que quiseres.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        407,
        'Latim',
        'Patrística',
        'public_domain',
        'ready_for_curatorship',
        'server/texts/tratado-primeira-epistola-sao-joao-agostinho.md',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        online_read_path = EXCLUDED.online_read_path,
        is_published = true,
        updated_at = NOW();
END $$;
