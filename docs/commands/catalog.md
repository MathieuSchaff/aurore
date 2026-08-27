# Catalogue

Import product lots and ingest external sources.

Two seed paths exist and they are not interchangeable: `just db-seed` maintains the core
fixtures (tags, ingredients, users, articles, certifications), `just ingest-catalogue` imports
real products. Never use the first for a bulk import.

## Import a lot

A lot is a JSONL file, one product per line, each line matching the product create input. The
command runs inside the backend container from `/app/backend`, so a host file at
`backend/tmp/lots/products.jsonl` is passed as `tmp/lots/products.jsonl`.

| Step | Command | What |
| :--- | :--- | :--- |
| 1. Dry-run | `just ingest-catalogue <jsonl>` | Validates, checks duplicates, writes a plan. Blockers exit 1, nothing written |
| 2. Apply | `just catalogue-apply <jsonl>` | Ingest (Gate A) then catalogue gate (Gate B). Dev-only |
| 3. Link | `just link-ingredients` | Ingredient links are **not** created by the ingest. See [data-writes.md](data-writes.md) |

| Output | Path |
| :--- | :--- |
| Dry-run plan | `backend/tmp/data-runs/<lot>-<timestamp>/plan.json` |
| Apply log | `backend/tmp/data-runs/<lot>-<timestamp>/apply.jsonl` |

Options, all env vars in front of the command:

| Env | Effect |
| :--- | :--- |
| `--write` | Apply. Without it, dry-run |
| `SEED_OWNER_EMAIL=…` | Use a specific pre-existing catalogue owner (default `seed@seed.com`) |
| `CLASSIFICATIONS=path/to/file.json` | Apply classification overrides |
| `ALLOW_PARTIAL=1` | Accept a lot with blockers and skip the blocked rows. Deliberate use only |

## Gates

| Command | What | Notes |
| :--- | :--- | :--- |
| `just catalogue-gate` | **Gate B**: `audit-db-full` + `audit-cdn`, then `db-snapshot` | The snapshot runs only if everything passes: no catalogue ships with a red DB or broken images. Dev-only |
| `just catalogue-apply <jsonl>` | **Gate A + Gate B**: `ingest-catalogue --write` then `catalogue-gate` | Dev-only |

Do not run `just db-snapshot` alone after importing products. Use the gate, so the audits run
before the snapshot changes.

## Production boundary

`catalogue-apply` is dev-only because it refreshes the dev snapshot. On prod, run the ingest
from the VPS:

```bash
just prod-ssh 'TARGET=prod just ingest-catalogue path/to/products.jsonl --write'
```

## External ingests

| Command | Source | What | Env |
| :--- | :--- | :--- | :--- |
| `just ingest-peta` | PETA | Probes ~220 brands and writes cruelty-free into `brand_certifications` | `--write`, `REFRESH` (fetch again), `STRICT_PRUNE` (drop stale `peta` rows) |
| `just ingest-obf` | Open Beauty Facts | Reads the ~17 MB dump and aggregates vegan / cruelty-free / natural claims per brand above `THRESHOLD` | `--write`, `DOWNLOAD`, `THRESHOLD` (default 0.5), `NO_WHITELIST` |
| `just ingest-incidecoder <phase>` | INCIDecoder | Clean INCI for products with a weak one. Phases in order: `crawl`, `match`, `fetch`, `apply` | Prod confirmation on `apply` |

## Product maintenance

`scan` reads a dump. The others write the DB and are dry-run by default.

| Command | What | Env |
| :--- | :--- | :--- |
| `just catalog-scan-dups [dump]` | Scans a SQL dump for four duplicate signals: misspelled slug, kits and lots, near-identical INCI within a brand, base + refill. Defaults to the committed snapshot | - |
| `just catalog-backfill-canonical-key` | Fills `ingredients.canonical_key` from algo-derm evidence. Run it again after a seed, a reset, or an algo-derm bump | `--write` |
| `just catalog-backfill-dermo-profiles` | Fills `ingredient_dermo_profiles` (comedogenicity, functions) from algo-derm evidence | `--write` |
| `just catalog-normalize-inci` | Rewrites `products.inci` into the governed canonical form (the same normalizer the create/update path uses) | `--write` |
| `just catalog-hide-kit-packs` | Soft-hides bundle products (coffret, kit, gift set, trio, lot de N). Idempotent | `--write`, `DELETE` |

A slug is a catalogue row; a `canonical_key` is a substance. Two rows can deliberately share a
key: `-hair` shadows, and English/French pairs.

**Trap.** A one-off catalogue data correction is an idempotent SQL file applied with `just db-fix`,
not a raw `UPDATE` typed at a prompt: replayable in dev then prod, and archived once applied. Either
way the SQL bypasses INCI cleaning and auto-tag re-emission, so the `-- Re-derive:` header names the
runner to replay. See [deploy-ops.md](deploy-ops.md).
