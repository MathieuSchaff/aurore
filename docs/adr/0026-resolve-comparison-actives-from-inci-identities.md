---
date: 2026-10-28
accepted: 2026-10-28
---

# Resolve comparison actives from INCI identities

Comparison actives show an ingredient name, a catalogue link when unambiguous, short cosmetic
functions and the products containing it. The active counter is removed.

## Why

A fixed list of sheet slugs missed ingredients whose names differed and depended on incomplete
product-to-ingredient links. A count did not explain what each ingredient contributed. Catalogue
descriptions can contain efficacy claims, so they are not a source for these short functions.

## Decision

Resolve raw INCI tokens through the vendored ingredient identity index. Select visible cosmetic
catalogue sheets in the product's domain with the same canonical key and either category `actif`
or an `actif_class` tag. A haircare sheet cannot qualify a skincare ingredient.
No product-to-sheet link is required. Deduplicate and group by canonical identity. If several
eligible sheets match, retain the INCI name without choosing a link. Missing or unknown INCI
cannot produce an active entry, even when a product has linked sheets.

Return the identity's CosIng functions and reference. Display up to two distinct French labels
from a bounded vocabulary, with an explicit missing-role fallback and a link to
[CosIng](https://single-market-economy.ec.europa.eu/sectors/cosmetics/cosmetic-ingredient-database_en).
Translations follow the [official function definitions](https://eur-lex.europa.eu/eli/dec/2006/257/oj/eng).
Functions describe cosmetic uses, not the efficacy of the compared product. In particular,
antioxidant and buffering functions refer to the formula, not anti-ageing or exfoliation claims.

## Considered options

- Keep slug-based selection: simpler, but sheet renaming and missing links change detection.
- Extract a benefit from descriptions: rejected because claims and dosage context vary.
- Use canonical identities and catalogue classification: chosen for a reproducible selection
  and traceable cosmetic functions without a product score.

## Consequences

Preview and saved comparisons use the same resolution inside the request transaction. One
batched query selects eligible sheets. Moderation hiding and restoration apply immediately.
Coverage still depends on recognised INCI identities and catalogue classification, so detection
is explicitly non-exhaustive. The subsequent alert-card review is recorded in [ADR 0027](0027-show-named-formula-facts-in-comparisons.md).
Formula-table links retain their existing product-link requirement. No schema or seed change.
