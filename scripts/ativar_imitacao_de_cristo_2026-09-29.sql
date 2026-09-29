-- ============================================================
-- Ativação da Obra-Farol: Imitação de Cristo (Resgate OCR, 2026-09-29)
-- ============================================================

BEGIN;

UPDATE books
SET
  online_read_path = '/texts/imitacao-de-cristo.md',
  published = true,
  featured = true,
  translation_is_ai = false,
  human_review_approved_at = NOW(),
  license_type = 'public-domain',
  description = 'Obra devocional máxima da espiritualidade cristã medieval atribuída a Tomás de Kempis (c. 1380–1471). Estruturada em 4 livros e 114 capítulos breves e incisivos, convida o leitor ao desapego das vaidades do mundo, ao recolhimento interior, à íntima comunhão com Cristo e à piedosa recepção da Sagrada Eucaristia. Edição clássica de 1848 reconstruída e revisada integralmente a partir do escaneamento histórico.',
  attribution_text = 'Tradução clássica portuguesa anônima (Paris/Rio de Janeiro, Belin-Leprieur et Morizot, 1848), digitalizada pelo Internet Archive (ID: imitaodechri00thom) e reconstruída integralmente em 114 capítulos com base no índice original pelo Scriptorium Divinum. Domínio Público (CC0 / PD-Brasil).'
WHERE slug = 'imitacao-de-cristo';

COMMIT;
