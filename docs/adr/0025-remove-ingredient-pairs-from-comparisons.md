---
date: 2026-10-28
accepted: 2026-10-28
---

# Remove ingredient pairs from comparisons

The product comparison screen no longer displays selected ingredient pairs or the sentence
about whether compared products can be used together.

## Why

Selecting four predefined associations gives them an unexplained importance when choosing
between products. The accompanying disclaimer introduces a question about combined use
without helping the user answer it.

## Decision

Remove the pair card and its local aggregation. Keep individual ingredients in the formula
tables and the existing active and alert cards, with product attribution.

## Considered options

- Keep the pair card with softer wording: the unexplained selection remains.
- Remove the card and combined-use sentence: chosen to keep comparison focused on formula facts.

## Consequences

Comparison no longer consumes `DERMO_CONFLICTS`. Its shared definition and other consumers
remain outside this change. Reworking active and alert content is a separate product decision.
