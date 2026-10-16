-- ==============================================================================
-- Scriptorium Divinum — Comentários Bíblicos Clássicos Indexados por Livro e Capítulo
-- Permite que ferramentas do ecossistema (ex: Lecionário) consultem a exegese histórica
-- Data: 2026-10-16
-- ==============================================================================

-- 1. Criação idempotente da tabela e índices
CREATE TABLE IF NOT EXISTS biblical_commentaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bible_book VARCHAR(100) NOT NULL,
    chapter INTEGER NOT NULL,
    verse_start INTEGER,
    verse_end INTEGER,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT,
    anchor_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_commentaries_bible_book_chapter ON biblical_commentaries(bible_book, chapter);
CREATE INDEX IF NOT EXISTS idx_commentaries_book_id ON biblical_commentaries(book_id);

-- 2. Função auxiliar anônima para inserção idempotente
DO $$
DECLARE
    b_id UUID;
BEGIN
    -- -------------------------------------------------------------
    -- 1. Martinho Lutero — Comentário aos Gálatas (Capítulos 1 a 6)
    -- -------------------------------------------------------------
    SELECT id INTO b_id FROM books WHERE slug = 'comentario-aos-galatas-martinho-lutero' LIMIT 1;
    IF b_id IS NOT NULL THEN
        -- Cap 1
        IF NOT EXISTS (SELECT 1 FROM biblical_commentaries WHERE book_id = b_id AND bible_book = 'galatas' AND chapter = 1) THEN
            INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
            VALUES ('galatas', 1, b_id, 'Martinho Lutero — Comentário sobre Gálatas 1: O Evangelho da Graça sem Adições Humanas', 'Exposição magistral sobre a autoridade apostólica de Paulo e a justificação somente pela fé.', '/ler/comentario-aos-galatas-martinho-lutero#capitulo-1');
        END IF;
        -- Cap 2
        IF NOT EXISTS (SELECT 1 FROM biblical_commentaries WHERE book_id = b_id AND bible_book = 'galatas' AND chapter = 2) THEN
            INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
            VALUES ('galatas', 2, b_id, 'Martinho Lutero — Comentário sobre Gálatas 2: Justificados pela Fé em Cristo e não pelas Obras da Lei', 'O confronto com Pedro em Antioquia e a declaração de que estamos crucificados com Cristo.', '/ler/comentario-aos-galatas-martinho-lutero#capitulo-2');
        END IF;
        -- Cap 3
        IF NOT EXISTS (SELECT 1 FROM biblical_commentaries WHERE book_id = b_id AND bible_book = 'galatas' AND chapter = 3) THEN
            INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
            VALUES ('galatas', 3, b_id, 'Martinho Lutero — Comentário sobre Gálatas 3: A Bênção de Abraão e a Maldição da Lei', 'Cristo nos resgatou da maldição da lei, fazendo-se maldição por nós.', '/ler/comentario-aos-galatas-martinho-lutero#capitulo-3');
        END IF;
        -- Cap 4
        IF NOT EXISTS (SELECT 1 FROM biblical_commentaries WHERE book_id = b_id AND bible_book = 'galatas' AND chapter = 4) THEN
            INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
            VALUES ('galatas', 4, b_id, 'Martinho Lutero — Comentário sobre Gálatas 4: Da Servidão à Adoção Filial (Aba, Pai)', 'A plenitude dos tempos e a filiação divina outorgada pelo Espírito do Filho.', '/ler/comentario-aos-galatas-martinho-lutero#capitulo-4');
        END IF;
        -- Cap 5
        IF NOT EXISTS (SELECT 1 FROM biblical_commentaries WHERE book_id = b_id AND bible_book = 'galatas' AND chapter = 5) THEN
            INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
            VALUES ('galatas', 5, b_id, 'Martinho Lutero — Comentário sobre Gálatas 5: A Liberdade Cristã e o Fruto do Espírito', 'Para a liberdade foi que Cristo nos libertou; o combate da carne contra o Espírito.', '/ler/comentario-aos-galatas-martinho-lutero#capitulo-5');
        END IF;
        -- Cap 6
        IF NOT EXISTS (SELECT 1 FROM biblical_commentaries WHERE book_id = b_id AND bible_book = 'galatas' AND chapter = 6) THEN
            INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
            VALUES ('galatas', 6, b_id, 'Martinho Lutero — Comentário sobre Gálatas 6: Levar as Cargas uns dos Outros e a Glória na Cruz', 'A lei de Cristo, a semeadura no Espírito e o gloriar-se unicamente na cruz de nosso Senhor.', '/ler/comentario-aos-galatas-martinho-lutero#capitulo-6');
        END IF;
    END IF;

    -- -------------------------------------------------------------
    -- 2. São João Crisóstomo — Comentário sobre Gálatas (Capítulos 1 a 6)
    -- -------------------------------------------------------------
    SELECT id INTO b_id FROM books WHERE slug = 'comentario-sobre-galatas-joao-crisostomo' LIMIT 1;
    IF b_id IS NOT NULL THEN
        FOR c IN 1..6 LOOP
            IF NOT EXISTS (SELECT 1 FROM biblical_commentaries WHERE book_id = b_id AND bible_book = 'galatas' AND chapter = c) THEN
                INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
                VALUES ('galatas', c, b_id, 'São João Crisóstomo — Comentário sobre Gálatas: Capítulo ' || c, 'Exposição patrística oratória e moral de São João Crisóstomo.', '/ler/comentario-sobre-galatas-joao-crisostomo#capitulo-' || c);
            END IF;
        END LOOP;
    END IF;

    -- -------------------------------------------------------------
    -- 3. São João Crisóstomo — Sermão da Montanha (Mateus 5 a 7)
    -- -------------------------------------------------------------
    SELECT id INTO b_id FROM books WHERE slug = 'homilias-sermao-da-montanha-crisostomo' LIMIT 1;
    IF b_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM biblical_commentaries WHERE book_id = b_id AND bible_book = 'mateus' AND chapter = 5) THEN
            INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
            VALUES ('mateus', 5, b_id, 'São João Crisóstomo — Homilias sobre Mateus 5: As Bem-Aventuranças e o Sal da Terra', 'A excelência da virtude evangélica superior à justiça dos escribas e fariseus.', '/ler/homilias-sermao-da-montanha-crisostomo#homilia-15');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM biblical_commentaries WHERE book_id = b_id AND bible_book = 'mateus' AND chapter = 6) THEN
            INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
            VALUES ('mateus', 6, b_id, 'São João Crisóstomo — Homilias sobre Mateus 6: A Esmola em Segredo, a Oração e a Providência', 'Exposição sobre a pureza de intenção, o Pai Nosso e o abandono filial no Pai celeste.', '/ler/homilias-sermao-da-montanha-crisostomo#homilia-19');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM biblical_commentaries WHERE book_id = b_id AND bible_book = 'mateus' AND chapter = 7) THEN
            INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
            VALUES ('mateus', 7, b_id, 'São João Crisóstomo — Homilias sobre Mateus 7: Não Julgar, a Porta Estreita e a Casa sobre a Rocha', 'A firmeza daquele que ouve e pratica as palavras de Cristo.', '/ler/homilias-sermao-da-montanha-crisostomo#homilia-23');
        END IF;
    END IF;

    -- -------------------------------------------------------------
    -- 4. São João Crisóstomo — Homilias sobre Efésios (Capítulos 1 a 6)
    -- -------------------------------------------------------------
    SELECT id INTO b_id FROM books WHERE slug = 'homilias-sobre-efesios-joao-crisostomo' LIMIT 1;
    IF b_id IS NOT NULL THEN
        FOR c IN 1..6 LOOP
            IF NOT EXISTS (SELECT 1 FROM biblical_commentaries WHERE book_id = b_id AND bible_book = 'efesios' AND chapter = c) THEN
                INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
                VALUES ('efesios', c, b_id, 'São João Crisóstomo — Homilias sobre Efésios: Capítulo ' || c, 'A vocação eterna da Igreja, a reconciliação pela cruz e a armadura de Deus.', '/ler/homilias-sobre-efesios-joao-crisostomo#capitulo-' || c);
            END IF;
        END LOOP;
    END IF;

    -- -------------------------------------------------------------
    -- 5. São João Crisóstomo — Homilias sobre Filipenses (Capítulos 1 a 4)
    -- -------------------------------------------------------------
    SELECT id INTO b_id FROM books WHERE slug = 'homilias-sobre-filipenses-joao-crisostomo' LIMIT 1;
    IF b_id IS NOT NULL THEN
        FOR c IN 1..4 LOOP
            IF NOT EXISTS (SELECT 1 FROM biblical_commentaries WHERE book_id = b_id AND bible_book = 'filipenses' AND chapter = c) THEN
                INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
                VALUES ('filipenses', c, b_id, 'São João Crisóstomo — Homilias sobre Filipenses: Capítulo ' || c, 'A alegria no Senhor, a humildade de Cristo (kenosis) e a paz que excede todo entendimento.', '/ler/homilias-sobre-filipenses-joao-crisostomo#capitulo-' || c);
            END IF;
        END LOOP;
    END IF;

    -- -------------------------------------------------------------
    -- 6. São João Crisóstomo — Homilias sobre Colossenses (Capítulos 1 a 4)
    -- -------------------------------------------------------------
    SELECT id INTO b_id FROM books WHERE slug = 'homilias-sobre-colossenses-joao-crisostomo' LIMIT 1;
    IF b_id IS NOT NULL THEN
        FOR c IN 1..4 LOOP
            IF NOT EXISTS (SELECT 1 FROM biblical_commentaries WHERE book_id = b_id AND bible_book = 'colossenses' AND chapter = c) THEN
                INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
                VALUES ('colossenses', c, b_id, 'São João Crisóstomo — Homilias sobre Colossenses: Capítulo ' || c, 'A supremacia de Cristo, imagem do Deus invisível, e a plenitude da divindade habitando nele.', '/ler/homilias-sobre-colossenses-joao-crisostomo#capitulo-' || c);
            END IF;
        END LOOP;
    END IF;

    -- -------------------------------------------------------------
    -- 7. Santo Agostinho — Homilias sobre a 1ª Epístola de São João (Capítulos 1 a 5)
    -- -------------------------------------------------------------
    SELECT id INTO b_id FROM books WHERE slug = 'homilias-sobre-a-primeira-epistola-de-sao-joao-agostinho' LIMIT 1;
    IF b_id IS NOT NULL THEN
        FOR c IN 1..5 LOOP
            IF NOT EXISTS (SELECT 1 FROM biblical_commentaries WHERE book_id = b_id AND bible_book = '1-joao' AND chapter = c) THEN
                INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
                VALUES ('1-joao', c, b_id, 'Santo Agostinho — Tratados sobre a Primeira Epístola de São João: Capítulo ' || c, 'O amor de Deus derramado em nós: quem ama conhece a Deus, porque Deus é amor.', '/ler/homilias-sobre-a-primeira-epistola-de-sao-joao-agostinho#tratado-' || c);
            END IF;
        END LOOP;
    END IF;

END $$;
