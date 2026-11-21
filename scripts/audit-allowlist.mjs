#!/usr/bin/env node
// Auditoria de dependências de PRODUÇÃO com allowlist.
//
// `pnpm audit --prod` em produção reporta só advisories do react-router v6 (2026-11-21;
// os de lodash, yaml, glob e fast-uri foram corrigidos por override/atualização; sem patch no v6
// e não explorável neste projeto — ver
// ROADMAP.md, seção "Segurança"). Qualquer advisory NOVO de severidade
// high/critical faz o CI falhar.
//
// Uso: node scripts/audit-allowlist.mjs

import { spawnSync } from 'node:child_process';

// GHSA aceitos e o motivo de cada um:
const ACCEPTED = new Set([
  'GHSA-wrjc-x8rr-h8h6', // react-router v6: open redirect via backslash — sem patch no v6 (só 7.18+); links vêm de slugs sanitizados
  'GHSA-jjmj-jmhj-qwj2', // react-router v6: open redirect → XSS — idem, sem patch no v6
  'GHSA-337j-9hxr-rhxg', // react-router v6: constructor injection em SSR hydration — app é SPA sem SSR, não aplicável
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
