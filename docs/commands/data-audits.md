# Data audits

Read-only. Nothing here writes unless a row lists `--write`. Reports land in
`.audit-out/db/<name>.<TARGET>.md`.

## Everything at once

| Command | What | Output |
| :--- | :--- | :--- |
| `just audit-db-full` | Runs the 14 read-only audits in sequence. Never aborts midrun; exits 1 if any failed | Table summary → `.audit-out/db/audit-db-full.<TARGET>.md` |

This is also Gate B of `just catalogue-gate`, together with `audit-cdn` and `db-snapshot`.

## Live DB

| Command | What | Env |
| :--- | :--- | :--- |
| `just audit-db` | Admin RLS integrity: tag/domain coherence (error level), image coverage, products with no ingredients (empty input, no comma, or comma-containing text with category counts; these buckets do not validate INCI), products with no tags, products with no dermo profile | - |
| `just audit-taxonomy` | Taxonomy coherence: absence claims on implausible kinds, product-type axis leaking, concern/effect duplication. Info only | - |
| `just audit-security` | Suspicious URLs and HTML injection in rows. Exits 1 on high severity in read-only mode; write mode also fails on unresolved manual high findings or failed fixes | `--write` auto-fixes, `CSV_OUT` exports |
| `just audit-cdn` | Authoritative CDN/DB reconciliation: Bunny orphans, broken DB references, reachability sample | - |
| `just db-stats` | Global admin RLS counts, including hidden catalogue rows and tenant aggregates; stdout only | - |

`audit-db` passes one admin RLS transaction to all six checkers. Domain mismatches
and auto-tags outside the eligible corpus include hidden products. Image coverage,
products without ingredients and products without tags retain their explicit visible
filters. The ingredient-profile checker includes hidden ingredients linked to products.
The audit stays read-only; error findings exit 1, info findings do not fail. No
repeatable-read isolation is added. Older public-scope reports can miss violations.

`audit-security --write` keeps exit status 1 when a high-severity finding requires
manual review, even if no automatic fix is available. Clean or low-only runs still exit 0.
This exit-status correction does not change detection, reading scope or automatic fixes.

`db-stats` passes the same admin RLS transaction to all five sections (products,
ingredients, tags, users and content), retaining each query's filters. Catalogue coverage
numerators and denominators therefore use the admin scope, including hidden products.
Visibility, public permissions and stored data are unchanged. It prints aggregates to
stdout without creating a report file. This transaction does not add repeatable-read
isolation; concurrent changes can still move counts between statements. Older reports
read through public RLS are not directly comparable with the new scope.

For the `audit-taxonomy` product-type-axis check, the headline counts distinct visible
products with `type-exfoliation` and another `product_type_v2` tag. Each format detail
counts its own associations, so the sum can exceed the headline when one product has
several formats. The visible filter, the other checkers, info severity and exit behavior
are unchanged. Findings do not authorize taxonomy changes or catalogue writes.

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

These signals form a post-ingest detection loop. A finding calls for diagnosis of the source
and the responsible transformation; it does not authorize folding, nulling or rewriting INCI.
Reproduce a transformation defect on its actual consumer before planning a correction.
Recognition coverage is not formula completeness, and a recognized optional ingredient need
not create a certain link. Linker holds, cleanup region/row refusals and stale writes are
different diagnostics; see [cleanup safeguards](data-writes.md#historical-resplit-safeguards)
and the [storage and consumer boundaries](catalog.md).

## Auto-tagging

Settings in `UPPERCASE` are env vars set before `just`; settings in `--kebab-case` are options
typed after the recipe name, and `just --usage <recipe>` prints them.

| Command | What | Settings |
| :--- | :--- | :--- |
| `just audit-auto-tags` | Full dry-run of the detector against the DB: hit / agree / new pairs per tag | `CONF_OVERRIDE, CSV_OUT, LIMIT, INCLUDE_DROPPED, DUMP_BUDGETS, DUMP_BENEFITS, BENEFITS_OUT, DISABLE_FLOORS, CHECK` |
| `just audit-auto-tags-check` | Calibration drift: hit rate per (slug, category) against the budget. Exits 1 on FAIL, out-of-budget warns | - |
| `just audit-gold-set` | Benchmark the orchestrator against the gold set: precision, recall, Brier, ECE per tag | `--gold-set`, `--csv-out`, `--strict` |
| `just audit-product-kinds` | Cosmetic/dental kind proposals via name patterns; supplements excluded. Read-only: even "certain" suggestions need review. Apply reviewed fixes with `just db-fix` | `--slug` |
| `just audit-kind-inci` | Kind/INCI text patterns to review, with product slugs: wash kinds without a recognized surfactant pattern, or leave-on kinds with a leading wash pattern. Does not validate source INCI, ingredient absence, or classification; verify source and intended use before correcting | - |
| `just audit-sans-sulfates` | Sulfate-free false negatives: leave-on products denied the claim by a cetearyl or coceth emulsifier | - |
| `just audit-tag-contradictions` | Absence tags (`sans-parfum`, `sans-silicones`, …) whose own INCI declares the thing they deny | - |
| `just audit-uv-filters` | Visible SPF products (name or `kind=sunscreen`) with no `filtre-uv` ingredient linked. Report-only: review source INCI and the actual linker before assigning a cause | - |
| `just audit-actif-class` | Dry-run of pass 2 with the runtime assessment and stored ingredient doses, before orchestrator precedence | `LIMIT, DUMP_DRIFT, DUMP_NEW` |
| `just audit-aha-bha-pha` | Manual AHA/BHA/PHA links not emitted by the current pipeline (kind, name, dose and claims included). **Trap:** `--write` deletes only manual pairs listed in a reviewed CSV | `--write`, `CSV_OUT, CSV_DIR, LIMIT, APPLY_FROM_CSV` |
| `just audit-concentration-solver` | Solver percentages against brand claims: MAE, RMSE, CI coverage | `--slug`, `--json-out` |
| `just audit-orchestrator-diff` | CSV snapshot and diff of the orchestrator output | `--csv-out` (required), `--baseline`, `LIMIT` |

| Trap | Detail |
| :--- | :--- |
| The drift check measures algo-derm alone | It reads `detectAutoTags`, not `detectAllAutoTags`. A tag set to `allow:false` disappears from the measurement instead of failing |
| A baseline is only valid against its own DB | Cut it again on the current database before comparing a bump |

## Explaining one product

| Command | What | Env |
| :--- | :--- | :--- |
| `just autotag-explain` | `SLUG=<slug>` traces a real product with its full input (name, description, brand, texture). Dropped candidates name the final emitting pass when the same slug wins in another Aurore pass. `INCI="…"` traces a raw INCI only, blind to the name and claim passes. `COUNTS=1` aggregates the whole catalogue | `SLUG, INCI, KIND` (default `serum`), `CATEGORY` (default `skincare`), `COUNTS` |

## Date and context of an audit

State the environment, capture, code and package context of each report. A measurement
before an authorized data change is not a current plan after that change. Reusing an old
CSV or report with a new runner, catalogue or lockfile is a new comparison, not an exact
historical replay. Preserve the original artifacts and compare members as well as counts.
An ISO timestamp accepted by a schema proves its form, not its equality to the native
PostgreSQL value; use the [date contract](../conventions/dates.md) for exact receipts.
Read-only audits do not approve or apply the plans they describe.
