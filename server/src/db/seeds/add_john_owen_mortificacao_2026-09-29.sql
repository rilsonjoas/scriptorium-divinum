-- ============================================================
-- Nova entrada: John Owen - A Mortificação do Pecado nos Crentes (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'john-owen',
  'John Owen',
  'Teólogo puritano, deão da Christ Church em Oxford e capelão (1616–1683), cognominado "o Calvino da Inglaterra". Considerado a maior e mais profunda mente teológica do puritanismo inglês, Owen articulou com mestria insuperável as doutrinas da Trindade, da Expiação Eficaz de Cristo, do Espírito Santo e da vida espiritual interior em tratados monumentais como "A Mortificação do Pecado nos Crentes" (1656).',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Teologia Pastoral', 'Espiritualidade Cristã']
)
ON CONFLICT (slug) DO UPDATE SET
  bio_summary = EXCLUDED.bio_summary;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai, human_review_approved_at,
  license_type, attribution_text
)
VALUES (
  'A Mortificação do Pecado nos Crentes',
  (SELECT id FROM authors WHERE slug = 'john-owen'),
  'Português',
  'O clássico definitivo de teologia pastoral e combate espiritual do puritanismo inglês. Baseado na exortação de Paulo em Romanos 8.13 ("Mata o pecado, ou o pecado te matará"), John Owen disseca a anatomia do pecado remanescente na alma do crente justificado, demonstra a total ineficácia dos ascetismos puramente humanos e apresenta o poder soberano do Espírito Santo e da Cruz de Cristo para enfraquecer e vencer as concupiscências carnais.',
  'a-mortificacao-do-pecado-john-owen',
  'Of the Mortification of Sin in Believers',
  '1656',
  2026,
  'inteligência artificial, a partir do original inglês clássico de Oxford',
  ARRAY['Inglês'],
  ARRAY['Tradição Puritana', 'Vida Cristã', 'Teologia Pastoral', 'Santificação', 'Tradição Reformada'],
  ARRAY['john-owen', 'mortificacao-do-pecado', 'puritanos', 'santificacao', 'romanos-8', 'vida-crista'],
  '/texts/a-mortificacao-do-pecado-john-owen.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica de William H. Goold (Banner of Truth). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
