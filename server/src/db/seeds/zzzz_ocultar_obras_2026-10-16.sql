-- ==============================================================================
-- Obras ocultadas do site (decisão do autor, 2026-10-16)
--
-- Este seed roda POR ÚLTIMO de propósito (o migrate aplica os seeds em ordem
-- alfabética). Os seeds antigos fazem `published = EXCLUDED.published` a cada
-- deploy e republicariam o que fosse ocultado direto no banco. Para voltar a
-- publicar qualquer item abaixo, é só apagar a linha ou o arquivo: no deploy
-- seguinte os seeds originais republicam sozinhos.
--
-- 1. Só obras em português por enquanto. Edições em inglês e em latim ficam
--    fora do site até a internacionalização completa (interface, busca em
--    inglês e proveniência de cada edição).
-- 2. Obras com defeito de conteúdo, pendentes de reprocessamento ou revisão:
--      tratado-sobre-as-reliquias-calvino  arquivo corrompido (inglês fora de
--                                          ordem misturado ao texto de Calvino)
--      proslogion                          texto publicado tem 2.353 palavras;
--                                          há versão nova de 9.707 (em
--                                          proslogion-anselmo.md) aguardando
--                                          revisão antes de substituir
-- ==============================================================================

UPDATE books SET published = false WHERE language IS DISTINCT FROM 'Português';

UPDATE books SET published = false
WHERE slug IN ('tratado-sobre-as-reliquias-calvino', 'proslogion');
