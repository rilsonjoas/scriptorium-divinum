-- ============================================================
-- Reverte scripts/retirar_obras_sem_pd_2026-09-28.sql
-- Linhas exatas de `books` exportadas do banco de produção em 2026-09-28
-- (row_to_json), antes da retirada. Usar quando a tradução entrar em
-- domínio público (Institutas/Waldyr Luz: conferir a data de morte;
-- Compêndio/Odilão Moura †2010: 2081) e ajustar license_type então.
-- ============================================================

BEGIN;

INSERT INTO books SELECT * FROM json_populate_record(NULL::books, '{"id":"fb0de8a5-7c6a-4f30-b036-73d9be220dac","slug":"compendio-da-suma-teologica","title":"Compêndio de Teologia","original_title":"Compendium Theologiae","author_id":"d8b43dd2-d66b-4e9e-8078-0d15da457f9e","publication_year_original":"1273","publication_year_translation":1935,"translator":"D. Odilão Moura","language":"Português","original_languages":["Latim"],"description":"Síntese clara e profunda dos principais mistérios da fé cristã escrita por Santo Tomás de Aquino, estruturada sobre as três virtudes teologais: Fé, Esperança e Caridade.","categories":["Escolástica","Teologia Sistemática","Dogmática"],"tags":["fé","trindade","encarnação","virtudes","deus"],"cover_image_url":"/covers/compendio-da-suma-teologica.svg","online_read_path":"/texts/tomas-compendio.md","featured":true,"created_at":"2026-08-08T03:51:57.716626+00:00","updated_at":"2026-09-26T14:02:09.762491+00:00","license_type":"public-domain","attribution_text":null,"related_edition_slug":"compendium-theologiae"}');
INSERT INTO books SELECT * FROM json_populate_record(NULL::books, '{"id":"2f898c05-7cdd-45ff-8e85-9059712d251f","slug":"institutas-da-religiao-crista","title":"As Institutas da Religião Cristã","original_title":"Institutio Christianae Religionis","author_id":"0ac823b5-7813-4608-a973-23a2ac6a3459","publication_year_original":"1536-1559","publication_year_translation":1957,"translator":"Waldyr Carvalho Luz","language":"Português","original_languages":["Latim","Francês"],"description":"Tratado teológico monumental que definiu os fundamentos bíblicos da teologia reformada, abordando o conhecimento de Deus, a redenção em Cristo e a vida cristã.","categories":["Reforma Protestante","Teologia Sistemática","Eclesiologia"],"tags":["escrituras","salvação","predestinação","sacramentos","graça"],"cover_image_url":"/covers/institutas-da-religiao-crista.svg","online_read_path":"/texts/calvino-institutas.md","featured":true,"created_at":"2026-08-08T03:51:57.716626+00:00","updated_at":"2026-09-26T14:02:09.762491+00:00","license_type":"public-domain","attribution_text":null,"related_edition_slug":"institutes-of-the-christian-religion"}');

UPDATE quotes
   SET scriptorium_url = 'https://scriptorium.narniano.com/livros/institutas-da-religiao-crista'
 WHERE id IN ('f97f5fda-62ec-4692-974d-04d0e65065c1',
              '4140591a-a7c5-485e-8ea2-43c9f16644b7',
              '1389a186-3cc3-44aa-8f74-002dceddc44c');

UPDATE quotes
   SET scriptorium_url = 'https://scriptorium.narniano.com/livros/compendio-da-suma-teologica'
 WHERE id = 'cd1d84b2-3c23-414e-89f7-6593b1665939';

COMMIT;
