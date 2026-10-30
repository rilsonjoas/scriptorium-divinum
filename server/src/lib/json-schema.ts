import { z } from 'zod';

type Json = Record<string, unknown>;

/**
 * Campo com valor padrão não é obrigatório para quem chama a API (o servidor preenche). O `z.toJSONSchema` em modo de saída
 * os lista em `required` (a saída sempre tem o valor); o `zod-to-json-schema`, que este módulo substitui, não os listava.
 * Mantemos o comportamento antigo para a OpenAPI (e os contratos dos consumidores) não mudarem de significado.
 */
function tirarPadroesDeRequired(no: unknown): void {
  if (Array.isArray(no)) return no.forEach(tirarPadroesDeRequired);
  if (typeof no !== 'object' || no === null) return;
  const obj = no as Json;
  const props = obj.properties as Record<string, Json> | undefined;
  if (props && Array.isArray(obj.required)) {
    obj.required = (obj.required as string[]).filter((k) => !('default' in (props[k] ?? {})));
    if ((obj.required as string[]).length === 0) delete obj.required;
  }
  Object.values(obj).forEach(tirarPadroesDeRequired);
}

/**
 * Esquema JSON (draft-7) de um schema Zod, para o OpenAPI e a validação do Fastify. Substitui o `zod-to-json-schema`
 * (que não suporta o Zod 4). O segundo argumento existe só para manter a assinatura antiga das chamadas.
 */
export function zodToJsonSchema(schema: z.ZodType, _opcoesAntigas?: unknown): Json {
  const { $schema: _descartado, ...resto } = z.toJSONSchema(schema, {
    target: 'draft-7',
    io: 'output',
    unrepresentable: 'any',
    // `z.date()` não tem forma em JSON Schema no Zod 4 (viraria `{}`, e o tipo gerado nos consumidores, `unknown`). Na
    // resposta a data sai como texto ISO; o `zod-to-json-schema` representava assim e os contratos dependem disso.
    override: (ctx) => {
      if (ctx.zodSchema._zod.def.type === 'date') {
        ctx.jsonSchema.type = 'string';
        ctx.jsonSchema.format = 'date-time';
      }
    },
  }) as Json;
  tirarPadroesDeRequired(resto);
  return resto;
}
