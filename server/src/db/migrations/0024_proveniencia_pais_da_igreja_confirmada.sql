-- ==============================================================================
-- Faixa D: grava a edição-fonte confirmada em 19 obras de Pais da Igreja (2026-11-21)
--
-- Mesmo método da migration 0023 (docs/PROVENIENCIA-ACERVO.md): a sequência de referências bíblicas de
-- cada obra em português, comparada com 31 volumes do CCEL (NPNF/ANF de Schaff, domínio público), casou
-- com um volume (>= 15% dos trigramas, margem >= 10 pontos sobre o segundo colocado). Essas referências
-- são acréscimo editorial de Schaff e colaboradores, então indicam a edição, não só a obra.
-- Não é parecer jurídico. Só altera atribuição de obra ainda publicada e de tradução por IA. Idempotente.
-- ==============================================================================

UPDATE books b
SET attribution_text = 'Tradução gerada por IA a partir de ' || t.edicao || ', em domínio público. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.',
    updated_at = now()
FROM (VALUES
      ('a-criacao-do-homem-gregorio-de-nissa', 'NPNF série 2, vol. 5 (Schaff, CCEL)'),
      ('a-demetriano-cipriano', 'ANF vol. 5 (Schaff, CCEL)'),
      ('a-oracao-do-senhor-cipriano', 'ANF vol. 5 (Schaff, CCEL)'),
      ('contra-helvidio-perpetua-virgindade-de-maria-jeronimo', 'NPNF série 2, vol. 6 (Schaff, CCEL)'),
      ('contra-praxeas-tertuliano', 'ANF vol. 3 (Schaff, CCEL)'),
      ('da-idolatria-tertuliano', 'ANF vol. 3 (Schaff, CCEL)'),
      ('da-paciencia-tertuliano', 'ANF vol. 3 (Schaff, CCEL)'),
      ('dialogo-contra-os-luciferianos-jeronimo', 'NPNF série 2, vol. 6 (Schaff, CCEL)'),
      ('exortacao-ao-martirio-cipriano', 'ANF vol. 5 (Schaff, CCEL)'),
      ('o-habito-das-virgens-cipriano', 'ANF vol. 5 (Schaff, CCEL)'),
      ('sobre-a-carne-de-cristo-tertuliano', 'ANF vol. 3 (Schaff, CCEL)'),
      ('sobre-a-oracao-tertuliano', 'ANF vol. 3 (Schaff, CCEL)'),
      ('sobre-a-ressurreicao-da-carne-tertuliano', 'ANF vol. 3 (Schaff, CCEL)'),
      ('sobre-a-virgindade-gregorio-de-nissa', 'NPNF série 2, vol. 5 (Schaff, CCEL)'),
      ('sobre-as-boas-obras-e-as-esmolas-cipriano', 'ANF vol. 5 (Schaff, CCEL)'),
      ('sobre-as-virgens-ambrosio-de-milao', 'NPNF série 2, vol. 10 (Schaff, CCEL)'),
      ('sobre-as-viuvas-ambrosio-de-milao', 'NPNF série 2, vol. 10 (Schaff, CCEL)'),
      ('sobre-o-batismo-tertuliano', 'ANF vol. 3 (Schaff, CCEL)'),
      ('sobre-os-caidos-cipriano', 'ANF vol. 5 (Schaff, CCEL)')
) AS t(slug, edicao)
WHERE b.slug = t.slug AND b.translation_is_ai AND b.published;
