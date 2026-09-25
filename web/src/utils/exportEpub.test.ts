import { describe, it, expect } from 'vitest';
import { unzipSync, strFromU8 } from 'fflate';
import { buildEpub } from './exportEpub';

describe('buildEpub', () => {
  const base = {
    title: 'Confissões',
    author: 'Santo Agostinho',
    content: '# Livro I\n\n**Texto forte.**\n\n- item um\n- item dois',
  };

  it('gera um arquivo ZIP válido com estrutura EPUB 3', () => {
    const epub = buildEpub({ ...base, slug: 'confissoes' });
    const unzipped = unzipSync(epub);

    expect('mimetype' in unzipped).toBe(true);
    expect(strFromU8(unzipped['mimetype'])).toBe('application/epub+zip');
    expect('META-INF/container.xml' in unzipped).toBe(true);
    expect('OEBPS/content.opf' in unzipped).toBe(true);
    expect('OEBPS/chapter.xhtml' in unzipped).toBe(true);
    expect('OEBPS/nav.xhtml' in unzipped).toBe(true);
    expect('OEBPS/style.css' in unzipped).toBe(true);
  });

  it('converte markdown para HTML no capítulo', () => {
    const epub = buildEpub(base);
    const unzipped = unzipSync(epub);
    const chapter = strFromU8(unzipped['OEBPS/chapter.xhtml']);

    expect(chapter).toContain('<h1>Confissões</h1>');
    expect(chapter).toContain('<strong>Texto forte.</strong>');
    expect(chapter).toContain('<ul>');
    expect(chapter).toContain('<li>item um</li>');
  });
});