#!/usr/bin/env bash
# Atualiza server/scripts/data/quotes-canonical.json a partir do banco de PRODUÇÃO, em um comando.
# Só leitura no VPS (a sessão do psql é forçada a read-only); só grava o arquivo local, e só se mudou.
#
#   scripts/atualizar-canonico.sh           # exporta, valida, mostra o que mudou e grava
#   scripts/atualizar-canonico.sh --check   # só confere (sai com 1 se estiver defasado)
#
# Depois de gravar: revise `git diff`, commite e abra o PR (o canônico é o espelho legível e a semente de um
# ambiente novo; a recuperação de desastre de verdade é o backup do banco: docs/GERENCIAR-ACERVO.md).
set -euo pipefail
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$RAIZ"
ssh narniano@debian13-4gb-narniano \
  "docker exec -i -e PGOPTIONS='-c default_transaction_read_only=on' postgres-shared psql -U postgres -d scriptorium_divinum_db -At" \
  < server/scripts/data/export-quotes-canonical.sql \
  | pnpm --silent --filter server exec tsx scripts/update-quotes-canonical.ts "$@"
