#!/usr/bin/env node
/**
 * Remove resíduo de site copiado (rodapé e barra de navegação do Novo Advento)
 * e o cabeçalho bibliográfico colado ao primeiro parágrafo da Vida de Santa
 * Macrina, em server/texts/*.md.
 *
 * MODO DE TESTE POR PADRÃO: só imprime o que sairia. Grava apenas com --aplicar.
 *
 *   node scripts/limpar-residuos-de-fonte.mjs            # mostra, não grava
 *   node scripts/limpar-residuos-de-fonte.mjs --aplicar  # grava
 *
 * Cada regra é literal e restrita; nada de conteúdo da obra é tocado. Fora de
 * escopo de propósito: chamadas de nota `[1]`, marcas de edição `[960A]`/`|18`
 * (aparato acadêmico) e títulos com `#` duplicado (`## ### Artigo`), que pedem
 * decisão própria.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'server', 'texts');
const aplicar = process.argv.includes('--aplicar');

const RODAPE = 'CONTACTE-NOS | ANUNCIE COM NOVO ADVENTO';

/** cada regra devolve { depois, removidos[] } */
const REGRAS = [
  {
    nome: 'rodapé "Sobre esta página" + "CONTACTE-NOS | ANUNCIE COM NOVO ADVENTO"',
    aplica: (t) => cortar(t, /\n*Sobre esta página[ \t]*\n+CONTACTE-NOS \| ANUNCIE COM NOVO ADVENTO[ \t]*(?:\n+|$)/g, '\n\n'),
  },
  {
    nome: 'rodapé "CONTACTE-NOS | ANUNCIE COM NOVO ADVENTO" solto',
    aplica: (t) => cortar(t, new RegExp(`\\n*${RODAPE.replace(/[|]/g, '\\|')}[ \\t]*(?:\\n+|$)`, 'g'), '\n\n'),
  },
  {
    nome: 'barra de navegação e anúncio do Novo Advento (Sobre a Paciência)',
    aplica: (t) => cortar(t, /^PAIS DA IGREJA: .*?por apenas US\$ 19,99\.\.\. /m, ''),
  },
  {
    nome: 'cabeçalho bibliográfico colado ao 1º parágrafo (Vida de Santa Macrina)',
    aplica: (t) =>
      cortar(
        t,
        /^Gregório de Nissa, Vida de Santa Macrina \(1916\) pp\. Tradução para o inglês .*?\[AO MONGE OLYMPIUS\] \[960A\] INTRODUÇÃO A forma/m,
        '[AO MONGE OLYMPIUS]\n\nA forma',
      ),
  },
];

function cortar(texto, regex, troca) {
  const removidos = [];
  const depois = texto.replace(regex, (achado) => {
    removidos.push(achado);
    // se a troca deixaria o bloco sem linha em branco antes do próximo parágrafo, mantém a separação
    return troca;
  });
  return { depois, removidos };
}

let totalArquivos = 0;
let totalTrechos = 0;
for (const arquivo of readdirSync(DIR).filter((f) => f.endsWith('.md')).sort()) {
  const caminho = join(DIR, arquivo);
  const original = readFileSync(caminho, 'utf8');
  let atual = original;
  const achados = [];
  for (const regra of REGRAS) {
    const { depois, removidos } = regra.aplica(atual);
    if (removidos.length) achados.push({ regra: regra.nome, removidos });
    atual = depois;
  }
  if (!achados.length) continue;
  totalArquivos++;
  console.log(`\n${arquivo}`);
  for (const { regra, removidos } of achados) {
    totalTrechos += removidos.length;
    console.log(`  - ${regra}: ${removidos.length}x`);
    for (const r of removidos.slice(0, 2)) {
      const visivel = r.replace(/\n+/g, ' ⏎ ').trim();
      console.log(`      "${visivel.length > 170 ? visivel.slice(0, 170) + '…' : visivel}"`);
    }
  }
  const quedaLinhas = original.split('\n').length - atual.split('\n').length;
  console.log(`  = ${original.length - atual.length} caracteres e ${quedaLinhas} linhas a menos`);
  if (aplicar) writeFileSync(caminho, atual);
}

console.log(`\n${totalTrechos} trechos em ${totalArquivos} obras. ${aplicar ? 'GRAVADO.' : 'MODO DE TESTE: nada foi gravado (use --aplicar).'}`);
