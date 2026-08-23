import { describe, it, expect } from 'vitest';
import { markdownToSpeechText, splitIntoChunks, pickPortugueseVoice } from './speech';

describe('markdownToSpeechText', () => {
  it('remove marcação e mantém o texto legível', () => {
    const md = '## Capítulo 1\n\nEra **um** dia [claro](https://x.com) e *sereno*.';
    expect(markdownToSpeechText(md)).toBe('Capítulo 1 Era um dia claro e sereno.');
  });

  it('remove código, imagens e citações', () => {
    const md = '> Fala dele\n\n```\ncodigo estranho\n```\n\n![capa](img.png)\n\nTexto final.';
    const r = markdownToSpeechText(md);
    expect(r).not.toContain('codigo');
    expect(r).not.toContain('img.png');
    expect(r).toContain('Fala dele');
    expect(r).toContain('Texto final.');
  });

  it('não deixa marcadores de lista no áudio', () => {
    expect(markdownToSpeechText('- primeiro\n- segundo')).toBe('primeiro segundo');
  });
});

describe('splitIntoChunks', () => {
  it('quebra por frase respeitando o limite', () => {
    const text = 'Primeira frase curta. Segunda frase também é breve. Terceira encerra. ';
    const chunks = splitIntoChunks(text, 40);
    expect(chunks.length).toBeGreaterThan(1);
    for (const c of chunks) {
      expect(c.length).toBeLessThanOrEqual(60);
      expect(c.trim()).toMatch(/[a-záéíóúâêôãõç.]$/i);
    }
  });

  it('não perde palavras na divisão', () => {
    const text = 'Um dois três quatro cinco seis sete oito nove dez onze doze treze quatorze quinze.';
    const joined = splitIntoChunks(text, 30).join(' ');
    expect(joined.replace(/\s+/g, ' ')).toBe(text);
  });

  it('fatiamento bruto para sentença gigante', () => {
    const huge = `${'palavra '.repeat(80)}.`;
    const chunks = splitIntoChunks(huge, 200);
    expect(chunks.every(c => c.length <= 300)).toBe(true);
  });
});

describe('pickPortugueseVoice', () => {
  it('prefere pt-BR, aceita pt genérico, ignora outras', () => {
    const mk = (lang: string, name: string): SpeechSynthesisVoice =>
      ({ lang, name }) as unknown as SpeechSynthesisVoice;
    const synth = {
      getVoices: () => [mk('en-US', 'A'), mk('pt-PT', 'B'), mk('pt-BR', 'C')],
    };
    expect(pickPortugueseVoice(synth)?.name).toBe('C');
    expect(
      pickPortugueseVoice({ getVoices: () => [mk('en-US', 'A'), mk('pt-PT', 'B')] })?.name,
    ).toBe('B');
    expect(pickPortugueseVoice({ getVoices: () => [mk('en-US', 'A')] })).toBeNull();
  });
});
