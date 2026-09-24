import { describe, expect, it } from 'vitest';
import { dateKeyInTimeZone, daySeed } from './date.js';

describe('daySeed', () => {
  it('é determinística: mesma data sempre retorna o mesmo seed', () => {
    expect(daySeed('2026-09-23')).toBe(daySeed('2026-09-23'));
  });

  it('é estável no tempo (dias desde a época)', () => {
    // 2026-09-23 = 20709 dias desde 1970-01-01 (verificação por cálculo direto)
    const expected = Math.floor((Date.UTC(2026, 8, 23) - Date.UTC(1970, 0, 1)) / 86_400_000);
    expect(daySeed('2026-09-23')).toBe(expected);
    expect(daySeed('2026-09-23')).toBe(20719);
  });

  it('dias diferentes geram seeds diferentes', () => {
    expect(daySeed('2026-09-22')).not.toBe(daySeed('2026-09-23'));
  });
});

describe('dateKeyInTimeZone', () => {
  it('retorna chave no formato YYYY-MM-DD', () => {
    const key = dateKeyInTimeZone(new Date('2026-09-22T12:00:00-03:00'));
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(key).toBe('2026-09-22');
  });
});