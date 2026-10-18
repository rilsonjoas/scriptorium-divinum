#!/usr/bin/env node
/**
 * Contrato das APIs do cluster que o Lecionário web consome (Fase 3 de
 * hetzner-infra/ROADMAP-CLUSTER.md).
 *
 * Baixa a especificação OpenAPI de produção, guarda só as rotas que este app usa
 * (e só os esquemas que elas referenciam) em `contract/<api>.openapi.json` e gera
 * `contract/<api>.d.ts`. O teste de tipos `src/lib/__tests__/contract.types.ts`
 * falha no `tsc` do CI se um tipo escrito à mão no app deixar de bater com o gerado.
 *
 * Uso:
 *   npm run contract:update   baixa, recorta e regera (depois: revisar o diff e commitar)
 *   npm run contract:check    só compara com produção; sai com 1 se mudou (não regera)
 *
 * Para acrescentar uma rota que o app passa a usar, inclua-a em `CONTRATOS` abaixo.
 * Sem dependências além do `openapi-typescript` (devDependency) e do `fetch` do Node.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const PASTA = join(RAIZ, 'contract');

const CONTRATOS = [
  {
    nome: 'scriptorium',
    especificacao: 'https://api-scriptorium.narniano.com/docs/json',
    rotas: ['/api/v1/quotes/daily'],
  },
  {
    nome: 'biblianaarte',
    especificacao: 'https://api-biblianaarte.narniano.com/docs',
    rotas: ['/api/v1/artworks/daily'],
  },
];

/** Ordena as chaves para o JSON versionado não mudar de ordem entre execuções. */
function ordenar(valor) {
  if (Array.isArray(valor)) return valor.map(ordenar);
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(
      Object.keys(valor)
        .sort()
        .map((k) => [k, ordenar(valor[k])]),
    );
  }
  return valor;
}

/** Junta os `$ref` de `#/components/<tipo>/<nome>` usados por um trecho. */
function referencias(valor, achados = new Set()) {
  if (Array.isArray(valor)) valor.forEach((v) => referencias(v, achados));
  else if (valor && typeof valor === 'object') {
    for (const [k, v] of Object.entries(valor)) {
      if (k === '$ref' && typeof v === 'string') achados.add(v);
      else referencias(v, achados);
    }
  }
  return achados;
}

export function recortar(spec, rotas) {
  const paths = {};
  for (const rota of rotas) {
    if (!spec.paths?.[rota]) throw new Error(`A especificação não tem a rota ${rota}`);
    paths[rota] = { get: spec.paths[rota].get };
    if (!paths[rota].get) throw new Error(`A rota ${rota} não tem GET`);
  }
  const saida = { openapi: spec.openapi, info: spec.info, paths };
  // Esquemas referenciados (transitivamente), preservando só o que é usado.
  const pendentes = [...referencias(paths)];
  const vistos = new Set();
  const componentes = {};
  while (pendentes.length) {
    const ref = pendentes.pop();
    if (vistos.has(ref)) continue;
    vistos.add(ref);
    const [, , tipo, nome] = ref.split('/');
    const alvo = spec.components?.[tipo]?.[nome];
    if (!alvo) throw new Error(`Referência quebrada: ${ref}`);
    (componentes[tipo] ??= {})[nome] = alvo;
    referencias(alvo).forEach((r) => pendentes.push(r));
  }
  if (Object.keys(componentes).length) saida.components = componentes;
  return ordenar(saida);
}

async function baixar(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

const checar = process.argv.includes('--check');
if (!checar) mkdirSync(PASTA, { recursive: true });
let mudou = false;

for (const c of CONTRATOS) {
  const recorte = recortar(await baixar(c.especificacao), c.rotas);
  const alvo = join(PASTA, `${c.nome}.openapi.json`);
  const novo = JSON.stringify(recorte, null, 2) + '\n';
  const atual = existsSync(alvo) ? readFileSync(alvo, 'utf8') : null;
  if (atual !== novo) {
    mudou = true;
    console.log(`${checar ? 'MUDOU' : 'atualizado'}: ${c.nome} (${c.rotas.join(', ')})`);
  } else {
    console.log(`igual: ${c.nome}`);
  }
  if (!checar) {
    writeFileSync(alvo, novo);
    execFileSync(
      join(RAIZ, 'node_modules', '.bin', 'openapi-typescript'),
      [alvo, '-o', join(PASTA, `${c.nome}.d.ts`)],
      { stdio: 'inherit' },
    );
  }
}

if (checar && mudou) {
  console.error('\nO contrato de produção mudou. Rode `npm run contract:update`, revise o diff e rode o tsc.');
  process.exit(1);
}
