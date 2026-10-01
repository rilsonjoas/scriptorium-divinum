#!/usr/bin/env node
/**
 * Reparo das fontes de citação corrompidas (incidente de 2026-10-01).
 *
 * O que aconteceu: a citação do dia serviu uma "fonte" que não é obra de
 * ninguém — `Cheque-Livro do Banco da Fé`. Como `affiliateUrl` é gerada em
 * tempo real a partir de `source + author`, o banco não guardava URL nenhuma:
 * bastava um `source` errado para a API manufacturear um link de busca da
 * Amazon para um livro que não existe. O gate em `src/lib/quote-sources.ts`
 * corta o CTA a partir de agora, mas a fonte errada no banco continua
 * errada até este script rodar.
 *
 * ⚠️ Este script roda contra PRODUÇÃO. Leitura por padrão:
 *
 *   tsx scripts/repair-quote-sources.ts              # dry-run: só mostra o plano
 *   tsx scripts/repair-quote-sources.ts --apply      # aplica, gravando backup antes
 *   tsx scripts/repair-quote-sources.ts --rollback <arquivo.json>
 *
 * O backup é escrito ANTES de qualquer escrita e é o caminho de volta:
 * reinsere as linhas apagadas e restaura `source`/`author` das alteradas.
 *
 * Cada passo é confrontado com a contagem esperada. Se o banco já tiver sido
 * mexido por outra mão, o script aborta em vez de insistir.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { env } from '../src/config.js';

const BACKUP_DIR = path.join(import.meta.dirname, 'data', 'backups');

interface QuoteSnapshot {
  id: string;
  author: string;
  text: string;
  source: string | null;
  dominio_publico: boolean;
  scriptorium_url: string | null;
  theme: string | null;
  fonte_url: string | null;
  verificado_em: string | Date | null;
  created_at: Date;
  updated_at: Date;
}

type Sql = postgres.Sql;

/** Citação com texto e fonte inventadas — não pertence a obra nenhuma. */
const FABRICADA = {
  table: 'quotes',
  label: 'fonte fabricada "Cheque-Livro do Banco da Fé"',
  match: (s: QuoteSnapshot) =>
    s.author === 'C. S. Lewis' && s.source === 'Cheque-Livro do Banco da Fé',
  expected: 1,
  apply: (s: Sql) => s`DELETE FROM quotes WHERE author = 'C. S. Lewis' AND source = 'Cheque-Livro do Banco da Fé'`,
};

/** `source` repetindo o nome do autor: 7 linhas, e "C. S. Lewis C. S. Lewis" virava busca na Amazon. */
const FONTE_E_AUTOR = {
  table: 'quotes',
  label: 'source = "C. S. Lewis" (7 linhas)',
  match: (s: QuoteSnapshot) =>
    s.author === 'C. S. Lewis' && (s.source ?? '').trim() === 'C. S. Lewis',
  expected: 7,
  apply: (s: Sql) => s`UPDATE quotes SET source = NULL WHERE author = 'C. S. Lewis' AND btrim(source) = 'C. S. Lewis'`,
};

/** Atribuição errada: é Lutero, não Lewis. */
const LUTERO = {
  table: 'quotes',
  label: '"Da Liberdade do Cristão" reatribuída a Martinho Lutero',
  match: (s: QuoteSnapshot) =>
    s.author === 'C. S. Lewis' &&
    s.source === 'Da Liberdade do Cristão' &&
    s.text.startsWith('Um cristão é um senhor livre'),
  expected: 1,
  apply: (s: Sql) => s`UPDATE quotes SET author = 'Martinho Lutero', source = 'A liberdade do cristão' WHERE author = 'C. S. Lewis' AND source = 'Da Liberdade do Cristão' AND text LIKE 'Um cristão é um senhor livre%'`,
};

/**
 * O texto existe em O Peso da Glória, mas a frase não bate com a passagem.
 * Não apaga: zera a fonte e deixa marcada pro crivo humano. Perder a citação
 * é decisão de curadoria, não de script — e ela volta com um INSERT.
 */
const PARA_AUDITORIA = {
  table: 'quotes',
  label: 'fração da verdade → fonte zerada, aguardando curadoria',
  match: (s: QuoteSnapshot) =>
    s.author === 'C. S. Lewis' &&
    s.source === 'O Peso da Glória' &&
    s.text.includes('fração da verdade'),
  expected: 1,
  apply: (s: Sql) => s`UPDATE quotes SET source = NULL WHERE author = 'C. S. Lewis' AND source = 'O Peso da Glória' AND text LIKE '%fração da verdade%'`,
};

const STEPS = [FABRICADA, FONTE_E_AUTOR, LUTERO, PARA_AUDITORIA] as const;

type Step = (typeof STEPS)[number];

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
}

const SELECT_ALL = `
  SELECT id, author, text, source, dominio_publico, scriptorium_url, theme,
         fonte_url, verificado_em, created_at, updated_at
    FROM quotes
   WHERE author = 'C. S. Lewis'
      OR btrim(coalesce(source, '')) = 'C. S. Lewis'
      OR source IN ('Cheque-Livro do Banco da Fé', 'Da Liberdade do Cristão', 'O Peso da Glória')
`;

async function snapshot(s: Sql): Promise<QuoteSnapshot[]> {
  return (await s.unsafe(SELECT_ALL)) as QuoteSnapshot[];
}

function findRows(rows: QuoteSnapshot[], step: Step): QuoteSnapshot[] {
  return rows.filter((r) => step.match(r));
}

async function rollback(s: Sql, file: string) {
  const rows = JSON.parse(readFileSync(file, 'utf-8')) as QuoteSnapshot[];
  console.log(`Rollback: restaurando ${rows.length} linhas de ${file}\n`);
  for (const r of rows) {
    await s`
      INSERT INTO quotes (id, author, text, source, dominio_publico, scriptorium_url,
                          theme, fonte_url, verificado_em, created_at, updated_at)
      VALUES (${r.id}, ${r.author}, ${r.text}, ${r.source}, ${r.dominio_publico},
              ${r.scriptorium_url}, ${r.theme}, ${r.fonte_url}, ${r.verificado_em},
              ${r.created_at}, ${r.updated_at})
      ON CONFLICT (id) DO UPDATE SET
        author = excluded.author, text = excluded.text, source = excluded.source,
        dominio_publico = excluded.dominio_publico,
        scriptorium_url = excluded.scriptorium_url, theme = excluded.theme,
        fonte_url = excluded.fonte_url, verificado_em = excluded.verificado_em,
        updated_at = now()
    `;
  }
  console.log(`✓ ${rows.length} linhas restauradas.`);
}

async function main() {
  const s = postgres(env.DATABASE_URL, { max: 1 });

  const rollbackFile = arg('--rollback');
  if (rollbackFile) {
    await rollback(s, rollbackFile);
    await s.end({ timeout: 5 });
    return;
  }

  const apply = process.argv.includes('--apply');
  const rows = await snapshot(s);

  console.log(`\nReparo de fontes — ${apply ? 'APLICANDO' : 'DRY-RUN (nada será escrito)'}`);
  console.log(`Banco: ${env.DATABASE_URL.replace(/:[^:@/]*@/, ':***@')}`);
  console.log(`Citações de Lewis no banco: ${rows.filter((r) => r.author === 'C. S. Lewis').length}\n`);

  let divergente = false;
  let total = 0;

  for (const step of STEPS) {
    const found = findRows(rows, step);
    const ok = found.length === step.expected;
    if (!ok) divergente = true;
    total += found.length;

    console.log(`${ok ? '✓' : '✗'} ${step.label}`);
    console.log(`  esperado ${step.expected}, encontrado ${found.length}`);
    for (const r of found) {
      console.log(`  - ${r.id.slice(0, 8)}… ${JSON.stringify(r.text.slice(0, 62))}…`);
      console.log(`      author=${JSON.stringify(r.author)} source=${JSON.stringify(r.source)}`);
    }
    console.log();
  }

  console.log(`Total de linhas afetadas: ${total}`);

  if (divergente) {
    console.error(
      '\n✗ Contagem divergente em pelo menos um passo. Abortando sem escrever nada:',
    );
    console.error('  o banco pode já ter sido mexido, ou os dados mudaram desde a análise.');
    console.error('  Confira a lista acima e ajuste `expected` em cada passo se for o caso.');
    await s.end({ timeout: 5 });
    process.exitCode = 1;
    return;
  }

  if (!apply) {
    console.log('\nNada foi escrito. Rode com --apply para gravar (o backup é automático).');
    await s.end({ timeout: 5 });
    return;
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(BACKUP_DIR, `quotes-before-source-repair-${stamp}.json`);
  mkdirSync(BACKUP_DIR, { recursive: true });
  writeFileSync(file, JSON.stringify(rows, null, 2));
  console.log(`\nBackup das ${rows.length} linhas de Lewis salvo em:\n  ${file}`);
  console.log(`Para desfazer: tsx scripts/repair-quote-sources.ts --rollback "${file}"`);

  await s.begin(async (tx) => {
    for (const step of STEPS) {
      const res = await step.apply(tx as unknown as Sql);
      const n = Array.isArray(res) ? res.count : res.count;
      if (n !== step.expected) throw new Error(`${step.label}: esperava ${step.expected}, afetou ${n}`);
      console.log(`✓ ${step.label} — ${n} linha(s)`);
    }
  });

  const restantes = await snapshot(s);
  const sobrou = STEPS.flatMap((step) => findRows(restantes, step));
  if (sobrou.length > 0) {
    throw new Error(`Ainda restam ${sobrou.length} linhas alvo. Faça rollback.`);
  }

  console.log(`\n✓ Reparo concluído e reconferido. Reexporte o JSON canônico:`);
  console.log(`  tsx scripts/export-quotes-canonical.ts`);
  await s.end({ timeout: 5 });
}

main().catch(async (e) => {
  console.error('\n✗ Falhou:', e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
