import { describe, expect, it } from 'vitest';
import { pickQuoteBySeed, toQuoteDto, type QuoteRow } from './quotes.js';

function row(over: Partial<QuoteRow>): QuoteRow {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    author: 'C. S. Lewis',
    text: 'Alegria é o assunto sério do Céu.',
    source: 'Cartas a Malcolm',
    dominioPublico: false,
    scriptoriumWorkId: null,
    scriptoriumUrl: null,
    theme: null,
    fonteUrl: null,
    verificadoEm: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...over,
  };
}

const quotes = [
  row({ id: '11111111-1111-4111-8111-111111111111' }),
  row({ id: '22222222-2222-4222-8222-222222222222' }),
  row({ id: '33333333-3333-4333-8333-333333333333' }),
];

describe('toQuoteDto', () => {
  it('monta affiliateUrl apenas para citações não-públicas (ADR 001)', () => {
    const dto = toQuoteDto(row({}));
    expect(dto.dominioPublico).toBe(false);
    expect(dto.affiliateUrl).toBe(
      'https://www.amazon.com.br/s?k=Cartas%20a%20Malcolm%20C.%20S.%20Lewis&tag=rilson-20',
    );
  });

  it('null no affiliateUrl para obras de domínio público', () => {
    const dto = toQuoteDto(
      row({ author: 'Santo Agostinho', text: '…', source: 'Confissões', dominioPublico: true }),
    );
    expect(dto.affiliateUrl).toBeNull();
    expect(dto.theme).toBeNull();
  });
});

describe('pickQuoteBySeed', () => {
  it('mesma data → mesma citação (determinístico)', () => {
    expect(pickQuoteBySeed(quotes, '2026-09-23')).toBe(pickQuoteBySeed(quotes, '2026-09-23'));
  });

  it('data diferente → citação diferente (seeds distintos)', () => {
    const a = pickQuoteBySeed(quotes, '2026-09-22');
    const b = pickQuoteBySeed(quotes, '2026-09-23');
    expect(a).not.toBe(b);
  });

  it('conjunto vazio → undefined', () => {
    expect(pickQuoteBySeed([], '2026-09-23')).toBeUndefined();
  });
});