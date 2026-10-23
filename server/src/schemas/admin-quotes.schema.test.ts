import { describe, it, expect } from 'vitest';
import {
  TEXTO_MAX,
  createQuoteSchema,
  updateQuoteSchema,
  ocultarQuoteSchema,
  listAdminQuotesQuerySchema,
} from './admin-quotes.schema.js';

const minimo = { author: 'C. S. Lewis', text: 'Texto.' };

describe('createQuoteSchema', () => {
  it('aceita o mínimo e preenche status e dominioPublico', () => {
    const r = createQuoteSchema.parse(minimo);
    expect(r.status).toBe('rascunho');
    expect(r.dominioPublico).toBe(false);
  });
  it.each([
    ['texto acima do limite', { ...minimo, text: 'a'.repeat(TEXTO_MAX + 1) }],
    ['campo desconhecido (id)', { ...minimo, id: '40000000-0000-0000-0000-000000000001' }],
    ['status oculta', { ...minimo, status: 'oculta' }],
    ['data que não existe', { ...minimo, verificadoEm: '2026-02-30' }],
    ['fonteUrl não http', { ...minimo, fonteUrl: 'javascript:alert(1)' }],
    ['texto vazio', { ...minimo, text: '   ' }],
  ])('recusa %s', (_n, corpo) => {
    expect(createQuoteSchema.safeParse(corpo).success).toBe(false);
  });
});

describe('updateQuoteSchema', () => {
  const ok = { updatedAt: '2026-01-01T10:00:00.123Z' };
  it('exige updatedAt', () => {
    expect(updateQuoteSchema.safeParse({ text: 'x' }).success).toBe(false);
    expect(updateQuoteSchema.safeParse({ ...ok, text: 'x' }).success).toBe(true);
  });
  it('recusa status oculta e campo desconhecido', () => {
    expect(updateQuoteSchema.safeParse({ ...ok, status: 'oculta' }).success).toBe(false);
    expect(updateQuoteSchema.safeParse({ ...ok, id: 'x' }).success).toBe(false);
  });
});

describe('ocultarQuoteSchema', () => {
  it('recusa motivo curto', () => {
    expect(ocultarQuoteSchema.safeParse({ motivo: 'ab' }).success).toBe(false);
    expect(ocultarQuoteSchema.safeParse({ motivo: 'abc' }).success).toBe(true);
  });
});

describe('listAdminQuotesQuerySchema', () => {
  it('page vem como texto na query e vira número, default 1', () => {
    expect(listAdminQuotesQuerySchema.parse({}).page).toBe(1);
    expect(listAdminQuotesQuerySchema.parse({ page: '2' }).page).toBe(2);
    expect(listAdminQuotesQuerySchema.safeParse({ page: '0' }).success).toBe(false);
  });
});
