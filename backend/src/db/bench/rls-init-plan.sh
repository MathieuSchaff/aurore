#!/usr/bin/env bash
#
# Bench RLS InitPlan optimization for auth.uid() / auth.role() wrappers.
#
# Purpose: prove that wrapping auth.uid() in (SELECT ...) at the call site
# preserves the InitPlan node (function evaluated once per query). A bare
# auth.uid() in a policy gets evaluated per-row when no index helps, which
# is ~12x slower at 1000 rows and worse as the table grows.
#
# Re-run before/after touching auth wrappers (migration 0024) or RLS policies
# (Partie 3.2 of idee/db/roadmap.md).
#
# Usage: ./bench-rls-init-plan.sh [container] [rows]
#   container — Postgres container name (default: app_db)
#   rows      — bench table size            (default: 1000)
#
# Hermetic: creates and drops a temp `bench_rls` table. No real data touched.

set -euo pipefail

CONTAINER="${1:-app_db}"
ROWS="${2:-1000}"
USER_ID='019de09c-3403-7f67-8b49-560aecb2d9c9'

psql_run() {
  docker exec -i "$CONTAINER" psql -U app -d appdb -X "$@"
}

require_container() {
  if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "error: container '$CONTAINER' is not running" >&2
    exit 1
  fi
}

setup() {
  psql_run -q <<EOF
DROP TABLE IF EXISTS bench_rls;
CREATE TABLE bench_rls (id bigserial PRIMARY KEY, user_id uuid NOT NULL);
INSERT INTO bench_rls (user_id)
  SELECT '${USER_ID}'::uuid FROM generate_series(1, ${ROWS});
ANALYZE bench_rls;
EOF
}

teardown() {
  psql_run -q -c "DROP TABLE IF EXISTS bench_rls;" >/dev/null
}

bench() {
  local label="$1"
  local where_expr="$2"

  printf '\n=== %s ===\n' "$label"
  printf 'WHERE user_id = %s\n\n' "$where_expr"

  psql_run <<EOF
BEGIN;
SET LOCAL app.user_id = '${USER_ID}';
SET LOCAL enable_indexscan = off;
SET LOCAL enable_bitmapscan = off;
EXPLAIN (ANALYZE, BUFFERS)
  SELECT count(*) FROM bench_rls WHERE user_id = ${where_expr};
ROLLBACK;
EOF
}

main() {
  require_container
  trap teardown EXIT

  echo "Container : $CONTAINER"
  echo "Rows      : $ROWS"
  echo "Strategy  : seqscan forced (enable_indexscan/bitmapscan = off)"
  echo "Expect    : raw + (SELECT auth.uid()) show 'InitPlan'; bare auth.uid() does NOT"

  setup

  bench "raw (SELECT current_setting(...)) — gold standard" \
        "(SELECT current_setting('app.user_id', true)::uuid)"

  bench "auth.uid() bare — BAD: per-row call, no InitPlan" \
        "auth.uid()"

  bench "(SELECT auth.uid()) — Supabase pattern, target for 3.2" \
        "(SELECT auth.uid())"
}

main "$@"
