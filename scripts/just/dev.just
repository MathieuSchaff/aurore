import '_vars.just'

ALGO_DERM_DIR := "../algo-derm"

# Launch dev environment after host-side TypeScript preflight
dev: ts-build _db-guard
    {{COMPOSE_DEV}} up --build

# Stop dev environment
dev-down:
    {{COMPOSE_DEV}} down

# Launch dev in background after host-side TypeScript preflight
dev-d: ts-build _db-guard
    {{COMPOSE_DEV}} up -d --build

# Fail-safe: bring db up first and offer a snapshot restore if the dev DB is
# empty. A volume wipe (just clean / down -v / prune) otherwise leaves the stack
# silently 500ing. `just dev` boots fine but every query hits a schemaless DB.
_db-guard:
    #!/usr/bin/env bash
    set -euo pipefail
    {{COMPOSE_DEV}} up -d db
    for _ in $(seq 1 30); do
        {{COMPOSE_DEV}} exec -T db pg_isready -U app -d appdb >/dev/null 2>&1 && break
        sleep 1
    done
    # A fresh schema has no products table yet. Keep the failed probe from
    # tripping `set -e -o pipefail`; an empty COUNT is the restore signal.
    COUNT=$({{COMPOSE_DEV}} exec -T db psql -U app -d appdb -tAc "SELECT count(*) FROM products" 2>/dev/null | tr -dc '0-9' || true)
    if [ -n "$COUNT" ] && [ "$COUNT" -gt 0 ]; then exit 0; fi
    printf "{{RED}}⚠ Dev DB is empty (no products table, or 0 rows) — wiped volume, or a first clone.{{NC}}\n"
    printf "{{YELLOW}}  Manual restore: just db-migrate && just db-snapshot-load{{NC}}\n"
    if [ ! -t 0 ]; then
        printf "{{YELLOW}}  (non-interactive → booting on an empty DB){{NC}}\n"
        exit 0
    fi
    # Default yes: declining leaves every page 500ing with no further explanation.
    read -r -p "Restore the committed catalogue snapshot now? [Y/n] " C
    case "${C:-y}" in [yY]*) ;; *) exit 0 ;; esac
    just db-migrate
    ASSUME_YES=1 just db-snapshot-load
    # mig 0013 creates app_runtime with a placeholder password; realign with .env.dev so the pool can auth
    set -a; source .env.dev; set +a
    {{COMPOSE_DEV}} exec -T db psql -U app -d appdb -c "ALTER ROLE app_runtime PASSWORD '${APP_RUNTIME_PASSWORD}'" >/dev/null
    printf "{{GREEN}}✓ DB restored from snapshot{{NC}}\n"

# Prod-like LCP/transport profiling: the REAL edge nginx (HTTP/2 + TLS + prod
# template) in front of the prod frontend Bun SSR server (host-built .output),
# /api → the running dev backend. Faithful browser-facing transport, unlike
# `vite preview` (HTTP/1.1, no compression, no cache headers). Prereq: `just dev-d`.
# Open https://localhost and accept the self-signed cert. Teardown: `just profile-prod-down`.
profile-prod: ts-build
    #!/usr/bin/env bash
    set -euo pipefail
    if [ -z "$(docker ps -q -f name=app_api -f status=running)" ]; then
        printf "{{RED}}app_api absent — run 'just dev-d' first (profiling reuses the dev backend).{{NC}}\n"
        exit 1
    fi
    cd frontend && VITE_API_URL=http://api:3000 bunx vite build && cd ..
    # Self-signed cert at the path reload-certs.sh probes; without it the edge
    # renders an HTTP-only fallback (no HTTP/2 → LCP numbers are meaningless).
    if [ ! -f .profile-certs/live/localhost/fullchain.pem ]; then
        mkdir -p .profile-certs/live/localhost
        openssl req -x509 -newkey rsa:2048 -sha256 -days 365 -nodes \
            -keyout .profile-certs/live/localhost/privkey.pem \
            -out .profile-certs/live/localhost/fullchain.pem \
            -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,DNS:www.localhost"
    fi
    {{COMPOSE_PROFILE}} up -d
    # Join the dev backend to the profiling network as `api` so the prod template's
    # `upstream api { server api:3000 }` resolves without editing the template.
    docker network connect --alias api aurore-profile_profilenet app_api 2>/dev/null || true
    # Flush nginx's negative DNS cache (resolver valid=30s), else /api 502s for ~30s
    # because the edge tried to resolve `api` before the network attach landed.
    docker exec aurore_profile_edge nginx -s reload 2>/dev/null || true
    printf "{{GREEN}}✓ Profiling up → https://localhost (accept the self-signed cert). Down: just profile-prod-down{{NC}}\n"

# Tear down the LCP profiling stack + detach the dev backend from its network
profile-prod-down:
    docker network disconnect aurore-profile_profilenet app_api 2>/dev/null || true
    {{COMPOSE_PROFILE}} down
    @printf "{{GREEN}}✓ Profiling stack down{{NC}}\n"

# Full clean + install + types + docker (preserves pgdata)
dev-fresh: ts-clean install-deps ts-build
    {{COMPOSE_DEV}} down 2>/dev/null || true
    just _db-guard
    {{COMPOSE_DEV}} up --build

# Full rebuild without cache (after adding dependencies)
dev-rebuild: ts-build
    {{COMPOSE_DEV}} down
    {{COMPOSE_DEV}} build --no-cache
    just _db-guard
    {{COMPOSE_DEV}} up

# First-time setup: deps + env template + hooks
init: install-deps
    #!/usr/bin/env bash
    set -euo pipefail
    # Compose creates missing bind-mount sources as root, which the api container
    # (uid 1000) then cannot write to. Own them from the host first.
    mkdir -p backend/openapi backend/tmp backend/src/output frontend/.tanstack
    if [ ! -f .env.dev ]; then
        cp .env.example .env.dev
        # Real secrets over the shipped placeholders, so the first `just dev` boots.
        for var in JWT_SECRET REFRESH_SECRET; do
            secret="$(openssl rand -base64 32 | tr -d '\n')"
            SECRET="$secret" perl -i -pe "s{^$var=.*}{$var=\$ENV{SECRET}}" .env.dev
        done
        printf "{{GREEN}}→ .env.dev created with generated JWT secrets{{NC}}\n"
        printf "{{YELLOW}}  Third-party keys (Brevo, Google, Bunny) stay placeholders — the app runs without them.{{NC}}\n"
    else
        printf "{{CYAN}}→ .env.dev already exists, skipping{{NC}}\n"
    fi
    # Hooks are a contributor convenience: never let them block a first-time setup.
    if command -v mise >/dev/null 2>&1; then
        just setup-hooks || printf "{{YELLOW}}→ Git hooks skipped. Run 'just setup-hooks' later.{{NC}}\n"
    else
        printf "{{YELLOW}}→ Git hooks skipped (mise not installed).{{NC}}\n"
    fi
    printf "{{GREEN}}✓ Project ready. Next: just dev-fresh{{NC}}\n"

# Install git hooks through mise; fresh clones are trusted before mise runs.
setup-hooks:
    mise trust --quiet
    mise exec -- lefthook install
    @printf "{{GREEN}}✓ Git hooks installed{{NC}}\n"

# Install deps from root (host)
install-deps:
    @printf "{{CYAN}}Installing monorepo dependencies...{{NC}}\n"
    bun install
    @printf "{{GREEN}}✓ Dependencies installed{{NC}}\n"

# Install deps in CI: the lockfile is law, any drift fails the job.
install-deps-ci:
    @printf "{{CYAN}}Installing monorepo dependencies (frozen lockfile)...{{NC}}\n"
    bun install --frozen-lockfile
    @printf "{{GREEN}}✓ Dependencies installed{{NC}}\n"

# Rebuild algo-derm tarball in vendor/ from a pinned ref + bun install --force.
# Aurore is calibrated for a fixed TAG_DEFS_VERSION (passes/algo-derm-detection.ts);
# algo-derm main has moved ahead, so we build from a pinned ref in a throwaway
# worktree (never the working checkout) and refuse a version mismatch. To migrate:
# bump CALIBRATED_FOR_TAG_DEFS_VERSION, cut a fresh `vNN-aurore` pin branch in
# algo-derm at the target commit, then point the default below at it (a named pin,
# not `main`, since `main` is usually the active algo-derm checkout → worktree clash).
vendor-algo-derm:
    #!/usr/bin/env bash
    set -euo pipefail
    REF="${ALGO_DERM_REF:-v30-aurore}"
    printf "{{CYAN}}Build algo-derm @ %s...{{NC}}\n" "$REF"
    WT="$(mktemp -d)"
    trap 'git -C {{ALGO_DERM_DIR}} worktree remove --force "$WT" >/dev/null 2>&1 || true' EXIT
    git -C {{ALGO_DERM_DIR}} worktree add --quiet "$WT" "$REF"
    ( cd "$WT" && npm ci --silent && npm run build:inci-aliases && npm run build )
    mkdir -p vendor
    rm -f vendor/algo-derm.tgz vendor/algo-derm-*.tgz
    ( cd "$WT" && npm pack --pack-destination {{justfile_directory()}}/vendor >/dev/null )
    mv vendor/algo-derm-*.tgz vendor/algo-derm.tgz
    # Refuse a build whose TAG_DEFS_VERSION differs from what Aurore is calibrated for.
    want="$(grep -oE 'CALIBRATED_FOR_TAG_DEFS_VERSION = [0-9]+' backend/src/features/auto-tagging/passes/algo-derm-detection.ts | grep -oE '[0-9]+$')"
    # -a: compiled index.js carries non-ASCII bytes, so plain grep treats it as binary and drops the match.
    got="$(tar -xzOf vendor/algo-derm.tgz package/dist/engine/tags/index.js | grep -aoE 'TAG_DEFS_VERSION = [0-9]+' | grep -oE '[0-9]+$' | head -1)"
    if [ "$got" != "$want" ]; then
        printf "{{RED}}refusing: built TAG_DEFS_VERSION=%s but Aurore is calibrated for %s — re-run audits + bump CALIBRATED_FOR first.{{NC}}\n" "$got" "$want"
        exit 1
    fi
    printf "{{GREEN}}✓ vendor/algo-derm.tgz updated (TAG_DEFS v%s, ref %s){{NC}}\n" "$got" "$REF"
    # Regen bun.lock integrity for the rebuilt tarball; else `bun install --force`
    # fails the integrity check (the hash is keyed to the tarball bytes).
    export newint="sha512-$(openssl dgst -sha512 -binary vendor/algo-derm.tgz | openssl base64 -A)"
    perl -i -pe 's{(\Q"algo-derm": ["algo-derm@../vendor/algo-derm.tgz", {}, "\E)sha512-[^"]+}{$1 . $ENV{newint}}e' bun.lock
    # bun keys the file: tarball extraction once and reuses it on --force; purge the
    # cache entry + its @T@ target so host node_modules (and host tsc -b) get the rebuild.
    for l in "${BUN_INSTALL:-$HOME/.bun}"/install/cache/algo-derm/*; do rm -rf "$(readlink -f "$l")"; done
    rm -rf "${BUN_INSTALL:-$HOME/.bun}/install/cache/algo-derm" node_modules/algo-derm
    bun install --force
    printf "{{GREEN}}✓ Deps reinstalled (algo-derm@%s from tarball, host cache purged){{NC}}\n" "$REF"

# Full backend rebuild (volumes + image)
reinstall-backend:
    {{COMPOSE_DEV}} down
    {{COMPOSE_DEV}} build --no-cache api
    {{COMPOSE_DEV}} up -d
    @printf "{{GREEN}}✓ Backend reinstalled{{NC}}\n"

# Watch TypeScript (generates types for editor)
ts-check:
    bunx tsc -b --watch

# Host-side preflight: TanStack routes + TypeScript project check
ts-build:
    @printf "{{CYAN}}Generating TanStack routes...{{NC}}\n"
    cd frontend && bunx @tanstack/router-cli generate
    @printf "{{CYAN}}TypeScript global check...{{NC}}\n"
    bunx tsc -b

# Verify types without watch (end of session, incremental). Solution graph includes backend tests.
ts-verify:
    bunx tsc -b

# Remove all dist/ and TS caches
ts-clean:
    @printf "{{YELLOW}}Cleaning types...{{NC}}\n"
    rm -rf shared/dist backend/dist frontend/dist
    find . -name "*.tsbuildinfo" -delete
    find . -name ".turbo" -type d -exec rm -rf {} + 2>/dev/null || true
    @printf "{{GREEN}}✓ Types cleaned{{NC}}\n"
