-- ============================================================
-- Catálogo Universal Completo do Scriptorium Divinum (2026)
-- Total de obras: 294 (com 45 edições bilíngues vinculadas)
-- ============================================================

BEGIN;

-- 1. Autores
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('1-epistola-aos-efesios', '1. Epístola aos Efésios', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('a-respeito-da-liberdade-crista', '# A respeito da liberdade cristã', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('agostinho-de-hipona-354-430', 'Agostinho de Hipona (354–430)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('as-conferencias-de-joao-cassiano', 'As Conferências de João Cassiano.', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('assembleia-de-westminster-1643-1649-convocada-pelo-parlamento-ingles', 'Assembleia de Westminster (1643–1649), convocada pelo Parlamento inglês', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('atenagoras-de-atenas', 'Atenágoras de Atenas', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('blaise-pascal', 'Blaise Pascal', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('blaise-pascal-1623-1662', 'Blaise Pascal (1623–1662)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('book-i', 'Book I', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('capitulo-i-cristo-como-mestre-da-oracao-e-as-disposicoes-interiores-1-6', 'Capítulo I: Cristo como Mestre da Oração e as Disposições Interiores (§§ 1–6)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('capitulo-i-da-sagrada-escritura', 'Capítulo I: Da Sagrada Escritura', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('capitulo-i-elogio-da-fe-anterior-dos-corintios-1-3', 'Capítulo I: Elogio da Fé Anterior dos Coríntios (§§ 1–3)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('capitulo-i-o-afeto-paternal-e-a-finalidade-da-instrucao-1', 'Capítulo I: O Afeto Paternal e a Finalidade da Instrução (§ 1)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('compendio-de-teologia', '# Compêndio de Teologia', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('desconhecido-mateto-isto-e-discipulo-pseudonimo-tradicional-ii-seculo-os-capitulos-xi-e-xii-sao-de-outra-mao-provavelmente-do-iii-seculo-ver-nota-abaixo', 'Desconhecido ("Mateto", isto é, "discípulo" — pseudônimo tradicional), II século. Os capítulos XI e XII são de outra mão, provavelmente do III século (ver nota abaixo)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('eusebio-de-cesareia', 'Eusébio de Cesareia', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('filipe-melancton', 'Filipe Melâncton', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('folhas-de-sao-joao-crisostomo', '# Folhas de São João Crisóstomo', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('frei-luis-de-sousa-c-1555-1632-a-partir-dos-apontamentos-de-frei-luis-de-cacegas', 'Frei Luís de Sousa (c. 1555–1632), a partir dos apontamentos de Frei Luís de Cácegas', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('frei-tome-de-jesus-osa-1529-1582-escrito-no-cativeiro-em-marrocos-depois-de-alcacer-quibir', 'Frei Tomé de Jesus, OSA (1529–1582), escrito no cativeiro em Marrocos depois de Alcácer-Quibir', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('g-k-chesterton', 'G. K. Chesterton', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('george-herbert', 'George Herbert', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('gil-vicente', 'Gil Vicente', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('gregorio-de-nissa', 'Gregório de Nissa', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('hermas-de-roma', 'Hermas de Roma', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('hipolito-de-roma', 'Hipólito de Roma', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('hugo-de-sao-vitor', 'Hugo de São Vítor', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('igreja-antiga', 'Igreja Antiga', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('igreja-antiga-documento-de-instrucao-catequetica-e-eclesiastica-final-do-sec-i-ou-inicio-do-sec-ii', 'Igreja Antiga (documento de instrução catequética e eclesiástica, final do séc. I ou início do séc. II)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('igreja-antiga-textos-conciliares-e-liturgicos-seculos-iv-a-vi', 'Igreja antiga (textos conciliares e litúrgicos, séculos IV a VI)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('instrucao-i-sobre-a-renuncia-ao-mundo', 'Instrução I — Sobre a Renúncia ao Mundo', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('introducao', 'Introdução', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('introducao-a-luz-mais-pura-do-evangelho', 'Introdução: A Luz Mais Pura do Evangelho', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('irmao-lourenco-da-ressurreicao', 'Irmão Lourenço da Ressurreição', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('jeremy-taylor', 'Jeremy Taylor', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('joao-calvino', 'João Calvino', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('joao-calvino-1509-1564', 'João Calvino (1509–1564)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('john-bunyan', 'John Bunyan', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('john-bunyan-1628-1688', 'John Bunyan (1628–1688)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('john-donne', 'John Donne', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('john-flavel', 'John Flavel', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('john-owen', 'John Owen', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('jonathan-edwards', 'Jonathan Edwards', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('lancelot-andrewes', 'Lancelot Andrewes', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('martinho-lutero', 'Martinho Lutero', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('martinho-lutero-1483-1546', 'Martinho Lutero (1483–1546)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('matthew-henry', 'Matthew Henry', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('nota-historica', 'Nota Histórica', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('nota-introdutoria', 'Nota Introdutória', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('nota-prefatoria', 'Nota Prefatória', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('o-comunitorio', 'O COMUNITÓRIO', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('padre-antonio-vieira', 'Padre Antônio Vieira', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('padre-manuel-bernardes-1644-1710', 'Padre Manuel Bernardes (1644–1710)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('parte-i-a-fe-na-santissima-trindade-artigos-i-v', 'Parte I: A Fé na Santíssima Trindade (Artigos I–V)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('parte-i-epistola-de-policarpo-aos-filipenses-c-110-d-c', 'Parte I: Epístola de Policarpo aos Filipenses (c. 110 d.C.)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('parte-i-o-que-e-o-desapego', 'Parte I — O que É o Desapego', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('philipp-melanchthon', 'Philipp Melanchthon', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('prefacio', 'Prefácio', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('prefacio-a-luz-e-o-calor', 'Prefácio — A Luz e o Calor', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('prefacio-por-que-esta-carta-foi-escrita', 'Prefácio: Por que Esta Carta Foi Escrita', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('primeira-carta-a-nestorio-c-429-d-c', 'Primeira Carta a Nestório (c. 429 d.C.)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('primeiro-ponto-de-doutrina-da-eleicao-divina-e-da-reprovacao', 'Primeiro Ponto de Doutrina: Da Eleição Divina e da Reprovação', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('proemio-o-proposito-da-obra', 'Proêmio: O Propósito da Obra', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('prologo', 'Prólogo', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('prologo-a-escritura-como-rio-de-deus', 'Prólogo — A Escritura como Rio de Deus', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('prologo-a-quem-esta-obra-se-dirige', 'Prólogo — A Quem Esta Obra Se Dirige', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('prologo-e-introducao', 'Prólogo e Introdução', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('prologo-o-serafim-de-isaias', 'Prólogo — O Serafim de Isaías', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('richard-baxter', 'Richard Baxter', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('richard-sibbes', 'Richard Sibbes', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('rufino-de-aquileia', 'Rufino de Aquileia', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('santa-catarina-de-sena', 'Santa Catarina de Sena', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('santa-teresa-de-avila', 'Santa Teresa de Ávila', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('santo-agostinho', 'Santo Agostinho', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('santo-agostinho-de-hipona', 'Santo Agostinho de Hipona', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('santo-ambrosio-de-milao', 'Santo Ambrósio de Milão', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('santo-anselmo-de-cantuaria', 'Santo Anselmo de Cantuária', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('santo-atanasio-de-alexandria', 'Santo Atanásio de Alexandria', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('santo-hilario-de-poitiers', 'Santo Hilário de Poitiers', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('santo-hipolito-de-roma', 'Santo Hipólito de Roma', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('santo-ireneu-de-lyon', 'Santo Ireneu de Lyon', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('santo-tomas-de-aquino', 'Santo Tomás de Aquino', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-basilio-magno', 'São Basílio Magno', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-bento-de-nursia', 'São Bento de Núrsia', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-bernardo-de-claraval', 'São Bernardo de Claraval', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-boaventura', 'São Boaventura', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-cipriano-de-cartago', 'São Cipriano de Cartago', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-cirilo-de-jerusalem', 'São Cirilo de Jerusalém', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-francisco-de-assis', 'São Francisco de Assis', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-francisco-de-sales', 'São Francisco de Sales', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-gregorio-de-nazianzo', 'São Gregório de Nazianzo', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-gregorio-de-nissa', 'São Gregório de Nissa', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-gregorio-magno', 'São Gregório Magno', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-gregorio-nazianzeno', 'São Gregório Nazianzeno', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-jeronimo', 'São Jerônimo', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-joao-cassiano', 'São João Cassiano', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-joao-climaco', 'São João Clímaco', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-joao-crisostomo', 'São João Crisóstomo', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-joao-da-cruz', 'São João da Cruz', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-joao-damasceno', 'São João Damasceno', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-justino-martir', 'São Justino Mártir', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-leao-magno', 'São Leão Magno', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-maximo-o-confessor', 'São Máximo, o Confessor', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-simeao-o-novo-teologo', 'São Simeão, o Novo Teólogo', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-teofilo-de-antioquia', 'São Teófilo de Antioquia', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-tomas-de-aquino', 'São Tomás de Aquino', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sao-vicente-de-lerins', 'São Vicente de Lérins', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sermao-1-intravit-iesus-in-quoddam-castellum-lc-10-38', 'Sermão 1 — *Intravit Iesus in quoddam castellum* (Lc 10,38)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sermao-i-que-ele-me-beije-com-os-beijos-da-sua-boca-ct-1-1', 'Sermão I — *"Que ele me beije com os beijos da sua boca"* (Ct 1,1)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('severino-boecio', 'Boécio', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('stephen-charnock', 'Stephen Charnock', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('sulpicio-severo', 'Sulpício Severo', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('taciano-o-sirio', 'Taciano o Sírio', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('tertuliano', 'Tertuliano de Cartago', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('thomas-brooks', 'Thomas Brooks', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('thomas-goodwin', 'Thomas Goodwin', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('thomas-watson', 'Thomas Watson', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('tomas-de-aquino-1225-1274', 'Tomás de Aquino (1225–1274)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('tomas-de-kempis', 'Tomás de Kempis', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('tomas-de-kempis-c-1380-1471', 'Tomás de Kempis (c. 1380–1471)', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('tradicao-classica-crista', 'Tradição Clássica Cristã', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('tradicao-liturgica-anglicana-thomas-cranmer', 'Tradição Litúrgica Anglicana / Thomas Cranmer', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('ulrico-zuinglio', 'Ulrico Zuínglio', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('varios', 'Vários', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;
INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES ('zacarias-ursino-1534-1583-e-caspar-oleviano-1536-1587-encomendado-pelo-eleitor-frederico-iii-do-palatinato', 'Zacarias Ursino (1534–1583) e Caspar Oleviano (1536–1587), encomendado pelo Eleitor Frederico III do Palatinato', 'Autor clássico da tradição cristã universal.', ARRAY['Tradição Clássica Cristã'])
ON CONFLICT (slug) DO NOTHING;

-- 2. Obras (Livros com Suporte Bilíngue)
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Biblia Sagrada, Contendo o Velho e o Novo Testamento (Biblia)',
  (SELECT id FROM authors WHERE slug = 'varios'),
  'Português',
  'A Biblia Sagrada, Contendo o Velho e o Novo Testamento (Biblia) por Vários. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-biblia-sagrada-contendo-o-velho-e-o-novo-testamento',
  'A Biblia Sagrada, Contendo o Velho e o Novo Testamento (Biblia)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['varios', 'a-biblia-sagrada-contendo-o-velho-e-o-novo-testamento', 'classicos-cristaos'],
  '/texts/a-biblia-sagrada-contendo-o-velho-e-o-novo-testamento.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Cana Quebrada e o Pavio Fumegante (The Bruised Reed and Smoking Flax)',
  (SELECT id FROM authors WHERE slug = 'richard-sibbes'),
  'Português',
  'A Cana Quebrada e o Pavio Fumegante (The Bruised Reed and Smoking Flax) por Richard Sibbes. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-cana-quebrada-richard-sibbes',
  'A Cana Quebrada e o Pavio Fumegante (The Bruised Reed and Smoking Flax)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Puritana e Consolação Pastoral'],
  ARRAY['richard-sibbes', 'a-cana-quebrada-richard-sibbes', 'classicos-cristaos'],
  '/texts/a-cana-quebrada-richard-sibbes.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Catequese dos Não Instruídos (De Catechizandis Rudibus)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho-de-hipona'),
  'Português',
  'A Catequese dos Não Instruídos (De Catechizandis Rudibus) por Santo Agostinho de Hipona. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-catequese-dos-nao-instruidos-agostinho',
  'A Catequese dos Não Instruídos (De Catechizandis Rudibus)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Pedagogia Catequética'],
  ARRAY['santo-agostinho-de-hipona', 'a-catequese-dos-nao-instruidos-agostinho', 'classicos-cristaos'],
  '/texts/a-catequese-dos-nao-instruidos-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Cidade de Deus (De Civitate Dei contra Paganos)',
  (SELECT id FROM authors WHERE slug = 'tradicao-classica-crista'),
  'Português',
  'A Cidade de Deus (De Civitate Dei contra Paganos) por Tradição Clássica Cristã. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-cidade-de-deus-agostinho',
  'A Cidade de Deus (De Civitate Dei contra Paganos)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['tradicao-classica-crista', 'a-cidade-de-deus-agostinho', 'classicos-cristaos'],
  '/texts/a-cidade-de-deus-agostinho.md',
  'cidade-de-deus-en',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Consolação da Filosofia',
  (SELECT id FROM authors WHERE slug = 'prefacio'),
  'Português',
  'A Consolação da Filosofia por Prefácio. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-consolacao-da-filosofia-boecio',
  'A Consolação da Filosofia',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['prefacio', 'a-consolacao-da-filosofia-boecio', 'classicos-cristaos'],
  '/texts/a-consolacao-da-filosofia-boecio.md',
  'the-consolation-of-philosophy',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Criação do Homem (De Hominis Opificio)',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nissa'),
  'Português',
  'A Criação do Homem (De Hominis Opificio) por São Gregório de Nissa. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-criacao-do-homem-gregorio-de-nissa',
  'A Criação do Homem (De Hominis Opificio)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Grega e Antropologia Teológica'],
  ARRAY['sao-gregorio-de-nissa', 'a-criacao-do-homem-gregorio-de-nissa', 'classicos-cristaos'],
  '/texts/a-criacao-do-homem-gregorio-de-nissa.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Demetriano (Ad Demetrianum)',
  (SELECT id FROM authors WHERE slug = 'sao-cipriano-de-cartago'),
  'Português',
  'A Demetriano (Ad Demetrianum) por São Cipriano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-demetriano-cipriano',
  'A Demetriano (Ad Demetrianum)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Apologética'],
  ARRAY['sao-cipriano-de-cartago', 'a-demetriano-cipriano', 'classicos-cristaos'],
  '/texts/a-demetriano-cipriano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Donato (Ad Donatum)',
  (SELECT id FROM authors WHERE slug = 'sao-cipriano-de-cartago'),
  'Português',
  'A Donato (Ad Donatum) por São Cipriano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-donato-cipriano',
  'A Donato (Ad Donatum)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Conversão Cristã'],
  ARRAY['sao-cipriano-de-cartago', 'a-donato-cipriano', 'classicos-cristaos'],
  '/texts/a-donato-cipriano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Doutrina Cristã',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho'),
  'Inglês',
  'A Doutrina Cristã por Santo Agostinho. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-doutrina-crista-agostinho',
  'A Doutrina Cristã',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Hermenêutica Bíblica e Retórica Cristã'],
  ARRAY['santo-agostinho', 'a-doutrina-crista-agostinho', 'classicos-cristaos'],
  '/texts/a-doutrina-crista-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Doutrina do Arrependimento: Exposição Bíblica e Prática (The Doctrine of Repentance)',
  (SELECT id FROM authors WHERE slug = 'thomas-watson'),
  'Português',
  'A Doutrina do Arrependimento: Exposição Bíblica e Prática (The Doctrine of Repentance) por Thomas Watson. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-doutrina-do-arrependimento-thomas-watson',
  'A Doutrina do Arrependimento: Exposição Bíblica e Prática (The Doctrine of Repentance)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Puritana e Soteriologia Prática'],
  ARRAY['thomas-watson', 'a-doutrina-do-arrependimento-thomas-watson', 'classicos-cristaos'],
  '/texts/a-doutrina-do-arrependimento-thomas-watson.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Encarnação do Verbo de Deus (De Incarnatione Verbi Dei)',
  (SELECT id FROM authors WHERE slug = 'santo-atanasio-de-alexandria'),
  'Português',
  'A Encarnação do Verbo de Deus (De Incarnatione Verbi Dei) por Santo Atanásio de Alexandria. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-encarnacao-do-verbo',
  'A Encarnação do Verbo de Deus (De Incarnatione Verbi Dei)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Oriental e Cristologia'],
  ARRAY['santo-atanasio-de-alexandria', 'a-encarnacao-do-verbo', 'classicos-cristaos'],
  '/texts/a-encarnacao-do-verbo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Escada do Paraíso: Os 30 Degraus da Ascensão Espiritual (Scala Paradisi)',
  (SELECT id FROM authors WHERE slug = 'sao-joao-climaco'),
  'Português',
  'A Escada do Paraíso: Os 30 Degraus da Ascensão Espiritual (Scala Paradisi) por São João Clímaco. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-escada-do-paraiso-joao-climaco',
  'A Escada do Paraíso: Os 30 Degraus da Ascensão Espiritual (Scala Paradisi)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Oriental e Ascética Monástica'],
  ARRAY['sao-joao-climaco', 'a-escada-do-paraiso-joao-climaco', 'classicos-cristaos'],
  '/texts/a-escada-do-paraiso-joao-climaco.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Escápula (Ad Scapulam)',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'A Escápula (Ad Scapulam) por Tertuliano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-escapula-tertuliano',
  'A Escápula (Ad Scapulam)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Apologética'],
  ARRAY['tertuliano', 'a-escapula-tertuliano', 'classicos-cristaos'],
  '/texts/a-escapula-tertuliano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Discursos sobre a Existência e os Atributos de Deus (The Existence and Attributes of God)',
  (SELECT id FROM authors WHERE slug = 'stephen-charnock'),
  'Português',
  'Discursos sobre a Existência e os Atributos de Deus (The Existence and Attributes of God) por Stephen Charnock. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-existencia-e-os-atributos-de-deus-charnock',
  'Discursos sobre a Existência e os Atributos de Deus (The Existence and Attributes of God)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Própria e Dogmática Puritana'],
  ARRAY['stephen-charnock', 'a-existencia-e-os-atributos-de-deus-charnock', 'classicos-cristaos'],
  '/texts/a-existencia-e-os-atributos-de-deus-charnock.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Fé e o Símbolo (De Fide et Symbolo)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho-de-hipona'),
  'Português',
  'A Fé e o Símbolo (De Fide et Symbolo) por Santo Agostinho de Hipona. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-fe-e-o-simbolo-agostinho',
  'A Fé e o Símbolo (De Fide et Symbolo)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Dogmática'],
  ARRAY['santo-agostinho-de-hipona', 'a-fe-e-o-simbolo-agostinho', 'classicos-cristaos'],
  '/texts/a-fe-e-o-simbolo-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Meditações e Discursos sobre a Glória de Cristo (The Glory of Christ)',
  (SELECT id FROM authors WHERE slug = 'john-owen'),
  'Português',
  'Meditações e Discursos sobre a Glória de Cristo (The Glory of Christ) por John Owen. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-gloria-de-cristo-john-owen',
  'Meditações e Discursos sobre a Glória de Cristo (The Glory of Christ)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Puritana e Cristologia Reformada'],
  ARRAY['john-owen', 'a-gloria-de-cristo-john-owen', 'classicos-cristaos'],
  '/texts/a-gloria-de-cristo-john-owen.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Guarda do Coração (Keeping the Heart; or, The Saint Indeed)',
  (SELECT id FROM authors WHERE slug = 'john-flavel'),
  'Português',
  'A Guarda do Coração (Keeping the Heart; or, The Saint Indeed) por John Flavel. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-guarda-do-coracao-john-flavel',
  'A Guarda do Coração (Keeping the Heart; or, The Saint Indeed)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Puritana e Espiritualidade Prática'],
  ARRAY['john-flavel', 'a-guarda-do-coracao-john-flavel', 'classicos-cristaos'],
  '/texts/a-guarda-do-coracao-john-flavel.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Guerra Santa',
  (SELECT id FROM authors WHERE slug = 'john-bunyan'),
  'Português',
  'A Guerra Santa por John Bunyan. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-guerra-santa-john-bunyan',
  'A Guerra Santa',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Alegoria e Ficção Teológica'],
  ARRAY['john-bunyan', 'a-guerra-santa-john-bunyan', 'classicos-cristaos'],
  '/texts/a-guerra-santa-john-bunyan.md',
  'the-holy-war',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Mortificação do Pecado nos Crentes',
  (SELECT id FROM authors WHERE slug = 'john-owen'),
  'Português',
  'A Mortificação do Pecado nos Crentes por John Owen. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-mortificacao-do-pecado-john-owen',
  'A Mortificação do Pecado nos Crentes',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Puritana e Vida Cristã'],
  ARRAY['john-owen', 'a-mortificacao-do-pecado-john-owen', 'classicos-cristaos'],
  '/texts/a-mortificacao-do-pecado-john-owen.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'À Nobreza Cristã da Nação Alemã sobre a Reforma do Estado Cristão (An den christlichen Adel)',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'À Nobreza Cristã da Nação Alemã sobre a Reforma do Estado Cristão (An den christlichen Adel) por Martinho Lutero. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-nobreza-crista-da-nacao-alema-lutero',
  'À Nobreza Cristã da Nação Alemã sobre a Reforma do Estado Cristão (An den christlichen Adel)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Reformada e Eclesiologia'],
  ARRAY['martinho-lutero', 'a-nobreza-crista-da-nacao-alema-lutero', 'classicos-cristaos'],
  '/texts/a-nobreza-crista-da-nacao-alema-lutero.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Oração do Senhor (De Dominica Oratione)',
  (SELECT id FROM authors WHERE slug = 'sao-cipriano-de-cartago'),
  'Português',
  'A Oração do Senhor (De Dominica Oratione) por São Cipriano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-oracao-do-senhor-cipriano',
  'A Oração do Senhor (De Dominica Oratione)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Espiritualidade'],
  ARRAY['sao-cipriano-de-cartago', 'a-oracao-do-senhor-cipriano', 'classicos-cristaos'],
  '/texts/a-oracao-do-senhor-cipriano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Oração no Espírito e com o Entendimento (I Will Pray with the Spirit)',
  (SELECT id FROM authors WHERE slug = 'john-bunyan'),
  'Português',
  'A Oração no Espírito e com o Entendimento (I Will Pray with the Spirit) por John Bunyan. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-oracao-no-espirito-john-bunyan',
  'A Oração no Espírito e com o Entendimento (I Will Pray with the Spirit)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Puritana e Espiritualidade'],
  ARRAY['john-bunyan', 'a-oracao-no-espirito-john-bunyan', 'classicos-cristaos'],
  '/texts/a-oracao-no-espirito-john-bunyan.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Prática da Presença de Deus',
  (SELECT id FROM authors WHERE slug = 'irmao-lourenco-da-ressurreicao'),
  'Inglês',
  'A Prática da Presença de Deus por Irmão Lourenço da Ressurreição. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-pratica-da-presenca-de-deus-irmao-lourenco',
  'A Prática da Presença de Deus',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Vida Interior e Oração Contemplativa'],
  ARRAY['irmao-lourenco-da-ressurreicao', 'a-pratica-da-presenca-de-deus-irmao-lourenco', 'classicos-cristaos'],
  '/texts/a-pratica-da-presenca-de-deus-irmao-lourenco.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Santa Regra dos Mosteiros (Regula Sancti Benedicti — 73 Capítulos)',
  (SELECT id FROM authors WHERE slug = 'sao-bento-de-nursia'),
  'Português',
  'A Santa Regra dos Mosteiros (Regula Sancti Benedicti — 73 Capítulos) por São Bento de Núrsia. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-regra-de-sao-bento',
  'A Santa Regra dos Mosteiros (Regula Sancti Benedicti — 73 Capítulos)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Monasticismo Ocidental e Espiritualidade Beneditina'],
  ARRAY['sao-bento-de-nursia', 'a-regra-de-sao-bento', 'classicos-cristaos'],
  '/texts/a-regra-de-sao-bento.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Regra Pastoral - Parte 1 (Regula Pastoralis Libri I & II)',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-magno'),
  'Português',
  'A Regra Pastoral - Parte 1 (Regula Pastoralis Libri I & II) por São Gregório Magno. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-regra-pastoral-parte-1-gregorio-magno',
  'A Regra Pastoral - Parte 1 (Regula Pastoralis Libri I & II)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Pastoral / Espiritualidade do Governo Eclesiástico / Patrística Latina'],
  ARRAY['sao-gregorio-magno', 'a-regra-pastoral-parte-1-gregorio-magno', 'classicos-cristaos'],
  '/texts/a-regra-pastoral-parte-1-gregorio-magno.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Regra Pastoral - Parte 2 (Regula Pastoralis Libri III & IV)',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-magno'),
  'Português',
  'A Regra Pastoral - Parte 2 (Regula Pastoralis Libri III & IV) por São Gregório Magno. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-regra-pastoral-parte-2-gregorio-magno',
  'A Regra Pastoral - Parte 2 (Regula Pastoralis Libri III & IV)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Pastoral / Discernimento Espiritual e Homilética / Patrística Latina'],
  ARRAY['sao-gregorio-magno', 'a-regra-pastoral-parte-2-gregorio-magno', 'classicos-cristaos'],
  '/texts/a-regra-pastoral-parte-2-gregorio-magno.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Tradição Apostólica',
  (SELECT id FROM authors WHERE slug = 'santo-hipolito-de-roma'),
  'Português',
  'A Tradição Apostólica por Santo Hipólito de Roma. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-tradicao-apostolica-hipolito',
  'A Tradição Apostólica',
  2026,
  'Scriptorium Divinum',
  ARRAY['grc'],
  ARRAY['Patrística Antiga / Liturgia e Ordenação'],
  ARRAY['santo-hipolito-de-roma', 'a-tradicao-apostolica-hipolito', 'classicos-cristaos'],
  '/texts/a-tradicao-apostolica-hipolito.md',
  'the-apostolic-tradition-of-hippolytus',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Trindade (De Trinitate)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho-de-hipona'),
  'Português',
  'A Trindade (De Trinitate) por Santo Agostinho de Hipona. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-trindade-santo-agostinho',
  'A Trindade (De Trinitate)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística e Teologia Trinitária Sistemática'],
  ARRAY['santo-agostinho-de-hipona', 'a-trindade-santo-agostinho', 'classicos-cristaos'],
  '/texts/a-trindade-santo-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Unidade da Igreja Católica (De Catholicae Ecclesiae Unitate)',
  (SELECT id FROM authors WHERE slug = 'sao-cipriano-de-cartago'),
  'Português',
  'A Unidade da Igreja Católica (De Catholicae Ecclesiae Unitate) por São Cipriano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-unidade-da-igreja-catolica-cipriano',
  'A Unidade da Igreja Católica (De Catholicae Ecclesiae Unitate)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Eclesiologia'],
  ARRAY['sao-cipriano-de-cartago', 'a-unidade-da-igreja-catolica-cipriano', 'classicos-cristaos'],
  '/texts/a-unidade-da-igreja-catolica-cipriano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Unidade da Igreja Católica: Tratado sobre o Corpo de Cristo (De Catholicae Ecclesiae Unitate)',
  (SELECT id FROM authors WHERE slug = 'sao-cipriano-de-cartago'),
  'Português',
  'A Unidade da Igreja Católica: Tratado sobre o Corpo de Cristo (De Catholicae Ecclesiae Unitate) por São Cipriano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-unidade-da-igreja-catolica',
  'A Unidade da Igreja Católica: Tratado sobre o Corpo de Cristo (De Catholicae Ecclesiae Unitate)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Eclesiologia'],
  ARRAY['sao-cipriano-de-cartago', 'a-unidade-da-igreja-catolica', 'classicos-cristaos'],
  '/texts/a-unidade-da-igreja-catolica.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Utilidade da Fé (De Utilitate Credendi)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho-de-hipona'),
  'Português',
  'A Utilidade da Fé (De Utilitate Credendi) por Santo Agostinho de Hipona. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-utilidade-da-fe-agostinho',
  'A Utilidade da Fé (De Utilitate Credendi)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Filosofia Cristã'],
  ARRAY['santo-agostinho-de-hipona', 'a-utilidade-da-fe-agostinho', 'classicos-cristaos'],
  '/texts/a-utilidade-da-fe-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Grande Catecismo e a Vida Espiritual (Oratio Catechetica Magna)',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nissa'),
  'Português',
  'O Grande Catecismo e a Vida Espiritual (Oratio Catechetica Magna) por São Gregório de Nissa. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-vida-de-moises-gregorio-de-nissa',
  'O Grande Catecismo e a Vida Espiritual (Oratio Catechetica Magna)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Grega e Dogmática Sistemática'],
  ARRAY['sao-gregorio-de-nissa', 'a-vida-de-moises-gregorio-de-nissa', 'classicos-cristaos'],
  '/texts/a-vida-de-moises-gregorio-de-nissa.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Vida do Cristão (De Vita Hominis Christiani)',
  (SELECT id FROM authors WHERE slug = 'joao-calvino'),
  'Português',
  'A Vida do Cristão (De Vita Hominis Christiani) por João Calvino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'a-vida-do-cristao-calvino',
  'A Vida do Cristão (De Vita Hominis Christiani)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Reformada, Piedade e Vida Devota'],
  ARRAY['joao-calvino', 'a-vida-do-cristao-calvino', 'classicos-cristaos'],
  '/texts/a-vida-do-cristao-calvino.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Aos Jovens Sobre A Literatura Classica',
  (SELECT id FROM authors WHERE slug = 'capitulo-i-o-afeto-paternal-e-a-finalidade-da-instrucao-1'),
  'Português',
  'Aos Jovens Sobre A Literatura Classica por Capítulo I: O Afeto Paternal e a Finalidade da Instrução (§ 1). Edição canônica integral e anotada do Scriptorium Divinum.',
  'aos-jovens-sobre-a-literatura-classica',
  'Aos Jovens Sobre A Literatura Classica',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['capitulo-i-o-afeto-paternal-e-a-finalidade-da-instrucao-1', 'aos-jovens-sobre-a-literatura-classica', 'classicos-cristaos'],
  '/texts/aos-jovens-sobre-a-literatura-classica.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Aos Jovens sobre a Utilidade da Literatura Clássica (Ad Adolescentes)',
  (SELECT id FROM authors WHERE slug = 'sao-basilio-magno'),
  'Português',
  'Aos Jovens sobre a Utilidade da Literatura Clássica (Ad Adolescentes) por São Basílio Magno. Edição canônica integral e anotada do Scriptorium Divinum.',
  'aos-jovens-sobre-a-literatura-grega-basilio',
  'Aos Jovens sobre a Utilidade da Literatura Clássica (Ad Adolescentes)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Grega e Educação Cristã'],
  ARRAY['sao-basilio-magno', 'aos-jovens-sobre-a-literatura-grega-basilio', 'classicos-cristaos'],
  '/texts/aos-jovens-sobre-a-literatura-grega-basilio.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Apologético (Apologeticus pro Christianis)',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Apologético (Apologeticus pro Christianis) por Tertuliano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'apologetico-tertuliano',
  'Apologético (Apologeticus pro Christianis)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Primitiva e Apologética Cristã'],
  ARRAY['tertuliano', 'apologetico-tertuliano', 'classicos-cristaos'],
  '/texts/apologetico-tertuliano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Apologia da Confissão de Augsburgo',
  (SELECT id FROM authors WHERE slug = 'introducao'),
  'Português',
  'Apologia da Confissão de Augsburgo por Introdução. Edição canônica integral e anotada do Scriptorium Divinum.',
  'apologia-da-confissao-de-augsburgo',
  'Apologia da Confissão de Augsburgo',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['introducao', 'apologia-da-confissao-de-augsburgo', 'classicos-cristaos'],
  '/texts/apologia-da-confissao-de-augsburgo.md',
  'the-apology-of-the-augsburg-confession',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Árvore da Vida (Lignum Vitae)',
  (SELECT id FROM authors WHERE slug = 'sao-boaventura'),
  'Português',
  'A Árvore da Vida (Lignum Vitae) por São Boaventura. Edição canônica integral e anotada do Scriptorium Divinum.',
  'arvore-da-vida-boaventura',
  'A Árvore da Vida (Lignum Vitae)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Vida Interior e Teologia Mística'],
  ARRAY['sao-boaventura', 'arvore-da-vida-boaventura', 'classicos-cristaos'],
  '/texts/arvore-da-vida-boaventura.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratado sobre as Afeições Religiosas (A Treatise Concerning Religious Affections)',
  (SELECT id FROM authors WHERE slug = 'jonathan-edwards'),
  'Português',
  'Tratado sobre as Afeições Religiosas (A Treatise Concerning Religious Affections) por Jonathan Edwards. Edição canônica integral e anotada do Scriptorium Divinum.',
  'as-afeicoes-religiosas-jonathan-edwards',
  'Tratado sobre as Afeições Religiosas (A Treatise Concerning Religious Affections)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Reformada e Discernimento Espiritual'],
  ARRAY['jonathan-edwards', 'as-afeicoes-religiosas-jonathan-edwards', 'classicos-cristaos'],
  '/texts/as-afeicoes-religiosas-jonathan-edwards.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'As Instituições Cenobíticas e os Remédios para os Oito Vícios Principais (De Institutis Coenobiorum)',
  (SELECT id FROM authors WHERE slug = 'sao-joao-cassiano'),
  'Português',
  'As Instituições Cenobíticas e os Remédios para os Oito Vícios Principais (De Institutis Coenobiorum) por São João Cassiano. Edição canônica integral e anotada do Scriptorium Divinum.',
  'as-instituicoes-cenobiticas-joao-cassiano',
  'As Instituições Cenobíticas e os Remédios para os Oito Vícios Principais (De Institutis Coenobiorum)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Monasticismo e Espiritualidade Cristã'],
  ARRAY['sao-joao-cassiano', 'as-instituicoes-cenobiticas-joao-cassiano', 'classicos-cristaos'],
  '/texts/as-instituicoes-cenobiticas-joao-cassiano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'As Seis Asas Do Serafim Boaventura',
  (SELECT id FROM authors WHERE slug = 'prologo-o-serafim-de-isaias'),
  'Português',
  'As Seis Asas Do Serafim Boaventura por Prólogo — O Serafim de Isaías. Edição canônica integral e anotada do Scriptorium Divinum.',
  'as-seis-asas-do-serafim-boaventura',
  'As Seis Asas Do Serafim Boaventura',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['prologo-o-serafim-de-isaias', 'as-seis-asas-do-serafim-boaventura', 'classicos-cristaos'],
  '/texts/as-seis-asas-do-serafim-boaventura.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Auto da Alma (Auto da Alma)',
  (SELECT id FROM authors WHERE slug = 'gil-vicente'),
  'Português',
  'Auto da Alma (Auto da Alma) por Gil Vicente. Edição canônica integral e anotada do Scriptorium Divinum.',
  'auto-da-alma',
  'Auto da Alma (Auto da Alma)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['gil-vicente', 'auto-da-alma', 'classicos-cristaos'],
  '/texts/auto-da-alma.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Auto Da Barca Do Inferno',
  (SELECT id FROM authors WHERE slug = 'nota-introdutoria'),
  'Português',
  'Auto Da Barca Do Inferno por Nota Introdutória. Edição canônica integral e anotada do Scriptorium Divinum.',
  'auto-da-barca-do-inferno',
  'Auto Da Barca Do Inferno',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['nota-introdutoria', 'auto-da-barca-do-inferno', 'classicos-cristaos'],
  '/texts/auto-da-barca-do-inferno.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Trechos da _Nova Floresta_, do _Estímulo Prático_, de _Luz e Calor_, dos _Últimos Fins do Homem_ e dos _Exercícios Espirituais_, em seleção: Antologia Portuguesa, _Bernardes_, vol. II, 2ª ed.',
  (SELECT id FROM authors WHERE slug = 'padre-manuel-bernardes-1644-1710'),
  'Português',
  'Trechos da _Nova Floresta_, do _Estímulo Prático_, de _Luz e Calor_, dos _Últimos Fins do Homem_ e dos _Exercícios Espirituais_, em seleção: Antologia Portuguesa, _Bernardes_, vol. II, 2ª ed. por Padre Manuel Bernardes (1644–1710). Edição canônica integral e anotada do Scriptorium Divinum.',
  'bernardes-antologia-estimulo-luz-e-calor',
  'Trechos da _Nova Floresta_, do _Estímulo Prático_, de _Luz e Calor_, dos _Últimos Fins do Homem_ e dos _Exercícios Espirituais_, em seleção: Antologia Portuguesa, _Bernardes_, vol. II, 2ª ed.',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['padre-manuel-bernardes-1644-1710', 'bernardes-antologia-estimulo-luz-e-calor', 'classicos-cristaos'],
  '/texts/bernardes-antologia-estimulo-luz-e-calor.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  '_Nova Floresta_ (1706–1728), em seleção: Antologia Portuguesa, _Bernardes_, vol. I, 2ª ed.',
  (SELECT id FROM authors WHERE slug = 'padre-manuel-bernardes-1644-1710'),
  'Português',
  '_Nova Floresta_ (1706–1728), em seleção: Antologia Portuguesa, _Bernardes_, vol. I, 2ª ed. por Padre Manuel Bernardes (1644–1710). Edição canônica integral e anotada do Scriptorium Divinum.',
  'bernardes-antologia-nova-floresta',
  '_Nova Floresta_ (1706–1728), em seleção: Antologia Portuguesa, _Bernardes_, vol. I, 2ª ed.',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['padre-manuel-bernardes-1644-1710', 'bernardes-antologia-nova-floresta', 'classicos-cristaos'],
  '/texts/bernardes-antologia-nova-floresta.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Breve Catecismo de Westminster (*The Westminster Shorter Catechism*)',
  (SELECT id FROM authors WHERE slug = 'assembleia-de-westminster-1643-1649-convocada-pelo-parlamento-ingles'),
  'Português',
  'O Breve Catecismo de Westminster (*The Westminster Shorter Catechism*) por Assembleia de Westminster (1643–1649), convocada pelo Parlamento inglês. Edição canônica integral e anotada do Scriptorium Divinum.',
  'breve-catecismo-westminster',
  'O Breve Catecismo de Westminster (*The Westminster Shorter Catechism*)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['assembleia-de-westminster-1643-1649-convocada-pelo-parlamento-ingles', 'breve-catecismo-westminster', 'classicos-cristaos'],
  '/texts/breve-catecismo-westminster.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Breviloquio Suma Breve Boaventura',
  (SELECT id FROM authors WHERE slug = 'prologo-a-escritura-como-rio-de-deus'),
  'Português',
  'Breviloquio Suma Breve Boaventura por Prólogo — A Escritura como Rio de Deus. Edição canônica integral e anotada do Scriptorium Divinum.',
  'breviloquio-suma-breve-boaventura',
  'Breviloquio Suma Breve Boaventura',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['prologo-a-escritura-como-rio-de-deus', 'breviloquio-suma-breve-boaventura', 'classicos-cristaos'],
  '/texts/breviloquio-suma-breve-boaventura.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Caminho de Perfeição (Camino de Perfección)',
  (SELECT id FROM authors WHERE slug = 'santa-teresa-de-avila'),
  'Português',
  'Caminho de Perfeição (Camino de Perfección) por Santa Teresa de Ávila. Edição canônica integral e anotada do Scriptorium Divinum.',
  'caminho-de-perfeicao-teresa-de-avila',
  'Caminho de Perfeição (Camino de Perfección)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Mística Carmelita e Oração Contemplativa'],
  ARRAY['santa-teresa-de-avila', 'caminho-de-perfeicao-teresa-de-avila', 'classicos-cristaos'],
  '/texts/caminho-de-perfeicao-teresa-de-avila.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Canones De Dort',
  (SELECT id FROM authors WHERE slug = 'primeiro-ponto-de-doutrina-da-eleicao-divina-e-da-reprovacao'),
  'Português',
  'Canones De Dort por Primeiro Ponto de Doutrina: Da Eleição Divina e da Reprovação. Edição canônica integral e anotada do Scriptorium Divinum.',
  'canones-de-dort',
  'Canones De Dort',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['primeiro-ponto-de-doutrina-da-eleicao-divina-e-da-reprovacao', 'canones-de-dort', 'classicos-cristaos'],
  '/texts/canones-de-dort.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Cântico das Criaturas e Escritos Espirituais',
  (SELECT id FROM authors WHERE slug = 'sao-francisco-de-assis'),
  'Português',
  'Cântico das Criaturas e Escritos Espirituais por São Francisco de Assis. Edição canônica integral e anotada do Scriptorium Divinum.',
  'cantico-das-criaturas-sao-francisco',
  'Cântico das Criaturas e Escritos Espirituais',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Vida Interior e Mística Franciscana'],
  ARRAY['sao-francisco-de-assis', 'cantico-das-criaturas-sao-francisco', 'classicos-cristaos'],
  '/texts/cantico-das-criaturas-sao-francisco.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Cântico Espiritual (Cántico Espiritual)',
  (SELECT id FROM authors WHERE slug = 'sao-joao-da-cruz'),
  'Português',
  'Cântico Espiritual (Cántico Espiritual) por São João da Cruz. Edição canônica integral e anotada do Scriptorium Divinum.',
  'cantico-espiritual-joao-da-cruz',
  'Cântico Espiritual (Cántico Espiritual)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Mística Carmelita e Poesia Teológica'],
  ARRAY['sao-joao-da-cruz', 'cantico-espiritual-joao-da-cruz', 'classicos-cristaos'],
  '/texts/cantico-espiritual-joao-da-cruz.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Carta a Diogneto (Πρὸς Διόγνητον)',
  (SELECT id FROM authors WHERE slug = 'desconhecido-mateto-isto-e-discipulo-pseudonimo-tradicional-ii-seculo-os-capitulos-xi-e-xii-sao-de-outra-mao-provavelmente-do-iii-seculo-ver-nota-abaixo'),
  'Português',
  'A Carta a Diogneto (Πρὸς Διόγνητον) por Desconhecido ("Mateto", isto é, "discípulo" — pseudônimo tradicional), II século. Os capítulos XI e XII são de outra mão, provavelmente do III século (ver nota abaixo). Edição canônica integral e anotada do Scriptorium Divinum.',
  'carta-a-diogneto',
  'A Carta a Diogneto (Πρὸς Διόγνητον)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['desconhecido-mateto-isto-e-discipulo-pseudonimo-tradicional-ii-seculo-os-capitulos-xi-e-xii-sao-de-outra-mao-provavelmente-do-iii-seculo-ver-nota-abaixo', 'carta-a-diogneto', 'classicos-cristaos'],
  '/texts/carta-a-diogneto.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Carta De Ouro Guilherme Saint Thierry',
  (SELECT id FROM authors WHERE slug = 'prefacio-por-que-esta-carta-foi-escrita'),
  'Português',
  'Carta De Ouro Guilherme Saint Thierry por Prefácio: Por que Esta Carta Foi Escrita. Edição canônica integral e anotada do Scriptorium Divinum.',
  'carta-de-ouro-guilherme-saint-thierry',
  'Carta De Ouro Guilherme Saint Thierry',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['prefacio-por-que-esta-carta-foi-escrita', 'carta-de-ouro-guilherme-saint-thierry', 'classicos-cristaos'],
  '/texts/carta-de-ouro-guilherme-saint-thierry.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Cartas A Nestorio Cirilo Alexandria',
  (SELECT id FROM authors WHERE slug = 'primeira-carta-a-nestorio-c-429-d-c'),
  'Português',
  'Cartas A Nestorio Cirilo Alexandria por Primeira Carta a Nestório (c. 429 d.C.). Edição canônica integral e anotada do Scriptorium Divinum.',
  'cartas-a-nestorio-cirilo-alexandria',
  'Cartas A Nestorio Cirilo Alexandria',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['primeira-carta-a-nestorio-c-429-d-c', 'cartas-a-nestorio-cirilo-alexandria', 'classicos-cristaos'],
  '/texts/cartas-a-nestorio-cirilo-alexandria.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Cartas De Inacio De Antioquia',
  (SELECT id FROM authors WHERE slug = '1-epistola-aos-efesios'),
  'Português',
  'Cartas De Inacio De Antioquia por 1. Epístola aos Efésios. Edição canônica integral e anotada do Scriptorium Divinum.',
  'cartas-de-inacio-de-antioquia',
  'Cartas De Inacio De Antioquia',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['1-epistola-aos-efesios', 'cartas-de-inacio-de-antioquia', 'classicos-cristaos'],
  '/texts/cartas-de-inacio-de-antioquia.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Cartas sobre São Martinho de Tours',
  (SELECT id FROM authors WHERE slug = 'sulpicio-severo'),
  'Português',
  'Cartas sobre São Martinho de Tours por Sulpício Severo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'cartas-sobre-sao-martinho-sulpicio-severo',
  'Cartas sobre São Martinho de Tours',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Epistolário / Hagiografia / Testemunho Patrístico'],
  ARRAY['sulpicio-severo', 'cartas-sobre-sao-martinho-sulpicio-severo', 'classicos-cristaos'],
  '/texts/cartas-sobre-sao-martinho-sulpicio-severo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Castelo Forte é o Nosso Deus e os Hinos Sagrados da Reforma (Geistliche Lieder)',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'Castelo Forte é o Nosso Deus e os Hinos Sagrados da Reforma (Geistliche Lieder) por Martinho Lutero. Edição canônica integral e anotada do Scriptorium Divinum.',
  'castelo-forte-e-o-nosso-deus',
  'Castelo Forte é o Nosso Deus e os Hinos Sagrados da Reforma (Geistliche Lieder)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Hinologia, Liturgia e Teologia Pastoral'],
  ARRAY['martinho-lutero', 'castelo-forte-e-o-nosso-deus', 'classicos-cristaos'],
  '/texts/castelo-forte-e-o-nosso-deus.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Catecismo de Heidelberg (*Heidelberger Katechismus* / *Catechesis Palatina*)',
  (SELECT id FROM authors WHERE slug = 'zacarias-ursino-1534-1583-e-caspar-oleviano-1536-1587-encomendado-pelo-eleitor-frederico-iii-do-palatinato'),
  'Português',
  'O Catecismo de Heidelberg (*Heidelberger Katechismus* / *Catechesis Palatina*) por Zacarias Ursino (1534–1583) e Caspar Oleviano (1536–1587), encomendado pelo Eleitor Frederico III do Palatinato. Edição canônica integral e anotada do Scriptorium Divinum.',
  'catecismo-de-heidelberg',
  'O Catecismo de Heidelberg (*Heidelberger Katechismus* / *Catechesis Palatina*)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['zacarias-ursino-1534-1583-e-caspar-oleviano-1536-1587-encomendado-pelo-eleitor-frederico-iii-do-palatinato', 'catecismo-de-heidelberg', 'classicos-cristaos'],
  '/texts/catecismo-de-heidelberg.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Catequeses Batismais - Parte 1 (Prólogo e Catequeses 1 a 10)',
  (SELECT id FROM authors WHERE slug = 'sao-cirilo-de-jerusalem'),
  'Português',
  'Catequeses Batismais - Parte 1 (Prólogo e Catequeses 1 a 10) por São Cirilo de Jerusalém. Edição canônica integral e anotada do Scriptorium Divinum.',
  'catequeses-batismais-parte-1-cirilo-de-jerusalem',
  'Catequeses Batismais - Parte 1 (Prólogo e Catequeses 1 a 10)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Catequese Sacramental / Teologia Batismal / Exposição do Credo de Jerusalém'],
  ARRAY['sao-cirilo-de-jerusalem', 'catequeses-batismais-parte-1-cirilo-de-jerusalem', 'classicos-cristaos'],
  '/texts/catequeses-batismais-parte-1-cirilo-de-jerusalem.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Catequeses Batismais - Parte 2 (Catequeses 11 a 18)',
  (SELECT id FROM authors WHERE slug = 'sao-cirilo-de-jerusalem'),
  'Português',
  'Catequeses Batismais - Parte 2 (Catequeses 11 a 18) por São Cirilo de Jerusalém. Edição canônica integral e anotada do Scriptorium Divinum.',
  'catequeses-batismais-parte-2-cirilo-de-jerusalem',
  'Catequeses Batismais - Parte 2 (Catequeses 11 a 18)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Catequese Sacramental / Cristologia / Pneumatologia e Escatologia do Credo'],
  ARRAY['sao-cirilo-de-jerusalem', 'catequeses-batismais-parte-2-cirilo-de-jerusalem', 'classicos-cristaos'],
  '/texts/catequeses-batismais-parte-2-cirilo-de-jerusalem.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Catequeses Mistagógicas',
  (SELECT id FROM authors WHERE slug = 'sao-cirilo-de-jerusalem'),
  'Português',
  'Catequeses Mistagógicas por São Cirilo de Jerusalém. Edição canônica integral e anotada do Scriptorium Divinum.',
  'catequeses-mistagogicas-cirilo-de-jerusalem',
  'Catequeses Mistagógicas',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística e Teologia Sacramental'],
  ARRAY['sao-cirilo-de-jerusalem', 'catequeses-mistagogicas-cirilo-de-jerusalem', 'classicos-cristaos'],
  '/texts/catequeses-mistagogicas-cirilo-de-jerusalem.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Do Cativeiro Babilônico da Igreja: Prelúdio sobre os Sacramentos',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'Do Cativeiro Babilônico da Igreja: Prelúdio sobre os Sacramentos por Martinho Lutero. Edição canônica integral e anotada do Scriptorium Divinum.',
  'cativeiro-babilonico-da-igreja-lutero',
  'Do Cativeiro Babilônico da Igreja: Prelúdio sobre os Sacramentos',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Reformada e Teologia Sacramental'],
  ARRAY['martinho-lutero', 'cativeiro-babilonico-da-igreja-lutero', 'classicos-cristaos'],
  '/texts/cativeiro-babilonico-da-igreja-lutero.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Centurias Sobre A Caridade Maximo Confessor',
  (SELECT id FROM authors WHERE slug = 'prologo'),
  'Português',
  'Centurias Sobre A Caridade Maximo Confessor por Prólogo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'centurias-sobre-a-caridade-maximo-confessor',
  'Centurias Sobre A Caridade Maximo Confessor',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['prologo', 'centurias-sobre-a-caridade-maximo-confessor', 'classicos-cristaos'],
  '/texts/centurias-sobre-a-caridade-maximo-confessor.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'De Civitate Dei contra Paganos (413–426) — edição inglesa "The City of God", em dois volumes',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona-354-430'),
  'Inglês',
  'De Civitate Dei contra Paganos (413–426) — edição inglesa "The City of God", em dois volumes por Agostinho de Hipona (354–430). Edição canônica integral e anotada do Scriptorium Divinum.',
  'cidade-de-deus-en',
  'De Civitate Dei contra Paganos (413–426) — edição inglesa "The City of God", em dois volumes',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['agostinho-de-hipona-354-430', 'cidade-de-deus-en', 'classicos-cristaos'],
  '/texts/cidade-de-deus-en.md',
  'a-cidade-de-deus-agostinho',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Clareza e Certeza da Palavra de Deus (Von Klarheit und Gewissheit)',
  (SELECT id FROM authors WHERE slug = 'ulrico-zuinglio'),
  'Português',
  'Da Clareza e Certeza da Palavra de Deus (Von Klarheit und Gewissheit) por Ulrico Zuínglio. Edição canônica integral e anotada do Scriptorium Divinum.',
  'clareza-e-certeza-palavra-de-deus-zuinglio',
  'Da Clareza e Certeza da Palavra de Deus (Von Klarheit und Gewissheit)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Reformada e Hermenêutica Bíblica'],
  ARRAY['ulrico-zuinglio', 'clareza-e-certeza-palavra-de-deus-zuinglio', 'classicos-cristaos'],
  '/texts/clareza-e-certeza-palavra-de-deus-zuinglio.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Coletas e Orações do Ano Cristão (Book of Common Prayer)',
  (SELECT id FROM authors WHERE slug = 'tradicao-liturgica-anglicana-thomas-cranmer'),
  'Português',
  'Coletas e Orações do Ano Cristão (Book of Common Prayer) por Tradição Litúrgica Anglicana / Thomas Cranmer. Edição canônica integral e anotada do Scriptorium Divinum.',
  'coletas-livro-de-oracao-comum-1662',
  'Coletas e Orações do Ano Cristão (Book of Common Prayer)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Liturgia e Oração Pública'],
  ARRAY['tradicao-liturgica-anglicana-thomas-cranmer', 'coletas-livro-de-oracao-comum-1662', 'classicos-cristaos'],
  '/texts/coletas-livro-de-oracao-comum-1662.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Comentário ao Magnificat (O Cântico de Maria)',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'Comentário ao Magnificat (O Cântico de Maria) por Martinho Lutero. Edição canônica integral e anotada do Scriptorium Divinum.',
  'comentario-ao-magnificat-lutero',
  'Comentário ao Magnificat (O Cântico de Maria)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Reformada e Espiritualidade Bíblica'],
  ARRAY['martinho-lutero', 'comentario-ao-magnificat-lutero', 'classicos-cristaos'],
  '/texts/comentario-ao-magnificat-lutero.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Comentário à Epístola aos Gálatas',
  (SELECT id FROM authors WHERE slug = 'tradicao-classica-crista'),
  'Português',
  'Comentário à Epístola aos Gálatas por Tradição Clássica Cristã. Edição canônica integral e anotada do Scriptorium Divinum.',
  'comentario-aos-galatas-lutero',
  'Comentário à Epístola aos Gálatas',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['tradicao-classica-crista', 'comentario-aos-galatas-lutero', 'classicos-cristaos'],
  '/texts/comentario-aos-galatas-lutero.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Comentário à Epístola aos Gálatas',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'Comentário à Epístola aos Gálatas por Martinho Lutero. Edição canônica integral e anotada do Scriptorium Divinum.',
  'comentario-aos-galatas-martinho-lutero',
  'Comentário à Epístola aos Gálatas',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim / Alemão'],
  ARRAY['Exegese Bíblica / Teologia Paulina / Soteriologia da Fé'],
  ARRAY['martinho-lutero', 'comentario-aos-galatas-martinho-lutero', 'classicos-cristaos'],
  '/texts/comentario-aos-galatas-martinho-lutero.md',
  'commentary-on-the-epistle-to-the-galatians',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Comentário sobre a Epístola aos Gálatas',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Comentário sobre a Epístola aos Gálatas por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'comentario-sobre-galatas-joao-crisostomo',
  'Comentário sobre a Epístola aos Gálatas',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Teologia Paulina / Graça e Justificação'],
  ARRAY['sao-joao-crisostomo', 'comentario-sobre-galatas-joao-crisostomo', 'classicos-cristaos'],
  '/texts/comentario-sobre-galatas-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Commentary on the Epistle to the Galatians (In epistolam S. Pauli ad Galatas commentarius)',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Inglês',
  'Commentary on the Epistle to the Galatians (In epistolam S. Pauli ad Galatas commentarius) por Martinho Lutero. Edição canônica integral e anotada do Scriptorium Divinum.',
  'commentary-on-the-epistle-to-the-galatians',
  'Commentary on the Epistle to the Galatians (In epistolam S. Pauli ad Galatas commentarius)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['martinho-lutero', 'commentary-on-the-epistle-to-the-galatians', 'classicos-cristaos'],
  '/texts/commentary-on-the-epistle-to-the-galatians.md',
  'comentario-aos-galatas-martinho-lutero',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Commonitorium: Para a Antiguidade e Universalidade da Fé Católica contra as Profanas Novidades de Todas as Heresias',
  (SELECT id FROM authors WHERE slug = 'sao-vicente-de-lerins'),
  'Português',
  'Commonitorium: Para a Antiguidade e Universalidade da Fé Católica contra as Profanas Novidades de Todas as Heresias por São Vicente de Lérins. Edição canônica integral e anotada do Scriptorium Divinum.',
  'commonitorium-canon-ortodoxia-vicente-lerins',
  'Commonitorium: Para a Antiguidade e Universalidade da Fé Católica contra as Profanas Novidades de Todas as Heresias',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Dogmática'],
  ARRAY['sao-vicente-de-lerins', 'commonitorium-canon-ortodoxia-vicente-lerins', 'classicos-cristaos'],
  '/texts/commonitorium-canon-ortodoxia-vicente-lerins.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Commonitorium (O Critério da Fé Católica)',
  (SELECT id FROM authors WHERE slug = 'o-comunitorio'),
  'Português',
  'Commonitorium (O Critério da Fé Católica) por O COMUNITÓRIO. Edição canônica integral e anotada do Scriptorium Divinum.',
  'commonitorium-vicente-de-lerins',
  'Commonitorium (O Critério da Fé Católica)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['o-comunitorio', 'commonitorium-vicente-de-lerins', 'classicos-cristaos'],
  '/texts/commonitorium-vicente-de-lerins.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Compêndio de Teologia (Compendium Theologiae)',
  (SELECT id FROM authors WHERE slug = 'compendio-de-teologia'),
  'Português',
  'Compêndio de Teologia (Compendium Theologiae) por # Compêndio de Teologia. Edição canônica integral e anotada do Scriptorium Divinum.',
  'compendio-de-teologia-tomas-de-aquino',
  'Compêndio de Teologia (Compendium Theologiae)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['compendio-de-teologia', 'compendio-de-teologia-tomas-de-aquino', 'classicos-cristaos'],
  '/texts/compendio-de-teologia-tomas-de-aquino.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Compendium theologiae ad fratrem Reginaldum (c. 1269–1272, obra inacabada: interrompe-se no tratado da esperança)',
  (SELECT id FROM authors WHERE slug = 'tomas-de-aquino-1225-1274'),
  'Português',
  'Compendium theologiae ad fratrem Reginaldum (c. 1269–1272, obra inacabada: interrompe-se no tratado da esperança) por Tomás de Aquino (1225–1274). Edição canônica integral e anotada do Scriptorium Divinum.',
  'compendium-theologiae-la',
  'Compendium theologiae ad fratrem Reginaldum (c. 1269–1272, obra inacabada: interrompe-se no tratado da esperança)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['tomas-de-aquino-1225-1274', 'compendium-theologiae-la', 'classicos-cristaos'],
  '/texts/compendium-theologiae-la.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Comunhão com Deus Pai, Filho e Espírito Santo (Of Communion with God)',
  (SELECT id FROM authors WHERE slug = 'john-owen'),
  'Português',
  'Comunhão com Deus Pai, Filho e Espírito Santo (Of Communion with God) por John Owen. Edição canônica integral e anotada do Scriptorium Divinum.',
  'comunhao-com-deus-trindade-john-owen',
  'Comunhão com Deus Pai, Filho e Espírito Santo (Of Communion with God)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Puritana e Piedade Trinitária'],
  ARRAY['john-owen', 'comunhao-com-deus-trindade-john-owen', 'classicos-cristaos'],
  '/texts/comunhao-com-deus-trindade-john-owen.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Concerning Christian Liberty (Von der Freiheit eines Christenmenschen)',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Inglês',
  'Concerning Christian Liberty (Von der Freiheit eines Christenmenschen) por Martinho Lutero. Edição canônica integral e anotada do Scriptorium Divinum.',
  'concerning-christian-liberty',
  'Concerning Christian Liberty (Von der Freiheit eines Christenmenschen)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['martinho-lutero', 'concerning-christian-liberty', 'classicos-cristaos'],
  '/texts/concerning-christian-liberty.md',
  'da-liberdade-do-cristao-martinho-lutero',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'As Conferências dos Padres (Conlationes Patrum)',
  (SELECT id FROM authors WHERE slug = 'as-conferencias-de-joao-cassiano'),
  'Português',
  'As Conferências dos Padres (Conlationes Patrum) por As Conferências de João Cassiano.. Edição canônica integral e anotada do Scriptorium Divinum.',
  'conferencias-dos-padres-joao-cassiano',
  'As Conferências dos Padres (Conlationes Patrum)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['as-conferencias-de-joao-cassiano', 'conferencias-dos-padres-joao-cassiano', 'classicos-cristaos'],
  '/texts/conferencias-dos-padres-joao-cassiano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Confissao De Fe De Westminster',
  (SELECT id FROM authors WHERE slug = 'capitulo-i-da-sagrada-escritura'),
  'Português',
  'Confissao De Fe De Westminster por Capítulo I: Da Sagrada Escritura. Edição canônica integral e anotada do Scriptorium Divinum.',
  'confissao-de-fe-de-westminster',
  'Confissao De Fe De Westminster',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['capitulo-i-da-sagrada-escritura', 'confissao-de-fe-de-westminster', 'classicos-cristaos'],
  '/texts/confissao-de-fe-de-westminster.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Confessiones (c. 397–400) — "Confissões do Grande Doutor da Igreja Santo Agostinho',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona-354-430'),
  'Português',
  'Confessiones (c. 397–400) — "Confissões do Grande Doutor da Igreja Santo Agostinho por Agostinho de Hipona (354–430). Edição canônica integral e anotada do Scriptorium Divinum.',
  'confissoes-garnier-1905-pt',
  'Confessiones (c. 397–400) — "Confissões do Grande Doutor da Igreja Santo Agostinho',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['agostinho-de-hipona-354-430', 'confissoes-garnier-1905-pt', 'classicos-cristaos'],
  '/texts/confissoes-garnier-1905-pt.md',
  'the-confessions-of-st-augustine',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'As Confissões',
  (SELECT id FROM authors WHERE slug = 'book-i'),
  'Português',
  'As Confissões por Book I. Edição canônica integral e anotada do Scriptorium Divinum.',
  'confissoes-santo-agostinho',
  'As Confissões',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['book-i', 'confissoes-santo-agostinho', 'classicos-cristaos'],
  '/texts/confissoes-santo-agostinho.md',
  'the-confessions-of-st-augustine',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Contra a Mentira (Contra Mendacium)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho'),
  'Português',
  'Contra a Mentira (Contra Mendacium) por Santo Agostinho. Edição canônica integral e anotada do Scriptorium Divinum.',
  'contra-a-mentira-agostinho',
  'Contra a Mentira (Contra Mendacium)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Teologia Moral'],
  ARRAY['santo-agostinho', 'contra-a-mentira-agostinho', 'classicos-cristaos'],
  '/texts/contra-a-mentira-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Contra as Heresias: Livro III — A Tradição Apostólica, a Sucessão Eclesiástica e os Quatro Evangelhos (Adversus Haereses)',
  (SELECT id FROM authors WHERE slug = 'santo-ireneu-de-lyon'),
  'Português',
  'Contra as Heresias: Livro III — A Tradição Apostólica, a Sucessão Eclesiástica e os Quatro Evangelhos (Adversus Haereses) por Santo Ireneu de Lyon. Edição canônica integral e anotada do Scriptorium Divinum.',
  'contra-as-heresias-livro-3-ireneu',
  'Contra as Heresias: Livro III — A Tradição Apostólica, a Sucessão Eclesiástica e os Quatro Evangelhos (Adversus Haereses)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Antiga e Apologética'],
  ARRAY['santo-ireneu-de-lyon', 'contra-as-heresias-livro-3-ireneu', 'classicos-cristaos'],
  '/texts/contra-as-heresias-livro-3-ireneu.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Contra as Heresias: Livro IV — A Unidade da Antiga e Nova Aliança na Lei e no Evangelho (Adversus Haereses)',
  (SELECT id FROM authors WHERE slug = 'santo-ireneu-de-lyon'),
  'Português',
  'Contra as Heresias: Livro IV — A Unidade da Antiga e Nova Aliança na Lei e no Evangelho (Adversus Haereses) por Santo Ireneu de Lyon. Edição canônica integral e anotada do Scriptorium Divinum.',
  'contra-as-heresias-livro-4-ireneu',
  'Contra as Heresias: Livro IV — A Unidade da Antiga e Nova Aliança na Lei e no Evangelho (Adversus Haereses)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Antiga e Apologética'],
  ARRAY['santo-ireneu-de-lyon', 'contra-as-heresias-livro-4-ireneu', 'classicos-cristaos'],
  '/texts/contra-as-heresias-livro-4-ireneu.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Contra as Heresias: Livro V — A Ressurreição da Carne e o Reino dos Justos (Adversus Haereses)',
  (SELECT id FROM authors WHERE slug = 'santo-ireneu-de-lyon'),
  'Português',
  'Contra as Heresias: Livro V — A Ressurreição da Carne e o Reino dos Justos (Adversus Haereses) por Santo Ireneu de Lyon. Edição canônica integral e anotada do Scriptorium Divinum.',
  'contra-as-heresias-livro-5-ireneu',
  'Contra as Heresias: Livro V — A Ressurreição da Carne e o Reino dos Justos (Adversus Haereses)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Antiga e Escatologia'],
  ARRAY['santo-ireneu-de-lyon', 'contra-as-heresias-livro-5-ireneu', 'classicos-cristaos'],
  '/texts/contra-as-heresias-livro-5-ireneu.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Perpétua Virgindade da Bem-Aventurada Maria: Contra Helvídio',
  (SELECT id FROM authors WHERE slug = 'sao-jeronimo'),
  'Português',
  'A Perpétua Virgindade da Bem-Aventurada Maria: Contra Helvídio por São Jerônimo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'contra-helvidio-perpetua-virgindade-de-maria-jeronimo',
  'A Perpétua Virgindade da Bem-Aventurada Maria: Contra Helvídio',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Mariologia'],
  ARRAY['sao-jeronimo', 'contra-helvidio-perpetua-virgindade-de-maria-jeronimo', 'classicos-cristaos'],
  '/texts/contra-helvidio-perpetua-virgindade-de-maria-jeronimo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Contra Práxeas (Adversus Praxean)',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Contra Práxeas (Adversus Praxean) por Tertuliano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'contra-praxeas-tertuliano',
  'Contra Práxeas (Adversus Praxean)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Teologia Trinitária'],
  ARRAY['tertuliano', 'contra-praxeas-tertuliano', 'classicos-cristaos'],
  '/texts/contra-praxeas-tertuliano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Os Credos Ecumênicos — Credo Apostólico, Credo Niceno-Constantinopolitano (381), Definição de Calcedônia (451) e Credo Atanasiano (_Quicunque vult_)',
  (SELECT id FROM authors WHERE slug = 'igreja-antiga-textos-conciliares-e-liturgicos-seculos-iv-a-vi'),
  'Português',
  'Os Credos Ecumênicos — Credo Apostólico, Credo Niceno-Constantinopolitano (381), Definição de Calcedônia (451) e Credo Atanasiano (_Quicunque vult_) por Igreja antiga (textos conciliares e litúrgicos, séculos IV a VI). Edição canônica integral e anotada do Scriptorium Divinum.',
  'credos-ecumenicos',
  'Os Credos Ecumênicos — Credo Apostólico, Credo Niceno-Constantinopolitano (381), Definição de Calcedônia (451) e Credo Atanasiano (_Quicunque vult_)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['igreja-antiga-textos-conciliares-e-liturgicos-seculos-iv-a-vi', 'credos-ecumenicos', 'classicos-cristaos'],
  '/texts/credos-ecumenicos.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Cur Deus Homo: Por que Deus se Fez Homem',
  (SELECT id FROM authors WHERE slug = 'santo-anselmo-de-cantuaria'),
  'Inglês',
  'Cur Deus Homo: Por que Deus se Fez Homem por Santo Anselmo de Cantuária. Edição canônica integral e anotada do Scriptorium Divinum.',
  'cur-deus-homo-anselmo',
  'Cur Deus Homo: Por que Deus se Fez Homem',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Escolástica e Cristologia'],
  ARRAY['santo-anselmo-de-cantuaria', 'cur-deus-homo-anselmo', 'classicos-cristaos'],
  '/texts/cur-deus-homo-anselmo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Continência (De Continentia)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho'),
  'Português',
  'Da Continência (De Continentia) por Santo Agostinho. Edição canônica integral e anotada do Scriptorium Divinum.',
  'da-continencia-agostinho',
  'Da Continência (De Continentia)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['santo-agostinho', 'da-continencia-agostinho', 'classicos-cristaos'],
  '/texts/da-continencia-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Fé nas Coisas Invisíveis (De Fide Rerum Quae Non Videntur)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho'),
  'Português',
  'Da Fé nas Coisas Invisíveis (De Fide Rerum Quae Non Videntur) por Santo Agostinho. Edição canônica integral e anotada do Scriptorium Divinum.',
  'da-fe-nas-coisas-invisiveis-agostinho',
  'Da Fé nas Coisas Invisíveis (De Fide Rerum Quae Non Videntur)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Apologética'],
  ARRAY['santo-agostinho', 'da-fe-nas-coisas-invisiveis-agostinho', 'classicos-cristaos'],
  '/texts/da-fe-nas-coisas-invisiveis-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Idolatria (De Idololatria)',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Sobre a Idolatria (De Idololatria) por Tertuliano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'da-idolatria-tertuliano',
  'Sobre a Idolatria (De Idololatria)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Apologética'],
  ARRAY['tertuliano', 'da-idolatria-tertuliano', 'classicos-cristaos'],
  '/texts/da-idolatria-tertuliano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Liberdade do Cristão',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'Da Liberdade do Cristão por Martinho Lutero. Edição canônica integral e anotada do Scriptorium Divinum.',
  'da-liberdade-do-cristao-martinho-lutero',
  'Da Liberdade do Cristão',
  2026,
  'Scriptorium Divinum',
  ARRAY['de'],
  ARRAY['Reforma Protestante / Teologia Espiritual'],
  ARRAY['martinho-lutero', 'da-liberdade-do-cristao-martinho-lutero', 'classicos-cristaos'],
  '/texts/da-liberdade-do-cristao-martinho-lutero.md',
  'concerning-christian-liberty',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Liberdade do Cristão',
  (SELECT id FROM authors WHERE slug = 'a-respeito-da-liberdade-crista'),
  'Português',
  'Da Liberdade do Cristão por # A respeito da liberdade cristã. Edição canônica integral e anotada do Scriptorium Divinum.',
  'da-liberdade-do-cristao',
  'Da Liberdade do Cristão',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['a-respeito-da-liberdade-crista', 'da-liberdade-do-cristao', 'classicos-cristaos'],
  '/texts/da-liberdade-do-cristao.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Maneira de Orar e Meditar (De Modo Orandi et Meditandi)',
  (SELECT id FROM authors WHERE slug = 'hugo-de-sao-vitor'),
  'Português',
  'Da Maneira de Orar e Meditar (De Modo Orandi et Meditandi) por Hugo de São Vítor. Edição canônica integral e anotada do Scriptorium Divinum.',
  'da-maneira-de-orar-e-meditar-hugo-sao-vitor',
  'Da Maneira de Orar e Meditar (De Modo Orandi et Meditandi)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Vida Interior e Teologia Mística'],
  ARRAY['hugo-de-sao-vitor', 'da-maneira-de-orar-e-meditar-hugo-sao-vitor', 'classicos-cristaos'],
  '/texts/da-maneira-de-orar-e-meditar-hugo-sao-vitor.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Mentira (De Mendacio)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho'),
  'Português',
  'Da Mentira (De Mendacio) por Santo Agostinho. Edição canônica integral e anotada do Scriptorium Divinum.',
  'da-mentira-agostinho',
  'Da Mentira (De Mendacio)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Teologia Moral'],
  ARRAY['santo-agostinho', 'da-mentira-agostinho', 'classicos-cristaos'],
  '/texts/da-mentira-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Natureza do Bem (De Natura Boni)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho'),
  'Português',
  'Da Natureza do Bem (De Natura Boni) por Santo Agostinho. Edição canônica integral e anotada do Scriptorium Divinum.',
  'da-natureza-do-bem-agostinho',
  'Da Natureza do Bem (De Natura Boni)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Metafísica Cristã'],
  ARRAY['santo-agostinho', 'da-natureza-do-bem-agostinho', 'classicos-cristaos'],
  '/texts/da-natureza-do-bem-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Oração e da Vida Contemplativa',
  (SELECT id FROM authors WHERE slug = 'prefacio'),
  'Português',
  'Da Oração e da Vida Contemplativa por Prefácio. Edição canônica integral e anotada do Scriptorium Divinum.',
  'da-oracao-e-vida-contemplativa-tomas-de-aquino',
  'Da Oração e da Vida Contemplativa',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['prefacio', 'da-oracao-e-vida-contemplativa-tomas-de-aquino', 'classicos-cristaos'],
  '/texts/da-oracao-e-vida-contemplativa-tomas-de-aquino.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Paciência (De Patientia)',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Da Paciência (De Patientia) por Tertuliano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'da-paciencia-tertuliano',
  'Da Paciência (De Patientia)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['tertuliano', 'da-paciencia-tertuliano', 'classicos-cristaos'],
  '/texts/da-paciencia-tertuliano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Da Santa Virgindade (De Sancta Virginitate)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho'),
  'Português',
  'Da Santa Virgindade (De Sancta Virginitate) por Santo Agostinho. Edição canônica integral e anotada do Scriptorium Divinum.',
  'da-santa-virgindade-agostinho',
  'Da Santa Virgindade (De Sancta Virginitate)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Ascetismo'],
  ARRAY['santo-agostinho', 'da-santa-virgindade-agostinho', 'classicos-cristaos'],
  '/texts/da-santa-virgindade-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'De Magistro',
  (SELECT id FROM authors WHERE slug = 'nota-introdutoria'),
  'Português',
  'De Magistro por Nota Introdutória. Edição canônica integral e anotada do Scriptorium Divinum.',
  'de-magistro',
  'De Magistro',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['nota-introdutoria', 'de-magistro', 'classicos-cristaos'],
  '/texts/de-magistro.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Demonstração da Pregação Apostólica (Epideixis tou apostolikou kerygmatos)',
  (SELECT id FROM authors WHERE slug = 'santo-ireneu-de-lyon'),
  'Português',
  'Demonstração da Pregação Apostólica (Epideixis tou apostolikou kerygmatos) por Santo Ireneu de Lyon. Edição canônica integral e anotada do Scriptorium Divinum.',
  'demonstracao-da-pregacao-apostolica',
  'Demonstração da Pregação Apostólica (Epideixis tou apostolikou kerygmatos)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Grega e Apologética'],
  ARRAY['santo-ireneu-de-lyon', 'demonstracao-da-pregacao-apostolica', 'classicos-cristaos'],
  '/texts/demonstracao-da-pregacao-apostolica.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Devoções para Ocasiões Emergentes (Devotions upon Emergent Occasions)',
  (SELECT id FROM authors WHERE slug = 'john-donne'),
  'Português',
  'Devoções para Ocasiões Emergentes (Devotions upon Emergent Occasions) por John Donne. Edição canônica integral e anotada do Scriptorium Divinum.',
  'devocoes-para-ocasioes-emergentes-donne',
  'Devoções para Ocasiões Emergentes (Devotions upon Emergent Occasions)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Espiritualidade Anglicana e Poesia Metafísica'],
  ARRAY['john-donne', 'devocoes-para-ocasioes-emergentes-donne', 'classicos-cristaos'],
  '/texts/devocoes-para-ocasioes-emergentes-donne.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Diálogo contra os Luciferianos (Dialogus contra Luciferianos)',
  (SELECT id FROM authors WHERE slug = 'sao-jeronimo'),
  'Português',
  'Diálogo contra os Luciferianos (Dialogus contra Luciferianos) por São Jerônimo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'dialogo-contra-os-luciferianos-jeronimo',
  'Diálogo contra os Luciferianos (Dialogus contra Luciferianos)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Eclesiologia'],
  ARRAY['sao-jeronimo', 'dialogo-contra-os-luciferianos-jeronimo', 'classicos-cristaos'],
  '/texts/dialogo-contra-os-luciferianos-jeronimo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Diálogos sobre os Padres do Deserto e São Martinho de Tours',
  (SELECT id FROM authors WHERE slug = 'sulpicio-severo'),
  'Português',
  'Diálogos sobre os Padres do Deserto e São Martinho de Tours por Sulpício Severo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'dialogos-sobre-sao-martinho-sulpicio-severo',
  'Diálogos sobre os Padres do Deserto e São Martinho de Tours',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Hagiografia / Diálogos / Monaquismo Comparado'],
  ARRAY['sulpicio-severo', 'dialogos-sobre-sao-martinho-sulpicio-severo', 'classicos-cristaos'],
  '/texts/dialogos-sobre-sao-martinho-sulpicio-severo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Didaquê (O Ensino dos Doze Apóstolos)',
  (SELECT id FROM authors WHERE slug = 'introducao'),
  'Português',
  'Didaquê (O Ensino dos Doze Apóstolos) por Introdução. Edição canônica integral e anotada do Scriptorium Divinum.',
  'didaque-doutrina-dos-doze-apostolos',
  'Didaquê (O Ensino dos Doze Apóstolos)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['introducao', 'didaque-doutrina-dos-doze-apostolos', 'classicos-cristaos'],
  '/texts/didaque-doutrina-dos-doze-apostolos.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Didaquê: O Ensino dos Doze Apóstolos (Διδαχὴ τῶν δώδεκα ἀποστόλων / *Didache*)',
  (SELECT id FROM authors WHERE slug = 'igreja-antiga-documento-de-instrucao-catequetica-e-eclesiastica-final-do-sec-i-ou-inicio-do-sec-ii'),
  'Português',
  'Didaquê: O Ensino dos Doze Apóstolos (Διδαχὴ τῶν δώδεκα ἀποστόλων / *Didache*) por Igreja Antiga (documento de instrução catequética e eclesiástica, final do séc. I ou início do séc. II). Edição canônica integral e anotada do Scriptorium Divinum.',
  'didaque',
  'Didaquê: O Ensino dos Doze Apóstolos (Διδαχὴ τῶν δώδεκα ἀποστόλων / *Didache*)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['igreja-antiga-documento-de-instrucao-catequetica-e-eclesiastica-final-do-sec-i-ou-inicio-do-sec-ii', 'didaque', 'classicos-cristaos'],
  '/texts/didaque.md',
  'the-teaching-of-the-twelve-apostles-didache',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Didascalicon: Da Arte de Ler (De Studio Legendi)',
  (SELECT id FROM authors WHERE slug = 'hugo-de-sao-vitor'),
  'Português',
  'Didascalicon: Da Arte de Ler (De Studio Legendi) por Hugo de São Vítor. Edição canônica integral e anotada do Scriptorium Divinum.',
  'didascalicon-hugo-de-sao-vitor',
  'Didascalicon: Da Arte de Ler (De Studio Legendi)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Educação Cristã e Filosofia Medieval'],
  ARRAY['hugo-de-sao-vitor', 'didascalicon-hugo-de-sao-vitor', 'classicos-cristaos'],
  '/texts/didascalicon-hugo-de-sao-vitor.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Discurso aos Gregos: Apologia contra os Filósofos Pagãos (Oratio ad Graecos)',
  (SELECT id FROM authors WHERE slug = 'taciano-o-sirio'),
  'Português',
  'Discurso aos Gregos: Apologia contra os Filósofos Pagãos (Oratio ad Graecos) por Taciano o Sírio. Edição canônica integral e anotada do Scriptorium Divinum.',
  'discurso-aos-gregos-taciano',
  'Discurso aos Gregos: Apologia contra os Filósofos Pagãos (Oratio ad Graecos)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Antiga e Apologética'],
  ARRAY['taciano-o-sirio', 'discurso-aos-gregos-taciano', 'classicos-cristaos'],
  '/texts/discurso-aos-gregos-taciano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Segundo Discurso sobre a Páscoa (Oração 45)',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-nazianzeno'),
  'Português',
  'Segundo Discurso sobre a Páscoa (Oração 45) por São Gregório Nazianzeno. Edição canônica integral e anotada do Scriptorium Divinum.',
  'discurso-sobre-a-pascoa-gregorio-nazianzo',
  'Segundo Discurso sobre a Páscoa (Oração 45)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Homilética e Dogmática / Teologia Pascal e Trinitária'],
  ARRAY['sao-gregorio-nazianzeno', 'discurso-sobre-a-pascoa-gregorio-nazianzo', 'classicos-cristaos'],
  '/texts/discurso-sobre-a-pascoa-gregorio-nazianzo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Os Cinco Discursos Teológicos (Sobre a Trindade e o Espírito Santo)',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nazianzo'),
  'Português',
  'Os Cinco Discursos Teológicos (Sobre a Trindade e o Espírito Santo) por São Gregório de Nazianzo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'discursos-teologicos-gregorio-de-nazianzo',
  'Os Cinco Discursos Teológicos (Sobre a Trindade e o Espírito Santo)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Teologia Trinitária / Pneumatologia Niceno-Constantinopolitana / Teologia Dogmática'],
  ARRAY['sao-gregorio-de-nazianzo', 'discursos-teologicos-gregorio-de-nazianzo', 'classicos-cristaos'],
  '/texts/discursos-teologicos-gregorio-de-nazianzo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Do Amor de Deus',
  (SELECT id FROM authors WHERE slug = 'sao-bernardo-de-claraval'),
  'Inglês',
  'Do Amor de Deus por São Bernardo de Claraval. Edição canônica integral e anotada do Scriptorium Divinum.',
  'do-amor-de-deus-bernardo-de-claraval',
  'Do Amor de Deus',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Vida Interior e Teologia Mística'],
  ARRAY['sao-bernardo-de-claraval', 'do-amor-de-deus-bernardo-de-claraval', 'classicos-cristaos'],
  '/texts/do-amor-de-deus-bernardo-de-claraval.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Do Bem da Viuvez (De Bono Viduitatis)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho'),
  'Português',
  'Do Bem da Viuvez (De Bono Viduitatis) por Santo Agostinho. Edição canônica integral e anotada do Scriptorium Divinum.',
  'do-bem-da-viuvez-agostinho',
  'Do Bem da Viuvez (De Bono Viduitatis)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['santo-agostinho', 'do-bem-da-viuvez-agostinho', 'classicos-cristaos'],
  '/texts/do-bem-da-viuvez-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Do Bem do Matrimônio (De Bono Coniugali)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho'),
  'Português',
  'Do Bem do Matrimônio (De Bono Coniugali) por Santo Agostinho. Edição canônica integral e anotada do Scriptorium Divinum.',
  'do-bem-do-matrimonio-agostinho',
  'Do Bem do Matrimônio (De Bono Coniugali)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Teologia da Família'],
  ARRAY['santo-agostinho', 'do-bem-do-matrimonio-agostinho', 'classicos-cristaos'],
  '/texts/do-bem-do-matrimonio-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Do Cuidado Devido aos Mortos (De Cura pro Mortuis Gerenda)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho'),
  'Português',
  'Do Cuidado Devido aos Mortos (De Cura pro Mortuis Gerenda) por Santo Agostinho. Edição canônica integral e anotada do Scriptorium Divinum.',
  'do-cuidado-devido-aos-mortos-agostinho',
  'Do Cuidado Devido aos Mortos (De Cura pro Mortuis Gerenda)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Escatologia'],
  ARRAY['santo-agostinho', 'do-cuidado-devido-aos-mortos-agostinho', 'classicos-cristaos'],
  '/texts/do-cuidado-devido-aos-mortos-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Do Trabalho dos Monges (De Opere Monachorum)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho'),
  'Português',
  'Do Trabalho dos Monges (De Opere Monachorum) por Santo Agostinho. Edição canônica integral e anotada do Scriptorium Divinum.',
  'do-trabalho-dos-monges-agostinho',
  'Do Trabalho dos Monges (De Opere Monachorum)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Monasticismo'],
  ARRAY['santo-agostinho', 'do-trabalho-dos-monges-agostinho', 'classicos-cristaos'],
  '/texts/do-trabalho-dos-monges-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Dos Espetáculos (De Spectaculis)',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Dos Espetáculos (De Spectaculis) por Tertuliano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'dos-espetaculos-tertuliano',
  'Dos Espetáculos (De Spectaculis)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['tertuliano', 'dos-espetaculos-tertuliano', 'classicos-cristaos'],
  '/texts/dos-espetaculos-tertuliano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Enquirídio sobre a Fé, a Esperança e o Amor',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho'),
  'Inglês',
  'Enquirídio sobre a Fé, a Esperança e o Amor por Santo Agostinho. Edição canônica integral e anotada do Scriptorium Divinum.',
  'enchiridion-agostinho',
  'Enquirídio sobre a Fé, a Esperança e o Amor',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística e Teologia Dogmática'],
  ARRAY['santo-agostinho', 'enchiridion-agostinho', 'classicos-cristaos'],
  '/texts/enchiridion-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Epistola E Martirio De Policarpo',
  (SELECT id FROM authors WHERE slug = 'parte-i-epistola-de-policarpo-aos-filipenses-c-110-d-c'),
  'Português',
  'Epistola E Martirio De Policarpo por Parte I: Epístola de Policarpo aos Filipenses (c. 110 d.C.). Edição canônica integral e anotada do Scriptorium Divinum.',
  'epistola-e-martirio-de-policarpo',
  'Epistola E Martirio De Policarpo',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['parte-i-epistola-de-policarpo-aos-filipenses-c-110-d-c', 'epistola-e-martirio-de-policarpo', 'classicos-cristaos'],
  '/texts/epistola-e-martirio-de-policarpo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Exortação ao Martírio (Exhortatio ad Martyrium)',
  (SELECT id FROM authors WHERE slug = 'sao-cipriano-de-cartago'),
  'Português',
  'Exortação ao Martírio (Exhortatio ad Martyrium) por São Cipriano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'exortacao-ao-martirio-cipriano',
  'Exortação ao Martírio (Exhortatio ad Martyrium)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Espiritualidade do Martírio'],
  ARRAY['sao-cipriano-de-cartago', 'exortacao-ao-martirio-cipriano', 'classicos-cristaos'],
  '/texts/exortacao-ao-martirio-cipriano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Exposição da Fé Ortodoxa (De Fide Orthodoxa)',
  (SELECT id FROM authors WHERE slug = 'sao-joao-damasceno'),
  'Português',
  'Exposição da Fé Ortodoxa (De Fide Orthodoxa) por São João Damasceno. Edição canônica integral e anotada do Scriptorium Divinum.',
  'exposicao-da-fe-ortodoxa-damasceno',
  'Exposição da Fé Ortodoxa (De Fide Orthodoxa)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Oriental e Teologia Dogmática'],
  ARRAY['sao-joao-damasceno', 'exposicao-da-fe-ortodoxa-damasceno', 'classicos-cristaos'],
  '/texts/exposicao-da-fe-ortodoxa-damasceno.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Exposição Exata da Fé Ortodoxa - Parte 1',
  (SELECT id FROM authors WHERE slug = 'sao-joao-damasceno'),
  'Português',
  'Exposição Exata da Fé Ortodoxa - Parte 1 por São João Damasceno. Edição canônica integral e anotada do Scriptorium Divinum.',
  'exposicao-da-fe-ortodoxa-parte-1-joao-damasceno',
  'Exposição Exata da Fé Ortodoxa - Parte 1',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Teologia Dogmática / Teologia Trinitária / Cosmogonia e Antropologia Patrística'],
  ARRAY['sao-joao-damasceno', 'exposicao-da-fe-ortodoxa-parte-1-joao-damasceno', 'classicos-cristaos'],
  '/texts/exposicao-da-fe-ortodoxa-parte-1-joao-damasceno.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Exposição Exata da Fé Ortodoxa - Parte 2',
  (SELECT id FROM authors WHERE slug = 'sao-joao-damasceno'),
  'Português',
  'Exposição Exata da Fé Ortodoxa - Parte 2 por São João Damasceno. Edição canônica integral e anotada do Scriptorium Divinum.',
  'exposicao-da-fe-ortodoxa-parte-2-joao-damasceno',
  'Exposição Exata da Fé Ortodoxa - Parte 2',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Teologia Dogmática / Cristologia Calcedoniana / Sacramentologia e Teologia dos Ícones'],
  ARRAY['sao-joao-damasceno', 'exposicao-da-fe-ortodoxa-parte-2-joao-damasceno', 'classicos-cristaos'],
  '/texts/exposicao-da-fe-ortodoxa-parte-2-joao-damasceno.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Exposição do Símbolo dos Apóstolos (Commentarius in Symbolum Apostolorum)',
  (SELECT id FROM authors WHERE slug = 'rufino-de-aquileia'),
  'Português',
  'Exposição do Símbolo dos Apóstolos (Commentarius in Symbolum Apostolorum) por Rufino de Aquileia. Edição canônica integral e anotada do Scriptorium Divinum.',
  'exposicao-do-simbolo-dos-apostolos-rufino',
  'Exposição do Símbolo dos Apóstolos (Commentarius in Symbolum Apostolorum)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Dogmática'],
  ARRAY['rufino-de-aquileia', 'exposicao-do-simbolo-dos-apostolos-rufino', 'classicos-cristaos'],
  '/texts/exposicao-do-simbolo-dos-apostolos-rufino.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Graça Abundante ao Principal dos Pecadores',
  (SELECT id FROM authors WHERE slug = 'john-bunyan'),
  'Inglês',
  'Graça Abundante ao Principal dos Pecadores por John Bunyan. Edição canônica integral e anotada do Scriptorium Divinum.',
  'graca-abundante-john-bunyan',
  'Graça Abundante ao Principal dos Pecadores',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Autobiografia Espiritual e Teologia Puritana'],
  ARRAY['john-bunyan', 'graca-abundante-john-bunyan', 'classicos-cristaos'],
  '/texts/graca-abundante-john-bunyan.md',
  'grace-abounding-to-the-chief-of-sinners',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Grace Abounding to the Chief of Sinners (Grace Abounding to the Chief of Sinners)',
  (SELECT id FROM authors WHERE slug = 'john-bunyan'),
  'Português',
  'Grace Abounding to the Chief of Sinners (Grace Abounding to the Chief of Sinners) por John Bunyan. Edição canônica integral e anotada do Scriptorium Divinum.',
  'grace-abounding-to-the-chief-of-sinners',
  'Grace Abounding to the Chief of Sinners (Grace Abounding to the Chief of Sinners)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['john-bunyan', 'grace-abounding-to-the-chief-of-sinners', 'classicos-cristaos'],
  '/texts/grace-abounding-to-the-chief-of-sinners.md',
  'graca-abundante-john-bunyan',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Guia De Pecadores Luis De Granada',
  (SELECT id FROM authors WHERE slug = 'prologo-a-quem-esta-obra-se-dirige'),
  'Português',
  'Guia De Pecadores Luis De Granada por Prólogo — A Quem Esta Obra Se Dirige. Edição canônica integral e anotada do Scriptorium Divinum.',
  'guia-de-pecadores-luis-de-granada',
  'Guia De Pecadores Luis De Granada',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['prologo-a-quem-esta-obra-se-dirige', 'guia-de-pecadores-luis-de-granada', 'classicos-cristaos'],
  '/texts/guia-de-pecadores-luis-de-granada.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Hexaemeron: Homilias sobre os Seis Dias da Criação',
  (SELECT id FROM authors WHERE slug = 'sao-basilio-magno'),
  'Português',
  'Hexaemeron: Homilias sobre os Seis Dias da Criação por São Basílio Magno. Edição canônica integral e anotada do Scriptorium Divinum.',
  'hexaemeron-homilias-sobre-a-criacao-basilio-magno',
  'Hexaemeron: Homilias sobre os Seis Dias da Criação',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Cosmologia Teológica / Exegese do Gênesis / Filosofia Cristã da Criação'],
  ARRAY['sao-basilio-magno', 'hexaemeron-homilias-sobre-a-criacao-basilio-magno', 'classicos-cristaos'],
  '/texts/hexaemeron-homilias-sobre-a-criacao-basilio-magno.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Hinos do Amor Divino (Hymni de Divino Amore)',
  (SELECT id FROM authors WHERE slug = 'sao-simeao-o-novo-teologo'),
  'Português',
  'Hinos do Amor Divino (Hymni de Divino Amore) por São Simeão, o Novo Teólogo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'hinos-do-amor-divino-simeao-novo-teologo',
  'Hinos do Amor Divino (Hymni de Divino Amore)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Bizantina e Teologia Mística'],
  ARRAY['sao-simeao-o-novo-teologo', 'hinos-do-amor-divino-simeao-novo-teologo', 'classicos-cristaos'],
  '/texts/hinos-do-amor-divino-simeao-novo-teologo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Hinos Sobre A Natividade Efrem Siria',
  (SELECT id FROM authors WHERE slug = 'nota-introdutoria'),
  'Português',
  'Hinos Sobre A Natividade Efrem Siria por Nota Introdutória. Edição canônica integral e anotada do Scriptorium Divinum.',
  'hinos-sobre-a-natividade-efrem-siria',
  'Hinos Sobre A Natividade Efrem Siria',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['nota-introdutoria', 'hinos-sobre-a-natividade-efrem-siria', 'classicos-cristaos'],
  '/texts/hinos-sobre-a-natividade-efrem-siria.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'História Eclesiástica (Historia Ecclesiastica — 10 Livros)',
  (SELECT id FROM authors WHERE slug = 'eusebio-de-cesareia'),
  'Português',
  'História Eclesiástica (Historia Ecclesiastica — 10 Livros) por Eusébio de Cesareia. Edição canônica integral e anotada do Scriptorium Divinum.',
  'historia-eclesiastica-eusebio-de-cesareia',
  'História Eclesiástica (Historia Ecclesiastica — 10 Livros)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Historiografia Cristã e Patrística Grega'],
  ARRAY['eusebio-de-cesareia', 'historia-eclesiastica-eusebio-de-cesareia', 'classicos-cristaos'],
  '/texts/historia-eclesiastica-eusebio-de-cesareia.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias e Escritos Espirituais',
  (SELECT id FROM authors WHERE slug = 'folhas-de-sao-joao-crisostomo'),
  'Português',
  'Homilias e Escritos Espirituais por # Folhas de São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-e-escritos-espirituais-crisostomo',
  'Homilias e Escritos Espirituais',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['folhas-de-sao-joao-crisostomo', 'homilias-e-escritos-espirituais-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-e-escritos-espirituais-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre o Sermão da Montanha: Exposição Exegética e Pastoral de Mateus 5 a 7',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Homilias sobre o Sermão da Montanha: Exposição Exegética e Pastoral de Mateus 5 a 7 por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-sermao-da-montanha-crisostomo',
  'Homilias sobre o Sermão da Montanha: Exposição Exegética e Pastoral de Mateus 5 a 7',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Grega e Exegese Bíblica'],
  ARRAY['sao-joao-crisostomo', 'homilias-sermao-da-montanha-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sermao-da-montanha-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre as Estátuas ao Povo de Antioquia - Parte 1',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Homilias sobre as Estátuas ao Povo de Antioquia - Parte 1 por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-sobre-as-estatuas-parte-1-joao-crisostomo',
  'Homilias sobre as Estátuas ao Povo de Antioquia - Parte 1',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Homilética Patrística / Oratória Sagrada / Teologia Pastoral em Época de Calamidade'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-as-estatuas-parte-1-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-as-estatuas-parte-1-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre as Estátuas ao Povo de Antioquia - Parte 2',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Homilias sobre as Estátuas ao Povo de Antioquia - Parte 2 por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-sobre-as-estatuas-parte-2-joao-crisostomo',
  'Homilias sobre as Estátuas ao Povo de Antioquia - Parte 2',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Homilética Patrística / Oratória Sagrada / Teologia Pastoral em Época de Calamidade'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-as-estatuas-parte-2-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-as-estatuas-parte-2-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Epístola aos Colossenses',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Homilias sobre a Epístola aos Colossenses por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-sobre-colossenses-joao-crisostomo',
  'Homilias sobre a Epístola aos Colossenses',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Cristologia Paulina / Vida Mística'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-colossenses-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-colossenses-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Epístola aos Efésios',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Homilias sobre a Epístola aos Efésios por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-sobre-efesios-joao-crisostomo',
  'Homilias sobre a Epístola aos Efésios',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Eclesiologia / Teologia Dogmática e Moral'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-efesios-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-efesios-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Epístola a Filemom',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Homilias sobre a Epístola a Filemom por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-sobre-filemom-joao-crisostomo',
  'Homilias sobre a Epístola a Filemom',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Teologia Moral / Fraternidade Evangélica'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-filemom-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-filemom-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Epístola aos Filipenses',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Homilias sobre a Epístola aos Filipenses por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-sobre-filipenses-joao-crisostomo',
  'Homilias sobre a Epístola aos Filipenses',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Cristologia / Espiritualidade e Alegria Cristã'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-filipenses-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-filipenses-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Epístola aos Hebreus - Parte 1 (Homilias 1 a 17)',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Homilias sobre a Epístola aos Hebreus - Parte 1 (Homilias 1 a 17) por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-sobre-hebreus-parte-1-joao-crisostomo',
  'Homilias sobre a Epístola aos Hebreus - Parte 1 (Homilias 1 a 17)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Cristologia Sacerdotal / Teologia da Aliança'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-hebreus-parte-1-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-hebreus-parte-1-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Epístola aos Hebreus - Parte 2 (Homilias 18 a 34)',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Homilias sobre a Epístola aos Hebreus - Parte 2 (Homilias 18 a 34) por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-sobre-hebreus-parte-2-joao-crisostomo',
  'Homilias sobre a Epístola aos Hebreus - Parte 2 (Homilias 18 a 34)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Teologia Sacrificial / A Galeria da Fé e Perseverança'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-hebreus-parte-2-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-hebreus-parte-2-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Primeira Epístola aos Tessalonicenses',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Homilias sobre a Primeira Epístola aos Tessalonicenses por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-sobre-primeira-tessalonicenses-joao-crisostomo',
  'Homilias sobre a Primeira Epístola aos Tessalonicenses',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Teologia Paulina / Esperança e Ressurreição'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-primeira-tessalonicenses-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-primeira-tessalonicenses-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Primeira Epístola a Timóteo',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Homilias sobre a Primeira Epístola a Timóteo por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-sobre-primeira-timoteo-joao-crisostomo',
  'Homilias sobre a Primeira Epístola a Timóteo',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Teologia Pastoral / Ordem e Disciplina Eclesial'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-primeira-timoteo-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-primeira-timoteo-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Segunda Epístola aos Tessalonicenses',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Homilias sobre a Segunda Epístola aos Tessalonicenses por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-sobre-segunda-tessalonicenses-joao-crisostomo',
  'Homilias sobre a Segunda Epístola aos Tessalonicenses',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Escatologia Bíblica / Parusia e Fidelidade'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-segunda-tessalonicenses-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-segunda-tessalonicenses-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Segunda Epístola a Timóteo',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Homilias sobre a Segunda Epístola a Timóteo por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-sobre-segunda-timoteo-joao-crisostomo',
  'Homilias sobre a Segunda Epístola a Timóteo',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Teologia Pastoral / O Bom Combate da Fé'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-segunda-timoteo-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-segunda-timoteo-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre a Epístola a Tito',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Homilias sobre a Epístola a Tito por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'homilias-sobre-tito-joao-crisostomo',
  'Homilias sobre a Epístola a Tito',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Exegese Bíblica / Teologia Pastoral / Homilética Patrística'],
  ARRAY['sao-joao-crisostomo', 'homilias-sobre-tito-joao-crisostomo', 'classicos-cristaos'],
  '/texts/homilias-sobre-tito-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Imitação de Cristo (*De Imitatione Christi*)',
  (SELECT id FROM authors WHERE slug = 'tomas-de-kempis-c-1380-1471'),
  'Português',
  'Imitação de Cristo (*De Imitatione Christi*) por Tomás de Kempis (c. 1380–1471). Edição canônica integral e anotada do Scriptorium Divinum.',
  'imitacao-de-cristo-pt',
  'Imitação de Cristo (*De Imitatione Christi*)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['tomas-de-kempis-c-1380-1471', 'imitacao-de-cristo-pt', 'classicos-cristaos'],
  '/texts/imitacao-de-cristo-pt.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Imitação de Cristo (*De Imitatione Christi*)',
  (SELECT id FROM authors WHERE slug = 'tomas-de-kempis-c-1380-1471'),
  'Português',
  'Imitação de Cristo (*De Imitatione Christi*) por Tomás de Kempis (c. 1380–1471). Edição canônica integral e anotada do Scriptorium Divinum.',
  'imitacao-de-cristo',
  'Imitação de Cristo (*De Imitatione Christi*)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['tomas-de-kempis-c-1380-1471', 'imitacao-de-cristo', 'classicos-cristaos'],
  '/texts/imitacao-de-cristo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Institutio Christianae Religionis (edição latina final de 1559) — edição inglesa "Institutes of the Christian Religion", em dois volumes',
  (SELECT id FROM authors WHERE slug = 'joao-calvino-1509-1564'),
  'Inglês',
  'Institutio Christianae Religionis (edição latina final de 1559) — edição inglesa "Institutes of the Christian Religion", em dois volumes por João Calvino (1509–1564). Edição canônica integral e anotada do Scriptorium Divinum.',
  'institutas-da-religiao-crista-en',
  'Institutio Christianae Religionis (edição latina final de 1559) — edição inglesa "Institutes of the Christian Religion", em dois volumes',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['joao-calvino-1509-1564', 'institutas-da-religiao-crista-en', 'classicos-cristaos'],
  '/texts/institutas-da-religiao-crista-en.md',
  'institutas-da-religiao-crista',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'As Institutas da Religião Cristã',
  (SELECT id FROM authors WHERE slug = 'joao-calvino'),
  'Português',
  'As Institutas da Religião Cristã por João Calvino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'institutas-da-religiao-crista',
  'As Institutas da Religião Cristã',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Sistemática e Reforma'],
  ARRAY['joao-calvino', 'institutas-da-religiao-crista', 'classicos-cristaos'],
  '/texts/institutas-da-religiao-crista.md',
  'institutas-da-religiao-crista-en',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Instrucoes Espirituais Doroteu De Gaza',
  (SELECT id FROM authors WHERE slug = 'instrucao-i-sobre-a-renuncia-ao-mundo'),
  'Português',
  'Instrucoes Espirituais Doroteu De Gaza por Instrução I — Sobre a Renúncia ao Mundo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'instrucoes-espirituais-doroteu-de-gaza',
  'Instrucoes Espirituais Doroteu De Gaza',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['instrucao-i-sobre-a-renuncia-ao-mundo', 'instrucoes-espirituais-doroteu-de-gaza', 'classicos-cristaos'],
  '/texts/instrucoes-espirituais-doroteu-de-gaza.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Introdução à Vida Devota',
  (SELECT id FROM authors WHERE slug = 'tradicao-classica-crista'),
  'Português',
  'Introdução à Vida Devota por Tradição Clássica Cristã. Edição canônica integral e anotada do Scriptorium Divinum.',
  'introducao-a-vida-devota-francisco-de-sales',
  'Introdução à Vida Devota',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['tradicao-classica-crista', 'introducao-a-vida-devota-francisco-de-sales', 'classicos-cristaos'],
  '/texts/introducao-a-vida-devota-francisco-de-sales.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Itinerário da Mente para Deus (Itinerarium Mentis in Deum)',
  (SELECT id FROM authors WHERE slug = 'sao-boaventura'),
  'Português',
  'Itinerário da Mente para Deus (Itinerarium Mentis in Deum) por São Boaventura. Edição canônica integral e anotada do Scriptorium Divinum.',
  'itinerario-da-mente-para-deus-boaventura',
  'Itinerário da Mente para Deus (Itinerarium Mentis in Deum)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Mística e Teologia Franciscana Escolástica'],
  ARRAY['sao-boaventura', 'itinerario-da-mente-para-deus-boaventura', 'classicos-cristaos'],
  '/texts/itinerario-da-mente-para-deus-boaventura.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Leaves from St. John Chrysostom (Leaves from St. John Chrysostom)',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Inglês',
  'Leaves from St. John Chrysostom (Leaves from St. John Chrysostom) por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'leaves-from-st-john-chrysostom',
  'Leaves from St. John Chrysostom (Leaves from St. John Chrysostom)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['sao-joao-crisostomo', 'leaves-from-st-john-chrysostom', 'classicos-cristaos'],
  '/texts/leaves-from-st-john-chrysostom.md',
  'paginas-douradas-sao-joao-crisostomo',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Livro da Vida (Libro de la Vida — 40 Capítulos)',
  (SELECT id FROM authors WHERE slug = 'santa-teresa-de-avila'),
  'Português',
  'Livro da Vida (Libro de la Vida — 40 Capítulos) por Santa Teresa de Ávila. Edição canônica integral e anotada do Scriptorium Divinum.',
  'livro-da-vida-teresa-de-avila',
  'Livro da Vida (Libro de la Vida — 40 Capítulos)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Mística Cristã e Espiritualidade Carmelita'],
  ARRAY['santa-teresa-de-avila', 'livro-da-vida-teresa-de-avila', 'classicos-cristaos'],
  '/texts/livro-da-vida-teresa-de-avila.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Lugares Comuns Teológicos (Loci Communes Theologici)',
  (SELECT id FROM authors WHERE slug = 'filipe-melancton'),
  'Português',
  'Lugares Comuns Teológicos (Loci Communes Theologici) por Filipe Melâncton. Edição canônica integral e anotada do Scriptorium Divinum.',
  'loci-communes-melancton',
  'Lugares Comuns Teológicos (Loci Communes Theologici)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Sistemática e Dogmática Reformada'],
  ARRAY['filipe-melancton', 'loci-communes-melancton', 'classicos-cristaos'],
  '/texts/loci-communes-melancton.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  '_Disputatio pro declaratione virtutis indulgentiarum_ ("Disputa sobre o Poder e Eficácia das Indulgências"), 1517',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero-1483-1546'),
  'Português',
  '_Disputatio pro declaratione virtutis indulgentiarum_ ("Disputa sobre o Poder e Eficácia das Indulgências"), 1517 por Martinho Lutero (1483–1546). Edição canônica integral e anotada do Scriptorium Divinum.',
  'lutero-95-teses',
  '_Disputatio pro declaratione virtutis indulgentiarum_ ("Disputa sobre o Poder e Eficácia das Indulgências"), 1517',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['martinho-lutero-1483-1546', 'lutero-95-teses', 'classicos-cristaos'],
  '/texts/lutero-95-teses.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Luz E Calor Manuel Bernardes',
  (SELECT id FROM authors WHERE slug = 'prefacio-a-luz-e-o-calor'),
  'Português',
  'Luz E Calor Manuel Bernardes por Prefácio — A Luz e o Calor. Edição canônica integral e anotada do Scriptorium Divinum.',
  'luz-e-calor-manuel-bernardes',
  'Luz E Calor Manuel Bernardes',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['prefacio-a-luz-e-o-calor', 'luz-e-calor-manuel-bernardes', 'classicos-cristaos'],
  '/texts/luz-e-calor-manuel-bernardes.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Um Método para a Oração com Expressões Escriturísticas (A Method for Prayer)',
  (SELECT id FROM authors WHERE slug = 'matthew-henry'),
  'Português',
  'Um Método para a Oração com Expressões Escriturísticas (A Method for Prayer) por Matthew Henry. Edição canônica integral e anotada do Scriptorium Divinum.',
  'metodo-para-a-oracao-matthew-henry',
  'Um Método para a Oração com Expressões Escriturísticas (A Method for Prayer)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Prática e Piedade Puritana'],
  ARRAY['matthew-henry', 'metodo-para-a-oracao-matthew-henry', 'classicos-cristaos'],
  '/texts/metodo-para-a-oracao-matthew-henry.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Mistagogia: A Igreja e a Divina Liturgia como Ícone do Cosmos e da Alma',
  (SELECT id FROM authors WHERE slug = 'sao-maximo-o-confessor'),
  'Português',
  'Mistagogia: A Igreja e a Divina Liturgia como Ícone do Cosmos e da Alma por São Máximo, o Confessor. Edição canônica integral e anotada do Scriptorium Divinum.',
  'mistagogia-maximo-confessor',
  'Mistagogia: A Igreja e a Divina Liturgia como Ícone do Cosmos e da Alma',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Bizantina e Teologia Litúrgica Mística'],
  ARRAY['sao-maximo-o-confessor', 'mistagogia-maximo-confessor', 'classicos-cristaos'],
  '/texts/mistagogia-maximo-confessor.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Monologion: Sobre a Essência Divina',
  (SELECT id FROM authors WHERE slug = 'santo-anselmo-de-cantuaria'),
  'Inglês',
  'Monologion: Sobre a Essência Divina por Santo Anselmo de Cantuária. Edição canônica integral e anotada do Scriptorium Divinum.',
  'monologion-anselmo',
  'Monologion: Sobre a Essência Divina',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Escolástica e Filosofia Cristã'],
  ARRAY['santo-anselmo-de-cantuaria', 'monologion-anselmo', 'classicos-cristaos'],
  '/texts/monologion-anselmo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Necessidade de Reformar a Igreja: Apelo à Dieta Imperial de Spira (1544)',
  (SELECT id FROM authors WHERE slug = 'joao-calvino'),
  'Português',
  'A Necessidade de Reformar a Igreja: Apelo à Dieta Imperial de Spira (1544) por João Calvino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'necessidade-de-reformar-a-igreja-calvino',
  'A Necessidade de Reformar a Igreja: Apelo à Dieta Imperial de Spira (1544)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia da Reforma e Eclesiologia'],
  ARRAY['joao-calvino', 'necessidade-de-reformar-a-igreja-calvino', 'classicos-cristaos'],
  '/texts/necessidade-de-reformar-a-igreja-calvino.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Noite Escura da Alma',
  (SELECT id FROM authors WHERE slug = 'tradicao-classica-crista'),
  'Português',
  'Noite Escura da Alma por Tradição Clássica Cristã. Edição canônica integral e anotada do Scriptorium Divinum.',
  'noite-escura-da-alma-joao-da-cruz',
  'Noite Escura da Alma',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['tradicao-classica-crista', 'noite-escura-da-alma-joao-da-cruz', 'classicos-cristaos'],
  '/texts/noite-escura-da-alma-joao-da-cruz.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Bem da Paciência (De Bono Patientiae)',
  (SELECT id FROM authors WHERE slug = 'sao-cipriano-de-cartago'),
  'Português',
  'O Bem da Paciência (De Bono Patientiae) por São Cipriano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-bem-da-paciencia-cipriano',
  'O Bem da Paciência (De Bono Patientiae)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['sao-cipriano-de-cartago', 'o-bem-da-paciencia-cipriano', 'classicos-cristaos'],
  '/texts/o-bem-da-paciencia-cipriano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Castelo Interior (As Sete Moradas)',
  (SELECT id FROM authors WHERE slug = 'tradicao-classica-crista'),
  'Português',
  'O Castelo Interior (As Sete Moradas) por Tradição Clássica Cristã. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-castelo-interior-teresa-de-avila',
  'O Castelo Interior (As Sete Moradas)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['tradicao-classica-crista', 'o-castelo-interior-teresa-de-avila', 'classicos-cristaos'],
  '/texts/o-castelo-interior-teresa-de-avila.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Catecismo Maior',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'O Catecismo Maior por Martinho Lutero. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-catecismo-maior-martinho-lutero',
  'O Catecismo Maior',
  2026,
  'Scriptorium Divinum',
  ARRAY['de'],
  ARRAY['Confissões Luteranas / Catequese Dogmática'],
  ARRAY['martinho-lutero', 'o-catecismo-maior-martinho-lutero', 'classicos-cristaos'],
  '/texts/o-catecismo-maior-martinho-lutero.md',
  'the-large-catechism',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Catecismo Menor (Der Kleine Katechismus)',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'O Catecismo Menor (Der Kleine Katechismus) por Martinho Lutero. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-catecismo-menor-martinho-lutero',
  'O Catecismo Menor (Der Kleine Katechismus)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Catequese, Teologia Reformada e Vida Cristã'],
  ARRAY['martinho-lutero', 'o-catecismo-menor-martinho-lutero', 'classicos-cristaos'],
  '/texts/o-catecismo-menor-martinho-lutero.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Conflito da Alma Consigo Mesma e a Vitória pela Fé (The Soul''s Conflict)',
  (SELECT id FROM authors WHERE slug = 'richard-sibbes'),
  'Português',
  'O Conflito da Alma Consigo Mesma e a Vitória pela Fé (The Soul''s Conflict) por Richard Sibbes. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-conflito-da-alma-richard-sibbes',
  'O Conflito da Alma Consigo Mesma e a Vitória pela Fé (The Soul''s Conflict)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Puritana e Psicologia Espiritual'],
  ARRAY['richard-sibbes', 'o-conflito-da-alma-richard-sibbes', 'classicos-cristaos'],
  '/texts/o-conflito-da-alma-richard-sibbes.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Coração de Cristo nos Céus para com os Pecadores na Terra (The Heart of Christ in Heaven)',
  (SELECT id FROM authors WHERE slug = 'thomas-goodwin'),
  'Português',
  'O Coração de Cristo nos Céus para com os Pecadores na Terra (The Heart of Christ in Heaven) por Thomas Goodwin. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-coracao-de-cristo-thomas-goodwin',
  'O Coração de Cristo nos Céus para com os Pecadores na Terra (The Heart of Christ in Heaven)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Puritana e Cristologia Afetiva'],
  ARRAY['thomas-goodwin', 'o-coracao-de-cristo-thomas-goodwin', 'classicos-cristaos'],
  '/texts/o-coracao-de-cristo-thomas-goodwin.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Descanso Eterno dos Santos',
  (SELECT id FROM authors WHERE slug = 'richard-baxter'),
  'Português',
  'O Descanso Eterno dos Santos por Richard Baxter. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-descanso-eterno-dos-santos-richard-baxter',
  'O Descanso Eterno dos Santos',
  2026,
  'Scriptorium Divinum',
  ARRAY['Inglês'],
  ARRAY['Espiritualidade Puritana / Vida Devocional e Esperança Celeste'],
  ARRAY['richard-baxter', 'o-descanso-eterno-dos-santos-richard-baxter', 'classicos-cristaos'],
  '/texts/o-descanso-eterno-dos-santos-richard-baxter.md',
  'the-saints-everlasting-rest',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Diálogo da Divina Providência',
  (SELECT id FROM authors WHERE slug = 'santa-catarina-de-sena'),
  'Português',
  'O Diálogo da Divina Providência por Santa Catarina de Sena. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-dialogo-catarina-de-sena',
  'O Diálogo da Divina Providência',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Mística Dominicana e Teologia Espiritual'],
  ARRAY['santa-catarina-de-sena', 'o-dialogo-catarina-de-sena', 'classicos-cristaos'],
  '/texts/o-dialogo-catarina-de-sena.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Grande Discurso Catequético (Oratio Catechetica Magna)',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nissa'),
  'Português',
  'O Grande Discurso Catequético (Oratio Catechetica Magna) por São Gregório de Nissa. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-grande-discurso-catequetico-gregorio-de-nissa',
  'O Grande Discurso Catequético (Oratio Catechetica Magna)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Grega e Dogmática'],
  ARRAY['sao-gregorio-de-nissa', 'o-grande-discurso-catequetico-gregorio-de-nissa', 'classicos-cristaos'],
  '/texts/o-grande-discurso-catequetico-gregorio-de-nissa.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Hábito das Virgens (De Habitu Virginum)',
  (SELECT id FROM authors WHERE slug = 'sao-cipriano-de-cartago'),
  'Português',
  'O Hábito das Virgens (De Habitu Virginum) por São Cipriano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-habito-das-virgens-cipriano',
  'O Hábito das Virgens (De Habitu Virginum)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['sao-cipriano-de-cartago', 'o-habito-das-virgens-cipriano', 'classicos-cristaos'],
  '/texts/o-habito-das-virgens-cipriano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Homem Eterno (The Everlasting Man)',
  (SELECT id FROM authors WHERE slug = 'g-k-chesterton'),
  'Português',
  'O Homem Eterno (The Everlasting Man) por G. K. Chesterton. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-homem-eterno-chesterton',
  'O Homem Eterno (The Everlasting Man)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Apologética Cristã e Filosofia da História'],
  ARRAY['g-k-chesterton', 'o-homem-eterno-chesterton', 'classicos-cristaos'],
  '/texts/o-homem-eterno-chesterton.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Mistério da Providência: Conduta Divina na Vida Humana (The Mystery of Providence)',
  (SELECT id FROM authors WHERE slug = 'john-flavel'),
  'Português',
  'O Mistério da Providência: Conduta Divina na Vida Humana (The Mystery of Providence) por John Flavel. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-misterio-da-providencia-john-flavel',
  'O Mistério da Providência: Conduta Divina na Vida Humana (The Mystery of Providence)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Puritana e Providência Divina'],
  ARRAY['john-flavel', 'o-misterio-da-providencia-john-flavel', 'classicos-cristaos'],
  '/texts/o-misterio-da-providencia-john-flavel.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Padre do Campo: Caráter e Regra de Vida Sagrada (The Country Parson)',
  (SELECT id FROM authors WHERE slug = 'george-herbert'),
  'Português',
  'O Padre do Campo: Caráter e Regra de Vida Sagrada (The Country Parson) por George Herbert. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-padre-do-campo-george-herbert',
  'O Padre do Campo: Caráter e Regra de Vida Sagrada (The Country Parson)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Pastoral e Espiritualidade Clássica'],
  ARRAY['george-herbert', 'o-padre-do-campo-george-herbert', 'classicos-cristaos'],
  '/texts/o-padre-do-campo-george-herbert.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Pastor de Hermas (The Shepherd of Hermas)',
  (SELECT id FROM authors WHERE slug = 'hermas-de-roma'),
  'Português',
  'O Pastor de Hermas (The Shepherd of Hermas) por Hermas de Roma. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-pastor-de-hermas',
  'O Pastor de Hermas (The Shepherd of Hermas)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Padres Apostólicos e Apocalíptica Primitiva'],
  ARRAY['hermas-de-roma', 'o-pastor-de-hermas', 'classicos-cristaos'],
  '/texts/o-pastor-de-hermas.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'O Pastor Reformado (Gildas Salvianus)',
  (SELECT id FROM authors WHERE slug = 'richard-baxter'),
  'Português',
  'O Pastor Reformado (Gildas Salvianus) por Richard Baxter. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-pastor-reformado-richard-baxter',
  'O Pastor Reformado (Gildas Salvianus)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Pastoral Puritana e Ministério Cristão'],
  ARRAY['richard-baxter', 'o-pastor-reformado-richard-baxter', 'classicos-cristaos'],
  '/texts/o-pastor-reformado-richard-baxter.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'The Pilgrim''s Progress (1678/1684) — "O Peregrino ou A Viagem do Christão à Cidade Celestial debaixo da forma de um sonho',
  (SELECT id FROM authors WHERE slug = 'john-bunyan-1628-1688'),
  'Português',
  'The Pilgrim''s Progress (1678/1684) — "O Peregrino ou A Viagem do Christão à Cidade Celestial debaixo da forma de um sonho por John Bunyan (1628–1688). Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-peregrino-pt',
  'The Pilgrim''s Progress (1678/1684) — "O Peregrino ou A Viagem do Christão à Cidade Celestial debaixo da forma de um sonho',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['john-bunyan-1628-1688', 'o-peregrino-pt', 'classicos-cristaos'],
  '/texts/o-peregrino-pt.md',
  'the-pilgrims-progress',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Oração do Senhor: Exposição Doutrinária e Prática (The Lord''s Prayer)',
  (SELECT id FROM authors WHERE slug = 'thomas-watson'),
  'Português',
  'A Oração do Senhor: Exposição Doutrinária e Prática (The Lord''s Prayer) por Thomas Watson. Edição canônica integral e anotada do Scriptorium Divinum.',
  'o-tratado-da-oracao-do-senhor-thomas-watson',
  'A Oração do Senhor: Exposição Doutrinária e Prática (The Lord''s Prayer)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Puritana e Oração Cristã'],
  ARRAY['thomas-watson', 'o-tratado-da-oracao-do-senhor-thomas-watson', 'classicos-cristaos'],
  '/texts/o-tratado-da-oracao-do-senhor-thomas-watson.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'On Prayer and the Contemplative Life (Summa Theologiae (seleção sobre oração e vida contemplativa))',
  (SELECT id FROM authors WHERE slug = 'sao-tomas-de-aquino'),
  'Inglês',
  'On Prayer and the Contemplative Life (Summa Theologiae (seleção sobre oração e vida contemplativa)) por São Tomás de Aquino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'on-prayer-and-the-contemplative-life',
  'On Prayer and the Contemplative Life (Summa Theologiae (seleção sobre oração e vida contemplativa))',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['sao-tomas-de-aquino', 'on-prayer-and-the-contemplative-life', 'classicos-cristaos'],
  '/texts/on-prayer-and-the-contemplative-life.md',
  'sobre-a-oracao-e-a-vida-contemplativa-tomas-de-aquino',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Ortodoxia',
  (SELECT id FROM authors WHERE slug = 'g-k-chesterton'),
  'Inglês',
  'Ortodoxia por G. K. Chesterton. Edição canônica integral e anotada do Scriptorium Divinum.',
  'ortodoxia-chesterton',
  'Ortodoxia',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Apologética e Filosofia Cristã'],
  ARRAY['g-k-chesterton', 'ortodoxia-chesterton', 'classicos-cristaos'],
  '/texts/ortodoxia-chesterton.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Os Últimos Fins do Homem, Salvação e Condenação Eterna',
  (SELECT id FROM authors WHERE slug = 'padre-manuel-bernardes-1644-1710'),
  'Português',
  'Os Últimos Fins do Homem, Salvação e Condenação Eterna por Padre Manuel Bernardes (1644–1710). Edição canônica integral e anotada do Scriptorium Divinum.',
  'os-ultimos-fins-do-homem-pt',
  'Os Últimos Fins do Homem, Salvação e Condenação Eterna',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['padre-manuel-bernardes-1644-1710', 'os-ultimos-fins-do-homem-pt', 'classicos-cristaos'],
  '/texts/os-ultimos-fins-do-homem-pt.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Páginas Douradas de São João Crisóstomo',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Páginas Douradas de São João Crisóstomo por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'paginas-douradas-sao-joao-crisostomo',
  'Páginas Douradas de São João Crisóstomo',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Homilética e Espiritualidade Patrística'],
  ARRAY['sao-joao-crisostomo', 'paginas-douradas-sao-joao-crisostomo', 'classicos-cristaos'],
  '/texts/paginas-douradas-sao-joao-crisostomo.md',
  'leaves-from-st-john-chrysostom',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Pecadores nas Mãos de um Deus Irado',
  (SELECT id FROM authors WHERE slug = 'jonathan-edwards'),
  'Português',
  'Pecadores nas Mãos de um Deus Irado por Jonathan Edwards. Edição canônica integral e anotada do Scriptorium Divinum.',
  'pecadores-nas-maos-de-um-deus-irado',
  'Pecadores nas Mãos de um Deus Irado',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Homilética Puritana e o Grande Despertamento'],
  ARRAY['jonathan-edwards', 'pecadores-nas-maos-de-um-deus-irado', 'classicos-cristaos'],
  '/texts/pecadores-nas-maos-de-um-deus-irado.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Pensamentos',
  (SELECT id FROM authors WHERE slug = 'blaise-pascal'),
  'Português',
  'Pensamentos por Blaise Pascal. Edição canônica integral e anotada do Scriptorium Divinum.',
  'pensamentos-blaise-pascal',
  'Pensamentos',
  2026,
  'Scriptorium Divinum',
  ARRAY['Francês'],
  ARRAY['Apologética e Filosofia Cristã / Antropologia Teológica'],
  ARRAY['blaise-pascal', 'pensamentos-blaise-pascal', 'classicos-cristaos'],
  '/texts/pensamentos-blaise-pascal.md',
  'thoughts-pensees',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Pensamentos e Memorial',
  (SELECT id FROM authors WHERE slug = 'blaise-pascal'),
  'Português',
  'Pensamentos e Memorial por Blaise Pascal. Edição canônica integral e anotada do Scriptorium Divinum.',
  'pensamentos-e-memorial-blaise-pascal',
  'Pensamentos e Memorial',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Apologética e Filosofia Cristã'],
  ARRAY['blaise-pascal', 'pensamentos-e-memorial-blaise-pascal', 'classicos-cristaos'],
  '/texts/pensamentos-e-memorial-blaise-pascal.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Pequeno Tratado sobre a Santa Ceia de Nosso Senhor Jesus Cristo',
  (SELECT id FROM authors WHERE slug = 'joao-calvino'),
  'Português',
  'Pequeno Tratado sobre a Santa Ceia de Nosso Senhor Jesus Cristo por João Calvino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'pequeno-tratado-sobre-a-santa-ceia-calvino',
  'Pequeno Tratado sobre a Santa Ceia de Nosso Senhor Jesus Cristo',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Reformada e Teologia Sacramental'],
  ARRAY['joao-calvino', 'pequeno-tratado-sobre-a-santa-ceia-calvino', 'classicos-cristaos'],
  '/texts/pequeno-tratado-sobre-a-santa-ceia-calvino.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Petição e Embaixada em Favor dos Cristãos (Legatio pro Christianis — 37 Capítulos)',
  (SELECT id FROM authors WHERE slug = 'atenagoras-de-atenas'),
  'Português',
  'Petição e Embaixada em Favor dos Cristãos (Legatio pro Christianis — 37 Capítulos) por Atenágoras de Atenas. Edição canônica integral e anotada do Scriptorium Divinum.',
  'peticao-pelos-cristaos-atenagoras',
  'Petição e Embaixada em Favor dos Cristãos (Legatio pro Christianis — 37 Capítulos)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Grega e Apologética Filosófica'],
  ARRAY['atenagoras-de-atenas', 'peticao-pelos-cristaos-atenagoras', 'classicos-cristaos'],
  '/texts/peticao-pelos-cristaos-atenagoras.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Preces Privatae: Devoções Pessoais para Todos os Dias da Semana (Preces Privatae)',
  (SELECT id FROM authors WHERE slug = 'lancelot-andrewes'),
  'Português',
  'Preces Privatae: Devoções Pessoais para Todos os Dias da Semana (Preces Privatae) por Lancelot Andrewes. Edição canônica integral e anotada do Scriptorium Divinum.',
  'preces-privatae-lancelot-andrewes',
  'Preces Privatae: Devoções Pessoais para Todos os Dias da Semana (Preces Privatae)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Espiritualidade Anglicana e Oração Litúrgica'],
  ARRAY['lancelot-andrewes', 'preces-privatae-lancelot-andrewes', 'classicos-cristaos'],
  '/texts/preces-privatae-lancelot-andrewes.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Prefacio Aos Romanos Lutero',
  (SELECT id FROM authors WHERE slug = 'introducao-a-luz-mais-pura-do-evangelho'),
  'Português',
  'Prefacio Aos Romanos Lutero por Introdução: A Luz Mais Pura do Evangelho. Edição canônica integral e anotada do Scriptorium Divinum.',
  'prefacio-aos-romanos-lutero',
  'Prefacio Aos Romanos Lutero',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['introducao-a-luz-mais-pura-do-evangelho', 'prefacio-aos-romanos-lutero', 'classicos-cristaos'],
  '/texts/prefacio-aos-romanos-lutero.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Primeira Apologia em Favor dos Cristãos (Apologia Prima — 68 Capítulos)',
  (SELECT id FROM authors WHERE slug = 'sao-justino-martir'),
  'Português',
  'Primeira Apologia em Favor dos Cristãos (Apologia Prima — 68 Capítulos) por São Justino Mártir. Edição canônica integral e anotada do Scriptorium Divinum.',
  'primeira-apologia-justino-martir',
  'Primeira Apologia em Favor dos Cristãos (Apologia Prima — 68 Capítulos)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Grega e Apologética Cristã Primitiva'],
  ARRAY['sao-justino-martir', 'primeira-apologia-justino-martir', 'classicos-cristaos'],
  '/texts/primeira-apologia-justino-martir.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Primeira Epistola De Clemente',
  (SELECT id FROM authors WHERE slug = 'capitulo-i-elogio-da-fe-anterior-dos-corintios-1-3'),
  'Português',
  'Primeira Epistola De Clemente por Capítulo I: Elogio da Fé Anterior dos Coríntios (§§ 1–3). Edição canônica integral e anotada do Scriptorium Divinum.',
  'primeira-epistola-de-clemente',
  'Primeira Epistola De Clemente',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['capitulo-i-elogio-da-fe-anterior-dos-corintios-1-3', 'primeira-epistola-de-clemente', 'classicos-cristaos'],
  '/texts/primeira-epistola-de-clemente.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Proslogion: A Fé em Busca da Compreensão',
  (SELECT id FROM authors WHERE slug = 'santo-anselmo-de-cantuaria'),
  'Inglês',
  'Proslogion: A Fé em Busca da Compreensão por Santo Anselmo de Cantuária. Edição canônica integral e anotada do Scriptorium Divinum.',
  'proslogion-anselmo',
  'Proslogion: A Fé em Busca da Compreensão',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Escolástica e Filosofia Cristã'],
  ARRAY['santo-anselmo-de-cantuaria', 'proslogion-anselmo', 'classicos-cristaos'],
  '/texts/proslogion-anselmo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Proslogion',
  (SELECT id FROM authors WHERE slug = 'proemio-o-proposito-da-obra'),
  'Português',
  'Proslogion por Proêmio: O Propósito da Obra. Edição canônica integral e anotada do Scriptorium Divinum.',
  'proslogion',
  'Proslogion',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['proemio-o-proposito-da-obra', 'proslogion', 'classicos-cristaos'],
  '/texts/proslogion.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Regra Pastoral (Regula Pastoralis)',
  (SELECT id FROM authors WHERE slug = 'tradicao-classica-crista'),
  'Português',
  'A Regra Pastoral (Regula Pastoralis) por Tradição Clássica Cristã. Edição canônica integral e anotada do Scriptorium Divinum.',
  'regra-pastoral-gregorio-magno',
  'A Regra Pastoral (Regula Pastoralis)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['tradicao-classica-crista', 'regra-pastoral-gregorio-magno', 'classicos-cristaos'],
  '/texts/regra-pastoral-gregorio-magno.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Relação da Missão da Serra de Ibiapaba (Relação da Missão da Serra de Ibiapaba)',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'Relação da Missão da Serra de Ibiapaba (Relação da Missão da Serra de Ibiapaba) por Padre Antônio Vieira. Edição canônica integral e anotada do Scriptorium Divinum.',
  'relacao-da-missao-da-serra-de-ibiapaba',
  'Relação da Missão da Serra de Ibiapaba (Relação da Missão da Serra de Ibiapaba)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['padre-antonio-vieira', 'relacao-da-missao-da-serra-de-ibiapaba', 'classicos-cristaos'],
  '/texts/relacao-da-missao-da-serra-de-ibiapaba.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Remédios Preciosos contra as Ciladas de Satanás (Precious Remedies Against Satan''s Devices)',
  (SELECT id FROM authors WHERE slug = 'thomas-brooks'),
  'Português',
  'Remédios Preciosos contra as Ciladas de Satanás (Precious Remedies Against Satan''s Devices) por Thomas Brooks. Edição canônica integral e anotada do Scriptorium Divinum.',
  'remedios-preciosos-contra-satanas-thomas-brooks',
  'Remédios Preciosos contra as Ciladas de Satanás (Precious Remedies Against Satan''s Devices)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Puritana e Batalha Espiritual'],
  ARRAY['thomas-brooks', 'remedios-preciosos-contra-satanas-thomas-brooks', 'classicos-cristaos'],
  '/texts/remedios-preciosos-contra-satanas-thomas-brooks.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Resposta ao Cardeal Sadoleto (Responsio ad Sadoleti Epistolam)',
  (SELECT id FROM authors WHERE slug = 'joao-calvino'),
  'Português',
  'Resposta ao Cardeal Sadoleto (Responsio ad Sadoleti Epistolam) por João Calvino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'resposta-ao-cardeal-sadoleto-calvino',
  'Resposta ao Cardeal Sadoleto (Responsio ad Sadoleti Epistolam)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Apologética e Teologia Reformada'],
  ARRAY['joao-calvino', 'resposta-ao-cardeal-sadoleto-calvino', 'classicos-cristaos'],
  '/texts/resposta-ao-cardeal-sadoleto-calvino.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Resposta aos Judeus (Adversus Judaeos)',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Resposta aos Judeus (Adversus Judaeos) por Tertuliano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'resposta-aos-judeus-tertuliano',
  'Resposta aos Judeus (Adversus Judaeos)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Apologética'],
  ARRAY['tertuliano', 'resposta-aos-judeus-tertuliano', 'classicos-cristaos'],
  '/texts/resposta-aos-judeus-tertuliano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Regras e Exercícios do Santo Morrer (The Rule and Exercises of Holy Dying)',
  (SELECT id FROM authors WHERE slug = 'jeremy-taylor'),
  'Português',
  'Regras e Exercícios do Santo Morrer (The Rule and Exercises of Holy Dying) por Jeremy Taylor. Edição canônica integral e anotada do Scriptorium Divinum.',
  'santo-morrer-jeremy-taylor',
  'Regras e Exercícios do Santo Morrer (The Rule and Exercises of Holy Dying)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Espiritualidade Anglicana e Arte de Morrer (Ars Moriendi)'],
  ARRAY['jeremy-taylor', 'santo-morrer-jeremy-taylor', 'classicos-cristaos'],
  '/texts/santo-morrer-jeremy-taylor.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Regras e Exercícios do Santo Viver (The Rule and Exercises of Holy Living)',
  (SELECT id FROM authors WHERE slug = 'jeremy-taylor'),
  'Português',
  'Regras e Exercícios do Santo Viver (The Rule and Exercises of Holy Living) por Jeremy Taylor. Edição canônica integral e anotada do Scriptorium Divinum.',
  'santo-viver-jeremy-taylor',
  'Regras e Exercícios do Santo Viver (The Rule and Exercises of Holy Living)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Espiritualidade Anglicana e Conduta Cristã'],
  ARRAY['jeremy-taylor', 'santo-viver-jeremy-taylor', 'classicos-cristaos'],
  '/texts/santo-viver-jeremy-taylor.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Segunda Apologia em Favor dos Cristãos (Apologia Secunda — 15 Capítulos)',
  (SELECT id FROM authors WHERE slug = 'sao-justino-martir'),
  'Português',
  'Segunda Apologia em Favor dos Cristãos (Apologia Secunda — 15 Capítulos) por São Justino Mártir. Edição canônica integral e anotada do Scriptorium Divinum.',
  'segunda-apologia-justino-martir',
  'Segunda Apologia em Favor dos Cristãos (Apologia Secunda — 15 Capítulos)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Grega e Apologética Cristã Primitiva'],
  ARRAY['sao-justino-martir', 'segunda-apologia-justino-martir', 'classicos-cristaos'],
  '/texts/segunda-apologia-justino-martir.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermão da Dominga XIX depois do Pentecoste (Sermão da Dominga XIX depois do Pentecoste)',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'Sermão da Dominga XIX depois do Pentecoste (Sermão da Dominga XIX depois do Pentecoste) por Padre Antônio Vieira. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermao-da-dominga-xix-depois-do-pentecoste',
  'Sermão da Dominga XIX depois do Pentecoste (Sermão da Dominga XIX depois do Pentecoste)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['padre-antonio-vieira', 'sermao-da-dominga-xix-depois-do-pentecoste', 'classicos-cristaos'],
  '/texts/sermao-da-dominga-xix-depois-do-pentecoste.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermão da Quinta Dominga da Quaresma (Sermão da Quinta Dominga da Quaresma)',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'Sermão da Quinta Dominga da Quaresma (Sermão da Quinta Dominga da Quaresma) por Padre Antônio Vieira. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermao-da-quinta-dominga-da-quaresma',
  'Sermão da Quinta Dominga da Quaresma (Sermão da Quinta Dominga da Quaresma)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['padre-antonio-vieira', 'sermao-da-quinta-dominga-da-quaresma', 'classicos-cristaos'],
  '/texts/sermao-da-quinta-dominga-da-quaresma.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermão da Sexagésima',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'Sermão da Sexagésima por Padre Antônio Vieira. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermao-da-sexagesima-antonio-vieira',
  'Sermão da Sexagésima',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Homilética e Oratória Sacra'],
  ARRAY['padre-antonio-vieira', 'sermao-da-sexagesima-antonio-vieira', 'classicos-cristaos'],
  '/texts/sermao-da-sexagesima-antonio-vieira.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermão da Sexagésima (Sermão da Sexagésima)',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'Sermão da Sexagésima (Sermão da Sexagésima) por Padre Antônio Vieira. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermao-da-sexagesima',
  'Sermão da Sexagésima (Sermão da Sexagésima)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['padre-antonio-vieira', 'sermao-da-sexagesima', 'classicos-cristaos'],
  '/texts/sermao-da-sexagesima.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermão das Lágrimas de São Pedro',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'Sermão das Lágrimas de São Pedro por Padre Antônio Vieira. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermao-das-lagrimas-de-sao-pedro-vieira',
  'Sermão das Lágrimas de São Pedro',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Oratória Sacra e Teologia Moral'],
  ARRAY['padre-antonio-vieira', 'sermao-das-lagrimas-de-sao-pedro-vieira', 'classicos-cristaos'],
  '/texts/sermao-das-lagrimas-de-sao-pedro-vieira.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermão de Santo António aos Peixes (Sermão de Santo António aos Peixes)',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'Sermão de Santo António aos Peixes (Sermão de Santo António aos Peixes) por Padre Antônio Vieira. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermao-de-santo-antonio-aos-peixes',
  'Sermão de Santo António aos Peixes (Sermão de Santo António aos Peixes)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['padre-antonio-vieira', 'sermao-de-santo-antonio-aos-peixes', 'classicos-cristaos'],
  '/texts/sermao-de-santo-antonio-aos-peixes.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermão do Mandato (1670) (Sermão do Mandato)',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'Sermão do Mandato (1670) (Sermão do Mandato) por Padre Antônio Vieira. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermao-do-mandato-1670',
  'Sermão do Mandato (1670) (Sermão do Mandato)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['padre-antonio-vieira', 'sermao-do-mandato-1670', 'classicos-cristaos'],
  '/texts/sermao-do-mandato-1670.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermão do Mandato (Sermão do Mandato)',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'Sermão do Mandato (Sermão do Mandato) por Padre Antônio Vieira. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermao-do-mandato',
  'Sermão do Mandato (Sermão do Mandato)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['padre-antonio-vieira', 'sermao-do-mandato', 'classicos-cristaos'],
  '/texts/sermao-do-mandato.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermão pelo Bom Sucesso das Armas de Portugal contra as de Holanda (Sermão pelo Bom Sucesso das Armas de Portugal contra as de Holanda)',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'Sermão pelo Bom Sucesso das Armas de Portugal contra as de Holanda (Sermão pelo Bom Sucesso das Armas de Portugal contra as de Holanda) por Padre Antônio Vieira. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermao-pelo-bom-sucesso-das-armas-de-portugal-contra-as-de-holanda',
  'Sermão pelo Bom Sucesso das Armas de Portugal contra as de Holanda (Sermão pelo Bom Sucesso das Armas de Portugal contra as de Holanda)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['padre-antonio-vieira', 'sermao-pelo-bom-sucesso-das-armas-de-portugal-contra-as-de-holanda', 'classicos-cristaos'],
  '/texts/sermao-pelo-bom-sucesso-das-armas-de-portugal-contra-as-de-holanda.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermão da Primeira Dominga da Quaresma',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'Sermão da Primeira Dominga da Quaresma por Padre Antônio Vieira. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermao-primeira-dominga-quaresma-vieira',
  'Sermão da Primeira Dominga da Quaresma',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Oratória Sacra e Teologia Moral'],
  ARRAY['padre-antonio-vieira', 'sermao-primeira-dominga-quaresma-vieira', 'classicos-cristaos'],
  '/texts/sermao-primeira-dominga-quaresma-vieira.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermão de Santo António aos Peixes',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'Sermão de Santo António aos Peixes por Padre Antônio Vieira. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermao-santo-antonio-peixes-vieira',
  'Sermão de Santo António aos Peixes',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Oratória Sacra e Literatura Barroca'],
  ARRAY['padre-antonio-vieira', 'sermao-santo-antonio-peixes-vieira', 'classicos-cristaos'],
  '/texts/sermao-santo-antonio-peixes-vieira.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermoes Cantico Dos Canticos Bernardo Claraval',
  (SELECT id FROM authors WHERE slug = 'sermao-i-que-ele-me-beije-com-os-beijos-da-sua-boca-ct-1-1'),
  'Português',
  'Sermoes Cantico Dos Canticos Bernardo Claraval por Sermão I — *"Que ele me beije com os beijos da sua boca"* (Ct 1,1). Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermoes-cantico-dos-canticos-bernardo-claraval',
  'Sermoes Cantico Dos Canticos Bernardo Claraval',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['sermao-i-que-ele-me-beije-com-os-beijos-da-sua-boca-ct-1-1', 'sermoes-cantico-dos-canticos-bernardo-claraval', 'classicos-cristaos'],
  '/texts/sermoes-cantico-dos-canticos-bernardo-claraval.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermoes Do Homem Interior Mestre Eckhart',
  (SELECT id FROM authors WHERE slug = 'sermao-1-intravit-iesus-in-quoddam-castellum-lc-10-38'),
  'Português',
  'Sermoes Do Homem Interior Mestre Eckhart por Sermão 1 — *Intravit Iesus in quoddam castellum* (Lc 10,38). Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermoes-do-homem-interior-mestre-eckhart',
  'Sermoes Do Homem Interior Mestre Eckhart',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['sermao-1-intravit-iesus-in-quoddam-castellum-lc-10-38', 'sermoes-do-homem-interior-mestre-eckhart', 'classicos-cristaos'],
  '/texts/sermoes-do-homem-interior-mestre-eckhart.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermões sobre o Mistério da Natividade e Encarnação do Senhor',
  (SELECT id FROM authors WHERE slug = 'sao-leao-magno'),
  'Português',
  'Sermões sobre o Mistério da Natividade e Encarnação do Senhor por São Leão Magno. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermoes-sobre-a-natividade-sao-leao-magno',
  'Sermões sobre o Mistério da Natividade e Encarnação do Senhor',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Dogmática / Cristologia / Homilética Litúrgica'],
  ARRAY['sao-leao-magno', 'sermoes-sobre-a-natividade-sao-leao-magno', 'classicos-cristaos'],
  '/texts/sermoes-sobre-a-natividade-sao-leao-magno.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermões sobre o Mistério Pascal (Paixão, Ressurreição e Ascensão do Senhor)',
  (SELECT id FROM authors WHERE slug = 'sao-leao-magno'),
  'Português',
  'Sermões sobre o Mistério Pascal (Paixão, Ressurreição e Ascensão do Senhor) por São Leão Magno. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermoes-sobre-o-misterio-pascal-sao-leao-magno',
  'Sermões sobre o Mistério Pascal (Paixão, Ressurreição e Ascensão do Senhor)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Sermões Dogmáticos / Teologia Litúrgica / Cristologia e Redenção'],
  ARRAY['sao-leao-magno', 'sermoes-sobre-o-misterio-pascal-sao-leao-magno', 'classicos-cristaos'],
  '/texts/sermoes-sobre-o-misterio-pascal-sao-leao-magno.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sermões sobre Pentecostes, os Santos Apóstolos e as Bem-Aventuranças',
  (SELECT id FROM authors WHERE slug = 'sao-leao-magno'),
  'Português',
  'Sermões sobre Pentecostes, os Santos Apóstolos e as Bem-Aventuranças por São Leão Magno. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sermoes-sobre-pentecostes-e-os-santos-sao-leao-magno',
  'Sermões sobre Pentecostes, os Santos Apóstolos e as Bem-Aventuranças',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Pneumatologia / Eclesiologia / Hagiografia e Ética Evangélica'],
  ARRAY['sao-leao-magno', 'sermoes-sobre-pentecostes-e-os-santos-sao-leao-magno', 'classicos-cristaos'],
  '/texts/sermoes-sobre-pentecostes-e-os-santos-sao-leao-magno.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Alma e a Ressurreição',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nissa'),
  'Português',
  'Sobre a Alma e a Ressurreição por São Gregório de Nissa. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-a-alma-e-a-ressurreicao-gregorio-de-nissa',
  'Sobre a Alma e a Ressurreição',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Escrituração Dialógica / Imortalidade da Alma / Escatologia e Ressurreição'],
  ARRAY['sao-gregorio-de-nissa', 'sobre-a-alma-e-a-ressurreicao-gregorio-de-nissa', 'classicos-cristaos'],
  '/texts/sobre-a-alma-e-a-ressurreicao-gregorio-de-nissa.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Alma e a Ressurreição (De Anima et Resurrectione — Diálogo com Santa Macrina)',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nissa'),
  'Português',
  'Sobre a Alma e a Ressurreição (De Anima et Resurrectione — Diálogo com Santa Macrina) por São Gregório de Nissa. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-a-alma-e-a-ressurreicao-gregorio-nissa',
  'Sobre a Alma e a Ressurreição (De Anima et Resurrectione — Diálogo com Santa Macrina)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Grega e Filosofia Cristã'],
  ARRAY['sao-gregorio-de-nissa', 'sobre-a-alma-e-a-ressurreicao-gregorio-nissa', 'classicos-cristaos'],
  '/texts/sobre-a-alma-e-a-ressurreicao-gregorio-nissa.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Carne de Cristo (De Carne Christi)',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Sobre a Carne de Cristo (De Carne Christi) por Tertuliano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-a-carne-de-cristo-tertuliano',
  'Sobre a Carne de Cristo (De Carne Christi)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Cristologia'],
  ARRAY['tertuliano', 'sobre-a-carne-de-cristo-tertuliano', 'classicos-cristaos'],
  '/texts/sobre-a-carne-de-cristo-tertuliano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Criação do Homem',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nissa'),
  'Português',
  'Sobre a Criação do Homem por São Gregório de Nissa. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-a-criacao-do-homem-gregorio-de-nissa',
  'Sobre a Criação do Homem',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego'],
  ARRAY['Antropologia Teológica / Imago Dei / Ressurreição e Escatologia'],
  ARRAY['sao-gregorio-de-nissa', 'sobre-a-criacao-do-homem-gregorio-de-nissa', 'classicos-cristaos'],
  '/texts/sobre-a-criacao-do-homem-gregorio-de-nissa.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Mortalidade (De Mortalitate)',
  (SELECT id FROM authors WHERE slug = 'sao-cipriano-de-cartago'),
  'Português',
  'Sobre a Mortalidade (De Mortalitate) por São Cipriano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-a-mortalidade-cipriano',
  'Sobre a Mortalidade (De Mortalitate)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Consolação Cristã'],
  ARRAY['sao-cipriano-de-cartago', 'sobre-a-mortalidade-cipriano', 'classicos-cristaos'],
  '/texts/sobre-a-mortalidade-cipriano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre A Oracao Dominical',
  (SELECT id FROM authors WHERE slug = 'capitulo-i-cristo-como-mestre-da-oracao-e-as-disposicoes-interiores-1-6'),
  'Português',
  'Sobre A Oracao Dominical por Capítulo I: Cristo como Mestre da Oração e as Disposições Interiores (§§ 1–6). Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-a-oracao-dominical',
  'Sobre A Oracao Dominical',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['capitulo-i-cristo-como-mestre-da-oracao-e-as-disposicoes-interiores-1-6', 'sobre-a-oracao-dominical', 'classicos-cristaos'],
  '/texts/sobre-a-oracao-dominical.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Oração e a Vida Contemplativa',
  (SELECT id FROM authors WHERE slug = 'santo-tomas-de-aquino'),
  'Português',
  'Sobre a Oração e a Vida Contemplativa por Santo Tomás de Aquino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-a-oracao-e-a-vida-contemplativa-tomas-de-aquino',
  'Sobre a Oração e a Vida Contemplativa',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Espiritual e Mística / Vida Contemplativa e Oração'],
  ARRAY['santo-tomas-de-aquino', 'sobre-a-oracao-e-a-vida-contemplativa-tomas-de-aquino', 'classicos-cristaos'],
  '/texts/sobre-a-oracao-e-a-vida-contemplativa-tomas-de-aquino.md',
  'on-prayer-and-the-contemplative-life',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Oração (De Oratione)',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Sobre a Oração (De Oratione) por Tertuliano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-a-oracao-tertuliano',
  'Sobre a Oração (De Oratione)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Espiritualidade'],
  ARRAY['tertuliano', 'sobre-a-oracao-tertuliano', 'classicos-cristaos'],
  '/texts/sobre-a-oracao-tertuliano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Paciência (De Patientia)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho-de-hipona'),
  'Português',
  'Sobre a Paciência (De Patientia) por Santo Agostinho de Hipona. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-a-paciencia-agostinho',
  'Sobre a Paciência (De Patientia)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Ética Cristã'],
  ARRAY['santo-agostinho-de-hipona', 'sobre-a-paciencia-agostinho', 'classicos-cristaos'],
  '/texts/sobre-a-paciencia-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Ressurreição da Carne (De Resurrectione Carnis)',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Sobre a Ressurreição da Carne (De Resurrectione Carnis) por Tertuliano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-a-ressurreicao-da-carne-tertuliano',
  'Sobre a Ressurreição da Carne (De Resurrectione Carnis)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Escatologia'],
  ARRAY['tertuliano', 'sobre-a-ressurreicao-da-carne-tertuliano', 'classicos-cristaos'],
  '/texts/sobre-a-ressurreicao-da-carne-tertuliano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratado sobre a Verdade (De Veritate)',
  (SELECT id FROM authors WHERE slug = 'santo-anselmo-de-cantuaria'),
  'Português',
  'Tratado sobre a Verdade (De Veritate) por Santo Anselmo de Cantuária. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-a-verdade-de-veritate-anselmo',
  'Tratado sobre a Verdade (De Veritate)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Filosofia Medieval e Teologia Escolástica'],
  ARRAY['santo-anselmo-de-cantuaria', 'sobre-a-verdade-de-veritate-anselmo', 'classicos-cristaos'],
  '/texts/sobre-a-verdade-de-veritate-anselmo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre a Virgindade (De Virginitate)',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nissa'),
  'Português',
  'Sobre a Virgindade (De Virginitate) por São Gregório de Nissa. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-a-virgindade-gregorio-de-nissa',
  'Sobre a Virgindade (De Virginitate)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Grega e Ascética'],
  ARRAY['sao-gregorio-de-nissa', 'sobre-a-virgindade-gregorio-de-nissa', 'classicos-cristaos'],
  '/texts/sobre-a-virgindade-gregorio-de-nissa.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre as Boas Obras e as Esmolas (De Opere et Eleemosynis)',
  (SELECT id FROM authors WHERE slug = 'sao-cipriano-de-cartago'),
  'Português',
  'Sobre as Boas Obras e as Esmolas (De Opere et Eleemosynis) por São Cipriano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-as-boas-obras-e-as-esmolas-cipriano',
  'Sobre as Boas Obras e as Esmolas (De Opere et Eleemosynis)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['sao-cipriano-de-cartago', 'sobre-as-boas-obras-e-as-esmolas-cipriano', 'classicos-cristaos'],
  '/texts/sobre-as-boas-obras-e-as-esmolas-cipriano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre as Virgens (De Virginibus ad Marcellinam)',
  (SELECT id FROM authors WHERE slug = 'santo-ambrosio-de-milao'),
  'Português',
  'Sobre as Virgens (De Virginibus ad Marcellinam) por Santo Ambrósio de Milão. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-as-virgens-ambrosio-de-milao',
  'Sobre as Virgens (De Virginibus ad Marcellinam)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Ascetismo'],
  ARRAY['santo-ambrosio-de-milao', 'sobre-as-virgens-ambrosio-de-milao', 'classicos-cristaos'],
  '/texts/sobre-as-virgens-ambrosio-de-milao.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre as Viúvas (De Viduis)',
  (SELECT id FROM authors WHERE slug = 'santo-ambrosio-de-milao'),
  'Português',
  'Sobre as Viúvas (De Viduis) por Santo Ambrósio de Milão. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-as-viuvas-ambrosio-de-milao',
  'Sobre as Viúvas (De Viduis)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['santo-ambrosio-de-milao', 'sobre-as-viuvas-ambrosio-de-milao', 'classicos-cristaos'],
  '/texts/sobre-as-viuvas-ambrosio-de-milao.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre Homens Ilustres (De Viris Illustribus)',
  (SELECT id FROM authors WHERE slug = 'sao-jeronimo'),
  'Português',
  'Sobre Homens Ilustres (De Viris Illustribus) por São Jerônimo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-homens-ilustres-jeronimo',
  'Sobre Homens Ilustres (De Viris Illustribus)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Patrologia Histórica'],
  ARRAY['sao-jeronimo', 'sobre-homens-ilustres-jeronimo', 'classicos-cristaos'],
  '/texts/sobre-homens-ilustres-jeronimo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre o Batismo (De Baptismo)',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'Sobre o Batismo (De Baptismo) por Tertuliano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-o-batismo-tertuliano',
  'Sobre o Batismo (De Baptismo)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Teologia Sacramental'],
  ARRAY['tertuliano', 'sobre-o-batismo-tertuliano', 'classicos-cristaos'],
  '/texts/sobre-o-batismo-tertuliano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre o Espírito Santo (De Spiritu Sancto)',
  (SELECT id FROM authors WHERE slug = 'santo-ambrosio-de-milao'),
  'Português',
  'Sobre o Espírito Santo (De Spiritu Sancto) por Santo Ambrósio de Milão. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-o-espirito-santo-ambrosio-de-milao',
  'Sobre o Espírito Santo (De Spiritu Sancto)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Pneumatologia Patrística / Teologia Trinitária / Cristologia Dogmática'],
  ARRAY['santo-ambrosio-de-milao', 'sobre-o-espirito-santo-ambrosio-de-milao', 'classicos-cristaos'],
  '/texts/sobre-o-espirito-santo-ambrosio-de-milao.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratado Sobre o Espírito Santo',
  (SELECT id FROM authors WHERE slug = 'tradicao-classica-crista'),
  'Português',
  'Tratado Sobre o Espírito Santo por Tradição Clássica Cristã. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-o-espirito-santo-basilio-magno',
  'Tratado Sobre o Espírito Santo',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['tradicao-classica-crista', 'sobre-o-espirito-santo-basilio-magno', 'classicos-cristaos'],
  '/texts/sobre-o-espirito-santo-basilio-magno.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre o Mestre (De Magistro)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho-de-hipona'),
  'Português',
  'Sobre o Mestre (De Magistro) por Santo Agostinho de Hipona. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-o-mestre-agostinho',
  'Sobre o Mestre (De Magistro)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Filosofia Cristã, Linguagem e Epistemologia da Iluminação'],
  ARRAY['santo-agostinho-de-hipona', 'sobre-o-mestre-agostinho', 'classicos-cristaos'],
  '/texts/sobre-o-mestre-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratado sobre o Sacerdócio (De Sacerdotio)',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Tratado sobre o Sacerdócio (De Sacerdotio) por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-o-sacerdocio-joao-crisostomo',
  'Tratado sobre o Sacerdócio (De Sacerdotio)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Grega e Teologia Pastoral'],
  ARRAY['sao-joao-crisostomo', 'sobre-o-sacerdocio-joao-crisostomo', 'classicos-cristaos'],
  '/texts/sobre-o-sacerdocio-joao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre o Zelo e a Inveja (De Zelo et Livore)',
  (SELECT id FROM authors WHERE slug = 'sao-cipriano-de-cartago'),
  'Português',
  'Sobre o Zelo e a Inveja (De Zelo et Livore) por São Cipriano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-o-zelo-e-a-inveja-cipriano',
  'Sobre o Zelo e a Inveja (De Zelo et Livore)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Moral Cristã'],
  ARRAY['sao-cipriano-de-cartago', 'sobre-o-zelo-e-a-inveja-cipriano', 'classicos-cristaos'],
  '/texts/sobre-o-zelo-e-a-inveja-cipriano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre os Caídos (De Lapsis)',
  (SELECT id FROM authors WHERE slug = 'sao-cipriano-de-cartago'),
  'Português',
  'Sobre os Caídos (De Lapsis) por São Cipriano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-os-caidos-cipriano',
  'Sobre os Caídos (De Lapsis)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Disciplina Eclesiástica'],
  ARRAY['sao-cipriano-de-cartago', 'sobre-os-caidos-cipriano', 'classicos-cristaos'],
  '/texts/sobre-os-caidos-cipriano.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre os Deveres do Clero - Livro I (De Officiis Ministrorum Liber I)',
  (SELECT id FROM authors WHERE slug = 'santo-ambrosio-de-milao'),
  'Português',
  'Sobre os Deveres do Clero - Livro I (De Officiis Ministrorum Liber I) por Santo Ambrósio de Milão. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-os-deveres-do-clero-livro-1-ambrosio-de-milao',
  'Sobre os Deveres do Clero - Livro I (De Officiis Ministrorum Liber I)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Ética Cristã / Teologia Pastoral / Filosofia Moral Patrística'],
  ARRAY['santo-ambrosio-de-milao', 'sobre-os-deveres-do-clero-livro-1-ambrosio-de-milao', 'classicos-cristaos'],
  '/texts/sobre-os-deveres-do-clero-livro-1-ambrosio-de-milao.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre os Deveres do Clero - Livros II e III (De Officiis Ministrorum Libri II & III)',
  (SELECT id FROM authors WHERE slug = 'santo-ambrosio-de-milao'),
  'Português',
  'Sobre os Deveres do Clero - Livros II e III (De Officiis Ministrorum Libri II & III) por Santo Ambrósio de Milão. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-os-deveres-do-clero-livros-2-e-3-ambrosio-de-milao',
  'Sobre os Deveres do Clero - Livros II e III (De Officiis Ministrorum Libri II & III)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Ética Cristã / Teologia Pastoral / Filosofia Moral Patrística'],
  ARRAY['santo-ambrosio-de-milao', 'sobre-os-deveres-do-clero-livros-2-e-3-ambrosio-de-milao', 'classicos-cristaos'],
  '/texts/sobre-os-deveres-do-clero-livros-2-e-3-ambrosio-de-milao.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre os Mistérios (De Mysteriis)',
  (SELECT id FROM authors WHERE slug = 'santo-ambrosio-de-milao'),
  'Português',
  'Sobre os Mistérios (De Mysteriis) por Santo Ambrósio de Milão. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-os-misterios-ambrosio-de-milao',
  'Sobre os Mistérios (De Mysteriis)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística e Teologia Sacramental'],
  ARRAY['santo-ambrosio-de-milao', 'sobre-os-misterios-ambrosio-de-milao', 'classicos-cristaos'],
  '/texts/sobre-os-misterios-ambrosio-de-milao.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Sobre os Sínodos, ou Da Fé dos Orientais',
  (SELECT id FROM authors WHERE slug = 'santo-hilario-de-poitiers'),
  'Português',
  'Sobre os Sínodos, ou Da Fé dos Orientais por Santo Hilário de Poitiers. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sobre-os-sinodos-hilario-de-poitiers',
  'Sobre os Sínodos, ou Da Fé dos Orientais',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Dogmática / Cristologia / História Conciliar'],
  ARRAY['santo-hilario-de-poitiers', 'sobre-os-sinodos-hilario-de-poitiers', 'classicos-cristaos'],
  '/texts/sobre-os-sinodos-hilario-de-poitiers.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Solilóquio sobre as Arras da Alma (Soliloquium de Arrha Animae)',
  (SELECT id FROM authors WHERE slug = 'hugo-de-sao-vitor'),
  'Português',
  'Solilóquio sobre as Arras da Alma (Soliloquium de Arrha Animae) por Hugo de São Vítor. Edição canônica integral e anotada do Scriptorium Divinum.',
  'soliloquio-arras-da-alma-hugo-de-sao-vitor',
  'Solilóquio sobre as Arras da Alma (Soliloquium de Arrha Animae)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Vida Interior e Contemplação Mística'],
  ARRAY['hugo-de-sao-vitor', 'soliloquio-arras-da-alma-hugo-de-sao-vitor', 'classicos-cristaos'],
  '/texts/soliloquio-arras-da-alma-hugo-de-sao-vitor.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Solilóquio da Alma (Soliloquium Animae — 25 Capítulos)',
  (SELECT id FROM authors WHERE slug = 'tomas-de-kempis'),
  'Português',
  'Solilóquio da Alma (Soliloquium Animae — 25 Capítulos) por Tomás de Kempis. Edição canônica integral e anotada do Scriptorium Divinum.',
  'soliloquio-da-alma-tomas-de-kempis',
  'Solilóquio da Alma (Soliloquium Animae — 25 Capítulos)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Devotio Moderna e Espiritualidade Mística'],
  ARRAY['tomas-de-kempis', 'soliloquio-da-alma-tomas-de-kempis', 'classicos-cristaos'],
  '/texts/soliloquio-da-alma-tomas-de-kempis.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  '_Vida de D. Frei Bartolomeu dos Mártires_ (1619), em seleção: Antologia Portuguesa, _Frei Luís de Sousa_, vol. I',
  (SELECT id FROM authors WHERE slug = 'frei-luis-de-sousa-c-1555-1632-a-partir-dos-apontamentos-de-frei-luis-de-cacegas'),
  'Português',
  '_Vida de D. Frei Bartolomeu dos Mártires_ (1619), em seleção: Antologia Portuguesa, _Frei Luís de Sousa_, vol. I por Frei Luís de Sousa (c. 1555–1632), a partir dos apontamentos de Frei Luís de Cácegas. Edição canônica integral e anotada do Scriptorium Divinum.',
  'sousa-vida-do-arcebispo-antologia',
  '_Vida de D. Frei Bartolomeu dos Mártires_ (1619), em seleção: Antologia Portuguesa, _Frei Luís de Sousa_, vol. I',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['frei-luis-de-sousa-c-1555-1632-a-partir-dos-apontamentos-de-frei-luis-de-cacegas', 'sousa-vida-do-arcebispo-antologia', 'classicos-cristaos'],
  '/texts/sousa-vida-do-arcebispo-antologia.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'St. Bernard of Clairvaux''s Life of St. Malachy of Armagh (Vita sancti Malachiae)',
  (SELECT id FROM authors WHERE slug = 'sao-bernardo-de-claraval'),
  'Inglês',
  'St. Bernard of Clairvaux''s Life of St. Malachy of Armagh (Vita sancti Malachiae) por São Bernardo de Claraval. Edição canônica integral e anotada do Scriptorium Divinum.',
  'st-bernard-of-clairvauxs-life-of-st-malachy-of-armagh',
  'St. Bernard of Clairvaux''s Life of St. Malachy of Armagh (Vita sancti Malachiae)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['sao-bernardo-de-claraval', 'st-bernard-of-clairvauxs-life-of-st-malachy-of-armagh', 'classicos-cristaos'],
  '/texts/st-bernard-of-clairvauxs-life-of-st-malachy-of-armagh.md',
  'vida-de-sao-malaquias-bernardo-de-claraval',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Subida do Monte Carmelo (Subida del Monte Carmelo)',
  (SELECT id FROM authors WHERE slug = 'sao-joao-da-cruz'),
  'Português',
  'Subida do Monte Carmelo (Subida del Monte Carmelo) por São João da Cruz. Edição canônica integral e anotada do Scriptorium Divinum.',
  'subida-do-monte-carmelo-joao-da-cruz',
  'Subida do Monte Carmelo (Subida del Monte Carmelo)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Mística Cristã e Teologia Negativa / Apofática'],
  ARRAY['sao-joao-da-cruz', 'subida-do-monte-carmelo-joao-da-cruz', 'classicos-cristaos'],
  '/texts/subida-do-monte-carmelo-joao-da-cruz.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Suma contra os Gentios: Livro I — De Deus em Si Mesmo (Summa contra Gentiles)',
  (SELECT id FROM authors WHERE slug = 'santo-tomas-de-aquino'),
  'Português',
  'Suma contra os Gentios: Livro I — De Deus em Si Mesmo (Summa contra Gentiles) por Santo Tomás de Aquino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'suma-contra-os-gentios-tomas-de-aquino',
  'Suma contra os Gentios: Livro I — De Deus em Si Mesmo (Summa contra Gentiles)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Escolástica e Apologética Filosófica'],
  ARRAY['santo-tomas-de-aquino', 'suma-contra-os-gentios-tomas-de-aquino', 'classicos-cristaos'],
  '/texts/suma-contra-os-gentios-tomas-de-aquino.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Suma Teológica — Primeira Parte da Segunda Parte (Prima Secundae)',
  (SELECT id FROM authors WHERE slug = 'santo-tomas-de-aquino'),
  'Português',
  'Suma Teológica — Primeira Parte da Segunda Parte (Prima Secundae) por Santo Tomás de Aquino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'suma-teologica-primeira-parte-da-segunda-parte',
  'Suma Teológica — Primeira Parte da Segunda Parte (Prima Secundae)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Moral e Escolástica'],
  ARRAY['santo-tomas-de-aquino', 'suma-teologica-primeira-parte-da-segunda-parte', 'classicos-cristaos'],
  '/texts/suma-teologica-primeira-parte-da-segunda-parte.md',
  'summa-theologica-part-i-ii-pars-prima-secundae',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Suma Teológica — Primeira Parte (Prima Pars)',
  (SELECT id FROM authors WHERE slug = 'santo-tomas-de-aquino'),
  'Português',
  'Suma Teológica — Primeira Parte (Prima Pars) por Santo Tomás de Aquino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'suma-teologica-primeira-parte',
  'Suma Teológica — Primeira Parte (Prima Pars)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Sistemática e Escolástica'],
  ARRAY['santo-tomas-de-aquino', 'suma-teologica-primeira-parte', 'classicos-cristaos'],
  '/texts/suma-teologica-primeira-parte.md',
  'summa-theologica-part-i-prima-pars',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Suma Teológica — Segunda Parte da Segunda Parte (Secunda Secundae)',
  (SELECT id FROM authors WHERE slug = 'santo-tomas-de-aquino'),
  'Português',
  'Suma Teológica — Segunda Parte da Segunda Parte (Secunda Secundae) por Santo Tomás de Aquino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'suma-teologica-segunda-parte-da-segunda-parte',
  'Suma Teológica — Segunda Parte da Segunda Parte (Secunda Secundae)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Moral e Virtudes Escolásticas'],
  ARRAY['santo-tomas-de-aquino', 'suma-teologica-segunda-parte-da-segunda-parte', 'classicos-cristaos'],
  '/texts/suma-teologica-segunda-parte-da-segunda-parte.md',
  'summa-theologica-part-ii-ii-secunda-secundae',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Suma Teológica — Terceira Parte (Tertia Pars)',
  (SELECT id FROM authors WHERE slug = 'santo-tomas-de-aquino'),
  'Português',
  'Suma Teológica — Terceira Parte (Tertia Pars) por Santo Tomás de Aquino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'suma-teologica-terceira-parte',
  'Suma Teológica — Terceira Parte (Tertia Pars)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Cristologia e Teologia Sacramental'],
  ARRAY['santo-tomas-de-aquino', 'suma-teologica-terceira-parte', 'classicos-cristaos'],
  '/texts/suma-teologica-terceira-parte.md',
  'summa-theologica-part-iii-tertia-pars',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Summa Theologica, Part I-II (Pars Prima Secundae) (Summa Theologiae, Prima Secundae)',
  (SELECT id FROM authors WHERE slug = 'sao-tomas-de-aquino'),
  'Inglês',
  'Summa Theologica, Part I-II (Pars Prima Secundae) (Summa Theologiae, Prima Secundae) por São Tomás de Aquino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'summa-theologica-part-i-ii-pars-prima-secundae',
  'Summa Theologica, Part I-II (Pars Prima Secundae) (Summa Theologiae, Prima Secundae)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['sao-tomas-de-aquino', 'summa-theologica-part-i-ii-pars-prima-secundae', 'classicos-cristaos'],
  '/texts/summa-theologica-part-i-ii-pars-prima-secundae.md',
  'suma-teologica-primeira-parte-da-segunda-parte',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Summa Theologica, Part I (Prima Pars) (Summa Theologiae, Prima Pars)',
  (SELECT id FROM authors WHERE slug = 'sao-tomas-de-aquino'),
  'Inglês',
  'Summa Theologica, Part I (Prima Pars) (Summa Theologiae, Prima Pars) por São Tomás de Aquino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'summa-theologica-part-i-prima-pars',
  'Summa Theologica, Part I (Prima Pars) (Summa Theologiae, Prima Pars)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['sao-tomas-de-aquino', 'summa-theologica-part-i-prima-pars', 'classicos-cristaos'],
  '/texts/summa-theologica-part-i-prima-pars.md',
  'suma-teologica-primeira-parte',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Summa Theologica, Part II-II (Secunda Secundae) (Summa Theologiae, Secunda Secundae)',
  (SELECT id FROM authors WHERE slug = 'sao-tomas-de-aquino'),
  'Inglês',
  'Summa Theologica, Part II-II (Secunda Secundae) (Summa Theologiae, Secunda Secundae) por São Tomás de Aquino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'summa-theologica-part-ii-ii-secunda-secundae',
  'Summa Theologica, Part II-II (Secunda Secundae) (Summa Theologiae, Secunda Secundae)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['sao-tomas-de-aquino', 'summa-theologica-part-ii-ii-secunda-secundae', 'classicos-cristaos'],
  '/texts/summa-theologica-part-ii-ii-secunda-secundae.md',
  'suma-teologica-segunda-parte-da-segunda-parte',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Summa Theologica, Part III (Tertia Pars) (Summa Theologiae, Tertia Pars)',
  (SELECT id FROM authors WHERE slug = 'sao-tomas-de-aquino'),
  'Inglês',
  'Summa Theologica, Part III (Tertia Pars) (Summa Theologiae, Tertia Pars) por São Tomás de Aquino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'summa-theologica-part-iii-tertia-pars',
  'Summa Theologica, Part III (Tertia Pars) (Summa Theologiae, Tertia Pars)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['sao-tomas-de-aquino', 'summa-theologica-part-iii-tertia-pars', 'classicos-cristaos'],
  '/texts/summa-theologica-part-iii-tertia-pars.md',
  'suma-teologica-terceira-parte',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Teologia Mistica Pseudo Dionisio',
  (SELECT id FROM authors WHERE slug = 'nota-introdutoria'),
  'Português',
  'Teologia Mistica Pseudo Dionisio por Nota Introdutória. Edição canônica integral e anotada do Scriptorium Divinum.',
  'teologia-mistica-pseudo-dionisio',
  'Teologia Mistica Pseudo Dionisio',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['nota-introdutoria', 'teologia-mistica-pseudo-dionisio', 'classicos-cristaos'],
  '/texts/teologia-mistica-pseudo-dionisio.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'The Apology of the Augsburg Confession (Apologia Confessionis Augustanae)',
  (SELECT id FROM authors WHERE slug = 'philipp-melanchthon'),
  'Inglês',
  'The Apology of the Augsburg Confession (Apologia Confessionis Augustanae) por Philipp Melanchthon. Edição canônica integral e anotada do Scriptorium Divinum.',
  'the-apology-of-the-augsburg-confession',
  'The Apology of the Augsburg Confession (Apologia Confessionis Augustanae)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['philipp-melanchthon', 'the-apology-of-the-augsburg-confession', 'classicos-cristaos'],
  '/texts/the-apology-of-the-augsburg-confession.md',
  'apologia-da-confissao-de-augsburgo',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'The Apostolic Tradition of Hippolytus (Ἀποστολικὴ παράδοσις)',
  (SELECT id FROM authors WHERE slug = 'hipolito-de-roma'),
  'Inglês',
  'The Apostolic Tradition of Hippolytus (Ἀποστολικὴ παράδοσις) por Hipólito de Roma. Edição canônica integral e anotada do Scriptorium Divinum.',
  'the-apostolic-tradition-of-hippolytus',
  'The Apostolic Tradition of Hippolytus (Ἀποστολικὴ παράδοσις)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['hipolito-de-roma', 'the-apostolic-tradition-of-hippolytus', 'classicos-cristaos'],
  '/texts/the-apostolic-tradition-of-hippolytus.md',
  'a-tradicao-apostolica-hipolito',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'The Confessions of St. Augustine (Confessiones)',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho-de-hipona'),
  'Inglês',
  'The Confessions of St. Augustine (Confessiones) por Santo Agostinho de Hipona. Edição canônica integral e anotada do Scriptorium Divinum.',
  'the-confessions-of-st-augustine',
  'The Confessions of St. Augustine (Confessiones)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['santo-agostinho-de-hipona', 'the-confessions-of-st-augustine', 'classicos-cristaos'],
  '/texts/the-confessions-of-st-augustine.md',
  'confissoes-santo-agostinho',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'The Consolation of Philosophy (De Consolatione Philosophiae)',
  (SELECT id FROM authors WHERE slug = 'severino-boecio'),
  'Inglês',
  'The Consolation of Philosophy (De Consolatione Philosophiae) por Boécio. Edição canônica integral e anotada do Scriptorium Divinum.',
  'the-consolation-of-philosophy',
  'The Consolation of Philosophy (De Consolatione Philosophiae)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['severino-boecio', 'the-consolation-of-philosophy', 'classicos-cristaos'],
  '/texts/the-consolation-of-philosophy.md',
  'a-consolacao-da-filosofia-boecio',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'The Holy War (The Holy War)',
  (SELECT id FROM authors WHERE slug = 'john-bunyan'),
  'Inglês',
  'The Holy War (The Holy War) por John Bunyan. Edição canônica integral e anotada do Scriptorium Divinum.',
  'the-holy-war',
  'The Holy War (The Holy War)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['john-bunyan', 'the-holy-war', 'classicos-cristaos'],
  '/texts/the-holy-war.md',
  'a-guerra-santa-john-bunyan',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'The Large Catechism (Der Große Katechismus, 1529)',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero-1483-1546'),
  'Inglês',
  'The Large Catechism (Der Große Katechismus, 1529) por Martinho Lutero (1483–1546). Edição canônica integral e anotada do Scriptorium Divinum.',
  'the-large-catechism',
  'The Large Catechism (Der Große Katechismus, 1529)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['martinho-lutero-1483-1546', 'the-large-catechism', 'classicos-cristaos'],
  '/texts/the-large-catechism.md',
  'o-catecismo-maior-martinho-lutero',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'The Pilgrim''s Progress (The Pilgrim''s Progress)',
  (SELECT id FROM authors WHERE slug = 'john-bunyan'),
  'Inglês',
  'The Pilgrim''s Progress (The Pilgrim''s Progress) por John Bunyan. Edição canônica integral e anotada do Scriptorium Divinum.',
  'the-pilgrims-progress',
  'The Pilgrim''s Progress (The Pilgrim''s Progress)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['john-bunyan', 'the-pilgrims-progress', 'classicos-cristaos'],
  '/texts/the-pilgrims-progress.md',
  'o-peregrino-pt',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'The Saints'' Everlasting Rest (The Saints'' Everlasting Rest)',
  (SELECT id FROM authors WHERE slug = 'richard-baxter'),
  'Inglês',
  'The Saints'' Everlasting Rest (The Saints'' Everlasting Rest) por Richard Baxter. Edição canônica integral e anotada do Scriptorium Divinum.',
  'the-saints-everlasting-rest',
  'The Saints'' Everlasting Rest (The Saints'' Everlasting Rest)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['richard-baxter', 'the-saints-everlasting-rest', 'classicos-cristaos'],
  '/texts/the-saints-everlasting-rest.md',
  'o-descanso-eterno-dos-santos-richard-baxter',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'The Teaching of the Twelve Apostles (Didache) (Διδαχὴ τῶν δώδεκα ἀποστόλων)',
  (SELECT id FROM authors WHERE slug = 'igreja-antiga'),
  'Inglês',
  'The Teaching of the Twelve Apostles (Didache) (Διδαχὴ τῶν δώδεκα ἀποστόλων) por Igreja Antiga. Edição canônica integral e anotada do Scriptorium Divinum.',
  'the-teaching-of-the-twelve-apostles-didache',
  'The Teaching of the Twelve Apostles (Didache) (Διδαχὴ τῶν δώδεκα ἀποστόλων)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['igreja-antiga', 'the-teaching-of-the-twelve-apostles-didache', 'classicos-cristaos'],
  '/texts/the-teaching-of-the-twelve-apostles-didache.md',
  'didaque',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Thoughts (Pensées)',
  (SELECT id FROM authors WHERE slug = 'blaise-pascal-1623-1662'),
  'Inglês',
  'Thoughts (Pensées) por Blaise Pascal (1623–1662). Edição canônica integral e anotada do Scriptorium Divinum.',
  'thoughts-pensees',
  'Thoughts (Pensées)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['blaise-pascal-1623-1662', 'thoughts-pensees', 'classicos-cristaos'],
  '/texts/thoughts-pensees.md',
  'pensamentos-blaise-pascal',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  '_Trabalhos de Jesus_ (1602–1609), Primeira e Segunda Parte, precedidos da _Vida_ do autor por D. Frei Aleixo de Meneses',
  (SELECT id FROM authors WHERE slug = 'frei-tome-de-jesus-osa-1529-1582-escrito-no-cativeiro-em-marrocos-depois-de-alcacer-quibir'),
  'Português',
  '_Trabalhos de Jesus_ (1602–1609), Primeira e Segunda Parte, precedidos da _Vida_ do autor por D. Frei Aleixo de Meneses por Frei Tomé de Jesus, OSA (1529–1582), escrito no cativeiro em Marrocos depois de Alcácer-Quibir. Edição canônica integral e anotada do Scriptorium Divinum.',
  'tome-de-jesus-trabalhos-de-jesus-1',
  '_Trabalhos de Jesus_ (1602–1609), Primeira e Segunda Parte, precedidos da _Vida_ do autor por D. Frei Aleixo de Meneses',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['frei-tome-de-jesus-osa-1529-1582-escrito-no-cativeiro-em-marrocos-depois-de-alcacer-quibir', 'tome-de-jesus-trabalhos-de-jesus-1', 'classicos-cristaos'],
  '/texts/tome-de-jesus-trabalhos-de-jesus-1.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tomo a Flaviano sobre a Dupla Natureza de Cristo (Epistola XXVIII — Tomus ad Flavianum)',
  (SELECT id FROM authors WHERE slug = 'sao-leao-magno'),
  'Português',
  'Tomo a Flaviano sobre a Dupla Natureza de Cristo (Epistola XXVIII — Tomus ad Flavianum) por São Leão Magno. Edição canônica integral e anotada do Scriptorium Divinum.',
  'tomo-a-flaviano-sao-leao-magno',
  'Tomo a Flaviano sobre a Dupla Natureza de Cristo (Epistola XXVIII — Tomus ad Flavianum)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Cristologia Conciliar'],
  ARRAY['sao-leao-magno', 'tomo-a-flaviano-sao-leao-magno', 'classicos-cristaos'],
  '/texts/tomo-a-flaviano-sao-leao-magno.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Trabalhos De Jesus Frei Tome',
  (SELECT id FROM authors WHERE slug = 'nota-historica'),
  'Português',
  'Trabalhos De Jesus Frei Tome por Nota Histórica. Edição canônica integral e anotada do Scriptorium Divinum.',
  'trabalhos-de-jesus-frei-tome',
  'Trabalhos De Jesus Frei Tome',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['nota-historica', 'trabalhos-de-jesus-frei-tome', 'classicos-cristaos'],
  '/texts/trabalhos-de-jesus-frei-tome.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Tradição Apostólica',
  (SELECT id FROM authors WHERE slug = 'nota-prefatoria'),
  'Português',
  'A Tradição Apostólica por Nota Prefatória. Edição canônica integral e anotada do Scriptorium Divinum.',
  'tradicao-apostolica-hipolito',
  'A Tradição Apostólica',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['nota-prefatoria', 'tradicao-apostolica-hipolito', 'classicos-cristaos'],
  '/texts/tradicao-apostolica-hipolito.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratado a Autólico: Apologia da Fé Cristã e da Criação (Ad Autolycum)',
  (SELECT id FROM authors WHERE slug = 'sao-teofilo-de-antioquia'),
  'Português',
  'Tratado a Autólico: Apologia da Fé Cristã e da Criação (Ad Autolycum) por São Teófilo de Antioquia. Edição canônica integral e anotada do Scriptorium Divinum.',
  'tratado-a-autolico-teofilo-antioquia',
  'Tratado a Autólico: Apologia da Fé Cristã e da Criação (Ad Autolycum)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Antiga e Apologética'],
  ARRAY['sao-teofilo-de-antioquia', 'tratado-a-autolico-teofilo-antioquia', 'classicos-cristaos'],
  '/texts/tratado-a-autolico-teofilo-antioquia.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratado do Amor de Deus (Traité de l''Amour de Dieu)',
  (SELECT id FROM authors WHERE slug = 'sao-francisco-de-sales'),
  'Português',
  'Tratado do Amor de Deus (Traité de l''Amour de Dieu) por São Francisco de Sales. Edição canônica integral e anotada do Scriptorium Divinum.',
  'tratado-do-amor-de-deus-francisco-de-sales',
  'Tratado do Amor de Deus (Traité de l''Amour de Dieu)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Mística e Espiritualidade Salesiana'],
  ARRAY['sao-francisco-de-sales', 'tratado-do-amor-de-deus-francisco-de-sales', 'classicos-cristaos'],
  '/texts/tratado-do-amor-de-deus-francisco-de-sales.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratado Do Purgatorio Catarina De Genova',
  (SELECT id FROM authors WHERE slug = 'prologo-e-introducao'),
  'Português',
  'Tratado Do Purgatorio Catarina De Genova por Prólogo e Introdução. Edição canônica integral e anotada do Scriptorium Divinum.',
  'tratado-do-purgatorio-catarina-de-genova',
  'Tratado Do Purgatorio Catarina De Genova',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['prologo-e-introducao', 'tratado-do-purgatorio-catarina-de-genova', 'classicos-cristaos'],
  '/texts/tratado-do-purgatorio-catarina-de-genova.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratado sobre a Primeira Epístola de São João',
  (SELECT id FROM authors WHERE slug = 'santo-agostinho-de-hipona'),
  'Português',
  'Tratado sobre a Primeira Epístola de São João por Santo Agostinho de Hipona. Edição canônica integral e anotada do Scriptorium Divinum.',
  'tratado-primeira-epistola-sao-joao-agostinho',
  'Tratado sobre a Primeira Epístola de São João',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Exegese Bíblica e Teologia da Caridade'],
  ARRAY['santo-agostinho-de-hipona', 'tratado-primeira-epistola-sao-joao-agostinho', 'classicos-cristaos'],
  '/texts/tratado-primeira-epistola-sao-joao-agostinho.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratado sobre a Oração (De Precatione)',
  (SELECT id FROM authors WHERE slug = 'sao-joao-crisostomo'),
  'Português',
  'Tratado sobre a Oração (De Precatione) por São João Crisóstomo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'tratado-sobre-a-oracao-crisostomo',
  'Tratado sobre a Oração (De Precatione)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística e Vida Interior'],
  ARRAY['sao-joao-crisostomo', 'tratado-sobre-a-oracao-crisostomo', 'classicos-cristaos'],
  '/texts/tratado-sobre-a-oracao-crisostomo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Pequeno Tratado sobre a Santa Ceia de Nosso Senhor Jesus Cristo',
  (SELECT id FROM authors WHERE slug = 'joao-calvino'),
  'Português',
  'Pequeno Tratado sobre a Santa Ceia de Nosso Senhor Jesus Cristo por João Calvino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'tratado-sobre-a-santa-ceia-calvino',
  'Pequeno Tratado sobre a Santa Ceia de Nosso Senhor Jesus Cristo',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia Reformada e Teologia Sacramental'],
  ARRAY['joao-calvino', 'tratado-sobre-a-santa-ceia-calvino', 'classicos-cristaos'],
  '/texts/tratado-sobre-a-santa-ceia-calvino.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratado sobre as Relíquias',
  (SELECT id FROM authors WHERE slug = 'joao-calvino'),
  'Português',
  'Tratado sobre as Relíquias por João Calvino. Edição canônica integral e anotada do Scriptorium Divinum.',
  'tratado-sobre-as-reliquias-calvino',
  'Tratado sobre as Relíquias',
  2026,
  'Scriptorium Divinum',
  ARRAY['Francês'],
  ARRAY['Teologia Reformada / Polêmica Pastoral e Crítica Eclesial'],
  ARRAY['joao-calvino', 'tratado-sobre-as-reliquias-calvino', 'classicos-cristaos'],
  '/texts/tratado-sobre-as-reliquias-calvino.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratados Do Desapego Mestre Eckhart',
  (SELECT id FROM authors WHERE slug = 'parte-i-o-que-e-o-desapego'),
  'Português',
  'Tratados Do Desapego Mestre Eckhart por Parte I — O que É o Desapego. Edição canônica integral e anotada do Scriptorium Divinum.',
  'tratados-do-desapego-mestre-eckhart',
  'Tratados Do Desapego Mestre Eckhart',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['parte-i-o-que-e-o-desapego', 'tratados-do-desapego-mestre-eckhart', 'classicos-cristaos'],
  '/texts/tratados-do-desapego-mestre-eckhart.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratados Patrísticos Fundamentais - Parte 1',
  (SELECT id FROM authors WHERE slug = 'sao-cipriano-de-cartago'),
  'Português',
  'Tratados Patrísticos Fundamentais - Parte 1 por São Cipriano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'tratados-patristicos-parte-1-cipriano-de-cartago',
  'Tratados Patrísticos Fundamentais - Parte 1',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Eclesiologia Patrística / Espiritualidade / Disciplina Eclesiástica'],
  ARRAY['sao-cipriano-de-cartago', 'tratados-patristicos-parte-1-cipriano-de-cartago', 'classicos-cristaos'],
  '/texts/tratados-patristicos-parte-1-cipriano-de-cartago.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Tratados Patrísticos Fundamentais - Parte 2',
  (SELECT id FROM authors WHERE slug = 'sao-cipriano-de-cartago'),
  'Português',
  'Tratados Patrísticos Fundamentais - Parte 2 por São Cipriano de Cartago. Edição canônica integral e anotada do Scriptorium Divinum.',
  'tratados-patristicos-parte-2-cipriano-de-cartago',
  'Tratados Patrísticos Fundamentais - Parte 2',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Espiritualidade Patrística / Moral Cristã / Teologia do Martírio'],
  ARRAY['sao-cipriano-de-cartago', 'tratados-patristicos-parte-2-cipriano-de-cartago', 'classicos-cristaos'],
  '/texts/tratados-patristicos-parte-2-cipriano-de-cartago.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Trinta E Nove Artigos Da Religiao',
  (SELECT id FROM authors WHERE slug = 'parte-i-a-fe-na-santissima-trindade-artigos-i-v'),
  'Português',
  'Trinta E Nove Artigos Da Religiao por Parte I: A Fé na Santíssima Trindade (Artigos I–V). Edição canônica integral e anotada do Scriptorium Divinum.',
  'trinta-e-nove-artigos-da-religiao',
  'Trinta E Nove Artigos Da Religiao',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['parte-i-a-fe-na-santissima-trindade-artigos-i-v', 'trinta-e-nove-artigos-da-religiao', 'classicos-cristaos'],
  '/texts/trinta-e-nove-artigos-da-religiao.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Vida de Santa Macrina (Vita Sanctae Macrinae)',
  (SELECT id FROM authors WHERE slug = 'gregorio-de-nissa'),
  'Português',
  'A Vida de Santa Macrina (Vita Sanctae Macrinae) por Gregório de Nissa. Edição canônica integral e anotada do Scriptorium Divinum.',
  'vida-de-santa-macrina-gregorio-nissa',
  'A Vida de Santa Macrina (Vita Sanctae Macrinae)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Grega e Biografia Monástica'],
  ARRAY['gregorio-de-nissa', 'vida-de-santa-macrina-gregorio-nissa', 'classicos-cristaos'],
  '/texts/vida-de-santa-macrina-gregorio-nissa.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Vida de Santo Antão (Vita Antonii)',
  (SELECT id FROM authors WHERE slug = 'santo-atanasio-de-alexandria'),
  'Português',
  'Vida de Santo Antão (Vita Antonii) por Santo Atanásio de Alexandria. Edição canônica integral e anotada do Scriptorium Divinum.',
  'vida-de-santo-antao-atanasio',
  'Vida de Santo Antão (Vita Antonii)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística e Hagiografia Monástica'],
  ARRAY['santo-atanasio-de-alexandria', 'vida-de-santo-antao-atanasio', 'classicos-cristaos'],
  '/texts/vida-de-santo-antao-atanasio.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Vida de Santo Hilarião (Vita Sancti Hilarionis)',
  (SELECT id FROM authors WHERE slug = 'sao-jeronimo'),
  'Português',
  'Vida de Santo Hilarião (Vita Sancti Hilarionis) por São Jerônimo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'vida-de-santo-hilariao-jeronimo',
  'Vida de Santo Hilarião (Vita Sancti Hilarionis)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Hagiografia Monástica'],
  ARRAY['sao-jeronimo', 'vida-de-santo-hilariao-jeronimo', 'classicos-cristaos'],
  '/texts/vida-de-santo-hilariao-jeronimo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Vida de São Bento (Diálogos, Livro II)',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-magno'),
  'Português',
  'Vida de São Bento (Diálogos, Livro II) por São Gregório Magno. Edição canônica integral e anotada do Scriptorium Divinum.',
  'vida-de-sao-bento-dialogos-gregorio-magno',
  'Vida de São Bento (Diálogos, Livro II)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística e Hagiografia Monástica Ocidental'],
  ARRAY['sao-gregorio-magno', 'vida-de-sao-bento-dialogos-gregorio-magno', 'classicos-cristaos'],
  '/texts/vida-de-sao-bento-dialogos-gregorio-magno.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'A Vida de São Malaquias de Armagh',
  (SELECT id FROM authors WHERE slug = 'tradicao-classica-crista'),
  'Português',
  'A Vida de São Malaquias de Armagh por Tradição Clássica Cristã. Edição canônica integral e anotada do Scriptorium Divinum.',
  'vida-de-sao-malaquias-bernardo-de-claraval',
  'A Vida de São Malaquias de Armagh',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Teologia e Espiritualidade Clássica'],
  ARRAY['tradicao-classica-crista', 'vida-de-sao-malaquias-bernardo-de-claraval', 'classicos-cristaos'],
  '/texts/vida-de-sao-malaquias-bernardo-de-claraval.md',
  'st-bernard-of-clairvauxs-life-of-st-malachy-of-armagh',
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Vida de São Malaquias, o Monge Cativo (Vita Malchi)',
  (SELECT id FROM authors WHERE slug = 'sao-jeronimo'),
  'Português',
  'Vida de São Malaquias, o Monge Cativo (Vita Malchi) por São Jerônimo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'vida-de-sao-malaquias-jeronimo',
  'Vida de São Malaquias, o Monge Cativo (Vita Malchi)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Hagiografia Monástica'],
  ARRAY['sao-jeronimo', 'vida-de-sao-malaquias-jeronimo', 'classicos-cristaos'],
  '/texts/vida-de-sao-malaquias-jeronimo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Vida de São Martinho de Tours',
  (SELECT id FROM authors WHERE slug = 'sulpicio-severo'),
  'Português',
  'Vida de São Martinho de Tours por Sulpício Severo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'vida-de-sao-martinho-sulpicio-severo',
  'Vida de São Martinho de Tours',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Hagiografia / Espiritualidade / Monaquismo Primitivo'],
  ARRAY['sulpicio-severo', 'vida-de-sao-martinho-sulpicio-severo', 'classicos-cristaos'],
  '/texts/vida-de-sao-martinho-sulpicio-severo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;
INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  related_edition_slug,
  featured, published, translation_is_ai,
  license_type, attribution_text
)
VALUES (
  'Vida de São Paulo, o Primeiro Eremita (Vita Sancti Pauli)',
  (SELECT id FROM authors WHERE slug = 'sao-jeronimo'),
  'Português',
  'Vida de São Paulo, o Primeiro Eremita (Vita Sancti Pauli) por São Jerônimo. Edição canônica integral e anotada do Scriptorium Divinum.',
  'vida-de-sao-paulo-eremita-jeronimo',
  'Vida de São Paulo, o Primeiro Eremita (Vita Sancti Pauli)',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim'],
  ARRAY['Patrística Latina e Hagiografia Monástica'],
  ARRAY['sao-jeronimo', 'vida-de-sao-paulo-eremita-jeronimo', 'classicos-cristaos'],
  '/texts/vida-de-sao-paulo-eremita-jeronimo.md',
  NULL,
  false,
  true,
  true,
  'public-domain',
  'Domínio público / Scriptorium Divinum 2026'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  online_read_path = EXCLUDED.online_read_path,
  language = EXCLUDED.language,
  related_edition_slug = EXCLUDED.related_edition_slug,
  published = EXCLUDED.published;

COMMIT;
