# Start test DB and apply migrations
test-db-up:
    {{COMPOSE_TEST}} up -d
    @printf "{{CYAN}}Waiting for DB...{{NC}}\n"
    @sleep 3
    @until {{COMPOSE_TEST}} exec db-test pg_isready -U app -d appdb_test 2>/dev/null; do sleep 1; done
    @printf "{{CYAN}}Applying migrations...{{NC}}\n"
    cd backend && DATABASE_URL={{TEST_DB_URL}} APP_DATABASE_URL={{APP_TEST_DB_URL}} bun run src/db/migrate.ts
    @printf "{{GREEN}}✓ Test DB ready{{NC}}\n"

# Stop test DB
test-db-down:
    {{COMPOSE_TEST}} down

# Run backend tests — full cycle (optional pattern: just test "my-pattern")
test args="": test-db-up
    DATABASE_URL={{TEST_DB_URL}} APP_DATABASE_URL={{APP_TEST_DB_URL}} bun --cwd ./backend test {{args}}
    @printf "{{GREEN}}✓ Tests done{{NC}}\n"

# Run tests without stopping DB — faster in dev (optional pattern)
test-dev args="":
    cd backend && DATABASE_URL={{TEST_DB_URL}} APP_DATABASE_URL={{APP_TEST_DB_URL}} bun test {{args}}

# Show only failing tests (optional pattern)
test-failures args="": test-db-up
    DATABASE_URL={{TEST_DB_URL}} APP_DATABASE_URL={{APP_TEST_DB_URL}} bun --cwd ./backend test {{args}} 2>&1 \
        | grep -E "^\s*(✗|×|fail|error:|at )" \
        | grep -v "node_modules" \
        || true

# Watch tests without stopping DB (requires test-db-up) — optional pattern
test-dev-watch args="":
    cd backend && DATABASE_URL={{TEST_DB_URL}} APP_DATABASE_URL={{APP_TEST_DB_URL}} bun test --watch {{args}}

# Watch tests with auto-setup
test-watch: test-db-up
    cd backend && DATABASE_URL={{TEST_DB_URL}} APP_DATABASE_URL={{APP_TEST_DB_URL}} bun test --watch

# Run specific tests — pattern required (just test-only "my-pattern")
test-only pattern: test-db-up
    cd backend && DATABASE_URL={{TEST_DB_URL}} APP_DATABASE_URL={{APP_TEST_DB_URL}} bun test "{{pattern}}"

# Launch Drizzle Studio for test DB
test-db-studio:
    cd backend && DATABASE_URL="{{TEST_DB_URL}}" bun x drizzle-kit studio --port 4982

# Run frontend tests
test-frontend:
    cd frontend && bunx vitest run
    @printf "{{GREEN}}✓ Frontend tests done{{NC}}\n"

# Watch frontend tests
test-frontend-watch:
    cd frontend && bunx vitest

# Run specific frontend tests — pattern required
test-frontend-only pattern:
    cd frontend && bunx vitest run "{{pattern}}"

# Launch Vitest with web UI
test-frontend-ui:
    cd frontend && bunx vitest --ui

# Run all tests (backend + frontend)
test-all: test test-frontend

# Reset test DB from scratch
test-db-reset: test-db-down test-db-up

# Seed CORE into test DB — --reset, requires test-db-up
test-db-seed:
    @printf "{{CYAN}}Seeding CORE into test DB...{{NC}}\n"
    cd backend && export $(grep -v '^\#' ../.env.dev | xargs) && DATABASE_URL={{TEST_DB_URL}} APP_DATABASE_URL={{APP_TEST_DB_URL}} bun run src/db/seed/runners/seed-core.ts --reset
    @printf "{{GREEN}}✓ CORE seed done on test DB{{NC}}\n"
