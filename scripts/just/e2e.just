import '_vars.just'
import 'dev.just'

[doc('Launch E2E stack (tmpfs DB + migrate + restore data.sql: full catalog/personas/fixtures, not seed-core) on isolated ports 5174/3001/5434. Runs alongside just dev.')]
[group('e2e')]
e2e-up: ts-build
    {{COMPOSE_E2E}} build
    # vite proxies /api as soon as it listens: a frontend booted during the restore lets
    # Playwright's webServer probe start tests against a DB still being restored
    # Bring it up only after the data is in
    {{COMPOSE_E2E}} up -d db api
    @printf "{{CYAN}}Waiting for DB...{{NC}}\n"
    @until {{COMPOSE_E2E}} exec -T db pg_isready -U app -d appdb >/dev/null 2>&1; do sleep 1; done
    @printf "{{CYAN}}Migrations...{{NC}}\n"
    {{COMPOSE_E2E}} exec -T api bun run src/db/migrate.ts
    @printf "{{CYAN}}Seed from snapshot...{{NC}}\n"
    {{COMPOSE_E2E}} exec -T db psql -U app -d appdb -v ON_ERROR_STOP=1 -c "DO \$\$ DECLARE r record; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname='public') LOOP EXECUTE 'TRUNCATE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE'; END LOOP; END \$\$;"
    {{COMPOSE_E2E}} exec -T db psql -U app -d appdb -v ON_ERROR_STOP=1 < {{SNAPSHOT_FILE}} > /dev/null
    @printf "{{CYAN}}Waiting for frontend...{{NC}}\n"
    {{COMPOSE_E2E}} up -d frontend
    @until curl -sf http://localhost:5174 >/dev/null; do sleep 1; done
    @printf "{{GREEN}}✓ E2E stack ready on http://localhost:5174{{NC}}\n"

[doc('Stop E2E stack (tmpfs DB lost)')]
[group('e2e')]
e2e-down:
    {{COMPOSE_E2E}} down

[doc('Recreate E2E stack from scratch.')]
[group('e2e')]
e2e-reset:
    {{COMPOSE_E2E}} down
    just e2e-up

# Fail-safe: each Playwright release pins its own browser builds, and bumping the
# package leaves ~/.cache/ms-playwright on the previous ones. Nothing detects it, so
# the whole suite dies on "Executable doesn't exist" without launching a browser.
# Idempotent and ~0.5s once the builds are present. BEWARE lines are the unsupported-OS
# notice on every run; the braces keep grep's no-match status from masking a real failure.
[script]
_e2e-browsers:
    cd frontend
    bunx playwright install 2>&1 | { grep -v '^BEWARE:' || true; }

[doc('Run Playwright: auto-runs `just e2e-up` if the stack is not already up (webServer in playwright.config)')]
[group('e2e')]
e2e: _e2e-browsers
    cd frontend && bunx playwright test

[doc('Run Playwright in interactive UI mode')]
[group('e2e')]
e2e-ui: _e2e-browsers
    cd frontend && bunx playwright test --ui
