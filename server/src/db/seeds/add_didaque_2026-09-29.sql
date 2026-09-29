-- ============================================================
-- Nova entrada: Didaquê: O Ensino dos Doze Apóstolos (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'igreja-antiga',
  'Igreja Antiga',
  'Textos coletivos e anônimos da Igreja dos primeiros séculos (credos, manuais catequéticos, cânones e ordens litúrgicas) sem um autor individual único. A Didaquê e os credos ecumênicos são testemunhas centrais da fé dos séculos I a VI.',
  ARRAY['Patrística', 'Igreja Primitiva']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path, related_edition_slug,
  featured, published, translation_is_ai, human_review_approved_at,
  license_type, attribution_text
)
VALUES (
  'Didaquê: O Ensino dos Doze Apóstolos',
  (SELECT id FROM authors WHERE slug = 'igreja-antiga'),
  'Português',
  'O mais antigo manual de instrução cristã, liturgia e vida comunitária preservado fora do Novo Testamento (séc. I–II). Abrange os Dois Caminhos (Vida e Morte), a ordem do Santo Batismo, o jejum e a Oração do Senhor, as orações eucarísticas com o clamor Maranata, a acolhida dos ministros e a vigilância escatológica. Tradução nova diretamente a partir do grego koiné.',
  'didaque',
  'Διδαχὴ τῶν δώδεκα ἀποστόλων',
  'séc. I–II',
  2026,
  'inteligência artificial, a partir do grego original',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Igreja Primitiva', 'Teologia'],
  ARRAY['didaque', 'patristica', 'batismo', 'eucaristia', 'maranata', 'escatologia'],
  '/texts/didaque.md',
  'the-teaching-of-the-twelve-apostles-didache',
  false,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do original grego em domínio público (edição Bryennios / Hitchcock & Brown, 1884), cotejada com a tradução inglesa e a edição de J. B. Lightfoot (1891). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
