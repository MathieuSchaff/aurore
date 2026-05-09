# Auto-tag gold set (audit O2)

Hand-annotated reference corpus (target 60-80 products) used by
`make audit-gold-set` to compute precision / recall / F1 / Brier / ECE per
tag against the orchestrator output. Lets calibration moves be measured
against ground truth instead of running blind.

## Scope

Focus calibration: 15 tags calibrated 2026-05-08 (`fini-glowy` retiré 2026-05-09 — slug killed comme marketing non-confirmable INCI).

| Group | Tags |
|-------|------|
| Actif-class clusters (positionCap: ∞) | `retinoids`, `vitamin-c`, `vitamin-e`, `hyaluronic-acid`, `peptides`, `polyphenols`, `enzymes-exfoliants`, `ceramides`, `tyrosinase-inhibitors` |
| Sensoriels Tier-1 | `fini-mat`, `texture-legere`, `texture-riche` |
| Acid clusters (positionCap: 10 — drift conservée par design) | `aha`, `bha`, `pha` |

Adding a tag requires editing `GOLD_SET_FOCUS_TAGS` in
`backend/src/db/seed/utils/gold-set.ts` and re-running bootstrap to draw
new samples for it.

## Schema (`annotations.json`)

```json
{
  "schemaVersion": "2026-05-08",
  "rulesetVersion": "products-branch@<sha>",
  "annotations": [
    {
      "productSlug": "the-ordinary-retinol-1pct",
      "kind": "serum",
      "category": "skincare",
      "present": ["retinoids", "moment-soir"],
      "absent": ["vitamin-c", "fini-mat"],
      "annotatedAt": "2026-05-08",
      "sampledFor": ["retinoids"],
      "notes": "Retinol 1 % top 5 — clear positive."
    }
  ]
}
```

Selective annotation: a tag is `present` when the annotator confirms it
fits, `absent` when it explicitly does not, otherwise **unrated** (metric
ignored). This keeps the corpus small enough to maintain by hand without
forcing exhaustive judgments per product.

`sampledFor` is a non-authoritative hint from the bootstrap — which focus
tag(s) caused this product to be drawn. Helpful when triaging.

## Workflow

1. **Bootstrap** (read-only on DB; writes `annotations.json` skeleton):
   ```sh
   make gold-set-bootstrap
   ```
   Idempotent: existing entries with non-empty `present`/`absent` are
   preserved. Re-running adds new skeletons; never overwrites.

   Tunables: `SAMPLE_SIZE` (default 70), `POSITIVES_PER_TAG` (4),
   `NEGATIVES_PER_TAG` (2), `SEED` (42).

2. **Annotate**: open `annotations.json` in an editor. For each new entry,
   fill `present` and/or `absent` arrays based on inspection of the INCI
   and product positioning. Use the `sampledFor` hint to focus on the
   recommended tags; rate other tags only when confident.

3. **Benchmark** (read-only):
   ```sh
   make audit-gold-set
   ```
   Outputs per-tag TP/FP/FN/TN, P/R/F1, Brier, ECE, plus macro/micro
   aggregates. Tag-versus-rated columns surface unrated gaps.

   Optional CSV per-pair predictions: `make audit-gold-set CSV_OUT=/tmp/preds.csv`.

   Strict mode fails if any annotation is still empty:
   `make audit-gold-set STRICT=1`.

## Calibration loop

```
edit rules → make backfill-auto-tags WRITE=1 → make audit-gold-set
```

The metrics shift on each rule change. A regression — e.g. F1 drop on
`retinoids` or precision drop on `aha` — flags overshoot before pushing.

For confidence-bearing tags (algo-derm passe 1: concerns, skin types,
absences), Brier / ECE quantify calibration too. The 16 focus tags here
are deterministic (passes 2-6), so Brier reduces to misclassification
rate and ECE collapses to a single bin — both still report meaningfully
but carry no calibration signal beyond P/R/F1.

## Gotchas

- **Drift hard-fails**: an annotated `productSlug` missing from DB causes
  `audit-gold-set` to throw with the orphan list. Re-run bootstrap or
  remove the dead entry.
- **Add tag scope**: editing `GOLD_SET_FOCUS_TAGS` invalidates samples
  for the new tag — re-bootstrap to redraw, then annotate.
- **Don't commit ad-hoc CSV outputs**: `CSV_OUT` paths typically point
  inside the container; use `/tmp` or a gitignored host-bind path.
