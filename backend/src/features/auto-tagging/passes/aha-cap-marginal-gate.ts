// Verdict for a cap-marginal AHA hit: a pH-active acid (lactic/glycolic et al.)
// admitted only by the looser rinse-off cap. Below ~1% these are pH adjusters,
// above they are exfoliant actifs; the narrow solver `%`/roleAtDose tiebreaker
// scoped to this ambiguous band decides. Consulted only for defs that declare
// `rinseOffNameGate`; every other cluster is a pure pattern-table lookup. ADR-0014.

import type { RoleAtDose } from 'algo-derm'

// Names that legitimately position a deep rinse-off acid as an exfoliant actif
// (rescues the cap-marginal gate). Matches exfoliant/exfoliation, (super)foliant,
// peel/peeling, gommage, resurfacing.
const EXFOLIATION_NAME_RE = /exfolia|foliant|peel|gommage|resurfa/

// The name-gate misses acid-named products (e.g. "Chestnut AHA Essence"), wrongly dropping
// real exfoliant actives deep in rinse-off INCI. The solver % rescues them when confidently
// functional. Threshold is 2%, not 1%: solver noise (MAE 4pts) near the pH-adjuster boundary
// must not rescue a true pH adjuster.
const AHA_RESCUE_PCT_MIN = 2

// roleAtDose (algo-derm v21+) says if an acid works as an exfoliant or as a pH adjuster
// It reads the dose, so we trust it over the name-gate when it is confident:
// a dose under c50 is a pH adjuster even when the name says exfoliant
// Near the knee of the curve it stops being confident, so we fall back to the name-gate
// and the %-rescue
// c50 is calibrated on the gold set
// A formula with heavy pins (40% urea peel, lactic acid at position 15) is only right when
// the solver leaves some mass on that last acid
// In v38 the pin returned 0, so the product went to the name-gate and stayed in the gold set
// as a false positive
// In v39 the solver keeps unpinned ingredients above zero, so this threshold stays as it is
const AHA_ROLE_DOSE_C50 = 0.5
const AHA_ROLE_CONFIDENCE_MIN = 0.5

// Resolves the algo-derm solver-estimated concentration (% w/w) for a matched acid
// pattern, or undefined when the solver has no estimate. Built once per product from
// the shared assessment (see actif-class-pass). Only consulted for cap-marginal AHA.
export type ConcentrationLookup = (matchedPattern: string) => number | undefined

// Resolves the algo-derm roleAtDose signal for a matched acid pattern, built once per
// product from the shared assessment. Only consulted for cap-marginal AHA hits.
export type RoleAtDoseLookup = (matchedPattern: string) => RoleAtDose | undefined

export type AhaCapMarginalVerdict = 'keep' | 'drop'

// Cascade, most-authoritative first: (1) a confident roleAtDose decides alone,
// sub-c50 drops, active dose keeps; (2) an exfoliant-positioning name keeps;
// (3) %-rescue keeps a neutral name only at a confidently functional dose.
// `gateName` is the already-trimmed/lowercased product name; empty means the caller
// cannot vouch for the product, so legacy keep. No lookups: identical to the bare name-gate.
export function resolveAhaCapMarginalVerdict(
  matchedPattern: string,
  gateName: string | undefined,
  concentrationLookup?: ConcentrationLookup,
  roleAtDoseLookup?: RoleAtDoseLookup
): AhaCapMarginalVerdict {
  const role = roleAtDoseLookup?.(matchedPattern)
  if (role && role.confidence >= AHA_ROLE_CONFIDENCE_MIN) {
    return role.doseFactor < AHA_ROLE_DOSE_C50 ? 'drop' : 'keep'
  }
  if (gateName && EXFOLIATION_NAME_RE.test(gateName)) return 'keep'
  const pct = concentrationLookup?.(matchedPattern)
  const rescued = pct !== undefined && pct >= AHA_RESCUE_PCT_MIN
  if (!rescued && gateName) return 'drop'
  return 'keep'
}
