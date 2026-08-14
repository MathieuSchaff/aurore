---
status: accepted
date: 2026-08-12
accepted: 2026-08-12
---

# Claim-worded tags stay internal-only: computed, audited, never displayed

`hypoallergenique`, `non-comedogene` and `non-irritant` keep being detected by the algo-derm pass, stored in `product_tag_links` and covered by the hit-rate budgets, but they no longer reach any user-facing surface: no product-card chip, no comparator row, no catalogue filter option, no `tagCounts` entry. The taxonomy carries the state as `internalOnly: true` on the tag def (`shared/src/products/skincare/tag-slugs.ts`); `isDisplayedProductTag()` is the single guard every display path calls. `comedogene` stays displayed: it reads the formula without borrowing anyone's wording.

## Why

The three slugs are computed from the INCI, but their wording is a manufacturer claim, two regulated. The gold-set that scores them asks a different question, "does the brand claim it?", so the two never converge: widening the sample from 11 to 19 verdicts per tag on 2026-08-12 made it worse, not better. F1 0.333 / 0.286 / 0.143 against 0.883 macro for the rest of the gold set, dominated by false positives. False positive here means Aurore asserting a claim the brand does not make, which is exactly the direction the root `CLAUDE.md` forbids: no verdict, no medical claim.

Nothing about the detection is broken. `just audit-auto-tags-check` is green, 38/38, dev and prod. The defect is that the displayed label promises a provenance the data does not have.

## Considered options

- **A. Keep emitting from the formula, point the gold set at it instead.** Rejected: it fixes the measurement, not the promise. The chip still reads as a claim to whoever sees it.
- **B. Regrade to a nondisplayed signal.** **Chosen.** The detection keeps earning its place in the audits and the budgets, and the claim stops being made. Cheap, reversible in one field, no dependency on an external source.
- **C. Only carry the tag when the brand claims it.** Rejected on cost and coverage: it needs a primary manufacturer source per product, and the same session measured 2 of 10 pages unreachable (403, or no official page served at all). Coverage would collapse over most of the catalogue.

## Consequences

- Display paths filter, write paths do not. `getProductFullBySlug` returns the raw tag list on purpose: `ProductEditPage` seeds its tag form from that payload and posts it back, so filtering there would erase the tags on every admin save. The product detail page has no `product_characteristic` surface today, which is why no render-side filter was needed there; adding one later must call `isDisplayedProductTag`.
- The gold set keeps scoring the three tags. Their annotations are evidence, and `GOLD_SET_FOCUS_TAGS` validates `annotations.json`, so dropping the slugs would invalidate the file. Their F1 now reports on a signal that gates nothing user-facing, and should be read that way.
- Reversing is one field per def. Undoing `internalOnly` restores the chips, the filter options and the counts at once.
- A stale bookmarked URL carrying `product_characteristic=hypoallergenique` still filters server-side; the option is simply no longer offered.
