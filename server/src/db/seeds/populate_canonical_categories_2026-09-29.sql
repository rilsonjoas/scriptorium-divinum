-- ============================================================================
-- POVOAMENTO E NORMALIZAÇÃO CANÔNICA DE CATEGORIAS (TAXONOMIA EM 3 EIXOS)
-- Data: 2026-09-29
-- Total de categorias canônicas: 25 (Tradições, Gêneros, Temas)
-- ============================================================================

BEGIN;

-- 1) Inserir/Atualizar todas as 25 Categorias Canônicas com metadados ricos
INSERT INTO categories (name, slug, description)
VALUES ('Igreja Primitiva & Patrística', 'patristica', 'Obras dos Padres Apostólicos, Apologistas e Doutores da Igreja Antiga que formularam os fundamentos da fé (Séc. I – VIII).')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Tradição Oriental & Bizantina', 'tradicao-oriental', 'Obras dos Padres gregos, mestres sírios e a mística da Filocalia e hesicasmo (Séc. IV – XV).')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Escolástica & Mística Medieval', 'escolastica-e-medieval', 'Obras da teologia monástica, grandes doutores escolásticos e a mística da Idade Média (Séc. XI – XV).')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Reforma Protestante', 'reforma-protestante', 'Monumentos teológicos da Reforma magisterial (luterana e reformada) e credos históricos (Séc. XVI – XVII).')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Tradição Anglicana', 'tradicao-anglicana', 'Liturgia, teologia e piedade do Livro de Oração Comum e da tradição clássica inglesa (Séc. XVI – XVIII).')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Puritanismo & Piedade Reformada', 'puritanismo', 'Clássicos pastorais e espirituais da cura d''almas e santificação prática da tradição puritana (Séc. XVII).')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Renovação Católica & Mística Ibérica', 'renovacao-catolica', 'A mística carmelita, salesiana, jesuítica e a literatura sacra em língua portuguesa e espanhola (Séc. XVI – XVIII).')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Clássicos Modernos & Avivamentos', 'classicos-modernos', 'Grandes reflexões teológicas, tratados dos avivamentos e clássicos cristãos dos séculos XVIII a XX.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Tratados & Sumas Teológicas', 'tratados-teologicos', 'Obras sistemáticas, exposições dogmáticas e investigações teológicas aprofundadas.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Espiritualidade & Vida Interior', 'espiritualidade', 'Obras de ascese, contemplação, maturidade da fé e comunhão íntima com Deus.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Sermões & Oratória Sacra', 'sermoes', 'Púlpito cristão, homilias patrísticas e grandes peças da oratória sagrada.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Epístolas & Cartas Pastorais', 'epistolas', 'Correspondências apostólicas, cartas doutrinárias e cartas de direção de almas.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Credos, Confissões & Catecismos', 'credos-e-confissoes', 'Símbolos ecumênicos, confissões confessionais e instrução catequética para a Igreja.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Liturgia, Orações & Hinos', 'liturgia-e-oracao', 'Textos litúrgicos, manuais de preces, ritos sacros e poesia hímnica.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Comentários Bíblicos & Homilias', 'comentarios-biblicos', 'Exegese, exposição versículo por versículo e meditações sobre as Sagradas Escrituras.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Apologética & Filosofia Cristã', 'apologetica-e-filosofia', 'Defesa racional da fé cristã diante de outras cosmovisões e questionamentos filosóficos.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Alegorias & Literatura Sacra', 'alegorias-e-literatura', 'Narrativas poéticas, visões alegóricas e expressões dramáticas da experiência cristã.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Trindade & Espírito Santo', 'trindade-e-espirito-santo', 'A comunhão eterna do Pai, do Filho e do Espírito Santo e a atuação santificadora do Paráclito.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Cristologia & Encarnação', 'cristologia', 'A pessoa divina e humana de Jesus Cristo, sua vida, paixão, morte e ressurreição salvadora.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Graça, Fé & Justificação', 'graca-e-justificacao', 'A soberana graça de Deus, o mistério da salvação, o perdão dos pecados e a justiça pela fé.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Oração & Contemplação', 'oracao-e-contemplacao', 'A prática da oração pessoal, a presença contínua de Deus e o silêncio interior.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Combate Espiritual & Penitência', 'combate-espiritual', 'A luta contra as paixões desordenadas, a mortificação do pecado e a conversão do coração.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Amor Divino & Virtudes Cristãs', 'amor-divino-e-virtudes', 'A caridade como ápice da vida cristã, as virtudes teologais e o fruto do Espírito.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Eclesiologia & Sacramentos', 'eclesiologia-e-sacramentos', 'A natureza e unidade da Igreja de Cristo, a Santa Ceia/Eucaristia, o Batismo e o ministério ordenado.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
INSERT INTO categories (name, slug, description)
VALUES ('Providência & Escatologia', 'providencia-e-escatologia', 'O governo providencial de Deus sobre o cosmos, a esperança da glória eterna e os novíssimos.')
ON CONFLICT (name) DO UPDATE 
SET slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();

-- 2) Atualizar categories de todos os livros para a taxonomia canônica

UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Sermões & Oratória Sacra', 'Combate Espiritual & Penitência']::text[] WHERE slug = 'sermao-primeira-dominga-quaresma-vieira';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Sermões & Oratória Sacra', 'Combate Espiritual & Penitência']::text[] WHERE slug = 'sermao-das-lagrimas-de-sao-pedro-vieira';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Tratados & Sumas Teológicas', 'Cristologia & Encarnação']::text[] WHERE slug = 'o-coracao-de-cristo-thomas-goodwin';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Sermões & Oratória Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'sermoes-do-homem-interior-mestre-eckhart';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Espiritualidade & Vida Interior', 'Amor Divino & Virtudes Cristãs']::text[] WHERE slug = 'centurias-sobre-a-caridade-maximo-confessor';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Comentários Bíblicos & Homilias', 'Graça, Fé & Justificação']::text[] WHERE slug = 'comentario-aos-galatas-lutero';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Espiritualidade & Vida Interior', 'Amor Divino & Virtudes Cristãs']::text[] WHERE slug = 'guia-de-pecadores-luis-de-granada';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Epístolas & Cartas Pastorais', 'Cristologia & Encarnação']::text[] WHERE slug = 'tomo-a-flaviano-sao-leao-magno';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Alegorias & Literatura Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'o-pastor-de-hermas';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Sermões & Oratória Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'discurso-sobre-a-pascoa-gregorio-nazianzo';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Liturgia, Orações & Hinos', 'Graça, Fé & Justificação']::text[] WHERE slug = 'cantico-das-criaturas-sao-francisco';
UPDATE books SET categories = ARRAY['Tradição Oriental & Bizantina', 'Tratados & Sumas Teológicas', 'Trindade & Espírito Santo']::text[] WHERE slug = 'teologia-mistica-pseudo-dionisio';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Epístolas & Cartas Pastorais', 'Cristologia & Encarnação']::text[] WHERE slug = 'cartas-a-nestorio-cirilo-alexandria';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Espiritualidade & Vida Interior', 'Combate Espiritual & Penitência']::text[] WHERE slug = 'tratado-do-purgatorio-catarina-de-genova';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'conferencias-dos-padres-joao-cassiano';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Eclesiologia & Sacramentos']::text[] WHERE slug = 'tratado-sobre-a-santa-ceia-calvino';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Espiritualidade & Vida Interior', 'Oração & Contemplação']::text[] WHERE slug = 'a-oracao-no-espirito-john-bunyan';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'as-seis-asas-do-serafim-boaventura';
UPDATE books SET categories = ARRAY['Tradição Anglicana', 'Liturgia, Orações & Hinos', 'Oração & Contemplação']::text[] WHERE slug = 'coletas-livro-de-oracao-comum-1662';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'trabalhos-de-jesus-frei-tome';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'suma-contra-os-gentios-tomas-de-aquino';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Tratados & Sumas Teológicas', 'Combate Espiritual & Penitência']::text[] WHERE slug = 'remedios-preciosos-contra-satanas-thomas-brooks';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Tratados & Sumas Teológicas', 'Amor Divino & Virtudes Cristãs']::text[] WHERE slug = 'tratado-do-amor-de-deus-francisco-de-sales';
UPDATE books SET categories = ARRAY['Tradição Oriental & Bizantina', 'Espiritualidade & Vida Interior', 'Providência & Escatologia']::text[] WHERE slug = 'a-escada-do-paraiso-joao-climaco';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Espiritualidade & Vida Interior', 'Oração & Contemplação']::text[] WHERE slug = 'a-pratica-da-presenca-de-deus-irmao-lourenco';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Tratados & Sumas Teológicas', 'Providência & Escatologia']::text[] WHERE slug = 'o-misterio-da-providencia-john-flavel';
UPDATE books SET categories = ARRAY['Clássicos Modernos & Avivamentos', 'Apologética & Filosofia Cristã', 'Graça, Fé & Justificação']::text[] WHERE slug = 'ortodoxia-chesterton';
UPDATE books SET categories = ARRAY['Clássicos Modernos & Avivamentos', 'Apologética & Filosofia Cristã', 'Cristologia & Encarnação']::text[] WHERE slug = 'o-homem-eterno-chesterton';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Tratados & Sumas Teológicas', 'Trindade & Espírito Santo']::text[] WHERE slug = 'a-existencia-e-os-atributos-de-deus-charnock';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Epístolas & Cartas Pastorais', 'Graça, Fé & Justificação']::text[] WHERE slug = 'resposta-ao-cardeal-sadoleto-calvino';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Sermões & Oratória Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'sermoes-cantico-dos-canticos-bernardo-claraval';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tradição Oriental & Bizantina', 'Tratados & Sumas Teológicas', 'Trindade & Espírito Santo']::text[] WHERE slug = 'sobre-o-espirito-santo-basilio-magno';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Apologética & Filosofia Cristã', 'Graça, Fé & Justificação']::text[] WHERE slug = 'peticao-pelos-cristaos-atenagoras';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Apologética & Filosofia Cristã', 'Graça, Fé & Justificação']::text[] WHERE slug = 'a-utilidade-da-fe-agostinho';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Sermões & Oratória Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'sermao-santo-antonio-peixes-vieira';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'livro-da-vida-teresa-de-avila';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'tratados-do-desapego-mestre-eckhart';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Eclesiologia & Sacramentos']::text[] WHERE slug = 'cativeiro-babilonico-da-igreja-lutero';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Tratados & Sumas Teológicas', 'Cristologia & Encarnação']::text[] WHERE slug = 'a-gloria-de-cristo-john-owen';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Espiritualidade & Vida Interior', 'Oração & Contemplação']::text[] WHERE slug = 'subida-do-monte-carmelo-joao-da-cruz';
UPDATE books SET categories = ARRAY['Tradição Anglicana', 'Espiritualidade & Vida Interior', 'Providência & Escatologia']::text[] WHERE slug = 'santo-morrer-jeremy-taylor';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'soliloquio-arras-da-alma-hugo-de-sao-vitor';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'historia-eclesiastica-eusebio-de-cesareia';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tradição Oriental & Bizantina', 'Sermões & Oratória Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'homilias-sermao-da-montanha-crisostomo';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'necessidade-de-reformar-a-igreja-calvino';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'luz-e-calor-manuel-bernardes';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Espiritualidade & Vida Interior', 'Providência & Escatologia']::text[] WHERE slug = 'o-descanso-eterno-dos-santos-richard-baxter';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tradição Oriental & Bizantina', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'vida-de-santo-antao-atanasio';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Combate Espiritual & Penitência']::text[] WHERE slug = 'sobre-a-paciencia-agostinho';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Apologética & Filosofia Cristã', 'Graça, Fé & Justificação']::text[] WHERE slug = 'apologetico-tertuliano';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'caminho-de-perfeicao-teresa-de-avila';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'a-cana-quebrada-richard-sibbes';
UPDATE books SET categories = ARRAY['Tradição Anglicana', 'Liturgia, Orações & Hinos', 'Oração & Contemplação']::text[] WHERE slug = 'preces-privatae-lancelot-andrewes';
UPDATE books SET categories = ARRAY['Tradição Anglicana', 'Espiritualidade & Vida Interior', 'Amor Divino & Virtudes Cristãs']::text[] WHERE slug = 'santo-viver-jeremy-taylor';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'vida-de-sao-bento-dialogos-gregorio-magno';
UPDATE books SET categories = ARRAY['Clássicos Modernos & Avivamentos', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'as-afeicoes-religiosas-jonathan-edwards';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tradição Oriental & Bizantina', 'Tratados & Sumas Teológicas', 'Oração & Contemplação']::text[] WHERE slug = 'tratado-sobre-a-oracao-crisostomo';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'graca-abundante-john-bunyan';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'a-consolacao-da-filosofia-boecio';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'arvore-da-vida-boaventura';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'monologion-anselmo';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Epístolas & Cartas Pastorais', 'Graça, Fé & Justificação']::text[] WHERE slug = 'tratado-primeira-epistola-sao-joao-agostinho';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Tratados & Sumas Teológicas', 'Combate Espiritual & Penitência']::text[] WHERE slug = 'a-doutrina-do-arrependimento-thomas-watson';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'loci-communes-melancton';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Comentários Bíblicos & Homilias', 'Graça, Fé & Justificação']::text[] WHERE slug = 'comentario-ao-magnificat-lutero';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'soliloquio-da-alma-tomas-de-kempis';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Apologética & Filosofia Cristã', 'Graça, Fé & Justificação']::text[] WHERE slug = 'primeira-apologia-justino-martir';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Espiritualidade & Vida Interior', 'Combate Espiritual & Penitência']::text[] WHERE slug = 'a-mortificacao-do-pecado-john-owen';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Espiritualidade & Vida Interior', 'Oração & Contemplação']::text[] WHERE slug = 'a-guarda-do-coracao-john-flavel';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Tratados & Sumas Teológicas', 'Oração & Contemplação']::text[] WHERE slug = 'cantico-espiritual-joao-da-cruz';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Apologética & Filosofia Cristã', 'Graça, Fé & Justificação']::text[] WHERE slug = 'demonstracao-da-pregacao-apostolica';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'didascalicon-hugo-de-sao-vitor';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Cristologia & Encarnação']::text[] WHERE slug = 'a-vida-de-moises-gregorio-de-nissa';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Sermões & Oratória Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'discursos-teologicos-gregorio-de-nazianzo';
UPDATE books SET categories = ARRAY['Tradição Oriental & Bizantina', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'exposicao-da-fe-ortodoxa-damasceno';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'o-dialogo-catarina-de-sena';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'a-vida-do-cristao-calvino';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Tratados & Sumas Teológicas', 'Cristologia & Encarnação']::text[] WHERE slug = 'cur-deus-homo-anselmo';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Amor Divino & Virtudes Cristãs']::text[] WHERE slug = 'a-doutrina-crista-agostinho';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Sermões & Oratória Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'sermao-da-sexagesima-antonio-vieira';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'commonitorium-vicente-de-lerins';
UPDATE books SET categories = ARRAY['Tradição Anglicana', 'Credos, Confissões & Catecismos', 'Graça, Fé & Justificação']::text[] WHERE slug = 'trinta-e-nove-artigos-da-religiao';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'compendio-de-teologia-tomas-de-aquino';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Espiritualidade & Vida Interior', 'Oração & Contemplação']::text[] WHERE slug = 'o-castelo-interior-teresa-de-avila';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'o-pastor-reformado-richard-baxter';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'a-regra-de-sao-bento';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'proslogion';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Epístolas & Cartas Pastorais', 'Graça, Fé & Justificação']::text[] WHERE slug = 'epistola-e-martirio-de-policarpo';
UPDATE books SET categories = ARRAY['Clássicos Modernos & Avivamentos', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'pensamentos-e-memorial-blaise-pascal';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Credos, Confissões & Catecismos', 'Graça, Fé & Justificação']::text[] WHERE slug = 'o-catecismo-menor-martinho-lutero';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'da-liberdade-do-cristao';
UPDATE books SET categories = ARRAY['Clássicos Modernos & Avivamentos', 'Sermões & Oratória Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'pecadores-nas-maos-de-um-deus-irado';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Espiritualidade & Vida Interior', 'Combate Espiritual & Penitência']::text[] WHERE slug = 'noite-escura-da-alma-joao-da-cruz';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Espiritualidade & Vida Interior', 'Eclesiologia & Sacramentos']::text[] WHERE slug = 'regra-pastoral-gregorio-magno';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'introducao-a-vida-devota-francisco-de-sales';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'enchiridion-agostinho';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tradição Oriental & Bizantina', 'Tratados & Sumas Teológicas', 'Eclesiologia & Sacramentos']::text[] WHERE slug = 'sobre-o-sacerdocio-joao-crisostomo';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Epístolas & Cartas Pastorais', 'Graça, Fé & Justificação']::text[] WHERE slug = 'primeira-epistola-de-clemente';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Eclesiologia & Sacramentos']::text[] WHERE slug = 'catequeses-mistagogicas-cirilo-de-jerusalem';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Oração & Contemplação']::text[] WHERE slug = 'sobre-a-oracao-dominical';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Eclesiologia & Sacramentos']::text[] WHERE slug = 'a-unidade-da-igreja-catolica';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Epístolas & Cartas Pastorais', 'Graça, Fé & Justificação']::text[] WHERE slug = 'cartas-de-inacio-de-antioquia';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Eclesiologia & Sacramentos']::text[] WHERE slug = 'pequeno-tratado-sobre-a-santa-ceia-calvino';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Alegorias & Literatura Sacra', 'Combate Espiritual & Penitência']::text[] WHERE slug = 'a-guerra-santa-john-bunyan';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'itinerario-da-mente-para-deus-boaventura';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Amor Divino & Virtudes Cristãs']::text[] WHERE slug = 'do-amor-de-deus-bernardo-de-claraval';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tradição Oriental & Bizantina', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'aos-jovens-sobre-a-literatura-classica';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Eclesiologia & Sacramentos']::text[] WHERE slug = 'sobre-os-misterios-ambrosio-de-milao';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Trindade & Espírito Santo']::text[] WHERE slug = 'a-trindade-santo-agostinho';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'sobre-o-mestre-agostinho';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tradição Oriental & Bizantina', 'Tratados & Sumas Teológicas', 'Cristologia & Encarnação']::text[] WHERE slug = 'a-encarnacao-do-verbo';
UPDATE books SET categories = ARRAY['Escolástica & Mística Medieval', 'Espiritualidade & Vida Interior', 'Cristologia & Encarnação']::text[] WHERE slug = 'imitacao-de-cristo';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'confissoes';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Alegorias & Literatura Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'o-peregrino';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Credos, Confissões & Catecismos', 'Graça, Fé & Justificação']::text[] WHERE slug = 'didaque';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Credos, Confissões & Catecismos', 'Graça, Fé & Justificação']::text[] WHERE slug = 'confissao-de-fe-de-westminster';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Credos, Confissões & Catecismos', 'Graça, Fé & Justificação']::text[] WHERE slug = 'catecismo-de-heidelberg';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Credos, Confissões & Catecismos', 'Graça, Fé & Justificação']::text[] WHERE slug = 'canones-de-dort';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Credos, Confissões & Catecismos', 'Graça, Fé & Justificação']::text[] WHERE slug = 'breve-catecismo-westminster';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Epístolas & Cartas Pastorais', 'Graça, Fé & Justificação']::text[] WHERE slug = 'carta-a-diogneto';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'bernardes-nova-floresta-antologia';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'bernardes-estimulo-luz-e-calor-antologia';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'vida-do-arcebispo-antologia';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Espiritualidade & Vida Interior', 'Graça, Fé & Justificação']::text[] WHERE slug = 'trabalhos-de-jesus';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tradição Oriental & Bizantina', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'leaves-from-st-john-chrysostom';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'the-apostolic-tradition-of-hippolytus';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'the-teaching-of-the-twelve-apostles-didache';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'commentary-on-the-epistle-to-the-galatians';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'the-apology-of-the-augsburg-confession';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'the-saints-everlasting-rest';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'on-prayer-and-the-contemplative-life';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'summa-theologica-part-iii-tertia-pars';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'summa-theologica-part-ii-ii-secunda-secundae';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'summa-theologica-part-i-ii-pars-prima-secundae';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'summa-theologica-part-i-prima-pars';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'st-bernard-of-clairvauxs-life-of-st-malachy-of-armagh';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'credos-ecumenicos';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'compendium-theologiae';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'institutes-of-the-christian-religion';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'the-city-of-god';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Sermões & Oratória Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'sermao-do-mandato-1670';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Sermões & Oratória Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'sermao-pelo-bom-sucesso-das-armas-de-portugal-contra-as-de-holanda';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Sermões & Oratória Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'sermao-da-sexagesima';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'the-consolation-of-philosophy';
UPDATE books SET categories = ARRAY['Clássicos Modernos & Avivamentos', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'thoughts-pensees';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'the-confessions-of-st-augustine';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'the-large-catechism';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'concerning-christian-liberty';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'the-holy-war';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'grace-abounding-to-the-chief-of-sinners';
UPDATE books SET categories = ARRAY['Puritanismo & Piedade Reformada', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'the-pilgrims-progress';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'auto-da-alma';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'auto-da-barca-do-inferno';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'relacao-da-missao-da-serra-de-ibiapaba';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Sermões & Oratória Sacra', 'Combate Espiritual & Penitência']::text[] WHERE slug = 'sermao-da-quinta-dominga-da-quaresma';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Sermões & Oratória Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'sermao-da-dominga-xix-depois-do-pentecoste';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'castelo-forte-e-o-nosso-deus';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Sermões & Oratória Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'sermao-do-mandato';
UPDATE books SET categories = ARRAY['Renovação Católica & Mística Ibérica', 'Sermões & Oratória Sacra', 'Graça, Fé & Justificação']::text[] WHERE slug = 'sermao-de-santo-antonio-aos-peixes';
UPDATE books SET categories = ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'a-biblia-sagrada-contendo-o-velho-e-o-novo-testamento';
UPDATE books SET categories = ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[] WHERE slug = 'as-95-teses';

-- 3) Limpar categorias órfãs não canônicas que não estejam em nenhum livro
DELETE FROM categories c
WHERE NOT EXISTS (
  SELECT 1 FROM books b WHERE c.name = ANY (b.categories)
);

COMMIT;
