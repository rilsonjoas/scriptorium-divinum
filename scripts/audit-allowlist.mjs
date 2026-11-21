#!/usr/bin/env node
// Auditoria de dependências de PRODUÇÃO com allowlist.
//
// `pnpm audit --prod` em produção está em 0 vulnerabilidades desde 2026-11-21 (react-router
// v6 -> v7.18, que fechou os 3 últimos GHSA aceitos). A allowlist continua existindo, vazia: um
// advisory aceito de novo precisa de GHSA, motivo e data aqui, revisável no PR. Qualquer advisory
// de severidade high/critical que não esteja na lista faz o CI falhar (moderados só avisam).
//
// Uso: node scripts/audit-allowlist.mjs

import { spawnSync } from 'node:child_process';

// GHSA aceitos e o motivo de cada um:
const ACCEPTED = new Set([
  // 'GHSA-xxxx-xxxx-xxxx', // pacote: o que é, por que não se aplica aqui, aceito em AAAA-MM-DD
]);

const result = spawnSync('pnpm', ['audit', '--prod', '--json'], {
  encoding: 'utf8',
});

let report;
try {
  report = JSON.parse(result.stdout);
} catch (err) {
  console.error('Falha ao interpretar a saída do pnpm audit:', err.message);
  process.exit(2);
}

const remaining = Object.values(report.advisories ?? {})
  .map((a) => ({
    severity: a.severity,
    module: a.module_name,
    title: a.title,
    url: a.url,
    ghsa: String(a.url).split('/').pop(),
  }))
  .filter((a) => !ACCEPTED.has(a.ghsa));

const critical = remaining.filter((a) => a.severity === 'critical' || a.severity === 'high');

console.log(`Auditoria de produção: ${report.metadata.vulnerabilities?.high ?? 0} high, ${report.metadata.vulnerabilities?.moderate ?? 0} moderate (${ACCEPTED.size} aceitos na allowlist).`);

if (critical.length > 0) {
  console.error('\nNovos advisories high/critical em produção:');
  for (const a of critical) {
    console.error(`  [${a.severity}] ${a.module}: ${a.title}\n    ${a.url}`);
  }
  process.exit(1);
}

if (remaining.length > 0) {
  console.log(`Advisories moderados novos (não bloqueiam): ${remaining.length}`);
}

process.exit(0);
