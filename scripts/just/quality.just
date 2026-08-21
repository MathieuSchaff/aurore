import '_vars.just'

[doc('Check code with Biome')]
[group('quality')]
lint:
    bunx biome check .
    bun scripts/check-auth-import-boundaries.ts

[doc('Fix lint issues')]
[group('quality')]
lint-fix:
    bunx biome check --write .

# The `-` prefixes are load-bearing: --save-baseline writes the file and *then* exits non-zero
# on the findings it just recorded, which would abort the recipe after the first line and leave
# the other two baselines missing. `just audit-code` reads audit-health.json / audit-dupes.json.
#
# No --css on the health line: the baseline format has no slot for a styling finding, so the flag
# writes a byte-identical file and buys nothing. audit-code keeps those findings out of the
# baselined passes for the same reason.
[doc('Save audit baseline (reset after big cleanup)')]
[group('quality')]
fallow-baseline:
    -npx fallow dead-code --save-baseline .fallow/audit-dead-code.json --quiet
    -npx fallow health --save-baseline .fallow/audit-health.json --quiet
    -npx fallow dupes --save-baseline .fallow/audit-dupes.json --quiet

# anonDb is the anonymous view, so a new site sees too little (lost personalisation, lost request
# transaction) instead of escalating; no test and no type catches that.
# Freeze the `c.get('anonDb')` surface against scripts/anon-db-allowlist.json. "--update" rewrites the baseline.
[doc("Freeze the c.get('anonDb') surface against scripts/anon-db-allowlist.json. --update rewrites the baseline.")]
[group('quality')]
anon-db-gate flags="":
    bun scripts/anon-db-gate.ts {{flags}}

[doc('Dead-code scan via knip (re-export aware, fewer false positives than fallow). DATABASE_URL stub avoids drizzle.config.ts load error (knip only parses imports). Pass "--strict" to also report unlisted deps, types-only, etc. Second positional picks the reporter ("sarif" for audit-code).')]
[group('quality')]
knip flags="" reporter="compact":
    @DATABASE_URL=postgres://x bunx knip {{flags}} --reporter {{reporter}}

# Import cycles. Type-only imports are ignored via .madgerc so TanStack Start's generated
# Register imports and other erased TypeScript edges do not masquerade as runtime cycles.
# Seed blog data excluded: index↔article-data barrels are static data, not real coupling.
#
# Runs from a temp cwd with TypeScript 5 pinned. madge parses through
# @typescript-eslint/typescript-estree, which reads ts.Extension, an enum the workspace's
# TypeScript 7 native port no longer exposes, so any run that resolves the repo's own
# typescript crashes on "Cannot read properties of undefined (reading 'Cjs')". The temp cwd
# keeps Node from walking up into node_modules/. The madge devDependency stays in
# package.json to pin the major used here; it is not what actually runs.
#
# frontend/tsconfig.madge.json teaches madge the "@/*" alias; see that file for why the
# regular tsconfig cannot be used. --warning surfaces whatever still fails to resolve, so the
# next such blind spot shows up instead of being counted as clean.
[doc('Circular-dependency scan via madge, frontend @/* alias resolved.')]
[group('quality')]
[script]
cycles:
    repo="$PWD"
    iso="${TMPDIR:-/tmp}/aurore-madge-iso"
    mkdir -p "$iso"
    cp "$repo/.madgerc" "$iso/.madgerc"
    cd "$iso"
    npx -y -p madge@8 -p typescript@5.9 madge --warning --circular --extensions ts,tsx \
        --ts-config "$repo/frontend/tsconfig.madge.json" \
        --exclude '(dist|node_modules|db/seed/data)/' \
        "$repo/backend/src" "$repo/frontend/src" "$repo/shared/src"

[doc('Test prod CSP against prod build, locally, no Docker (builds dist, serves w/ nginx CSP, headless chromium, fails on violation). Test-only.')]
[group('quality')]
test-csp:
    cd frontend && VITE_API_URL=http://localhost:3000 bunx vite build && bun e2e/csp/check.ts

# Test auth boot convergence against the production SSR build, locally, no Docker.
# VITE_API_URL points at the check's mock proxy so server-side fetches cannot
# silently reach a live dev backend on 3000.
[doc('Test auth boot convergence against the production SSR build, locally, no Docker.')]
[group('quality')]
test-auth-ssr:
    cd frontend && VITE_API_URL=http://127.0.0.1:4190 bunx vite build && bun e2e/auth-ssr/check.ts

[doc('Regenerate the OpenAPI spec from the backend AppType (static ts-morph analysis, no runtime). Serve it via the dev API at /api/docs.')]
[group('dev')]
docs:
    cd backend && bunx @rcmade/hono-docs generate --config ./hono-docs.ts
