import { describe, it, expect } from 'vitest';
import { splitIntoChapters, chapterIndexById } from './chapters';

describe('splitIntoChapters', () => {
  it('segue texto antes do primeiro heading como capitulo Início', () => {
    const md = 'Abertura do livro.\n\n# Capítulo Um\n\nCorpo do capítulo um.';
    const caps = splitIntoChapters(md);
    expect(caps[0].id).toBe('inicio');
    expect(caps[0].body).toContain('Abertura');
  });

  it('divide por headings de nível 1', () => {
    const md = '# Um\n\naaa\n\n# Dois\n\nbbb';
    const caps = splitIntoChapters(md);
    expect(caps).toHaveLength(2);
    expect(caps[0].title).toBe('Um');
    expect(caps[1].title).toBe('Dois');
  });

  it('mantém subtítulos (nível 2 e 3) dentro do capítulo pai', () => {
    const md = '# Parte\n\ntexto\n\n## Secao\n\nmais\n\n### Sub\n\nfim';
    const caps = splitIntoChapters(md);
    expect(caps).toHaveLength(1);
    expect(caps[0].body).toContain('## Secao');
    expect(caps[0].body).toContain('### Sub');
  });

  it('gera id legivel a partir do titulo (slug sem acento)', () => {
    const md = '# São Bento de Núrsia\n\ntexto';
    const caps = splitIntoChapters(md);
    expect(caps[0].id).toBe('sao-bento-de-nursia');
  });

  it('obra sem nenhum heading vira um capitulo só', () => {
    const md = 'Só texto corrido, sem estrutura.';
    const caps = splitIntoChapters(md);
    expect(caps).toHaveLength(1);
    expect(caps[0].body).toContain('Só texto');
  });

  it('não deixa capitulo vazio quando há heading vazio', () => {
    const md = '# Um\n\naaa\n\n#\n\nbbb';
    const caps = splitIntoChapters(md);
    // o "# " sem titulo cai no capitulo corrente, nao cria capitulo novo
    expect(caps.every((c) => c.body.trim().length > 0)).toBe(true);
  });
});

describe('chapterIndexById', () => {
  it('acha o indice do capitulo pelo id', () => {
    const caps = splitIntoChapters('# Um\n\na\n\n# Dois\n\nb');
    expect(chapterIndexById(caps, 'dois')).toBe(1);
    expect(chapterIndexById(caps, 'inexistente')).toBe(-1);
  });
});
