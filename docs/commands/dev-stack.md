# Dev stack

Start the app, typecheck, containers, ports.

## First run

| Command | What | Notes |
| :--- | :--- | :--- |
| `just init` | Deps + `.env.dev` with generated JWT secrets + optional git hooks | Boots as-is; only the third-party keys stay placeholders |
| `just dev-fresh` | Clean + install + types + up | Preserves `pgdata`. Offers the snapshot restore when the DB is empty |
| `just setup-hooks` | Install git hooks only | Needs mise. `just init` skips it rather than failing |
| `just install-deps` | Install deps from the repo root (host) | - |
| `just install-deps-ci` | Same, `--frozen-lockfile` | CI only: any lockfile drift fails the job |

## Daily

Two terminals: `just ts-check` on the host, `just dev` for Docker.

| Command | What | Notes |
| :--- | :--- | :--- |
| `just dev` | Host TypeScript preflight, then Compose up | Containers run `src`, not `dist`: the preflight is what generates TanStack routes and catches type errors |
| `just dev-d` | Same, detached | - |
| `just dev-down` | Stop the dev stack | - |
| `just dev-rebuild` | `build --no-cache` + up | After adding a dependency |
| `just stop` | Stop every stack (dev, prod, test, e2e) | - |
| `just profile-prod` | Real nginx edge (HTTP/2 + TLS) in front of the built SSR frontend, `/api` to the dev backend | Needs `dev-d` first. Opens `https://localhost`, self-signed cert |
| `just profile-prod-down` | Tear the profiling stack down | Also detaches the dev backend from its network |

If the DB volume was wiped, `just dev` offers to restore from the committed snapshot.

## TypeScript (host, no Docker)

| Command | What | Notes |
| :--- | :--- | :--- |
| `just ts-check` | `tsc -b --watch` | Keep it running all session (see below) |
| `just ts-build` | TanStack routes + `tsc -b` | The preflight `just dev` runs |
| `just ts-verify` | `tsc -b` one-shot, incremental | End of session. Solution graph includes backend tests |
| `just ts-clean` | Remove `dist/`, `tsbuildinfo`, `.turbo` | - |

Runtime resolves `src`, **types resolve `dist`**:

```jsonc
// tsconfig.json
"@aurore/shared":  ["./shared/dist/index.d.ts"]
"@aurore/backend": ["./backend/dist/index.d.ts"]
```

```jsonc
// backend/package.json
"types": "./dist/index.d.ts",   // what the frontend reads
"bun":   "./src/index.ts"       // what the container executes
```

So a cross-package change only reaches the other package once `tsc -b` has re-emitted the
declaration files. Change a backend route, and `frontend/src/lib/api.ts` keeps typing the RPC
client against the **previous** `AppType` until the rebuild lands: no error, just stale types.
`just ts-check` is the watcher that keeps `dist/` in sync. The same holds for `shared/`.

Editing `shared/src` while the dev stack runs also needs `docker restart app_frontend`: Vite
caches the old module.

## Containers

Dev containers have pinned names `app_api`, `app_db`, `app_frontend`. The E2E stack uses
`e2e_api`, `e2e_db`, `e2e_frontend`.

| Command | What |
| :--- | :--- |
| `just shell-api` | Shell into the API container |
| `just shell-db` | `psql` into the dev DB |
| `docker ps --filter name=app_` | Container status + health |
| `docker logs -f app_api` | Follow one container's logs |
| `docker stats --no-stream` | Resource usage |
| `docker rmi aurore-frontend aurore-api` | Drop project images to force a rebuild |

## Ports

| Service | Port |
| :--- | :--- |
| Frontend | 5173 |
| API | 3000 |
| DB | 5432 |
| Test DB | 5433 |
| E2E frontend | 5174 |
| E2E API | 3001 |
| E2E DB | 5434 |
| Drizzle Studio | 4983 |

Drizzle Studio, dev and test DB:

```bash
(cd backend && set -a && . ../.env.dev && set +a && bunx drizzle-kit studio --port 4983)
(cd backend && DATABASE_URL=postgres://app:testpassword@localhost:5433/appdb_test bunx drizzle-kit studio --port 4982)
```

## Seed accounts

`just db-seed` creates seven fixture users. They live in the dev and E2E databases only:
production has never carried them. Shared password: `Azerty123!seed`.

Login is by **email**: `users` has no `username` column. The username below lives in `profiles`
and only surfaces on public profile pages.

| Email | Username | Role | What it exercises |
| :--- | :--- | :--- | :--- |
| `seed@seed.com` | - | admin | Admin surface: moderation, reports, back-office |
| `marie@seed.local` | `marie-test` | user | The reference collection: 4 `in_stock`, 1 `archived`, 1 `wishlist`, one review public with its ratings |
| `lea@seed.local` | `lea-test` | user | The `avoided` status and the `eviter-pour-moi` preference: the only persona on that path |
| `theo@seed.local` | `theo-test` | user | Acne concerns against strong actives, where inferred alerts fire |
| `anna@seed.local` | `anna-test` | user | Largest collection (7), two SPF entries |
| `camille@seed.local` | `camille-test` | user | Rosacea, Fitzpatrick I, `sans-parfum`: the "no medical verdict" path |
| `banned@seed.local` | `banned-test` | user | Global ban active, empty collection: access blocking |

The password is a fixture, not a secret: it already sits in
`backend/src/db/seed/seeders/seed-test-users.ts`. Nothing here ever reaches production.

## Vendored `algo-derm`

`algo-derm` is a separate MIT library (`../algo-derm`) vendored as a tarball, because Docker
cannot read outside the build context. Backend-only: the frontend receives the precomputed
assessment.

| Command | What | Notes |
| :--- | :--- | :--- |
| `just vendor-algo-derm` | Rebuild `vendor/algo-derm.tgz` from a pinned ref (`ALGO_DERM_REF`) in a throwaway worktree | Refuses if the built `TAG_DEFS_VERSION` does not match `CALIBRATED_FOR_TAG_DEFS_VERSION`. Purges the host Bun cache: skipping that leaves stale `TS2367` errors |
| `just reinstall-backend` | Full backend rebuild (volumes + image) | Run right after vendoring, then commit the tarball |

## API docs

| Command | What | Output |
| :--- | :--- | :--- |
| `just docs` | Regenerate the OpenAPI spec from the backend `AppType`, via `@rcmade/hono-docs`. Static ts-morph analysis: nothing runs, no server needed | `backend/openapi/openapi.json` |

One-shot: it writes the file on the host and exits. Nothing keeps running.

The spec is read back by two routes the dev API mounts outside `routes`, so they never leak into
the RPC client type: `/api/openapi.json` serves the file, `/api/docs` renders it with Scalar.
Both are gated on `NODE_ENV !== 'production'`: there is no API reference in production.

The API reads the file per request and `backend/openapi` is bind-mounted read-only into the
container, so regenerating shows up on a refresh (no restart).

`/api/docs` answering `spec_not_generated` means the JSON was never generated: run `just docs`.
The generator reads `tsconfig.build.json`, not the root `tsconfig.json`: the root is a solution
file (`files: []`) where ts-morph would see an empty project and extract no JSDoc.

## Environment files

| File | Role |
| :--- | :--- |
| `.env.dev` | Development. Never committed |
| `.env.prod` | Production. Never committed |
| `.env.example` | Development template |
| `.env.prod.example` | Production template |

## Troubleshooting

| Symptom | Fix |
| :--- | :--- |
| `Cannot find module '@aurore/shared'` | `bun install` then `just dev-rebuild`: workspace deps are stale |
| Editor shows errors the build does not | `just ts-check` in a separate terminal on the host |
| Docker in a bad state, DB must survive | `just clean-soft` (drops containers, keeps volumes) then `just dev` |
| Docker in a bad state, nothing to save | `just clean && just dev-fresh`. **Trap:** `clean` destroys **all** Docker volumes including the local `pgdata` |
| `node_modules` owned by Docker root | `just clean-install`: wipes `node_modules`, keeps `bun.lock` |
