# Catalogue

Import product lots and ingest external sources.

Two seed paths exist and they are not interchangeable: `just db-seed` maintains the core
fixtures (tags, ingredients, users, articles, certifications), `just ingest-catalogue` imports
real products. Never use the first for a bulk import.

## Import a lot

A lot is a JSONL file, one product per line, each line matching the product create input. The
command runs inside the backend container from `/app/backend`, so a host file at
`backend/tmp/lots/products.jsonl` is passed as `tmp/lots/products.jsonl`.

Before storage, intake repairs semicolons, qualified list dashes and spaced `•`/`·` bullets
between entries with the same rules as the ingredient linker. Chemical hyphens and HTML entity
semicolons remain intact. CI, nano,
aromatic declarations, numeric percentages, optional ingredients, written alphabetical order
and botanical water preparations survive canonicalization with their separators repaired;
observable damage evidence stays in its original form. Newline lists are repaired only when exact known
ingredient names admit one complete segmentation, joining wrapped compound names when needed.
Ambiguous or unknown blocks keep the original line breaks. Arbitrary underscores are not split.

Input qualification decodes the supported HTML entities without folding list separators before
checking terminal punctuation. A trailing `&nbsp;` alone is not truncation; an actual comma,
semicolon or ellipsis before HTML whitespace remains suspect. Decoded whitespace-only input is
missing. Botanical water guards also recognize footnote marks before or after a parenthetical
annotation, without interpreting them as certification.

Preserving an optional declaration in storage does not make its ingredients certain.
The [ingredient linker](data-writes.md#ingredient-linker) and formula preview retain that modality
before token splitting; preview leaves optional regions unlinked without a name fallback.
Both also require a unique exact-name reading for newline boundaries in certain tokens;
unresolved boundaries stay unlinked, and the linker reports held automatic deletions.
Preview prepares delimiters for both tokens and suggested tags. Its suggestions fold newline
lists only for a unique reading without detected damage; otherwise the prepared input stays
intact. Preview never saves the input. Supplement suggestions remain disabled.

Historical cleanups have their own [safeguards and counters](data-writes.md#historical-resplit-safeguards).
They update INCI without automatically updating ingredient links or tags. In particular,
the resplit validates its raw CLI arguments and checks the exact INCI read before applying
a repair. A changed or deleted row is skipped; dry-run does not reserve a later write.
These checks do not give every other maintenance runner the same contract.

| Step | Command | What |
| :--- | :--- | :--- |
| 1. Dry-run | `just ingest-catalogue <jsonl>` | Validates, checks duplicates, writes a plan. Blockers exit 1, nothing written |
| 2. Apply | `just catalogue-apply <jsonl>` | Ingest (Gate A) then catalogue gate (Gate B). Dev-only |
| 3. Link | `just link-ingredients` | Ingredient links are **not** created by the ingest. See [data-writes.md](data-writes.md) |

| Output | Path |
| :--- | :--- |
| Dry-run plan | `backend/tmp/data-runs/<lot>-<timestamp>/plan.json` |
| Apply log | `backend/tmp/data-runs/<lot>-<timestamp>/apply.jsonl` |

Settings: env vars go before the command; `--write` goes after the recipe arguments.

| Setting | Effect |
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

`catalog-normalize-inci` targets `skincare`, `solaire` and `bodycare`. It skips every
row for which the shared normalizer raises a guard, even when that normalizer returns a safely
repaired source. It updates the INCI column only; ingredient links and tags are separate steps.
Its plan therefore differs from a theoretical replay of the normalizer on every product.
The SELECT runs in its own admin RLS transaction, including hidden products in those
three categories in both dry-run and write modes. Visibility is unchanged. This read
transaction ends before planning and the existing conditional write transaction.
The raw CLI accepts only `--write` (repetition is idempotent), or no arguments for dry-run.
Unknown arguments, including `--limit=...` and `--slug=...`, fail before the application
database module is loaded. No new LIMIT/SLUG option is added to the CLI or public recipe.
Older plans that silently omitted hidden products are not a current application plan.
In write mode, each UPDATE checks both the exact INCI read and current membership in
those three categories, then uses `RETURNING id`. A concurrent edit, deletion or move
out of scope is counted as `skipped stale`, without an automatic retry. `applied` counts
only returned rows after the existing admin RLS transaction commits. `to rewrite` and
previews remain the initial plan, including proposals later skipped; dry-run reserves
nothing and emits no applied/stale count. This is a value check, not a revision number.
The historical `inci-cleanup clean-inci` command has a separate contract described in
[data-writes.md](data-writes.md#inci-cleanups).

A slug is a catalogue row; a `canonical_key` is a substance. Two rows can deliberately share a
key: `-hair` shadows, and English/French pairs.

**Trap.** A one-off catalogue data correction is an idempotent SQL file applied with `just db-fix`,
not a raw `UPDATE` typed at a prompt: replayable in dev then prod, and archived once applied. Either
way the SQL bypasses INCI cleaning and auto-tag re-emission, so the `-- Re-derive:` header names the
runner to replay. See [deploy-ops.md](deploy-ops.md).
