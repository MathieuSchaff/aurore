# Tests

Backend uses `bun:test` against an isolated PostgreSQL on port 5433. Frontend uses Vitest and
jsdom. E2E uses Playwright against a Docker stack on isolated ports.

Naming rule: a recipe **without** `-dev` brings the test DB up first (safe, slower). A recipe
**with** `-dev` assumes it is already up (fast inner loop). `args` is a `bun test` filter.

## Before push or PR

```bash
just audit-code
just test
```

Add `just e2e` when a browser flow changed. Add `just test-csp` when the CSP, a frontend
dependency, or `frontend/src/client.tsx` changed. Add `just test-auth-ssr` when auth boot,
the root loader, or the server-hint context changed.

## Everything

| Command | What | Notes |
| :--- | :--- | :--- |
| `just test` | Shared (pure) + backend (full cycle) + frontend | ~2 min. Does not include E2E |

## Backend

| Command | What | Notes |
| :--- | :--- | :--- |
| `just test-db-up` | Recreate the test DB and apply migrations | `just test-db-up keep` reuses a running one |
| `just test-db-down` | Stop the test DB | — |
| `just test-db-seed` | Seed CORE into the test DB | Requires `test-db-up` |
| `just test-backend [args]` | Full backend suite, brings the DB up | — |
| `just test-dev [args]` | Backend suite, DB assumed up | The fast loop |
| `just test-dev-watch [args]` | Same, watch mode | — |
| `just test-watch` | Watch, brings the DB up first | — |
| `just test-backend-coverage [args]` | Backend coverage | → `backend/coverage/` (lcov) |

Targeted runs take a path or a substring:

```bash
just test-dev "products"
just test-dev "features/products/tests/products.routes.test.ts"
```

DB-backed tests clean their tables between tests, so a normal backend loop never needs a Docker
restart. Authoring rules: [`docs/conventions/backend-tests.md`](../conventions/backend-tests.md).

## Shared and frontend

| Command | What | Notes |
| :--- | :--- | :--- |
| `just test-shared [args]` | Shared unit tests | Pure, no DB |
| `just test-frontend` | Vitest suite | Components, hooks, forms, query serialization |
| `just test-frontend-coverage` | Frontend coverage | → `frontend/coverage/` (lcov, istanbul provider) |
| `cd frontend && bunx vitest` | Vitest watch mode | — |
| `cd frontend && bunx vitest --ui` | Vitest web UI | — |

## E2E

Isolated stack on 5174 / 3001 / 5434 with a tmpfs DB, runs alongside `just dev`. It is seeded
from the committed snapshot (full catalogue + personas), not from `seed-core`.

| Command | What | Notes |
| :--- | :--- | :--- |
| `just e2e-up` | Up + migrate + restore the snapshot | ⚠️ An already-running stack keeps a stale schema — re-run this after a new migration |
| `just e2e` | Run the Playwright suites | Auto-runs `e2e-up` if nothing serves 5174. Failures → `frontend/test-results/` |
| `just e2e-ui` | Playwright interactive mode | — |
| `just e2e-reset` | Recreate the stack from scratch | — |
| `just e2e-down` | Stop it | The tmpfs DB is lost |

Usual flow: `just dev-down` → `just e2e-up` → `just e2e`.

`frontend/src` is bind-mounted, so source changes need no image rebuild. Rebuild when package
dependencies, Docker config, migrations, or the DB snapshot changed.

## Guards (local-only, not in CI)

| Command | What | Run it after |
| :--- | :--- | :--- |
| `just test-csp` | Builds the prod bundle, serves it with the nginx CSP, drives headless chromium, fails on any violation | Editing the CSP, adding a frontend dependency, touching `frontend/src/client.tsx` |
| `just test-auth-ssr` | Builds the prod bundle, starts the generated Bun server, hydrates it in headless chromium. Checks the hinted server shell on `/` and `/products` and the four client outcomes (failed refresh, hint gone before hydration, restored session, anonymous without hint). Fails on hydration-mismatch console errors | Editing auth boot, the root loader, or the server-hint context |

## Bench

| Command | What | Output |
| :--- | :--- | :--- |
| `just test-bench` | Time the backend suite | `/tmp/aurore-backend-test.log` and `.time` |
| `just test-clean-count` | Re-read the `cleanDatabase` fire count from the last bench log | No re-bench. Baseline 903 — it must not climb |

## Traps

| Trap | Consequence |
| :--- | :--- |
| Two test runs at once | They share the test DB and destroy each other's state — the failures look real but are not |
| Playwright `reuseExistingServer: true` | A stale E2E container survives between runs |
| New frontend package without `just e2e-up` | The Docker image keeps the old `node_modules` |
