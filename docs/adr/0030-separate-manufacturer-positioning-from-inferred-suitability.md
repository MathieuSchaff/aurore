---
date: 2026-10-29
accepted: 2026-10-29
---

# Present calculated sensitive-skin signals with explicit provenance

Decision revised on 2026-10-29 before delivery. The local implementation exposes
the calculated signal as « Peau sensible · signal calculé » and removes the
manufacturer quotation workflow. Migration 0120 removes the column added by 0119
and updates the persisted taxonomy label. Corrective migration 0121 restores a neutral
taxonomy label: each read labels calculated and manual links from their actual source. Migration 0119 is retained because its
application state on production could not be independently verified.

## Why

A calculated formula signal and manufacturer positioning answer different questions.
Comparing the signal with manufacturer statements does not establish its accuracy.
Aurore will clarify what the formula signal means without adding a separate quotation
collection and maintenance workflow. Clear wording does not validate the calculation.

## Decision

1. Keep the calculated positive `peau-sensible` signal and make it displayable with
   explicit calculated provenance. Choose wording that matches the actual calculation,
   including on compact surfaces. Preserve manual links and label them « ajout manuel »;
   a manual link must never be described as formula output. Do not present it as a manufacturer claim or a
   guarantee of individual tolerance. Keep existing `avoid` signals and engine thresholds.
2. Remove the local `sensitiveSkinClaim` quotation/source feature, including its form,
   storage, edit history integration and identity-change invalidation. Resolve its
   migration according to actual database application state before removing migration files.
3. Keep positive `grossesse-compatible` internal: calculated, stored and audited, but
   hidden from catalogue chips, filters, comparisons, collections and formula previews.
   Existing `avoid` signals remain available to personal warnings.
4. Keep abstention from automatic `sans-allergenes-parfumants` emission when the INCI
   declares an undisclosed `Parfum`, `Fragrance` or `Aroma` mixture. Read paths also
   withhold old affected `algo-derm` links, without requiring a catalogue rewrite.
   Explicit manual links and other absence claims retain their provenance. Emission and
   stored-link reads share the same marker pattern, including synonyms such as `Flavor/Aroma`.

The three internal signals covered by [ADR 0017](0017-claim-tags-are-internal-only.md)
keep their existing contract.

## Consequences

The earlier manufacturer-only sensitive-skin contract is superseded. Its local tests
and qualification PASS remain historical evidence, not validation of this revision.
Update display and filter contracts, labels, targeted tests and qualification evidence
while preserving pregnancy and fragrance-allergen behavior. Persisted taxonomy labels
must agree with the revised wording; changing shared definitions alone is insufficient.

Historical annotations remain unchanged. Broader candidate adoption still requires its
own qualification. This decision does not authorize vendoring or catalogue reconciliation.
