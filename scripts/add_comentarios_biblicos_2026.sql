-- ==============================================================================
-- Scriptorium Divinum — Comentários Bíblicos indexados por livro e capítulo
-- Revisado em 2026-10-16.
--
-- Só entra aqui o que foi verificado no próprio texto da obra:
--   * Lutero, Comentário aos Gálatas (comentario-aos-galatas-lutero): o arquivo
--     tem "# Capítulo I" a "# Capítulo VI", correspondentes aos capítulos 1 a 6
--     da epístola.
-- Ficaram de fora, por não haver como verificar a correspondência: Crisóstomo
-- (Gálatas, Efésios, Filipenses, Colossenses, Sermão da Montanha) e Agostinho
-- (1 João). Os textos deles não têm título por capítulo ou por homilia, e as
-- homilias não seguem a divisão da Bíblia em capítulos. Entram quando o texto
-- ganhar estrutura. Sem "excerpt": não há resumo verificado a exibir.
--
-- A tabela é criada pela migration 0008; este seed só insere linhas.
-- ==============================================================================

DO $$
DECLARE
    b_id UUID;
BEGIN
    SELECT id INTO b_id FROM books WHERE slug = 'comentario-aos-galatas-lutero' LIMIT 1;
    IF b_id IS NOT NULL THEN
        FOR c IN 1..6 LOOP
            IF NOT EXISTS (
                SELECT 1 FROM biblical_commentaries
                WHERE book_id = b_id AND bible_book = 'galatas' AND chapter = c
            ) THEN
                INSERT INTO biblical_commentaries (bible_book, chapter, book_id, title, excerpt, anchor_url)
                VALUES (
                    'galatas', c, b_id,
                    'Martinho Lutero — Comentário aos Gálatas, capítulo ' || c,
                    NULL,
                    '/ler/comentario-aos-galatas-lutero'
                );
            END IF;
        END LOOP;
    END IF;
END $$;
