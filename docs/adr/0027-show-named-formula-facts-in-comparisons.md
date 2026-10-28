---
date: 2026-10-28
accepted: 2026-10-28
---

# Show named formula facts in comparisons

Replace the comparison's Vigilances card with Parfum et alcool dénaturé, showing ingredient
names from the declared INCI and the products where they occur, without a warning icon or count.

## Why

The former card matched ten sheet slugs and presented the result as potential allergens or
sensitisers. It did not explain that selection, inspect raw formulas or use personal preferences.
The user chose factual information shared by all viewers over personalised tracking or removal.

## Decision

Annotate comparison INCI tokens with optional factual markers on the backend. Detect generic
perfume declarations and named fragrance components through the existing `inci-facts` helpers.
Recognise explicit denatured alcohol names, including SD Alcohol variants. Plain Alcohol,
fatty alcohols and arbitrary names containing the word alcohol do not qualify.

Keep original INCI names and product attribution. Use existing visible formula-sheet links;
missing or conflicting links leave plain text. A marker requires a formula token, never just
a linked ingredient sheet. Preview and saved comparisons share the same enrichment path.

Use a neutral card with descriptive labels, no alert total, no tolerance or safety verdict,
and no absence claim. Other ingredients remain readable in the complete formula. The old
shared alert classifier is no longer a source for this card; its other API consumers are
outside this change.

## Consequences

No profile data, catalogue writes, database migration or external request is needed. The
existing named-component registry is deliberately non-exhaustive and is not presented as a
current regulatory allergen inventory. Unknown or missing ingredients cannot establish
absence of perfume or denatured alcohol. The section retains its incomplete-data wording.
