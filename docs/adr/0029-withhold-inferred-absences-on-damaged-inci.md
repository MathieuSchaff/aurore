---
date: 2026-10-29
accepted: 2026-10-29
---

# Withhold inferred absences on damaged INCI

Qualify observable damage in the original INCI before discarding formatting evidence.
Share that qualification between intake normalization and absence inference. Preserve
explicit name/description claims and the existing protection of manual tags.

## Why

Dictionary coverage measures recognized ingredients, not source completeness. A truncated
list can have full coverage. A prose paragraph can also produce `sans-savon`, whose Aurore
detector previously required only a nonempty token list and no soap pattern.

The same `Aqua, Glycerin` string can represent a complete formula or an unmarked truncation.
No text predicate can distinguish those sources without additional evidence. A minimum
length or comma requirement would reject legitimate mono and two ingredient formulas.

## Decision

1. `qualifyInciInput` returns `missing`, `suspect`, or `unknown`, with reasons. It recognizes
   explicit truncation markers, trailing list separators, and bounded prose, directions,
   nutrition or free-from-list patterns. Known removable headings and marketing tails are
   handled by the existing cleaner before searching for prose. It does not use dictionary
   coverage and never labels a source complete.
2. `normalizeInci` keeps the original whenever canonicalization would erase a damage reason.
   Formatting changes that preserve those reasons remain allowed. Evidence such as a trailing
   ellipsis must remain available when tags are recomputed from the stored value. No new column or
   persistent quality flag is added; repairing the INCI therefore removes the restriction.
3. The shared `PassContext` carries the result. The engine adapter removes present
   `detected_absence` candidates on suspect or missing input before evaluating
   `requiresAbsence`. The independent `sans-savon` detector uses the same qualification.
   Direct detector callers also qualify their input. Debug floor overrides do not bypass it.
4. Explicit claims retain their own pass and ingredient veto. Manual rows retain the
   existing writer precedence. No final filter over all `sans-*` tags is introduced.
5. `unknown` preserves existing inference behavior. This is a bounded damage veto, not
   proof that unknown sources are complete. Unmarked truncations, unfamiliar prose and
   glued names without a recognized clue remain unresolved. General abstention on unknown
   provenance requires a separately measured policy.

## Considered options

- **Increase coverage or token thresholds**: rejected because they do not establish
  integrity and penalize short formulas or dictionary gaps.
- **Remove every absence after merging passes**: rejected because it also removes explicit
  claims and leaves dependent engine candidates relying on discarded evidence.
- **Block observable damage at the inference boundary**: chosen to protect the confirmed
  cases while keeping claims, manual curation and unrelated passes intact.

## Consequences

An existing stored automatic tag changes only on a subsequent recalculation. This change
does not backfill the catalogue. Source checks remain necessary, and abstentions are not
scientific false-positive labels. A trailing separator is treated conservatively as suspect;
it can be harmless formatting. Source history and completeness are not reconstructed.

The regression tests cover direct detection, the complete orchestrator, intake storage,
explicit claim precedence, manual preservation and restoration after source repair.
