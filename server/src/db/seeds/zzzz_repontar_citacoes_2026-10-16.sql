-- ==============================================================================
-- Citações cujo link apontava para uma edição ocultada (2026-10-16)
--
-- As citações do Scriptorium estão em português, mas 12 delas linkavam para a
-- página da edição em inglês (the-city-of-god, thoughts-pensees,
-- institutes-of-the-christian-religion, summa-theologica-part-i-prima-pars,
-- proslogium-monologium-cur-deus-homo). Com só obras em português no ar, esses
-- links levariam a um 404. Este seed roda depois de zzzz_ocultar_obras.
--
-- Regra 1 (genérica): se a edição linkada está oculta e a edição em português
-- vinculada (related_edition_slug) está publicada, a citação passa a apontar
-- para a em português. Vale também para casos futuros.
-- Regra 2: as duas citações de Anselmo são trechos do Proslogion (capítulo 1),
-- obra hoje oculta por revisão pendente; passam a apontar para `proslogion`
-- assim que ele estiver publicado de novo, sem mexer em nada a mais.
-- ==============================================================================

UPDATE quotes q
SET scriptorium_url = regexp_replace(q.scriptorium_url, '[^/]+$', pt.slug)
FROM books en
JOIN books pt ON pt.slug = en.related_edition_slug
WHERE en.published = false
  AND pt.published = true
  AND pt.language = 'Português'
  AND q.scriptorium_url ~ ('/livros/' || en.slug || '$');

UPDATE quotes
SET scriptorium_url = regexp_replace(scriptorium_url, '[^/]+$', 'proslogion')
WHERE scriptorium_url ~ '/livros/proslogium-monologium-cur-deus-homo$'
  AND EXISTS (SELECT 1 FROM books WHERE slug = 'proslogion' AND published = true);

-- Regra 3: duas citações de Pascal apontavam para `pensamentos`, slug que nunca
-- existiu (404 em produção). A obra é `pensamentos-blaise-pascal`.
UPDATE quotes
SET scriptorium_url = regexp_replace(scriptorium_url, '[^/]+$', 'pensamentos-blaise-pascal')
WHERE scriptorium_url ~ '/livros/pensamentos$'
  AND NOT EXISTS (SELECT 1 FROM books WHERE slug = 'pensamentos')
  AND EXISTS (SELECT 1 FROM books WHERE slug = 'pensamentos-blaise-pascal' AND published = true);
