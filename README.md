# Aurore — Skincare Research Memory

I was tired of switching between brand websites, copying INCI lists into a spreadsheet, then pasting them into an AI to get an opinion — and losing everything between sessions. A folder of dead Markdown notes I never opened again.

Aurore centralises that: a personal database of skincare products and ingredients, with the **decision trail** kept beside each product — why it's still a candidate, why it was rejected, what fits the user's own goals. Calm by design, no scores, no medical claims, no shopping pressure.

---

## What Aurore is

A calm skincare shelf and formula notebook for people who **compare formulas before buying** — formula-conscious buyers, INCI readers, AI-skincare overthinkers.

The core loop:

```text
collect products → understand formulas → compare candidates
→ decide (keep / wishlist / reject) → come back later without losing the reasoning
```

**Decision states** (FR labels in the UI): `Wishlist`, `En cours`, `Saint Graal`, `À éviter`. `À éviter` is a first-class state, not a trash bin — it remembers *why* a product was rejected so the same research loop doesn't repeat.

## What Aurore isn't

- Not a medical tool or diagnostic system.
- Not a universal "best product for you" oracle.
- Not a safety score or Yuka-style verdict.
- Not a shopping app or influencer platform.

---

## Features

**Products & ingredients**

- Personal database of cosmetic products
- INCI parsed into structured ingredients (role, family, notes)
- Tag system for filtering and auto-tagging from formula signals
- Per-product personal note + decision state
- Product comparison without winners, scores, or fake precision

**Dermo signal (algo-derm)**

- Theoretical dermatological score per product (risk / benefit / confidence axes) computed backend-side from the INCI
- Calm presentation in the UI: groups before details, no medical claims, no universal verdicts
- Algo lives in a separate repo (`algo-derm`, MIT) vendored as a tarball — see [§ Vendored `algo-derm`](#vendored-algo-derm)

**Auth**

- Email + password (Argon2 via Bun) or Google OAuth
- Short-lived access token (15 min, memory) + refresh token (7 d, HttpOnly cookie, rotated)
- Row-Level Security at the Postgres level — see [`SECURITY.md`](./SECURITY.md)

---

## Stack

| Layer          | Technology                                             |
| :------------- | :----------------------------------------------------- |
| Runtime        | Bun                                                    |
| Backend        | Hono (REST API + typesafe RPC)                         |
| Frontend       | React 19, TanStack Router & Query                      |
| Database       | PostgreSQL 18 + Drizzle ORM                            |
| Validation     | Zod (shared between front and back)                    |
| Styling        | Vanilla CSS + Lucide Icons                             |
| Quality        | Biome (lint & format) + Vitest + Playwright + Lefthook |
| Infrastructure | Docker Compose + Nginx                                 |

---

## Quick start

> **Important**: the monorepo has a `shared` TypeScript package. Docker doesn't always have the build cache at startup, so build the types locally first.

```bash
# 1. First-time setup (deps + hooks + env template) — requires Bun + mise
just init

# 2. Fill in secrets
$EDITOR .env.dev

# 3. Start the full environment
just dev-fresh
```

**Daily workflow:**

- Terminal 1: `just ts-check` — TypeScript watch mode on the host
- Terminal 2: `just dev` — Docker

---

## Commands

### Development & types

| Command          | Description                        |
| :--------------- | :--------------------------------- |
| `just dev`       | Build types + start Docker         |
| `just dev-fresh` | Full cleanup + install + start     |
| `just ts-check`  | TypeScript watch mode (host)       |
| `just ts-build`  | Generate types and TanStack routes |
| `just ts-verify` | One-shot type check (host)         |
| `just diagnose`  | Check types and container state    |

### Quality & tests

| Command              | Description                    |
| :------------------- | :----------------------------- |
| `just lint-fix`      | Fix style with Biome           |
| `just format`        | Format code                    |
| `just test`          | Backend tests (isolated DB)    |
| `just test-frontend` | Vitest frontend tests          |
| `just test-all`      | Full test suite                |
| `just test-db-reset` | Reset the test DB from scratch |

### Backend tests (recommended workflow)

Keep the test DB running during your session:

```bash
just test-db-up  # once per session, starts Docker on port 5433
```

Run targeted tests:

```bash
just test-dev "products"
just test-dev "features/products/tests/products.routes.test.ts"
```

Watch mode (TDD):

```bash
just test-dev-watch "products"
```

> Each test (`beforeEach`) cleans tables via `cleanDatabase` — no need to restart Docker between tests.

### E2E (Playwright)

```bash
just dev-down   # stop the dev stack first
just e2e-up     # bring up the e2e overlay (swapped DB)
just e2e        # run Playwright suites
```

### Database

| Command                             | Description                        |
| :---------------------------------- | :--------------------------------- |
| `just db-generate`                  | Generate a SQL migration file      |
| `just db-migrate`                   | Apply migrations locally           |
| `just db-push`                      | Sync schema without migration      |
| `just db-studio`                    | Drizzle UI (http://localhost:4983) |
| `just db-seed`                      | Inject test data                   |
| `just db-reset`                     | Wipe + migrate + seed              |
| `just db-backup`                    | Backup to `./backups/`             |
| `just db-restore ./backups/xxx.sql` | Restore from a `.sql` file         |

---

## Structure

```text
aurore/
├── backend/            # Hono API (Route → Service → DB)
├── frontend/           # React SPA (Vite + TanStack Router/Query)
├── shared/             # Shared Zod schemas (source of truth)
├── vendor/             # Vendored deps (algo-derm tarball)
├── nginx/              # Reverse proxy (production)
├── backups/            # DB backups
├── just/               # Command entry point
└── docker-compose.yml  # PostgreSQL 18
```

---

## Vendored `algo-derm`

`algo-derm` is a separate MIT lib (`../algo-derm`) that computes the dermo signal from an INCI list. It's vendored into the backend as a tarball because Docker can't read outside the build context:

```bash
just vendor-algo-derm   # rebuild source, npm pack, drop into vendor/
just reinstall-backend  # if containers are running, wipe the volume + reinstall
```

Backend-only — the frontend receives the precomputed `ProductAssessment`. The bundled dataset (~535 KB) never ships to the browser.

---

## Configuration

- `.env.dev` — development (do not commit)
- `.env.prod` — production (do not commit)
- `.env.example` — template to copy

**Ports:**

| Service        | Port |
| :------------- | :--- |
| Frontend       | 5173 |
| API            | 3000 |
| DB             | 5432 |
| Test DB        | 5433 |
| Drizzle Studio | 4983 |

---

## License

Copyright (c) 2026 Mathieu Schaff.

Aurore is released under the **MIT License** — see [`LICENSE`](./LICENSE).

You may use, copy, modify, merge, publish, distribute, sublicense and sell
copies of the software, including for commercial purposes, as long as the
copyright notice and permission notice are kept in all copies or substantial
portions of the software.

---

## Troubleshooting

**Editor shows errors / Docker crashes at startup**

Symptom: `Cannot find module '@habit-tracker/shared'` (legacy package name, kept for now to avoid an invasive rename across imports).

```bash
just ts-clean && just ts-build  # rebuild types
# then restart Docker
```

Make sure `just ts-check` is running in a separate terminal on the host.

**Docker issues**

```bash
just stop          # port already in use
just dev-rebuild   # after a dependency change
just clean && just dev-fresh  # nuclear reset
```

---

## Production

1. Create `.env.prod` from `.env.example`
2. Update the domain and email in `just/ops.just` (`ssl-init`)
3. `just prod-migrate` — apply migrations
4. `just prod` — start services
5. `just ssl-init` — generate SSL certificate

---

## Related docs

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — code standards, commit format, PR rules
- [`SECURITY.md`](./SECURITY.md) — auth model, RLS, DB role separation
- [`PRIVACY.md`](./PRIVACY.md) — RGPD policy, data handling
- [`AI_USAGE.md`](./AI_USAGE.md) — how AI was used during development
