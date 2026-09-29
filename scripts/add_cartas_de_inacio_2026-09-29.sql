-- ============================================================
-- Nova entrada: Cartas de Santo Inácio de Antioquia (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'inacio-de-antioquia',
  'Santo Inácio de Antioquia',
  'Bispo de Antioquia na Síria e mártir cristão do início do século II (c. 35–108/110 d.C.), Inácio (cognominado Teóforo, "o que leva Deus") foi discípulo direto dos apóstolos, particularmente de São João. Conduzido sob escolta armada a Roma para ser entregue às feras no anfiteatro sob o imperador Trajano, escreveu durante a viagem sete cartas pastorais imorredouras às igrejas da Ásia Menor e de Roma, pilares da eclesiologia, da confissão da carne real de Cristo e da espiritualidade do martírio na Igreja Primitiva.',
  ARRAY['Patrística Grega', 'Pais Apostólicos', 'Igreja Antiga']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai, human_review_approved_at,
  license_type, attribution_text
)
VALUES (
  'Cartas de Santo Inácio de Antioquia',
  (SELECT id FROM authors WHERE slug = 'inacio-de-antioquia'),
  'Português',
  'As sete cartas autênticas do mártir Santo Inácio de Antioquia (Efésios, Magnesianos, Tralianos, Romanos, Filadelfos, Esmirnenses e a Policarpo), redigidas a caminho de Roma por volta de 108 d.C. Documento insubstituível dos Pais Apostólicos, articula a defesa da encarnação real de Cristo contra o docetismo, a centralidade da Eucaristia como remédio da imortalidade, a unidade da Igreja visível em torno do bispo e o comovente testemunho do trigo de Deus triturado pelos dentes das feras.',
  'cartas-de-inacio-de-antioquia',
  'Ἐπιστολαὶ τοῦ Ἁγίου Ἰγνατίου Ἀντιοχείας',
  'c. 108',
  2026,
  'inteligência artificial, a partir do original grego clássico',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Pais Apostólicos', 'Eclesiologia', 'Martírio'],
  ARRAY['inacio', 'antioquia', 'patristica', 'pais-apostolicos', 'efesios', 'romanos', 'policarpo', 'martirio', 'eucaristia', 'eclesiologia'],
  '/texts/cartas-de-inacio-de-antioquia.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto grego clássico da recensão média (J. B. Lightfoot, The Apostolic Fathers, 1889/1891). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
