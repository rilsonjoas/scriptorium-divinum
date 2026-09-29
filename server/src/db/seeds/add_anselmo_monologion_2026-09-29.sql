-- Inserção de livro: Santo Anselmo - Monologion
DO $$
DECLARE
    v_author_id UUID;
BEGIN
    SELECT id INTO v_author_id FROM authors WHERE slug = 'santo-anselmo-de-cantuaria';
    IF v_author_id IS NULL THEN
        INSERT INTO authors (id, name, slug, bio, birth_year, death_year, nationality, period, is_published, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'Santo Anselmo de Cantuária',
            'santo-anselmo-de-cantuaria',
            'Arcebispo de Cantuária, Doutor Magnífico, fundador da teologia escolástica e autor do Proslogion e Cur Deus Homo.',
            1033,
            1109,
            'Italo-Inglês',
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
        'Monologion',
        'monologion-anselmo',
        'A célebre meditação escolástica de Santo Anselmo que demonstra a existência e os atributos da Divindade através da razão iluminada pela fé cristã.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        1076,
        'Latim',
        'Escolástica',
        'public_domain',
        'ready_for_curatorship',
        'server/texts/monologion-anselmo.md',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        online_read_path = EXCLUDED.online_read_path,
        is_published = true,
        updated_at = NOW();
END $$;
