import { describe, it, expect } from 'vitest';
import { splitIntoChapters, chapterIndexById, agruparCapitulosCurtos } from './chapters';

describe('splitIntoChapters', () => {
  it('junta ao capítulo seguinte o bloco de título que não tem nenhum parágrafo', () => {
    // De Veritate: título, autor e linha horizontal viravam um capítulo sozinho
    const md = '# Tratado\n### *Anselmo (c. 1080)*\n\n---\n\n# Introdução\n\nTexto da introdução.\n\n## Capítulo I\n\naaa';
    const caps = splitIntoChapters(md);
    expect(caps).toHaveLength(2);
    expect(caps[0].title).toBe('Introdução');
    expect(caps[0].body).toContain('# Tratado');
    expect(caps[0].body).toContain('Texto da introdução.');
    expect(caps[1].title).toBe('Capítulo I');
  });

  it('não junta capítulo que tem parágrafo, mesmo curto', () => {
    const md = '# Um\n\naaa\n\n# Dois\n\nbbb';
    expect(splitIntoChapters(md)).toHaveLength(2);
  });

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

  it('mantém subtítulos (nível 3) dentro do capítulo pai', () => {
    const md = '# Parte\n\ntexto\n\n## Secao\n\nmais\n\n### Sub\n\nfim';
    const caps = splitIntoChapters(md);
    // nível 1 e 2 abrem capítulo; o nível 3 fica dentro da seção
    expect(caps).toHaveLength(2);
    expect(caps[1].title).toBe('Secao');
    expect(caps[1].body).toContain('### Sub');
  });

  it('segmenta obras que usam ## Capitulo como unidade (padrão do acervo)', () => {
    // Estrutura real de Confissões: # Titulo + epigrafe, depois 170 "## Capitulo"
    const md = '# Confissões de Santo Agostinho\n\n*Edição Garnier*\n\n## Capítulo I\n\naaa\n\n## Capítulo II\n\nbbb';
    const caps = splitIntoChapters(md);
    // 1 capitulo para o titulo/epigrafe + 2 capitulos
    expect(caps).toHaveLength(3);
    expect(caps[0].title).toBe('Confissões de Santo Agostinho');
    expect(caps[1].title).toBe('Capítulo I');
    expect(caps[2].title).toBe('Capítulo II');
    // o titulo e os capitulos sao unidades navegueis distintas
    expect(caps.every((c) => c.body.trim().length > 0)).toBe(true);
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

describe('agruparCapitulosCurtos', () => {
  const cap = (id: string, n: number) => ({ id, title: id, level: 2, body: `## ${id}\n\n${'x'.repeat(n)}` });

  it('junta capítulos curtos até passar do mínimo, mantendo id e título do primeiro', () => {
    const r = agruparCapitulosCurtos([cap('a', 300), cap('b', 300), cap('c', 300), cap('d', 2000)], 900);
    expect(r.map((c) => c.id)).toEqual(['a', 'd']);
    expect(r[0].body).toContain('## b');
    expect(r[0].body).toContain('## c');
  });

  it('não mexe em capítulos que já são longos', () => {
    const r = agruparCapitulosCurtos([cap('a', 2000), cap('b', 2000)], 900);
    expect(r.map((c) => c.id)).toEqual(['a', 'b']);
  });

  it('um curto no fim vai para o capítulo anterior', () => {
    const r = agruparCapitulosCurtos([cap('a', 2000), cap('b', 100)], 900);
    expect(r).toHaveLength(1);
    expect(r[0].body).toContain('## b');
  });

  it('obra só com um capítulo curto continua com ele', () => {
    expect(agruparCapitulosCurtos([cap('a', 100)], 900)).toHaveLength(1);
  });
});
