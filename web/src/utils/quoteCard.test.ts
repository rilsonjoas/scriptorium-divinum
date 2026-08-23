import { describe, it, expect } from 'vitest';
import { normalizeQuote, fontSizeForQuote, quoteCardFileName } from './quoteCard';

describe('normalizeQuote', () => {
  it('colapsa espaços e quebras de linha', () => {
    expect(normalizeQuote('  linha um\n\ntab\taqui  ')).toBe('linha um tab aqui');
  });

  it('trunca citações longas com reticências limpas', () => {
    const long = 'a'.repeat(600);
    const r = normalizeQuote(long);
    expect(r.length).toBeLessThanOrEqual(560);
    expect(r.endsWith('...')).toBe(true);
  });

  it('não corta citações curtas', () => {
    expect(normalizeQuote('Em vão.')).toBe('Em vão.');
  });
});

describe('fontSizeForQuote', () => {
  it('reduz a tipografia conforme o texto cresce', () => {
    const sizes = [80, 180, 280, 400, 520].map(len => fontSizeForQuote('a'.repeat(len)));
    expect(sizes).toEqual([54, 46, 40, 35, 31]);
  });
});

describe('quoteCardFileName', () => {
  it('gera slug limpo com acentos removidos', () => {
    expect(quoteCardFileName('A Cidade de Deus')).toBe('citacao-a-cidade-de-deus.png');
    expect(quoteCardFileName('Sermão da Sexagésima')).toBe('citacao-sermao-da-sexagesima.png');
  });

  it('tem fallback quando o título é inutilizável', () => {
    expect(quoteCardFileName('!!!')).toBe('citacao-scriptorium.png');
  });
});
