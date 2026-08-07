import '_vars.just'

# Check code with Biome
lint:
    bunx biome check .

# Fix lint issues
lint-fix:
    bunx biome check --write .

# Save audit baseline (reset after big cleanup)
fallow-baseline:
    npx fallow dead-code --save-baseline .fallow/audit-dead-code.json --quiet
    npx fallow health --save-baseline .fallow/audit-health.json --quiet
    npx fallow dupes --save-baseline .fallow/audit-dupes.json --quiet

# anonDb is the anonymous view, so a new site under-scopes (lost personalisation, lost request
# transaction) instead of escalating — no test and no type catches that.
# Freeze the `c.get('anonDb')` surface against scripts/anon-db-allowlist.json. "--update" re-baselines.
anon-db-gate flags="":
    bun scripts/anon-db-gate.ts {{flags}}

# Dead-code scan via knip (re-export aware, fewer false positives than fallow). DATABASE_URL stub avoids drizzle.config.ts load error (knip only parses imports). Pass "--strict" to also report unlisted deps, types-only, etc. Second positional picks the reporter ("sarif" for audit-code).
knip flags="" reporter="compact":
    @DATABASE_URL=postgres://x bunx knip {{flags}} --reporter {{reporter}}

# Import cycles. Type-only imports are ignored via .madgerc so TanStack Start's generated
# Register imports and other erased TypeScript edges do not masquerade as runtime cycles.
# Seed blog data excluded: index↔article-data barrels are static data, not real coupling.
#
# Runs from a temp cwd with TypeScript 5 pinned. madge parses through
# @typescript-eslint/typescript-estree, which reads ts.Extension — an enum the workspace's
# TypeScript 7 native port no longer exposes, so any run that resolves the repo's own
# typescript crashes on "Cannot read properties of undefined (reading 'Cjs')". The temp cwd
# keeps Node from walking up into node_modules/. The madge devDependency stays in
# package.json to pin the major used here; it is not what actually runs.
cycles:
    #!/usr/bin/env bash
    set -euo pipefail
    repo="$PWD"
    iso="${TMPDIR:-/tmp}/aurore-madge-iso"
    mkdir -p "$iso"
    cp "$repo/.madgerc" "$iso/.madgerc"
    cd "$iso"
    npx -y -p madge@8 -p typescript@5.9 madge --circular --extensions ts,tsx \
        --exclude '(dist|node_modules|db/seed/data)/' \
        "$repo/backend/src" "$repo/frontend/src" "$repo/shared/src"

# Test prod CSP against prod build, locally, no Docker (builds dist, serves w/ nginx CSP, headless chromium, fails on violation). Test-only.
test-csp:
    cd frontend && VITE_API_URL=http://localhost:3000 bunx vite build && bun e2e/csp/check.ts

# Test auth boot convergence against the production SSR build, locally, no Docker.
# VITE_API_URL points at the check's mock proxy so server-side fetches cannot
# silently reach a live dev backend on 3000.
test-auth-ssr:
    cd frontend && VITE_API_URL=http://127.0.0.1:4190 bunx vite build && bun e2e/auth-ssr/check.ts

# Regenerate the OpenAPI spec from the backend AppType (static ts-morph analysis, no runtime). Serve it via the dev API at /api/docs.
docs:
    cd backend && bunx @rcmade/hono-docs generate --config ./hono-docs.ts
