---
date: 2026-07-02
accepted: 2026-07-02
---

# roleAtDose is a narrow name-gate override for cap-marginal AHA, not a proxy replacement

algo-derm (v21+) attaches to each matched ingredient a `roleAtDose` verdict, a dose-conditioned `active` vs `excipient` signal with a confidence (`ActiveRole = "exfoliant"` is the only family shipped so far). Aurore's actif-class detector consumes it in **one narrow spot**: a cap-marginal AHA (an acid admitted only by the looser rinse-off position cap) is dropped as a pH adjuster unless the product name positions it as an exfoliant. When `roleAtDose` is **confident** (`confidence ≥ 0.5`), it **overrides** that name-gate: a sub-c50 dose is a pH adjuster even under an exfoliant name, an active dose is kept even when the name keyword list misses it. When confidence collapses near the curve knee, the legacy name-gate + `%`-rescue stay as fallback. We deliberately did **not** adopt the broader `functionalRole` engine change or delete the position-cap proxy.

## Why

The actif-class detector decides "is this acid acting as an exfoliant here?" with a **proxy stack**: position caps, an alphabetical-INCI guard (Korean brands list alphabetically, so caps are meaningless), a name-gate (`/exfolia|foliant|peel|gommage|resurfa/` on the product name), and a `%`-rescue (solver estimate ≥ 2 %). `roleAtDose` is a *direct* dose-to-role signal, strictly better information where it is confident. But adopting it as a blanket replacement was not justified:

- **The proxy already scores well.** AHA precision is 0.955; the headline false positives are alphabetical-INCI Korean formulas, which the `isAlpha` guard already makes position-blind. The `%`-rescue moves **0 products** in the corpus.
- **Confidence is not free everywhere.** Near the dose-response knee, or for INCI-only callers with no solver estimate, `roleAtDose` has no confident verdict. The name-gate + `%`-rescue must remain for those.
- **Audit attribution.** Bundling a broad adoption (drop patterns/caps/name-gate, calibrate τ) with the v17 to v22 tag-removal + benefit-scoring changes would make any gold-set regression unattributable. Was it the removal, the scoring change, or `roleAtDose`? Narrow + additive keeps every change bisectable.

So the rule this ADR fixes: **`roleAtDose` is authoritative only where it is confident and only at the one gate the proxy is weakest (cap-marginal AHA). It layers over the proxy; it does not replace it.**

## Considered options

- **A. Broad adoption: move active-vs-excipient into algo-derm (`functionalRole`), reduce the detector to a thin mapping, delete caps/name-gate/`%`-rescue.** Rejected here, deferred. No measured payoff yet (AHA P=0.955, `%`-rescue moves 0), and it destroys audit attribution if bundled. Gated behind a measurement (trigger: ≥10 gold FP/FN attributable to the position-cap proxy that a full dose verdict removes without new errors).
- **B. Narrow override: confident `roleAtDose` overrides the name-gate for cap-marginal AHA only; legacy proxy kept as fallback.** **Chosen.** Additive, 0 regression, bisectable, captures the signal exactly where the proxy is blind (an exfoliant-named 40 % urea peel whose lactic acid sits sub-1 % is now correctly a pH adjuster).
- **C. Ignore `roleAtDose`, keep the pure proxy.** Rejected. The field rides the tarball for free and the name-gate provably mishandles sub-c50 acids under exfoliant names and active acids the keyword list misses.

## Consequences

- The override lives in `passes/aha-cap-marginal-gate.ts`, next to its thresholds `AHA_ROLE_CONFIDENCE_MIN = 0.5` (τ) and `AHA_ROLE_DOSE_C50 = 0.5`; the concentration lookup is built once per product from the shared assessment in `passes/actif-class-pass.ts`. Tests: `tests/actif-class-detection.test.ts`.
- The position-cap proxy, name-gate, and `%`-rescue **stay** and are load-bearing. A future reader must not "simplify" them away on the assumption that `roleAtDose` covers all cases: it only covers the confident cap-marginal AHA path.
- Only the AHA family is wired. Other actif classes (retinoids, vitamin C/E) use `positionCap: Infinity` and have no dose gate; extending `roleAtDose` to a new family is a separate decision.
- The broad `functionalRole` move remains open and explicitly deferred (option A). This ADR does not decide it.
- Counterpart on the library side: algo-derm's own ADR on `roleAtDose` (engine design and `ActiveRole` typing) and its adoption brief for Aurore, both under that library's `docs/`.
