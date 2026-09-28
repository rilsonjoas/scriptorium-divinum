-- ============================================================
-- Nova entrada: Os Credos Ecumênicos (tradução própria)
-- Data: 2026-09-28
--
-- Primeira obra com tradução feita pelo próprio Scriptorium, gerada
-- por IA e sinalizada como tal ao leitor (texto, ficha e atribuição).
-- (caminho 2 do ROADMAP, "tradução nova licenciada aberta").
-- Motivo: não existe tradução portuguesa dos credos em domínio
-- público com proveniência comprovada. O texto do Wikisource PT
-- não tem tradutor nem fonte, e a grafia ("baptismo", "há-de")
-- indica o texto litúrgico moderno de Portugal.
--
-- Originais (grego/latim, séc. IV–VI) conforme Schaff, Creeds of
-- Christendom vol. II (1877), via CCEL. Tradução CC BY-SA 4.0.
--
-- NÃO APLICAR antes da revisão humana da tradução (ver bloco de
-- proveniência em server/texts/credos-ecumenicos.md).
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'igreja-antiga',
  'Igreja Antiga',
  'Textos coletivos da Igreja dos primeiros séculos (credos, definições conciliares, ordens litúrgicas) que não têm um autor individual. Os credos ecumênicos foram fixados entre os séculos IV e VI e recebidos pelas tradições ortodoxa, católica e protestante.',
  ARRAY['Patrística', 'Concílios Ecumênicos']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  license_type, attribution_text
)
VALUES (
  'Os Credos Ecumênicos',
  (SELECT id FROM authors WHERE slug = 'igreja-antiga'),
  'Português',
  'Os quatro resumos da fé recebidos por quase toda a cristandade: o Credo Apostólico, o Credo Niceno-Constantinopolitano (381), a Definição de Calcedônia (451) e o Credo Atanasiano. Tradução nova, gerada por inteligência artificial diretamente do grego e do latim, com o texto original ao lado de cada credo e notas nas escolhas de tradução.',
  'credos-ecumenicos',
  'Symbola Œcumenica',
  'séc. IV–VI',
  2026,
  'inteligência artificial (Claude Opus 5.5, da Anthropic), a partir do grego e do latim originais',
  ARRAY['Grego', 'Latim'],
  ARRAY['Credos e Confissões', 'Patrística', 'Teologia'],
  ARRAY['credo', 'trindade', 'cristologia', 'niceia', 'calcedonia'],
  '/texts/credos-ecumenicos.md',
  'cc-by-sa-4.0',
  'Tradução gerada por IA (Claude Opus 5.5, da Anthropic) a partir dos originais em domínio público, conferida com a tradução inglesa de Philip Schaff (The Creeds of Christendom, vol. II, 1877). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
);

COMMIT;

-- Verificação:
-- SELECT b.slug, a.slug AS autor, b.license_type, b.online_read_path
--   FROM books b JOIN authors a ON a.id = b.author_id
--  WHERE b.slug = 'credos-ecumenicos';
