-- ============================================================
-- Nova entrada: Compendium Theologiae (latim) — Tomás de Aquino
-- Data: 2026-08-23
--
-- Última obra-farói sem nenhuma versão legível. Texto latino
-- original (autor †1274, PD integral). Tradução inglesa Vollert
-- (1947, †1982) NÃO qualifica — protegida no Brasil até ~2052.
-- Sem link de download por enquanto: a única fonte pública do
-- texto eletrônico é um PDF em servidor com certificado vencido.
-- ============================================================

BEGIN;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, translator, categories, online_read_path
)
VALUES
  (
    'Compendium Theologiae',
    'd8b43dd2-d66b-4e9e-8078-0d15da457f9e',
    'Latim',
    'Compêndio escrito ao final da vida para o irmão Réginaldo, resumindo a doutrina cristã em torno das três virtudes teologais. Planejada em três partes, a obra interrompe-se no tratado da esperança pela morte do autor. Texto latino original; nesta edição, De fide caps. 1–246 e De spe caps. 1–10.',
    'compendium-theologiae',
    'Compendium theologiae ad fratrem Reginaldum',
    'c. 1270',
    'texto original (sem tradução)',
    ARRAY['Escolástica', 'Teologia', 'Clássicos'],
    '/texts/compendium-theologiae-la.md'
  );

COMMIT;

-- Verificação:
-- SELECT slug, language, online_read_path FROM books WHERE slug = 'compendium-theologiae';
