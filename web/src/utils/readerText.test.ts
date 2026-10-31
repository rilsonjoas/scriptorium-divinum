import { describe, it, expect } from 'vitest';
import { limparCallouts, normalizarReguas, normalizarTitulos, splitProvenance } from './readerText';

describe('limparCallouts', () => {
  it('tira o marcador [!NOTE] e mantém a citação', () => {
    expect(limparCallouts('> [!NOTE]\n> Texto da nota.')).toBe('> Texto da nota.');
  });

  it('transforma o título que vem na mesma linha em negrito', () => {
    expect(limparCallouts('> [!NOTE] Tradução por IA — Transparência\n> Corpo.')).toBe(
      '> **Tradução por IA — Transparência**\n>\n> Corpo.',
    );
  });

  it('não mexe em citação comum nem em colchetes no meio do texto', () => {
    const md = '> Citação comum.\n\nUm texto com [!NOTE] no meio.';
    expect(limparCallouts(md)).toBe(md);
  });
});

describe('splitProvenance com frontmatter', () => {
  const fm = '---\nid: "x"\ntitle: "Obra"\nauthor: "A"\n---\n\n';

  it('descarta o frontmatter YAML: ele nunca é o texto de contexto', () => {
    const { provenance, content } = splitProvenance(`${fm}# Obra\n### Autor\n\n---\n\n# Capítulo\n\nCorpo.`);
    expect(provenance).toBeNull();
    expect(content).not.toContain('id: "x"');
    expect(content).toContain('Corpo.');
  });

  it('o bloco de título é pulado e a seção Proveniência vira o contexto', () => {
    const texto = `${fm}# Obra\n### Autor\n\n---\n\n# Proveniência e Contexto\n\n> Nota.\n\n---\n\n## Prefácio\n\nCorpo.`;
    const { provenance, content } = splitProvenance(texto);
    expect(provenance).toContain('# Proveniência e Contexto');
    expect(provenance).not.toContain('id: "x"');
    expect(content).toContain('## Prefácio');
    expect(content).not.toContain('> Nota.');
  });

  it('sem seção de proveniência, nada some do texto de leitura', () => {
    const { provenance, content } = splitProvenance(`${fm}# Obra\n\nIntrodução longa.\n\n---\n\n## Cap\n\nCorpo.`);
    expect(provenance).toBeNull();
    expect(content).toContain('Introdução longa.');
    expect(content).toContain('Corpo.');
  });
});

describe('normalizarTitulos', () => {
  it('usa os # de dentro como nível do título (## ### Artigo -> ### Artigo)', () => {
    expect(normalizarTitulos('## ### Artigo 1: Se Deus existe')).toBe('### Artigo 1: Se Deus existe');
    expect(normalizarTitulos('## ## Questão 2')).toBe('## Questão 2');
    expect(normalizarTitulos('## # Livro 1')).toBe('# Livro 1');
  });

  it('não mexe em título comum, em hashtag nem em # dentro de parágrafo', () => {
    const md = '## Capítulo I\n\n#hashtag e # solto\n\nTexto com ## no meio.\n\n### Sub';
    expect(normalizarTitulos(md)).toBe(md);
  });

  it('só atua no começo da linha', () => {
    expect(normalizarTitulos('texto ## ### Artigo')).toBe('texto ## ### Artigo');
  });
});

describe('normalizarReguas', () => {
  it('traços colados ao fim do parágrafo viram régua horizontal em linha própria', () => {
    expect(normalizarReguas('a teologia difere em espécie. _______________________\n\n## Artigo 2')).toBe(
      'a teologia difere em espécie.\n\n***\n\n## Artigo 2',
    );
  });

  it('não mexe em linha que já é só traços, em sublinhado de palavra nem em campo a preencher no meio da frase', () => {
    const md = '_____\n\nfoi _enfatizado_ aqui\n\nNome: _____ e idade: 30';
    expect(normalizarReguas(md)).toBe(md);
  });

  it('tolera espaço no fim da linha', () => {
    expect(normalizarReguas('fim. ______   \nPróximo')).toBe('fim.\n\n***\nPróximo');
  });
});
