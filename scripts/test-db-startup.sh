#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
workdir="$(mktemp -d -t aurore-test-db-startup.XXXXXX)"
project="aurore-test-startup-$$"
compose=(docker compose -f "$repo_root/infra/docker/compose/docker-compose.test.yml" -f "$workdir/compose.yml" -p "$project")
export TEST_STARTUP_BASE="$repo_root/infra/docker/compose/docker-compose.test.yml"
export TEST_STARTUP_OVERRIDE="$workdir/compose.yml"
export TEST_STARTUP_PROJECT="$project"
export TEST_STARTUP_BUN="$(command -v bun)"

cleanup() {
    result=$?
    if [ "$result" -ne 0 ]; then
        "${compose[@]}" logs --no-color db-test >&2 || true
    fi
    "${compose[@]}" down --remove-orphans >/dev/null 2>&1 || true
    rm -rf "$workdir"
}
trap cleanup EXIT

cp -R "$repo_root/backend/drizzle-init" "$workdir/init"
cat > "$workdir/init/99-startup-regression.sh" <<'SH'
echo 'Startup regression: temporary socket server is active'
sleep 5
SH
cat > "$workdir/compose.yml" <<YAML
services:
  db-test:
    ports: !override
      - "127.0.0.1:55433:5432"
    volumes: !override
      - "$workdir/init:/docker-entrypoint-initdb.d:ro"
YAML

mkdir "$workdir/bin"
cat > "$workdir/bin/bun" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
if ! docker compose -f "$TEST_STARTUP_BASE" -f "$TEST_STARTUP_OVERRIDE" -p "$TEST_STARTUP_PROJECT" \
    exec -T -e PGPASSWORD=testpassword db-test psql -h 127.0.0.1 -U app -d appdb_test -Atc 'SELECT 1'; then
    echo 'FAIL: migration started before the final TCP server was ready' >&2
    exit 1
fi
exec "$TEST_STARTUP_BUN" "$@"
SH
chmod +x "$workdir/bin/bun"

cd "$repo_root"
start_db() {
    PATH="$workdir/bin:$PATH" timeout 60s just \
        --set COMPOSE_TEST "${compose[*]}" \
        --set TEST_DB_URL 'postgres://app:testpassword@127.0.0.1:55433/appdb_test' \
        --set APP_TEST_DB_URL 'postgres://app_runtime:testpassword@127.0.0.1:55433/appdb_test' \
        test-db-up "$@"
}

start_db
printf 'PASS: migrates after a cold initialization\n'

"${compose[@]}" exec -T db-test psql -U app -d appdb_test -v ON_ERROR_STOP=1 \
    -c 'CREATE TABLE startup_probe (value integer); INSERT INTO startup_probe VALUES (42)' >/dev/null
container_before="$("${compose[@]}" ps -q db-test)"
start_db keep
container_after="$("${compose[@]}" ps -q db-test)"
test "$container_before" = "$container_after"
value="$("${compose[@]}" exec -T db-test psql -U app -d appdb_test -Atc 'SELECT value FROM startup_probe')"
test "$value" = 42
printf 'PASS: keeps the running container and its data\n'

"${compose[@]}" down --remove-orphans
start_db keep
printf 'PASS: initializes a missing DB with keep\n'
