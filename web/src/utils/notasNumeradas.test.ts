import { describe, it, expect } from 'vitest';
import { converterNotas, relocarNotas } from './notasNumeradas';

describe('converterNotas', () => {
  it('converte chamada [n] e definição "[n] texto" quando há 1 de cada na obra', () => {
    const md = 'Texto que cita a ordem[1]; e segue.\n\n[1] Veja a Vida, seg. 6.\n';
    expect(converterNotas(md)).toBe('Texto que cita a ordem[^n1]; e segue.\n\n[^n1]: Veja a Vida, seg. 6.\n');
  });

  it('deixa intacto o id ambíguo (2 chamadas ou 2 definições), sem chutar', () => {
    const duas = 'a[1] e b[1]\n\n[1] nota\n';
    expect(converterNotas(duas)).toBe(duas);
    const defRepetida = 'a[2]\n\n[2] nota A\n\n[2] nota B\n';
    expect(converterNotas(defRepetida)).toBe(defRepetida);
  });

  it('deixa intacta chamada sem definição (ex.: referência a manuscrito [1201])', () => {
    const md = 'o Bodleian MS., Rawl. B. 502,[1201] tem a mesma genealogia';
    expect(converterNotas(md)).toBe(md);
  });

  it('reconhece chamada precedida de espaço, como em "; [3798] que"', () => {
    const md = 'o sistema desses homens; [3798] que te entreguei\n\n[3798] [Nota do editor] texto\n';
    expect(converterNotas(md)).toBe('o sistema desses homens; [^n3798] que te entreguei\n\n[^n3798]: [Nota do editor] texto\n');
  });

  it('não mexe em bloco de código nem em link [1](url)', () => {
    const md = '```\nx[1]\n[1] y\n```\n\nVeja [1](http://a.b) e c[1]\n\n[1] nota\n';
    // o link [1](url) não conta como chamada; dentro do código não se mexe
    expect(converterNotas(md)).toBe('```\nx[1]\n[1] y\n```\n\nVeja [1](http://a.b) e c[^n1]\n\n[^n1]: nota\n');
  });
});

describe('relocarNotas', () => {
  const cap = (id: string, body: string) => ({ id, title: id, level: 2, body });

  it('leva a definição para o capítulo que tem a chamada', () => {
    const r = relocarNotas([cap('a', 'texto[^n1] fim'), cap('b', 'outro\n\n[^n1]: a nota')]);
    expect(r[0]!.body).toContain('[^n1]: a nota');
    expect(r[1]!.body).not.toContain('[^n1]: a nota');
  });

  it('não duplica quando a definição já está no mesmo capítulo', () => {
    const r = relocarNotas([cap('a', 'texto[^n1]\n\n[^n1]: a nota')]);
    expect(r[0]!.body.match(/\[\^n1\]:/g)).toHaveLength(1);
  });

  it('não mexe em capítulo sem chamadas', () => {
    const c = cap('a', 'sem notas');
    expect(relocarNotas([c])[0]!.body).toBe('sem notas');
  });
});
