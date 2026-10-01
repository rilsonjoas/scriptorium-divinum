/**
 * Cobertura da allowlist contra o acervo REAL de produção.
 *
 * O teste de examples em `quote-sources.test.ts` prova que `isCuratedSource`
 * funciona; este prova que a lista está COMPLETA. São coisas diferentes, e a
 * segunda é a que importa: obra que falta na allowlist não dá erro nenhum —
 * só o CTA some, em silêncio, e a receita junto. Foi assim que "A Consolação
 * da Filosofia" (digitada `a consolao da filosofia`), "A Viagem do Peregrino da
 * Alvorada" (`do` por `da`), "Cartas de um diabo ao seu aprendiz" (`a seu` por
 * `ao seu`) e "Um Experimento em Crítica Literária" (sem o "a" final) todas
 * saíram da curadoria sem ninguém perceber.
 *
 * O par que NÃO deve ganhar CTA tem que estar em `PENDING_NO_CTA`, com motivo.
 * Assim "sem CTA" é sempre uma decisão registrada, nunca um esquecimento — e
 * obra nova entra no acervo fazendo este teste falhar, o que é o ponto.
 *
 * Fonte dos pares: `GET /api/v1/quotes` em 2026-10-01, 281 citações, 106 pares
 * autor/fonte distintos. Ao rodar o reparo de fontes ou mudar a curadoria,
 * regerere aqui.
 */
import { describe, expect, it } from 'vitest';
import { isCuratedSource, PENDING_NO_CTA } from './quote-sources.js';

/** [autor, fonte] — como está no banco de produção. `null` = fonte zerada. */
const PARES = [
  ["Agostinho de Hipona", "A Cidade de Deus"],
  ["Agostinho de Hipona", "A Cidade de Deus, Livro XI, cap. 26"],
  ["Agostinho de Hipona", "A Cidade de Deus, Livro XV, cap. 22"],
  ["Agostinho de Hipona", "A Doutrina Cristã, 1.35.39"],
  ["Agostinho de Hipona", "Confissões"],
  ["Agostinho de Hipona", "Confissões, Livro II, cap. 7"],
  ["Agostinho de Hipona", "Confissões, Livro III, cap. 13"],
  ["Agostinho de Hipona", "Confissões, Livro V, cap. 6"],
  ["Agostinho de Hipona", "Confissões, Livro V, cap. 8"],
  ["Agostinho de Hipona", "Confissões, Livro X, cap. 6"],
  ["Agostinho de Hipona", "De Vera Religione"],
  ["Agostinho de Hipona", "Enchiridion, 3.11"],
  ["Agostinho de Hipona", "Homilias sobre a Primeira Epístola de João, Homilia 7"],
  ["Agostinho de Hipona", "Sermão 43"],
  ["Agostinho de Hipona", "Sermão 52 (sobre Deus)"],
  ["Anselmo de Cantuária", "Por que Deus se fez Homem?"],
  ["Anselmo de Cantuária", "Proslógio, cap. 2-3"],
  ["Blaise Pascal", "Pensamentos"],
  ["Boécio", "A Consolação da Filosofia, Livro II"],
  ["Boécio", "A Consolação da Filosofia, Livro II, Prosa I"],
  ["Boécio", "A Consolação da Filosofia, Livro V, Prosa VI"],
  ["C. S. Lewis", "A Abolição do Homem"],
  ["C. S. Lewis", "A Anatomia de uma Dor"],
  ["C. S. Lewis", "A Última Batalha"],
  ["C. S. Lewis", "A Última Noite do Mundo"],
  ["C. S. Lewis", "A Viagem do Peregrino da Alvorada"],
  ["C. S. Lewis", "Aquela Fortaleza Medonha"],
  ["C. S. Lewis", "As crônicas de Nárnia: A Última Batalha"],
  ["C. S. Lewis", "As crônicas de Nárnia: Príncipe Caspian"],
  ["C. S. Lewis", "Até que Tenhamos Rostos"],
  ["C. S. Lewis", "Bluspels and Flalansferes (em Rehabilitations and Other Essays)"],
  ["C. S. Lewis", "Cartas de C. S. Lewis"],
  ["C. S. Lewis", "Cartas de um diabo ao seu aprendiz"],
  ["C. S. Lewis", "Cristianismo Puro e Simples"],
  ["C. S. Lewis", "Deus no Banco dos Réus"],
  ["C. S. Lewis", "Introdução a Sobre a encarnação de Atanásio"],
  ["C. S. Lewis", "Milagres"],
  ["C. S. Lewis", null],
  ["C. S. Lewis", "O Assunto do Céu"],
  ["C. S. Lewis", "O Cavalo e seu Menino"],
  ["C. S. Lewis", "O Grande Abismo"],
  ["C. S. Lewis", "O Leão, a Feiticeira e o Guarda-Roupa"],
  ["C. S. Lewis", "O Peso da Glória"],
  ["C. S. Lewis", "O Problema do Sofrimento"],
  ["C. S. Lewis", "O Sobrinho do Mago"],
  ["C. S. Lewis", "Oração: Cartas a Malcolm"],
  ["C. S. Lewis", "Os Quatro Amores"],
  ["C. S. Lewis", "Reflexões Cristãs"],
  ["C. S. Lewis", "Reflexões sobre os Salmos"],
  ["C. S. Lewis", "Sobre Histórias"],
  ["C. S. Lewis", "Surpreendido pela Alegria"],
  ["C. S. Lewis", "Um Experimento em Crítica Literária"],
  ["Dietrich Bonhoeffer", "Discipulado"],
  ["Dietrich Bonhoeffer", "Discipulado, cap. 1"],
  ["Dietrich Bonhoeffer", "Discipulado, cap. 2"],
  ["Dietrich Bonhoeffer", "Discipulado, cap. 5"],
  ["Dietrich Bonhoeffer", "Discipulado, cap. 6"],
  ["Dietrich Bonhoeffer", "Discipulado, p. 154"],
  ["Dietrich Bonhoeffer", "Discipulado, p. 19"],
  ["Dietrich Bonhoeffer", "Discipulado, p. 29-30"],
  ["Dietrich Bonhoeffer", "Discipulado, p. 34"],
  ["Dietrich Bonhoeffer", "Discipulado, p. 73"],
  ["G. K. Chesterton", "Illustrated London News, 31/12/1910"],
  ["G. K. Chesterton", "Ortodoxia"],
  ["G. K. Chesterton", "Ortodoxia, cap. VI"],
  ["G. K. Chesterton", "peça teatral de Chesterton (formulação popular; original usa \"discorda\" em vez de \"desobedece\")"],
  ["João Calvino", "A Verdadeira Vida Cristã"],
  ["João Calvino", "As Institutas"],
  ["João Calvino", "As Institutas da Religião Cristã"],
  ["John Bunyan", "O Peregrino"],
  ["John Bunyan", "O Progresso do Peregrino"],
  ["John Bunyan", "O Progresso do Peregrino, Parte I"],
  ["John Bunyan", "O Progresso do Peregrino, Parte I (linha final)"],
  ["John Bunyan", "O Progresso do Peregrino, Parte II (morte de Valente-pela-Verdade)"],
  ["Jonathan Edwards", "Afeições Religiosas"],
  ["Jonathan Edwards", "Afeições Religiosas, p. 195"],
  ["Jonathan Edwards", "Afeições Religiosas, p. 218"],
  ["Jonathan Edwards", "Afeições Religiosas, p. 25"],
  ["Jonathan Edwards", "Afeições Religiosas, p. 288"],
  ["Jonathan Edwards", "Afeições Religiosas, p. 44"],
  ["Martinho Lutero", "A liberdade do cristão"],
  ["Martinho Lutero", "As 95 Teses & Obras Escolhidas"],
  ["Martinho Lutero", "Castelo Forte é o Nosso Deus"],
  ["Martinho Lutero", "Do Servo Arbítrio"],
  ["Simone Weil", "A Gravidade e a Graça"],
  ["Simone Weil", "Carta a Joë Bousquet, 13/04/1942 (recolhida em Primeiros Escritos Filosóficos / Gravity and Grace)"],
  ["Simone Weil", "O Enraizamento"],
  ["Søren Kierkegaard", "Attack Upon Christendom"],
  ["Søren Kierkegaard", "Carta a Henriette Lund, 1847"],
  ["Søren Kierkegaard", "Diários"],
  ["Søren Kierkegaard", "Diários / Provocations"],
  ["Søren Kierkegaard", "Diários, 1º de agosto de 1835 (Gilleleje)"],
  ["Søren Kierkegaard", "O Conceito de Ironia"],
  ["Søren Kierkegaard", "Ponto de Vista Explicativo da Minha Obra como Escritor"],
  ["Søren Kierkegaard", "Provocations"],
  ["Søren Kierkegaard", "Temor e Tremor"],
  ["Tomás de Aquino", "Suma Teológica, I, q. 1, art. 8"],
  ["Tomás de Kempis", "Imitação de Cristo"],
  ["Tomás de Kempis", "Imitação de Cristo (\"Ama nesciri et pro nihilo reputari\")"],
  ["Tomás de Kempis", "Imitação de Cristo (\"Cogita frequenter ad quid venisti\")"],
  ["Tomás de Kempis", "Imitação de Cristo (\"Esse sine Iesu, gravis est infernus\")"],
  ["Tomás de Kempis", "Imitação de Cristo (\"Nunc tempus est faciendi\")"],
  ["Tomás de Kempis", "Imitação de Cristo (\"Omnia ergo vanitas, praeter amare Deum\")"],
  ["Tomás de Kempis", "Imitação de Cristo (\"Pauperrimus est qui vivit sine Iesu\")"],
  ["Tomás de Kempis", "Imitação de Cristo (\"Quando Iesus adest, totum bonum est\")"],
  ["Tomás de Kempis", "Imitação de Cristo (\"Si portare vis, porta et alium\")"],
] as const;

function semCtaJustificado(autor: string, fonte: string | null): boolean {
  return PENDING_NO_CTA.some((p) => p.author === autor && p.source === fonte);
}

describe('cobertura da allowlist contra o acervo de produção', () => {
  it('toda obra real de produção ou é curada, ou está justificada sem CTA', () => {
    const semJustificativa: string[] = [];
    for (const [autor, fonte] of PARES) {
      if (isCuratedSource(autor, fonte)) continue;
      if (!semCtaJustificado(autor, fonte)) {
        semJustificativa.push(`${autor} -> ${fonte ?? '(null)'}`);
      }
    }
    expect(
      semJustificativa,
      `obras sem CTA e sem justificativa em PENDING_NO_CTA:\n${semJustificativa.join('\n')}`,
    ).toEqual([]);
  });

  it('toda entrada de PENDING_NO_CTA corresponde a algo que existe no acervo', () => {
    // Evita a lista de pendências encher de lixo: um motivo que não casa com
    // par nenhum do banco é sinal de que o acervo mudou e ninguém revisou.
    const orfaos = PENDING_NO_CTA.filter(
      (p) => !PARES.some(([a, s]) => a === p.author && s === p.source),
    );
    expect(orfaos.map((p) => `${p.author} -> ${p.source}`)).toEqual([]);
  });

  it('a allowlist não devolve CTA para nenhuma fonte vazia ou igual ao autor', () => {
    for (const [autor, fonte] of PARES) {
      if (fonte === null) expect(isCuratedSource(autor, fonte), autor).toBe(false);
    }
    expect(isCuratedSource('C. S. Lewis', 'C. S. Lewis')).toBe(false);
    expect(isCuratedSource('C. S. Lewis', '  c. s. lewis  ')).toBe(false);
  });

  it('nenhuma obra real de produção gera o defeito do autor repetido', () => {
    // Regressão do bug de produção: `source` = nome do autor produzia
    // "?k=C. S. Lewis C. S. Lewis" na Amazon.
    for (const [autor, fonte] of PARES) {
      if (fonte === null) continue;
      const soAutor = fonte.trim().toLowerCase() === autor.trim().toLowerCase();
      expect(soAutor && isCuratedSource(autor, fonte), `fonte igual ao autor: ${fonte}`).toBe(false);
    }
  });
});
