import '_vars.just'

TEST_DB_URL     := "postgres://app:testpassword@localhost:5433/appdb_test"
APP_TEST_DB_URL := "postgres://app_runtime:testpassword@localhost:5433/appdb_test"

# Naming convention:
#   args="" → optional filter passed to the runner (e.g. `just test-backend auth`).

# ─────────────────────────── DB lifecycle ───────────────────────────

# Reusing a long-lived test DB lets its schema drift from what the migrations
# describe (drizzle only applies the missing ones), which surfaces as flaky RLS
# failures, hence the recreate-by-default. `keep` also spares a concurrent run's DB.
[doc('Recreate the test DB and apply migrations. Pass `keep` to reuse a running one.')]
[group('test')]
test-db-up keep="":
    @if [ "{{keep}}" = "keep" ] && {{COMPOSE_TEST}} exec db-test pg_isready -U app -d appdb_test >/dev/null 2>&1; then \
        printf "{{CYAN}}Reusing running test DB (omit 'keep' to recreate).{{NC}}\n"; \
    else \
        {{COMPOSE_TEST}} down --remove-orphans 2>/dev/null || true; \
        {{COMPOSE_TEST}} up -d; \
        printf "{{CYAN}}Waiting for DB...{{NC}}\n"; \
        until {{COMPOSE_TEST}} exec db-test pg_isready -U app -d appdb_test 2>/dev/null; do sleep 1; done; \
    fi
    @printf "{{CYAN}}Applying migrations...{{NC}}\n"
    cd backend && DATABASE_URL={{TEST_DB_URL}} APP_DATABASE_URL={{APP_TEST_DB_URL}} bun run src/db/migrate.ts
    @printf "{{GREEN}}✓ Test DB ready{{NC}}\n"

[doc('Stop test DB')]
[group('test')]
test-db-down:
    {{COMPOSE_TEST}} down

[doc('Seed CORE into test DB (requires test-db-up)')]
[group('test')]
test-db-seed:
    @printf "{{CYAN}}Seeding CORE into test DB...{{NC}}\n"
    cd backend && export $(grep -v '^\#' ../.env.dev | xargs) && DATABASE_URL={{TEST_DB_URL}} APP_DATABASE_URL={{APP_TEST_DB_URL}} bun run src/db/seed/seeders/seed-core.ts --reset
    @printf "{{GREEN}}✓ CORE seed done on test DB{{NC}}\n"

# ─────────────────────────── Run once ───────────────────────────

[doc('Run ALL tests: shared (pure) + backend (full cycle) + frontend')]
[group('test')]
test: test-shared test-backend test-frontend

[doc('Run shared unit tests: pure, no DB, optional filter')]
[group('test')]
test-shared args="":
    cd shared && bun test {{args}}
    @printf "{{GREEN}}✓ Shared tests done{{NC}}\n"

[doc('Run backend tests: brings DB up, optional filter')]
[group('test')]
test-backend args="": test-db-up
    DATABASE_URL={{TEST_DB_URL}} APP_DATABASE_URL={{APP_TEST_DB_URL}} bun --cwd ./backend test {{args}}
    @printf "{{GREEN}}✓ Backend tests done{{NC}}\n"

[doc('Run frontend tests: no DB (happy-dom), optional filter')]
[group('test')]
test-frontend args="":
    cd frontend && bunx vitest run {{args}}
    @printf "{{GREEN}}✓ Frontend tests done{{NC}}\n"

# ─────────────────────────── Watch ───────────────────────────

# `keep` here spares the DB of a concurrent run; a watch reuses what is already
# migrated instead of recreating it under another session's feet.
[doc('Watch backend tests: reuses a running test DB, optional filter')]
[group('test')]
test-watch args="":
    @just test-db-up keep
    cd backend && DATABASE_URL={{TEST_DB_URL}} APP_DATABASE_URL={{APP_TEST_DB_URL}} bun test --watch {{args}}

# ──────────────────── Coverage (feeds fallow health --coverage) ────────────────────

[doc('Backend coverage (lcov) → backend/coverage/')]
[group('test')]
test-backend-coverage args="": test-db-up
    DATABASE_URL={{TEST_DB_URL}} APP_DATABASE_URL={{APP_TEST_DB_URL}} bun --cwd ./backend test --coverage --coverage-reporter=lcov --coverage-reporter=text --coverage-dir=./coverage {{args}}
    @printf "{{GREEN}}✓ Backend coverage written to backend/coverage/{{NC}}\n"

[doc('Frontend coverage (lcov) → frontend/coverage/')]
[group('test')]
test-frontend-coverage args="":
    cd frontend && bunx vitest run --coverage {{args}}
    @printf "{{GREEN}}✓ Frontend coverage written to frontend/coverage/{{NC}}\n"

# ──────────────── Perf regression guard (baseline cleanDatabase = 903, must not rise) ────────────────

[doc('Bench backend suite: captures wall-time + full log to /tmp/aurore-backend-test.log')]
[group('test')]
test-bench: test-db-up
    @printf "{{CYAN}}Benching backend tests (output → /tmp/aurore-backend-test.log)...{{NC}}\n"
    cd backend && /usr/bin/time -f "wall=%es cpu=%P max-rss=%MKB" -o /tmp/aurore-backend-test.time \
        env DATABASE_URL={{TEST_DB_URL}} APP_DATABASE_URL={{APP_TEST_DB_URL}} \
        bun test 2>&1 | tee /tmp/aurore-backend-test.log
    @printf "{{GREEN}}--- timing ---{{NC}}\n"
    @cat /tmp/aurore-backend-test.time
    @printf "{{CYAN}}cleanDatabase fires (baseline 903):{{NC}} "
    @grep -c "Cleaning database" /tmp/aurore-backend-test.log

[doc('Read cleanDatabase fires again from the last test-bench log, without a new bench')]
[group('test')]
test-clean-count:
    @if [ ! -f /tmp/aurore-backend-test.log ]; then \
        printf "{{CYAN}}No log yet. Run 'just test-bench' first.{{NC}}\n"; \
        exit 1; \
    fi
    @printf "{{CYAN}}cleanDatabase fires in last run:{{NC}} "
    @grep -c "Cleaning database" /tmp/aurore-backend-test.log
