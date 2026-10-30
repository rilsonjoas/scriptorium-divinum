import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { dateKeyInTimeZone, daySeed, isValidDateKey } from './date.js';

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

const vetores = JSON.parse(
  readFileSync(path.join(import.meta.dirname, 'hoje-sao-paulo.vetores.json'), 'utf-8'),
) as { casos: { utc: string; esperado: string; nota: string }[] };

describe('dateKeyInTimeZone — vetores do cluster (hetzner-infra/vetores/hoje-sao-paulo.json)', () => {
  it.each(vetores.casos)('$utc → $esperado ($nota)', ({ utc, esperado }) => {
    expect(dateKeyInTimeZone(new Date(utc))).toBe(esperado);
  });
});

describe('dateKeyInTimeZone', () => {
  it('retorna chave no formato YYYY-MM-DD', () => {
    const key = dateKeyInTimeZone(new Date('2026-09-22T12:00:00-03:00'));
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(key).toBe('2026-09-22');
  });
});

describe('isValidDateKey', () => {
  it('aceita datas que existem, inclusive 29/02 de ano bissexto', () => {
    for (const d of ['2026-10-17', '2028-02-29', '2000-02-29', '1900-01-01', '2099-12-31']) {
      expect(isValidDateKey(d), d).toBe(true);
    }
  });

  it('rejeita dia ou mês que não existe (formato certo, calendário errado)', () => {
    const ruins = ['2026-13-45', '2026-02-30', '2027-02-29', '1900-02-29', '2026-00-10', '2026-04-31'];
    for (const d of [...ruins, '2026-10-00']) {
      expect(isValidDateKey(d), d).toBe(false);
    }
  });

  it('rejeita formato errado', () => {
    for (const d of ['', 'abc', '2026-1-1', '26-10-17', '2026/10/17', '2026-10-17T00:00', ' 2026-10-17']) {
      expect(isValidDateKey(d), d).toBe(false);
    }
  });
});
