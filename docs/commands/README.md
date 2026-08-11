# Commands

Every command you can run, grouped by the task you are trying to do. One table per file:
command, what it does, what it writes.

`just --list` is the live list of recipes, grouped the same way as the pages below
(`just --groups` names the groups). These pages carry what a recipe name cannot say —
env vars, outputs, order, and the traps.

| Page | Use it when |
| :--- | :--- |
| [dev-stack.md](dev-stack.md) | Start the app, typecheck, containers, ports, seed logins, troubleshooting |
| [tests.md](tests.md) | Backend, frontend, shared, E2E, CSP and SSR guards, coverage |
| [code-audit.md](code-audit.md) | Dead code, lint, types, cycles, complexity, bundle analysis |
| [database.md](database.md) | Migrations, seed, snapshot, backup, restore |
| [catalog.md](catalog.md) | Import a product lot, ingest external sources |
| [data-audits.md](data-audits.md) | Read-only audits: live DB, INCI corpus, auto-tagging |
| [data-writes.md](data-writes.md) | Ingredient linker, INCI cleanups, auto-tag backfill, images |
| [deploy-ops.md](deploy-ops.md) | Prod access, deploy, data fixes, crons, monitoring |

## Conventions

These hold for every recipe below.

| Rule | Detail |
| :--- | :--- |
| Parameters are env vars | `TARGET=prod LIMIT=50 just <recipe>`. Only a finite choice (`<phase>`, `<script>`) or a path (`<file>`, `<jsonl>`) stays positional. |
| …except typed options | A few recipes take `--kebab-case` options instead: `just <recipe> --slug x`. `just --usage <recipe>` prints them, and an unknown option is refused instead of ignored. Per-recipe pages mark which form applies. |
| `TARGET` | `dev` (default) or `prod`. Selects the Compose stack and the `.env.<target>` file. Any other value aborts before the recipe starts, whichever recipe was asked for. |
| Dry-run by default | Anything that writes previews first. `--write` applies. |
| Prod confirmation | Prod + write asks for a typed word: `PROD`, `I DESTROY PROD` when destructive, `DEPLOY` for a deploy. |
| Split-brain guard | `TARGET=prod` from a laptop **aborts** — the local Compose project would match the dev stack. Real prod goes through `just prod-ssh '<cmd>'`. |
| Audit reports | DB audits write `.audit-out/db/<name>.<TARGET>.md`. Code audits write `.audit-out/*.txt`. |
| After a dev write | Run `just db-snapshot` so the next reset keeps the change. |

## Requirements

Bun, Docker, mise, just.

## Local outputs

Everything below is gitignored. Clean it all with:

```bash
rm -rf .audit-out backend/coverage frontend/coverage frontend/test-results \
    frontend/playwright-report frontend/blob-report frontend/.playwright \
    frontend/stats.html
```
