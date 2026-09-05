# Data audits

Read-only. Nothing here writes unless a row lists `--write`. Reports land in
`.audit-out/db/<name>.<TARGET>.md`.

## Everything at once

| Command | What | Output |
| :--- | :--- | :--- |
| `just audit-db-full` | Runs the 13 read-only audits in sequence. Never aborts midrun; exits 1 if any failed | Table summary → `.audit-out/db/audit-db-full.<TARGET>.md` |

This is also Gate B of `just catalogue-gate`, together with `audit-cdn` and `db-snapshot`.

## Live DB

| Command | What | Env |
| :--- | :--- | :--- |
| `just audit-db` | Integrity: tag/domain coherence (error level), image coverage, products with no ingredients (bucketed: no INCI, no comma, real INCI with zero links), products with no tags, products with no dermo profile | - |
| `just audit-taxonomy` | Taxonomy coherence: absence claims on implausible kinds, product-type axis leaking, concern/effect duplication. Info only | - |
| `just audit-security` | Suspicious URLs and HTML injection in rows. Exits 1 on high severity | `--write` auto-fixes, `CSV_OUT` exports |
| `just audit-cdn` | Authoritative CDN/DB reconciliation: Bunny orphans, broken DB references, reachability sample | - |
| `just db-stats` | Row counts | - |

## Seed source and corpus

These validate the seed source and the INCI corpus rather than user data.

| Command | What | Env |
| :--- | :--- | :--- |
| `just audit-ingredients-sync` | Ingredient slugs: missing in data, ghosts, duplicates | - |
| `just audit-ingredient-tags-coverage` | Ingredients in the DB with no tag at all | - |
| `just audit-inci-quality` | INCI corpus health, see below | `FULL=1` for complete lists |

`audit-inci-quality` reports three things:

| Section | What it flags |
| :--- | :--- |
| Pathologies | `preamble`, `mojibake`, `truncated`, `very-short`, `single-token`, `no-comma`, `html-entity`, `scraped-code` (JS or markup captured by the scraper), `stray-delimiter` |
| Unmatched tokens | Top tokens the parser never resolves, split French versus non-French. These are parser or evidence opportunities |
| Worst matches | Products by matched/total ratio, plus match rate per brand |

The last three pathologies are the post-ingest detection loop: above zero means a fold or null
data-fix needs another pass.

## Auto-tagging

Settings in `UPPERCASE` are env vars set before `just`; settings in `--kebab-case` are options
typed after the recipe name, and `just --usage <recipe>` prints them.

| Command | What | Settings |
| :--- | :--- | :--- |
| `just audit-auto-tags` | Full dry-run of the detector against the DB: hit / agree / new pairs per tag | `CONF_OVERRIDE, CSV_OUT, LIMIT, INCLUDE_DROPPED, DUMP_BUDGETS, DUMP_BENEFITS, BENEFITS_OUT, DISABLE_FLOORS, CHECK` |
| `just audit-auto-tags-check` | Calibration drift: hit rate per (slug, category) against the budget. Exits 1 on FAIL, out-of-budget warns | - |
| `just audit-gold-set` | Benchmark the orchestrator against the gold set: precision, recall, Brier, ECE per tag | `--gold-set`, `--csv-out`, `--strict` |
| `just audit-product-kinds` | `products.kind` mistags via name patterns. Read-only on purpose: the "certain" tier held ~31 false positives. Apply reviewed fixes with `just db-fix` | `--slug` |
| `just audit-kind-inci` | Kind mistags the name regex misses, via INCI signal (a wash kind with no surfactant) | - |
| `just audit-sans-sulfates` | Sulfate-free false negatives: leave-on products denied the claim by a cetearyl or coceth emulsifier | - |
| `just audit-tag-contradictions` | Absence tags (`sans-parfum`, `sans-silicones`, …) whose own INCI declares the thing they deny | - |
| `just audit-uv-filters` | Visible SPF products (name or `kind=sunscreen`) with no `filtre-uv` ingredient linked. Report-only: the cause is a weak source INCI, not a linking bug | - |
| `just audit-actif-class` | Dry-run of the pharmacological clusters (pass 2) | `LIMIT, DUMP_DRIFT, DUMP_NEW` |
| `just audit-aha-bha-pha` | Manual AHA/BHA/PHA overrides. **Trap:** `--write` here means DELETE from a CSV | `--write`, `CSV_OUT, CSV_DIR, LIMIT, APPLY_FROM_CSV` |
| `just audit-concentration-solver` | Solver percentages against brand claims: MAE, RMSE, CI coverage | `--slug`, `--json-out` |
| `just audit-orchestrator-diff` | CSV snapshot and diff of the orchestrator output | `--csv-out` (required), `--baseline`, `LIMIT` |

| Trap | Detail |
| :--- | :--- |
| The drift check measures algo-derm alone | It reads `detectAutoTags`, not `detectAllAutoTags`. A tag set to `allow:false` disappears from the measurement instead of failing |
| A baseline is only valid against its own DB | Cut it again on the current database before comparing a bump |

## Explaining one product

| Command | What | Env |
| :--- | :--- | :--- |
| `just autotag-explain` | `SLUG=<slug>` traces a real product with its full input (name, description, brand, texture). `INCI="…"` traces a raw INCI only, blind to the name and claim passes. `COUNTS=1` aggregates the whole catalogue | `SLUG, INCI, KIND` (default `serum`), `CATEGORY` (default `skincare`), `COUNTS` |
