#!/usr/bin/env bash
# Ensaia migrations e seeds num Postgres descartável (Docker) antes de um deploy.
# Ver docs/GERENCIAR-ACERVO.md, seção "Ensaio antes do deploy".
#
# Uso:
#   scripts/ensaiar-migrate.sh                 # banco vazio
#   scripts/ensaiar-migrate.sh /tmp/prod.sql   # cópia da produção (recomendado)
#
# Para tirar a cópia da produção (só leitura):
#   ssh narniano@debian13-4gb-narniano \
#     'docker exec postgres-shared pg_dump -U postgres --no-owner --no-privileges scriptorium_divinum_db' > /tmp/prod.sql
#
# O que faz: sobe um Postgres em memória, carrega o dump, roda o migrate DUAS vezes
# (a segunda prova que é idempotente), mostra contagens e roda o verificador do
# acervo. Sai com erro se o migrate falhar. O container é sempre removido no fim:
# /tmp e a RAM do notebook são pequenos.
#
# Variáveis: ENSAIO_NOME (nome do container), ENSAIO_PORTA (padrão 54329),
#            MANTER=1 (não remove o container, para inspecionar com psql).
set -euo pipefail

NOME="${ENSAIO_NOME:-scriptorium-ensaio-pg}"
PORTA="${ENSAIO_PORTA:-54329}"
DUMP="${1:-}"
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BANCO="scriptorium_ensaio"

limpar() {
  if [ "${MANTER:-0}" != "1" ]; then docker rm -f "$NOME" >/dev/null 2>&1 || true; fi
}
trap limpar EXIT

if [ -n "$DUMP" ] && [ ! -s "$DUMP" ]; then
  echo "Dump '$DUMP' não existe ou está vazio." >&2
  exit 2
fi

docker rm -f "$NOME" >/dev/null 2>&1 || true
docker run -d --name "$NOME" -e POSTGRES_PASSWORD=ensaio -p "127.0.0.1:${PORTA}:5432" \
  --tmpfs /var/lib/postgresql/data postgres:16-alpine >/dev/null
for _ in $(seq 1 30); do
  docker exec "$NOME" pg_isready -U postgres -q && break
  sleep 1
done
docker exec "$NOME" psql -U postgres -qc "CREATE DATABASE ${BANCO}"

if [ -n "$DUMP" ]; then
  echo "Carregando $DUMP ..."
  docker exec -i "$NOME" psql -U postgres -d "$BANCO" -q < "$DUMP" >/dev/null 2>&1 || true
fi

q() { docker exec "$NOME" psql -U postgres -d "$BANCO" -At -F' | ' -c "$1"; }
estado() {
  echo "  obras: $(q 'select count(*) from books') | publicadas: $(q 'select count(*) from books where published') | autores: $(q 'select count(*) from authors') | citações: $(q 'select count(*) from quotes' 2>/dev/null || echo '-')"
}

echo "Antes:"; estado 2>/dev/null || echo "  (banco vazio)"

export DATABASE_URL="postgres://postgres:ensaio@127.0.0.1:${PORTA}/${BANCO}"
cd "$RAIZ/server"
for rodada in 1 2; do
  echo; echo "== migrate, execução ${rodada} =="
  if ! pnpm exec tsx src/db/migrate.ts 2>&1 | tee "/tmp/ensaio-migrate-${rodada}.log" | grep -E "❌|✅ Migrations|falharam"; then
    true
  fi
  if grep -q "❌" "/tmp/ensaio-migrate-${rodada}.log"; then
    echo "FALHOU na execução ${rodada}. Log completo: /tmp/ensaio-migrate-${rodada}.log" >&2
    exit 1
  fi
  echo "  seeds aplicados: $(grep -c '✅ Seed aplicado' "/tmp/ensaio-migrate-${rodada}.log")"
done

echo; echo "Depois:"; estado
echo "  publicadas por idioma: $(q "select string_agg(language||'='||n, ', ') from (select language, count(*) n from books where published group by 1) x")"

echo; echo "== verificador do acervo =="
pnpm exec tsx scripts/verificar-acervo.ts | tail -n 6 || true
echo
echo "Ensaio concluído: o migrate rodou duas vezes sem erro."
[ "${MANTER:-0}" = "1" ] && echo "Container mantido: docker exec -it ${NOME} psql -U postgres -d ${BANCO}"
