import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { zodToJsonSchema } from './json-schema.js';

/** `zodToJsonSchema` substitui o `zod-to-json-schema` (Zod 4). O que a OpenAPI e os contratos dos consumidores esperam. */
describe('zodToJsonSchema', () => {
  it('z.date() vira string date-time (o Zod 4 não representa Date; sem isto vira {} e o tipo gerado vira unknown)', () => {
    expect(zodToJsonSchema(z.object({ createdAt: z.string().or(z.date()).optional() }))).toMatchObject({
      properties: { createdAt: { anyOf: [{ type: 'string' }, { type: 'string', format: 'date-time' }] } },
    });
  });

  it('campo com valor padrão não é obrigatório (o servidor preenche)', () => {
    const j = zodToJsonSchema(z.object({ q: z.string(), limit: z.coerce.number().default(20), ativo: z.boolean().default(true) }));
    expect(j.required).toEqual(['q']);
    expect((j.properties as Record<string, { default?: unknown }>).limit!.default).toBe(20);
  });

  it('sem nenhum obrigatório, não deixa `required: []`', () => {
    const j = zodToJsonSchema(z.object({ limit: z.number().default(1) }));
    expect(j).not.toHaveProperty('required');
  });

  it('campo opcional e campo obrigatório continuam como eram', () => {
    const j = zodToJsonSchema(z.object({ a: z.string(), b: z.string().optional() }));
    expect(j.required).toEqual(['a']);
  });

  it('padrão dentro de objeto aninhado e dentro de lista também sai de required', () => {
    const j = zodToJsonSchema(z.object({ itens: z.array(z.object({ id: z.string(), n: z.number().default(0) })) }));
    const item = ((j.properties as Record<string, { items: Record<string, unknown> }>).itens!).items;
    expect(item.required).toEqual(['id']);
  });

  it('não vaza o $schema (o Fastify/swagger não quer a chave no meio do OpenAPI)', () => {
    expect(zodToJsonSchema(z.string())).not.toHaveProperty('$schema');
  });

  it('aceita (e ignora) as opções antigas, para as chamadas não mudarem', () => {
    expect(zodToJsonSchema(z.string(), { $refStrategy: 'none' })).toMatchObject({ type: 'string' });
  });
});
