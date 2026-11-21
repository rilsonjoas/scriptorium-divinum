-- ==============================================================================
-- Faixa D: grava a edição-fonte confirmada em 38 obras e oculta as 3 que não se confirmaram (2026-11-21)
--
-- Decisão do autor: verificar as obras sem pista da fonte e ocultar só as que não se confirmassem.
-- Método (docs/PROVENIENCIA-ACERVO.md): comparação com a edição inglesa antiga de domínio público, por
--   (1) sequência de referências bíblicas (trigramas) contra 31 volumes do CCEL: o volume certo casou e o segundo
--       colocado ficou em ~0; essas referências entre parênteses são acréscimo editorial de Schaff, não do original;
--   (2) leitura lado a lado de trechos (Pascal, Lutero, Catecismo Maior, Sulpício, Suma, Cidade de Deus, Didaqué):
--       a frase em português é a tradução da frase inglesa, às vezes com o mesmo erro (Ecclus. -> Eclesiastes).
-- Não é parecer jurídico: é evidência de qual texto serviu de partida.
--
-- Só altera a atribuição de obra ainda publicada e de tradução por IA. Idempotente.
-- ==============================================================================

UPDATE books b
SET attribution_text = 'Tradução gerada por IA a partir de ' || t.edicao || ', em domínio público. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.',
    updated_at = now()
FROM (VALUES
      ('a-nobreza-crista-da-nacao-alema-lutero', 'First Principles of the Reformation, tradução inglesa de 1896 (CCEL)'),
      ('cartas-sobre-sao-martinho-sulpicio-severo', 'NPNF série 2, vol. 11 (Schaff, CCEL)'),
      ('catequeses-batismais-parte-1-cirilo-de-jerusalem', 'NPNF série 2, vol. 7 (Schaff, CCEL)'),
      ('catequeses-batismais-parte-2-cirilo-de-jerusalem', 'NPNF série 2, vol. 7 (Schaff, CCEL)'),
      ('dialogos-sobre-sao-martinho-sulpicio-severo', 'NPNF série 2, vol. 11 (Schaff, CCEL)'),
      ('didaque-doutrina-dos-doze-apostolos', 'ANF vol. 7 (Schaff, CCEL)'),
      ('hexaemeron-homilias-sobre-a-criacao-basilio-magno', 'NPNF série 2, vol. 8 (Schaff, CCEL)'),
      ('homilias-e-escritos-espirituais-crisostomo', 'Leaves from St. John Chrysostom, tradução de Mary H. Allies, 1889 (Project Gutenberg 62447)'),
      ('homilias-sobre-as-estatuas-parte-1-joao-crisostomo', 'NPNF série 1, vol. 9 (Schaff, CCEL)'),
      ('homilias-sobre-as-estatuas-parte-2-joao-crisostomo', 'NPNF série 1, vol. 9 (Schaff, CCEL)'),
      ('homilias-sobre-colossenses-joao-crisostomo', 'NPNF série 1, vol. 13 (Schaff, CCEL)'),
      ('homilias-sobre-filemom-joao-crisostomo', 'NPNF série 1, vol. 13 (Schaff, CCEL)'),
      ('homilias-sobre-filipenses-joao-crisostomo', 'NPNF série 1, vol. 13 (Schaff, CCEL)'),
      ('homilias-sobre-hebreus-parte-1-joao-crisostomo', 'NPNF série 1, vol. 14 (Schaff, CCEL)'),
      ('homilias-sobre-hebreus-parte-2-joao-crisostomo', 'NPNF série 1, vol. 14 (Schaff, CCEL)'),
      ('homilias-sobre-primeira-tessalonicenses-joao-crisostomo', 'NPNF série 1, vol. 13 (Schaff, CCEL)'),
      ('homilias-sobre-primeira-timoteo-joao-crisostomo', 'NPNF série 1, vol. 13 (Schaff, CCEL)'),
      ('homilias-sobre-segunda-tessalonicenses-joao-crisostomo', 'NPNF série 1, vol. 13 (Schaff, CCEL)'),
      ('homilias-sobre-segunda-timoteo-joao-crisostomo', 'NPNF série 1, vol. 13 (Schaff, CCEL)'),
      ('homilias-sobre-tito-joao-crisostomo', 'NPNF série 1, vol. 13 (Schaff, CCEL)'),
      ('o-catecismo-maior-martinho-lutero', 'Concordia Triglotta, tradução de Bente e Dau, 1921 (bookofconcord.org)'),
      ('paginas-douradas-sao-joao-crisostomo', 'Leaves from St. John Chrysostom, tradução de Mary H. Allies, 1889 (Project Gutenberg 62447)'),
      ('pensamentos-blaise-pascal', 'Pensées, tradução de W. F. Trotter (CCEL)'),
      ('sermoes-sobre-a-natividade-sao-leao-magno', 'NPNF série 2, vol. 12 (Schaff, CCEL)'),
      ('sermoes-sobre-o-misterio-pascal-sao-leao-magno', 'NPNF série 2, vol. 12 (Schaff, CCEL)'),
      ('sermoes-sobre-pentecostes-e-os-santos-sao-leao-magno', 'NPNF série 2, vol. 12 (Schaff, CCEL)'),
      ('sobre-a-criacao-do-homem-gregorio-de-nissa', 'NPNF série 2, vol. 5 (Schaff, CCEL)'),
      ('sobre-o-espirito-santo-ambrosio-de-milao', 'NPNF série 2, vol. 10 (Schaff, CCEL)'),
      ('sobre-os-deveres-do-clero-livro-1-ambrosio-de-milao', 'NPNF série 2, vol. 10 (Schaff, CCEL)'),
      ('sobre-os-deveres-do-clero-livros-2-e-3-ambrosio-de-milao', 'NPNF série 2, vol. 10 (Schaff, CCEL)'),
      ('sobre-os-sinodos-hilario-de-poitiers', 'NPNF série 2, vol. 9 (Schaff, CCEL)'),
      ('suma-teologica-primeira-parte', 'Suma Teológica (tradução inglesa dos Dominicanos, CCEL)'),
      ('suma-teologica-primeira-parte-da-segunda-parte', 'Suma Teológica (tradução inglesa dos Dominicanos, CCEL)'),
      ('suma-teologica-segunda-parte-da-segunda-parte', 'Suma Teológica (tradução inglesa dos Dominicanos, CCEL)'),
      ('suma-teologica-terceira-parte', 'Suma Teológica (tradução inglesa dos Dominicanos, CCEL)'),
      ('tratados-patristicos-parte-1-cipriano-de-cartago', 'ANF vol. 5 (Schaff, CCEL)'),
      ('tratados-patristicos-parte-2-cipriano-de-cartago', 'ANF vol. 5 (Schaff, CCEL)'),
      ('vida-de-sao-martinho-sulpicio-severo', 'NPNF série 2, vol. 11 (Schaff, CCEL)')
) AS t(slug, edicao)
WHERE b.slug = t.slug AND b.translation_is_ai AND b.published;

UPDATE books
SET published = false,
    featured = false,
    updated_at = now()
WHERE published = true
  AND slug IN (
    'aos-jovens-sobre-a-literatura-grega-basilio',
    'sobre-a-alma-e-a-ressurreicao-gregorio-de-nissa',
    'sobre-a-alma-e-a-ressurreicao-gregorio-nissa'
  );
