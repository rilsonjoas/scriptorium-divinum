-- Popula os campos de curadoria para as obras já existentes no catálogo (2026-09-29)
BEGIN;

-- Credos Ecumênicos: tradução por IA aprovada pelo Rilson em 2026-09-29
UPDATE books
SET translation_is_ai = true,
    human_review_approved_at = '2026-09-29 12:00:00+00',
    published = true
WHERE slug = 'credos-ecumenicos';

-- Carta a Diogneto: tradução por IA com revisão humana pendente
UPDATE books
SET translation_is_ai = true,
    human_review_approved_at = NULL,
    published = true
WHERE slug = 'carta-a-diogneto';

COMMIT;
