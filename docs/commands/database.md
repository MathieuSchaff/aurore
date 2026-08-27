# Database

Migrations, seed, snapshot, backup. `TARGET=dev|prod` applies everywhere except where a row
says dev-only.

## Schema

| Command | What | Notes |
| :--- | :--- | :--- |
| `just db-migrate` | Apply Drizzle migrations | Runs on the host (`cd backend`, exports `.env.<target>`) |
| `just db-generate` | Generate migration files from the schema | Dev-only |
| `just db-push` | Sync the schema without a migration | **Trap:** loses `FORCE RLS` and the `auth.*` objects. Prefer `db-migrate` |

## Seed

The TS seed is idempotent and preserves user state. It never updates an existing slug. The
fixture accounts it creates, and how to log in as one, are in
[dev-stack.md](dev-stack.md#seed-accounts).

| Command | What | Notes |
| :--- | :--- | :--- |
| `just db-seed` | Push CORE seed deltas, then backfill `canonical_key` | Log → `.audit-out/db/seed.log` |
| `just db-seed-update` | Update name, description, content and category of existing entries | Leaves user data alone |
| `just db-seed-safe` | `db-seed` + `audit-db` | Recommended after a reseed |
| `just db-seed-reset` | **Trap:** TRUNCATE products/ingredients/tags, then reseed | Guarded when the DB holds more than the TS seed (`SEED_FORCE_RESET=1` forces). Types `I DESTROY PROD` on prod |

**The TS seed only carries the nonskincare fixtures. The real catalogue lives in the DB and
in the committed snapshot.** So `db-seed-reset` and `db-reset` wipe the ingested skincare
catalogue. Restore from the snapshot, never from the seed.

## Destructive

| Command | What |
| :--- | :--- |
| `just db-clean` | TRUNCATE every table in `public` (double confirmation on prod) |
| `just db-reset` | `db-clean` + `db-migrate` + `db-seed`. See the trap above |

## Snapshot (dev-only)

`backend/src/db/snapshot/data.sql` is a committed `pg_dump` artifact and the dev source of truth.

| Command | What |
| :--- | :--- |
| `just db-snapshot` | Dump data-only → `data.sql`. **Run after every dev write** |
| `just db-snapshot-load` | TRUNCATE and reload `data.sql` (needs a migrated schema) |
| `just db-snapshot-reset` | `db-clean` + `db-migrate` + load: the reset that keeps the catalogue |

| Trap | Detail |
| :--- | :--- |
| Never hand-edit `data.sql` | Change the DB, then run `db-snapshot` again. Regenerate after any column migration |
| A snapshot announced is not a snapshot committed | One regen was already lost with `git status` showing nothing. Verify by counting both sides |
| `grep` on an `INSERT` line lies | Inserts are positional and some are multiline (descriptions with newlines), so a `grep` sees only the first physical line and misses trailing columns. Count occurrences of the value, not `INSERT` lines |

```bash
docker exec app_db psql -U app -d appdb -tAc "select count(*) from product_ingredients"
grep -c '^INSERT INTO public.product_ingredients ' backend/src/db/snapshot/data.sql
```

## Catalogue to prod

| Command | What |
| :--- | :--- |
| `just db-catalogue-snapshot` | Catalogue-only dump (products, ingredients, tags, links, dermo profiles, articles, certifications; **no users**) → `catalogue.sql`, owner rewritten to `__OWNER_ID__`. Dev-only |
| `just db-prod-admin` | Create the prod catalogue owner from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (idempotent) |
| `just db-catalogue-load` | Load `catalogue.sql` with the owner resolved. Refuses if `products` is already populated. Run `db-prod-admin` first |

After a dev catalogue campaign the order is `just db-snapshot`, then `just db-catalogue-snapshot`.
The first keeps the full dev state; the second produces the user-free artifact prod loads.

## Backup and restore

| Command | What |
| :--- | :--- |
| `just db-backup` | `pg_dump` → `./backups/`. Prod is gzip + GPG (recipient `backup@aurore.local`), dev is plain `.sql` |
| `just db-restore <file>` | Restore. Detects `.sql`, `.gz` and `.sql.gz.gpg` |
| `just db-backup-prod` | Alias of `TARGET=prod just db-backup`: the installed cron calls it by name |
| `just db-backup-clean` | Delete backups older than 7 days. On the VPS |
| `just backup-cron-install` | Install the daily 3am backup cron. On the VPS |

## Read-only

| Command | What |
| :--- | :--- |
| `just db-stats` | Product, ingredient, tag and user counts |
