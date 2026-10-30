#!/usr/bin/env node
/**
 * Atualiza `scripts/data/quotes-canonical.json` a partir do JSON que a consulta `export-quotes-canonical.sql` produz
 * (lido da entrada padrão). Valida tudo antes de gravar, mostra o que mudou e só grava se mudou.
 * Normalmente chamado por `scripts/atualizar-canonico.sh`, que traz o JSON da produção (só leitura).
 *
 * Uso: ... | pnpm --filter server exec tsx scripts/update-quotes-canonical.ts [--check]
 *   --check: não grava; sai com 1 se o arquivo está defasado (para uso em verificação).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { diferencasCanonico, ordenarCanonico, resumirDiferencas, validarCanonico } from '../src/db/quotes-canonical.js';

const ARQUIVO = path.join(import.meta.dirname, 'data', 'quotes-canonical.json');
const soConferir = process.argv.includes('--check');

function main(): number {
  const entrada = readFileSync(0, 'utf8').trim();
  if (entrada === '') {
    console.error('Entrada vazia: a consulta não devolveu nada (tabela vazia ou conexão falhou). Nada foi gravado.');
    return 2;
  }
  let novo;
  try {
    novo = ordenarCanonico(validarCanonico(JSON.parse(entrada)));
  } catch (e) {
    console.error(`Entrada inválida, nada foi gravado:\n${(e as Error).message}`);
    return 2;
  }
  const atual = existsSync(ARQUIVO) ? validarCanonico(JSON.parse(readFileSync(ARQUIVO, 'utf8'))) : [];
  const dif = diferencasCanonico(atual, novo);
  console.log(resumirDiferencas(dif));
  if (dif.novas.length + dif.removidas.length + dif.mudadas.length === 0) return 0;
  if (soConferir) return 1;
  writeFileSync(ARQUIVO, JSON.stringify(novo, null, 2) + '\n');
  console.log(`Gravado: ${ARQUIVO} (${novo.length} citações). Revise o diff e abra o PR.`);
  return 0;
}

process.exit(main());
