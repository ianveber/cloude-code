#!/usr/bin/env bash
# Prove the Arhiv Heva RLS model against a throwaway Postgres.
# No Supabase project needed — 00-supabase-stub.sql stands in for the
# auth/storage schemas so ../schema.sql runs unmodified.
#
#   ./tests/run.sh          # exits 0 only if every isolation test passes
#
# Re-run this after ANY change to schema.sql. A resident reading another
# building's documents is the one failure this project cannot ship with.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CTR=heva-pg-test
PORT=55433

cleanup() { docker rm -f "$CTR" >/dev/null 2>&1 || true; }
trap cleanup EXIT

if ! docker info >/dev/null 2>&1; then
  echo "Docker isn't running. Start Docker Desktop and retry." >&2
  exit 1
fi

cleanup
docker run -d --rm --name "$CTR" \
  -e POSTGRES_PASSWORD=test -e POSTGRES_DB=heva \
  -p "$PORT":5432 postgres:16-alpine >/dev/null

printf 'waiting for postgres'
for _ in $(seq 1 30); do
  if docker exec "$CTR" pg_isready -U postgres -d heva >/dev/null 2>&1; then break; fi
  printf '.'; sleep 2
done
echo

run() { docker cp "$1" "$CTR":/tmp/x.sql >/dev/null; \
        docker exec "$CTR" psql -v ON_ERROR_STOP=1 -U postgres -d heva -q -f /tmp/x.sql; }

run "$HERE/00-supabase-stub.sql"
run "$HERE/../schema.sql"
run "$HERE/02-rls-tests.sql"

echo
echo "✅ RLS model verified — cross-building reads, privilege escalation,"
echo "   audit forgery and direct storage access are all refused."
