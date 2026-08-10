# Data writes

Everything here is dry-run by default; `--write` applies. Prod plus write asks for a typed
confirmation. After any dev write, run `just db-snapshot`.

Settings in `UPPERCASE` are env vars set before `just`; `--kebab-case` ones are typed after the
recipe name and `just --usage <recipe>` prints them.

## Ingredient linker

| Command | What | Env |
| :--- | :--- | :--- |
| `just link-ingredients` | Backfills `product_ingredients` from `products.inci` | `--write`, `SLUG=<slug>` (one product), `RELINK=1` (every product that has an INCI, not only those with zero links), `ONLY_SLUGS=a,b` (with `RELINK=1`: insert only these derived slugs, no delete), `LIMIT` (integer ≥ 0, invalid aborts) |

This is the **only** path that links imported products: the seed only covers the TS fixtures,
the ingest does not link, and the service path is manual admin work. Run it after every ingest.

| Fact | Detail |
| :--- | :--- |
| Resolution order per token | Direct index hit, then the algo-derm alias (with botanical stripping), then the evidence-to-slug bridge |
| Writing reconciles, it does not replace | A link still derived is left alone; a stale link is removed only when its `source` is `linker`. An empty target caused by missing or malformed input deletes nothing, including with `SLUG=`. An explicit ambiguous fallback follows the exception below. |
| Scoped relink | `ONLY_SLUGS` is for a bounded creation lot when a full relink contains separately owned drift. It keeps the normal resolver and identity guard, but inserts only the named slugs and never deletes. |
| Provenance | `source` defaults to `manual`; only the linker writes `linker`. An unmarked writer is treated as human and never deleted |
| One substance, one link | Two ingredient rows can share a `canonical_key`. Only the first in INCI order (the most concentrated) is kept; the other insert is held back, not written |
| Ambiguous fallback | A `canonical_key` fallback with several candidates of the preferred `ingredients.type` is reported and left unlinked. During `RELINK`, a stale `linker` row for that ambiguous key is removed; manual rows survive. Direct INCI index hits stay authoritative; row or alphabetical order never decides a fallback. |
| Proprietary evidence | A curated Angiopausine/Comedoclastin link suppresses the generic `Silybum Marianum Fruit Extract` fallback for that product, so one token never appears twice. |
| No count cap | INCI order is concentration order, so a cap loses the low-dose active |

The dry-run report names the zero-link buckets:

| Bucket | Meaning | Action |
| :--- | :--- | :--- |
| `uppercase-mega-token` | Token of 8+ words, mostly uppercase | Separators probably lost. Review |
| `non-uppercase-mega-token` | Token of 8+ words, mostly lowercase | Prose or malformed INCI. Review |
| `resolved-but-unbridged` | algo-derm resolves it, no Aurore slug matches | Excipients are expected here; an active means a bridge hole |
| `blocked-only` | Every resolved slug is a filler or excipient | Expected |
| `nothing-recognized` | Nothing resolves | Obscure botanicals or an index hole. Review |
| `no-inci` | The product targeted by `SLUG` has no INCI | Nothing written, nothing deleted |

## INCI cleanups

| Command | What | Env |
| :--- | :--- | :--- |
| `just inci-cleanup <script>` | One cleanup: `clean-inci`, `resplit-single-token` or `worst-match-prose` | `--write`, `LIMIT` (resplit only) |
| `just inci-cleanup-all` | The three in sequence | `--write` |

| Script | What | Guardrail |
| :--- | :--- | :--- |
| `clean-inci` | Runs the algo-derm cleaner over the corpus: labels, broken separators (pipe, middot, en dash, period), marketing and legal prose | Skips when the result has fewer than 3 tokens or under 50 % of the original |
| `resplit-single-token` | Re-tokenizes blobs with no separators: trivial split then longest match against the algo-derm alias index | Supplements excluded: nutrition blobs were mangled historically. Needs ≥ 3 matched spans and a ratio ≥ 0.7 |
| `worst-match-prose` | Per-slug fixes: null, set, strip after a marker, strip HTML | The canonical home for one-off cases |

## Auto-tagging

Backfill and reconcile are two different ways to propagate a detector change.

| | `autotag-backfill` | `autotag-reconcile` |
| :--- | :--- | :--- |
| Creates new links | yes | yes |
| Raises relevance (secondary → primary) | yes | yes |
| Deletes stale links | no | yes |
| Lowers relevance | no | yes |
| Touches manual tags | no | no |

Reconcile syncs exactly with the detector output. Backfill is additive and upgrade-only, so it
is the cautious choice on prod. After a reconcile, backfill finds nothing.

`autotag-backfill` runs in its own one-shot container, never inside the live API container. It
walks products by stable `id` cursor (`PAGE_SIZE=100` by default), commits each write page, and can
be restarted from the beginning after a failure: the additive classifier skips pages already
applied. The runner has a 512 MiB cgroup by default (`AUTOTAG_BACKFILL_MEMORY_LIMIT` overrides it);
check host headroom before raising that limit. Every production run, including `SLUG` or `LIMIT`,
is refused outside this isolated service.

| Command | What | Env |
| :--- | :--- | :--- |
| `just autotag-backfill` | Additive backfill | `--write`, `SLUG, LIMIT, PAGE_SIZE, CONF_OVERRIDE, INCLUDE_DROPPED, TAG` (per-tag plan), `EXCLUDE_TAG`, `SAMPLE` (review CSV, with `SEED` / `CSV_OUT`) |
| `just autotag-reconcile` | Exact sync, manual-safe | `--write`, `SLUG, LIMIT` |
| `just autotag-purge-stale` | Deletes the nonmanual links of **one** tag the detector no longer emits | `TAG` (required), `--write` |
| `just autotag-purge-off-corpus` | Deletes the nonmanual links of products whose category left the auto-tag corpus (`skincare`/`solaire`/`bodycare`). Reconcile and purge-stale cannot see them | `--write` |
| `just autotag-goldset` | Stratified sample of 60-80 products → `data/gold-set/annotations.json`. Idempotent | `SAMPLE_SIZE, POSITIVES_PER_TAG, NEGATIVES_PER_TAG, SEED, GOLD_SET_PATH` |
| `just catalog-fix-tag-domain` | Fixes `tag_products` rows breaking a domain constraint (skincare tag types on haircare products) | `--write` |
| `just catalog-fix-tag-domain-safe` | The same fix plus `db-snapshot` in one command | `--write`. Dev-only |

To persist a single isolated tag, write it directly rather than running `db-seed`: a full seed
churns the snapshot for nothing.

## Images

The pipeline is Bunny CDN. Staging defaults to `backend/src/output` on the host;
`IMAGE_OUTPUT_DIR` overrides it.

| Command | What | Env |
| :--- | :--- | :--- |
| `just image-upload` | Upload one image, or a JSON batch, to Bunny and update the DB | `--write`, `SLUG` or `BATCH` (one required), `URL, FILE, NO_DB, NO_STAGED, CONCURRENCY` |
| `just image-build-mapping` | Build `output/image-mapping.json` from the Bunny ∩ DB inventory | Prerequisite of `image-fix-refs`. Local artifact |
| `just image-fix-refs` | Reconcile `image_url` against Bunny from the mapping: rename, nullify, cleanup. Writes **both** DB and CDN | `--write` |

| Trap | Detail |
| :--- | :--- |
| Images must live on Bunny | An external URL breaks in production: the CSP `img-src` rejects it |
| Naming convention | `_` becomes `-`; `.raw` means DNG |
| Orphans | Measured by `just audit-cdn`, which stays the authoritative inventory |
