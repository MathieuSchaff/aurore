---
date: 2026-09-01
---

# Dose cuts are asymmetric: loose to add a positive line, strict to drop a risk line

The product page's formula reading consumes algo-derm's `roleAtDose` twice, and the two uses do
**not** share a confidence threshold. Adding the qualitative line "probablement dosé pour agir" to an
ingredient needs `doseFactor >= 0.7` with `confidence >= 0.5`. Dropping an ingredient from the
"À noter dans cette formule" list needs `doseFactor <= 0.3` with `confidence >= 0.6`, and every
occurrence of that INCI must clear the bar. The asymmetry is deliberate: a weak dose verdict may add
a hedged sentence, it may never remove a risk attribution. Scope is the formula reading only; the
backend actif-class gate keeps its own threshold under ADR-0014.

## Why

Aurore's product rule is that the inferred never masks: a computed signal may inform the reader, it
may not decide what the reader is allowed to see. `filterRiskDriversAtDose` sits against that rule,
because it does remove lines from the page.

What makes it admissible is *what* it removes. `roleAtDose` answers "at this position in the list, is
the ingredient acting or is it an excipient?". A cap-marginal acid sitting sub-1 % in a formula is
attributed an irritation axis by the risk model regardless of its dose, so the reader gets
"acide lactique — irritation" on a product where the lactic acid is a pH adjuster. The line is not a
fact about the formula, it is an inference the dose verdict contradicts. Keeping it is not caution,
it is a false positive that trains the reader to ignore the whole section.

The ingredient itself never disappears. It stays in the INCI disclosure, in the ingredients list, and
in the concentration table. Only its **inferred risk attribution** is withdrawn, and only where a
second inference confidently contradicts the first. That is the frontier the product rule draws: the
declared is never hidden, an inference may be arbitrated by a better inference.

The two thresholds diverge because the cost of being wrong diverges. A wrongly added dose line
overstates a benefit on a product that probably does contain the actif; the phrasing is already
hedged, and the reader loses little. A wrongly removed risk line is silence on something a sensitive
reader wanted, and silence leaves no trace to notice. So recall is cheap on the positive side and
expensive on the masking side, and the numbers say so: 0.5 to speak, 0.6 to stay quiet.

Both cuts shipped together in `fix(products): refine formula dose signals` (2026-08-13), which split
one symmetric 0.6 cut into this pair. Neither the split nor its direction was recorded anywhere
versioned, and the code comment ("recall must not hide more risks") states the rule without the
reasoning that justifies breaking a product interdict.

## Decision

1. **Two named threshold pairs, never one.** `DOSE_SIGNAL_*` gates the positive line,
   `DOSE_EXCIPIENT_*` gates the removal. They live side by side in `frontend/src/constants/derm.ts`
   and are not to be collapsed into a single cut, even if their values coincide one day.
2. **The masking cut is never looser than the positive cut.** Raising `DOSE_SIGNAL_MIN_CONFIDENCE`
   above `DOSE_EXCIPIENT_MIN_CONFIDENCE` inverts the trade-off this ADR fixes.
3. **A repeated INCI is masked only if every occurrence is a confident excipient.** Ambiguity on any
   row keeps the driver.
4. **Masking withdraws an inferred attribution, never a declared fact.** The ingredient stays visible
   in the INCI disclosure, the ingredients section, and the concentration table. Any future filter
   that would remove the ingredient itself falls outside this ADR and needs its own decision.
5. **Scope is the formula reading.** Extending `roleAtDose` to another consumer, or to another
   ActiveRole family, stays a separate decision, as ADR-0014 already says for the backend.

## Considered options

- **A. One symmetric confidence cut for both uses.** The shape before 2026-08-13. Rejected: it forces
  one number to price two asymmetric errors. Set at 0.5 it hides risk lines on weak verdicts; set at
  0.6 it silences correct dose lines to protect the masking path. The errors are not comparable, so
  neither setting is right.
- **B. Never mask, show every risk driver.** Rejected. It is the literal reading of "the inferred
  never masks", but it makes the section carry attributions the dose verdict contradicts, on exactly
  the products where the reader most needs it to be sharp. Precision loss is not neutral: a list that
  cries wolf gets skipped whole.
- **C. Mask, but show what was masked** (a "1 signal écarté" line, expandable). Rejected for now, not
  on principle. It is the honest form of the trade-off and would remove most of the tension with the
  product rule. It needs UI space in a section already dense, and a phrasing that explains a dose
  verdict without turning into a second verdict. Revisit if a reader ever reports a missing signal.
- **D. Asymmetric cuts, masking strictly stricter.** **Chosen.** It keeps the positive path generous
  where being wrong is cheap, and pays for silence where being wrong is invisible.

## Consequences

- `filterRiskDriversAtDose` (`frontend/src/features/products/components/FormulaReading/riskDrivers.ts`)
  is load-bearing and its conservatism is the decision, not an implementation detail. The
  "keep unless every occurrence is a confident excipient" rule must survive refactors.
- The four constants must move as a set, and their relative order is a rule a reviewer can check.
  `frontend/src/features/products/__tests__/risk-drivers.test.ts` pins the boundary cases: exact
  threshold masks, one tick either side keeps.
- Silence is untraceable by construction. Nothing on the page says a driver was withdrawn, so a
  calibration error surfaces only through a reader saying a known irritant went unmentioned. Option C
  is the escape hatch if that happens.
- The thresholds are frontend judgement calls, not gold-set calibrated numbers. They are not covered
  by the auto-tagging benchmark and no metric will regress if they drift.
- ADR-0014 stays the authority for the backend actif-class gate. This ADR does not change it and does
  not extend it: it records a second, independent consumer of the same library signal.
