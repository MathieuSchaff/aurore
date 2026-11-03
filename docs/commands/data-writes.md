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
| Unresolved supplement groups | For `complement` products, a token containing `(` that the resolver cannot resolve suspends automatic deletions for the product, including collision-only deletions. Unclosed parentheses count. Inserts still follow the normal resolver and identity guard; held rows retain their source, doses and notes. Resolved annotations and other categories keep their usual policy. |
| Composite iron oxides | A closed `Iron Oxides (CI ..., ...)` group may produce separate CI 77491, CI 77492 and CI 77499 links, in declaration order, only when every member resolves to its exact catalogue identity. Commas, slashes and implicit repeated CI prefixes are accepted. Closed single-code iron oxide declarations joined by underscores are accepted as one atomic group, with an optional `[ILN<digits>]` footer. Malformed joins are checked before normalization can discard a CI code. A natural-origin/organic footer is not an ingredient. No generic pigment fallback is added. |
| Unresolved CI groups | Unsupported, unknown or incomplete composites suspend automatic deletions for the product and produce no partial group inserts. Nano-qualified groups and CI declarations inside an optional region stay unresolved. Certain regions before or after a closed optional block keep their usual resolution. Unresolved groups are reported even when no deletion was proposed. |
| Optional declarations | `partitionInciPresence` separates certain and optional regions before token splitting. An isolated pigment or a non-CI ingredient inside an optional region never creates a certain link. An open declaration keeps the rest of the list optional; a closed block allows certain ingredients after it. Optical `(+/-)-Alpha-Tocopherol` remains certain. Existing uncertain automatic links are held with a diagnostic, not purged or converted to manual links. |
| Unresolved newline boundaries | After presence partitioning, certain tokens use exact-name line segmentation. Ambiguous or unknown readings create no link and suspend automatic deletions for the product; uniquely readable tokens keep normal resolution. No catalogue name fallback overrides the refusal. |
| Provenance | `source` defaults to `manual`; only the linker writes `linker`. An unmarked writer is treated as human and never deleted |
| One substance, one link | Two ingredient rows can share a `canonical_key`. Only the first in INCI order (the most concentrated) is kept; the other insert is held back, not written |
| Ambiguous fallback | A `canonical_key` fallback with several candidates of the preferred `ingredients.type` is reported and left unlinked. During `RELINK`, a stale `linker` row for that ambiguous key is removed; manual rows survive. Direct INCI index hits stay authoritative; row or alphabetical order never decides a fallback. |
| Proprietary evidence | A curated Angiopausine/Comedoclastin link suppresses the generic `Silybum Marianum Fruit Extract` fallback for that product, so one token never appears twice. |
| No count cap | INCI order is concentration order, so a cap loses the low-dose active |

The dry-run report lists every planned write, one line per product (`slug · +added -removed`), so the
plan can be reviewed before `--write`. Held deletions have separate row and product counts, plus
one JSON line per held row with product slug/ID, ingredient slug, link ID, unresolved token
or raw optional region and reason `unresolved-parenthetical-group`, `unresolved-ci-group`
or `optional-declaration` or `unresolved-line-boundary`. Optional and unresolved-boundary
diagnostics are reported even without a proposed deletion.
These holds remain visible on subsequent runs even
if no writes remain. They require declaration review: an uncertain product may retain an unrelated
stale link. A clarified flat list restores normal reconciliation. No nested fragment is promoted
to an ingredient by this guard. The report also names the zero-link buckets:

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
| `clean-inci` | Repairs uniquely readable line breaks, then runs the algo-derm cleaner over the corpus: labels, broken separators (pipe, middot, en dash, period), marketing and legal prose | Skips ambiguous or unknown line segmentation, loss of detected damage evidence, results under 3 tokens or under 50 % of the original |
| `resplit-single-token` | Repairs selected blobs with qualified separators and longest matches from the installed alias index | Supplements excluded. Unresolved newline boundaries, changed declarations and annotations are retained at different scopes; see [safeguards and counters](#historical-resplit-safeguards) |
| `worst-match-prose` | Per-slug fixes: null, set, strip after a marker, strip HTML | Source rejection aborts planning; stale writes roll back the transaction. HTML extraction and closing-tag repair retain list terminators; punctuation-only results are rejected |

These historical cleanup scripts do not call the governed `normalizeInci` used by product
creation and editing. `clean-inci` shares intake's exact-name line segmentation and reports
unresolved boundaries separately. It also refuses transformations that erase a previously
detected damage reason, reporting `Skipped damage evidence loss`; changes that retain the
reason remain allowed. It retains the cleaner's spelling and token thresholds;
these do not provide all of the governed normalizer's declaration-preservation guards.
The raw `clean-inci.ts` CLI accepts only `--apply` (repetition is idempotent), or no
arguments for dry-run. All other arguments, including `--limit=...`, fail before SQL
in both modes. The recipe still exposes `--write` and translates it to `--apply`;
`LIMIT` belongs only to resplit and is not a cleaner scope.
In apply mode, `clean-inci` updates only rows whose current INCI still equals the value
read, using `RETURNING id`. Concurrent edits or deletions are counted as `Skipped stale rows`,
without a successful `Touched`, `Updated` or preview entry. Dry-run counts proposals,
keeps this counter at zero and reserves nothing. No retry, revision check or batch transaction.
See [catalog.md](catalog.md#product-maintenance) for the governed maintenance command and its
scope; compare the relevant ingredient links and tags before applying an authorized plan.

For raw `worst-match-prose.ts`, only `--apply` is accepted (repetition is idempotent),
or no arguments for dry-run. Unknown arguments, including `--limit=...` and `--slug=...`,
fail before SQL. The public recipe still translates `--write` to `--apply`; no new scope
option is added. Existing per-slug definitions are unchanged. A source rejection aborts
planning; a row changed after validation aborts and rolls back the existing transaction.
HTML extraction and repair of a trailing `/p`, `/span` or `/div` preserve commas, semicolons
and ellipses at the end of the extracted formula. A single final period is still removed,
and punctuation-only results fail as empty extractions. This preserves truncation evidence
for later input qualification; it does not provide every governed-normalizer safeguard.
In HTML extraction, `p`, `div` and `br` boundaries become newlines. Only a unique reading
of known names is folded; ambiguous or unknown line segmentation aborts planning as
`unresolved-line-boundaries`. This check concerns the extracted payload, preserving its
terminal punctuation; inline spans keep whitespace semantics. Marker-only `strip-after`
and legacy closing-tag repair keep their own behavior.
Tag removal recognizes a tag name beginning with a letter. Other angle spans, including
paired numeric comparisons such as `&lt;5% ... &gt;1%`, survive until the existing
`markup-residue` rejection (line-segmentation checks can reject a multiline payload earlier).
No partial extraction or writes from that plan are applied;
this command does not interpret those comparisons or validate their scientific meaning.

For `resplit-single-token`, the recipe forwards a nonempty `LIMIT` as `--limit=...`.
The CLI validates it before opening SQL, in both dry-run and apply modes: after `Number`
conversion it must be a non-negative safe integer, and the supplied value must not be blank.
Invalid values fail instead of disabling the bound. Existing valid conversions such as
`01` and `1.0` to 1 remain accepted. An omitted flag is unbounded; `0` proposes or writes
nothing but still reads SQL. The bound counts changed proposals or writes, not selected
candidates or guard refusals. SQL selection order is unspecified. An empty recipe `LIMIT`
is omitted; an explicit empty `--limit=` is rejected. No transformation or counter changes.

The raw resplit CLI accepts only `--apply` and at most one `--limit=...`, in any order.
Unknown options, positional arguments, separated `--limit 1`, raw `--write`, and repeated
limits (including equal values) fail before SQL in dry-run and apply modes. No first/last
limit wins. Repeating `--apply` remains idempotent. The recipe still translates its
`--write` into `--apply`; the numeric validation above and transformation counters stay unchanged.

### Historical resplit safeguards

The cleanup recipes accept `--write`; `scripts/just/inci.just` translates it to `--apply`
for these historical CLI scripts. Cleanup writes concern INCI only, without automatic
relinking, retagging or structured dose creation. Local validation does not imply deployment
or approval to apply a historical repair plan.

| Stage | Guardrail |
| :--- | :--- |
| Before repair | Skip selected rows with ambiguous or unknown exact newline segmentation. The shared helper acts as a gate; its folded value is not stored |
| Trivial separators | Qualify list dashes so the examined numeric ranges and isolated prefixes remain intact. Preserve the longest recognized spaced slash name, including names embedded in glued regions. Keep named and numeric HTML entity terminators without decoding entities |
| Longest match | Require at least 3 matched spans and a ratio ≥ 0.7. Known slash names and their annotations may exceed the ordinary window. Long normalized aliases use the installed index bound; short aliases retain their five-word annotation window |
| Declaration spans | Refuse a region whose proposal splits a nano marker or quantity in percent, ppm or mg/g from its preceding word. Safe repairs outside the retained region remain allowed |
| Recomposition | Reuse source commas already at token boundaries; retain final commas and preexisting empty entries |
| Final annotations | Refuse the whole changed row if round/square annotations, their preceding word, nested or adjacent groups change, or delimiters are unbalanced. Repeated annotations are checked separately |
| Final optional declarations | After annotation checks, refuse changed rows whose optional regions lose their count, order or contents (ignoring whitespace, commas and semicolons) |
| Final quality | After optional-region checks, refuse changed rows losing any source suspicion reason from the shared qualifier; suspect inputs preserving every reason remain repairable |

The final optional-declaration guard compares the source and proposed optional regions
using the shared presence partitioner: same count, order and contents after removing
whitespace, commas and semicolons. Lost spaced markers or text moved outside a region
reject the whole changed row. A retained first region cannot hide a missing second one.
Intact `+/-`, `±`, `May contain` and `Peut contenir` declarations keep their existing
behavior, including the shared optical-isomer exclusions. Separator changes preserving
these regions remain allowed. The stricter annotation guard runs first; negative claims
and unrecognized markers gain no new interpretation.

The final quality guard then requires every source suspicion reason from `qualifyInciInput`
to survive in the proposal. Dropping `non-formula-text` by changing `Sans Retinol` into
`Sans, Retinol` rejects the whole changed row. An unchanged suspect status is insufficient
when one reason is lost but another remains. Suspect inputs remain repairable when their
reasons survive; the qualifier gains no new claim grammar or completeness threshold.

Percentage preservation covers integer/decimal values, numeric ranges joined by ASCII
or Unicode dashes, `to` or `à`, and operators `<`, `<=`, `>`, `>=`, `≤`, `≥`, `~`, `≈`.
It retains literal wording and units, without calculating bounds or interpreting a dose.
Intact parenthesized declarations and explicit list separators remain repairable.
The separate ppm guard retains the preceding word, integer/decimal value, optional range
or operator, and literal `ppm` unit (case insensitive, attached or spaced). Repeated
occurrences are checked separately; the unit ends at a word boundary (`ppma` is excluded).
It performs no conversion to percent or structured dose extraction.
A separate mg/g guard preserves the preceding word, value, optional range/operator and
literal unit, case insensitive. The trivial splitter first preserves the slash between
`mg` preceded by a digit and `g` ending at a word boundary, including spaces/tabs around
the slash. Other list slashes keep their existing behavior. Intact parenthesized ratios
and safe repairs outside a retained region remain allowed. Other units are outside this
guard; no numeric conversion or structured dose extraction is performed.

The percent, ppm and mg/g guards also cover leading decimal forms such as `.5` and `,5`,
for a single value or either range bound, with the existing operators and unit syntax.
They retain the literal source or reject the region using its existing unit counter.
No leading zero is inserted and no numeric conversion or structured dose is created.
Intact annotations, explicit list separators and partial repairs remain allowed.

The same three guards cover compact exponents: an existing integer/decimal mantissa
followed by `e` or `E`, an optional ASCII `+`/`-` sign and one or more digits. This applies
to a single value and either range bound, for example `5e-1%` or `.05-1e-1%`.
Keep the literal span with its preceding word or retain its region using the existing
unit counter. Intact annotations, explicit separators and safe partial repairs remain
allowed. No exponent evaluation, conversion or structured dose; other notations are not guaranteed.

In apply mode, each UPDATE requires both the row id and the exact INCI value read by
SELECT, and checks `RETURNING id`. A concurrent edit or deletion skips that row, without
an apply preview, a successful strategy count or consuming the write limit. It also
increments `skipped`; other candidates may still be processed. No automatic reread or retry.
Dry-run previews use the values read and do not reserve a future write; their stale counter
stays zero. This compares INCI values, without a revision number or a check on other fields;
an intervening change back to the same INCI is not detected. No whole-run transaction,
relinking or retagging is added.

| Counter | Unit |
| :--- | :--- |
| `Skipped stale rows` | Apply rows not returned by the conditional UPDATE; included in `skipped`, excluded from writes and the write limit |
| `Skipped unresolved line boundaries` | Selected rows skipped before repair |
| `Nano regions kept unsplit` | Regions retained by the nano declaration guard |
| `Percentage regions kept unsplit` | Regions retained by the percentage guard, including ranges and operators |
| `PPM regions kept unsplit` | Regions retained by the separate ppm guard, without dose conversion |
| `Mass-ratio regions kept unsplit` | Regions retained by the mg/g guard, distinct from preserved unit slashes |
| `Annotation rows kept unchanged` | Changed row proposals rejected by the final annotation guard |
| `Optional-declaration rows kept unchanged` | Changed row proposals rejected by the final optional-region guard, after annotation checks |
| `Damage-evidence rows kept unchanged` | Changed row proposals rejected for losing at least one suspicion reason, after annotation and optional-region checks; counts rows, not reasons |

Counters measure different scopes; do not sum them as repaired products or deleted links.
A retained region can coexist with a partial row repair. No guard certifies every unknown
blob or quantitative notation. Compare resulting ingredient links and tags separately.

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
| `just image-build-mapping` | Build `output/image-mapping.json` from Bunny files and actual DB image references | Prerequisite of `image-fix-refs`. Local artifact |
| `just image-fix-refs` | Clear still-missing references. Writes DB only; preserves healthy references and all CDN files | `--write` |

Mapping version 3 binds the plan to `TARGET` and the DB/CDN configuration. Regenerate older
artifacts with `just image-build-mapping`; `image-fix-refs` refuses them. Both recipes supply
`IMAGE_MAINTENANCE_TARGET` from `TARGET`; direct Bun invocations must set it explicitly.
`IMAGE_CDN_BASE` is required for both scripts so references are matched against the configured
origin and prefix, including URLs with query strings or fragments.

Healthy references stay unchanged even when their filename differs from the product slug or
several products share the same image. Repairs never copy or delete CDN files. Each planned
nullification checks the exact storage object without listing the zone again: only HTTP 404
allows clearing the reference. Other HTTP or network errors preserve it and report a failure.
The DB update also requires the stored URL to still match the plan. Skipped repairs require a
fresh mapping. Orphan candidates describe references in the selected DB only and never
authorize automatic deletion in a shared storage zone.

| Trap | Detail |
| :--- | :--- |
| Images must live on Bunny | An external URL breaks in production: the CSP `img-src` rejects it |
| Naming convention | `_` becomes `-`; `.raw` means DNG |
| Orphans | Measured by `just audit-cdn`, which stays the authoritative inventory |

## Evidence for a bounded data change

A dry-run is a dated proposal, not a reservation or approval to apply every reported delta.
For an authorized subset, verify exact product/ingredient membership and current source
preconditions, retain the actual created row IDs, then compare the committed delta,
protected curation, convergence and snapshots. Regenerate both full and catalogue-only
snapshots after a dev catalogue change; [snapshot procedure](database.md#snapshot-dev-only).
A software or lockfile change can invalidate preparation hashes without changing stored rows.

A rollback ownership receipt must target the created IDs and refuse later changes to their
source, dose, notes or identity. A pre-commit receipt alone does not prove commit, and a
whole-database restore is not a targeted inverse. Do not promote simulated IDs into a real
rollback. Exact timestamps must retain native PostgreSQL text/JSON precision; the patched
Bun/Drizzle Date fallback preserves the UTC instant at millisecond precision only.
See the [date contract](../conventions/dates.md). These checks add no CLI flags or new recipe.
