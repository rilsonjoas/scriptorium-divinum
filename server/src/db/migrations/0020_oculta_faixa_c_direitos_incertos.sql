-- ==============================================================================
-- Oculta as 57 obras publicadas da faixa C da triagem de proveniência (2026-11-21)
--
-- Decisão do autor (2026-11-21): "remover do site tudo o que não se tem certeza de direitos".
-- A faixa C (docs/PROVENIENCIA-ACERVO.md) reúne as traduções por IA cuja fonte DECLARADA é
-- edição crítica ou tradução moderna (Sources Chrétiennes, CCSL, CSEL, BAC, Quint, Yale,
-- Lafuma/Sellier, Leclercq, "edição crítica" sem editor), que podem ter proteção própria; uma
-- tradução feita a partir delas pode ser obra derivada. O próprio registro adverte que a
-- atribuição pode ter sido escrita pelo pipeline sem que aquela edição tenha sido usada de fato
-- (caso real: Preces Privatae constava como "edição crítica de Brightman" e o arquivo era um
-- romance). Sem a fonte confirmada, não há certeza; então saem do ar.
--
-- Ocultar é reversível: a chave `published` volta pelo painel ou por migration quando a fonte
-- real for confirmada (fonte antiga em domínio público -> corrigir a atribuição; edição moderna ->
-- trocar a base, pedir autorização ou manter oculta). Nenhuma citação ativa aponta para estas
-- obras (conferido em produção em 2026-11-21) e os comentários bíblicos já filtram por
-- `published`. Só mexe em quem ainda está publicada; tira do destaque; idempotente. O estado
-- correspondente está em server/texts/MANIFESTO.json (`oculta`, com o motivo).
-- ==============================================================================

UPDATE books
SET published = false,
    featured = false,
    updated_at = now()
WHERE published = true
  AND slug IN (
    'a-consolacao-da-filosofia-boecio',
    'a-doutrina-crista-agostinho',
    'a-encarnacao-do-verbo',
    'a-trindade-santo-agostinho',
    'a-unidade-da-igreja-catolica',
    'a-utilidade-da-fe-agostinho',
    'a-vida-de-moises-gregorio-de-nissa',
    'aos-jovens-sobre-a-literatura-classica',
    'apologetico-tertuliano',
    'as-afeicoes-religiosas-jonathan-edwards',
    'caminho-de-perfeicao-teresa-de-avila',
    'cantico-espiritual-joao-da-cruz',
    'cartas-a-nestorio-cirilo-alexandria',
    'cartas-de-inacio-de-antioquia',
    'catequeses-mistagogicas-cirilo-de-jerusalem',
    'centurias-sobre-a-caridade-maximo-confessor',
    'compendio-de-teologia-tomas-de-aquino',
    'conferencias-dos-padres-joao-cassiano',
    'cur-deus-homo-anselmo',
    'demonstracao-da-pregacao-apostolica',
    'didascalicon-hugo-de-sao-vitor',
    'discurso-sobre-a-pascoa-gregorio-nazianzo',
    'discursos-teologicos-gregorio-de-nazianzo',
    'do-amor-de-deus-bernardo-de-claraval',
    'enchiridion-agostinho',
    'epistola-e-martirio-de-policarpo',
    'exposicao-da-fe-ortodoxa-damasceno',
    'historia-eclesiastica-eusebio-de-cesareia',
    'introducao-a-vida-devota-francisco-de-sales',
    'itinerario-da-mente-para-deus-boaventura',
    'livro-da-vida-teresa-de-avila',
    'noite-escura-da-alma-joao-da-cruz',
    'o-catecismo-menor-martinho-lutero',
    'o-dialogo-catarina-de-sena',
    'o-pastor-de-hermas',
    'pecadores-nas-maos-de-um-deus-irado',
    'pensamentos-e-memorial-blaise-pascal',
    'peticao-pelos-cristaos-atenagoras',
    'primeira-apologia-justino-martir',
    'primeira-epistola-de-clemente',
    'regra-pastoral-gregorio-magno',
    'sermoes-cantico-dos-canticos-bernardo-claraval',
    'sermoes-do-homem-interior-mestre-eckhart',
    'sobre-a-oracao-dominical',
    'sobre-a-paciencia-agostinho',
    'sobre-o-espirito-santo-basilio-magno',
    'sobre-o-mestre-agostinho',
    'sobre-o-sacerdocio-joao-crisostomo',
    'sobre-os-misterios-ambrosio-de-milao',
    'soliloquio-arras-da-alma-hugo-de-sao-vitor',
    'subida-do-monte-carmelo-joao-da-cruz',
    'teologia-mistica-pseudo-dionisio',
    'tomo-a-flaviano-sao-leao-magno',
    'tratado-primeira-epistola-sao-joao-agostinho',
    'tratados-do-desapego-mestre-eckhart',
    'vida-de-santo-antao-atanasio',
    'vida-de-sao-bento-dialogos-gregorio-magno'
  );
