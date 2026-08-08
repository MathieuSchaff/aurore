// Ordered pass registry for the auto-tag pipeline (ADR-0001 cutover).
// Order matters: per-tag dedup (mergeProposal) keeps the first proposal at a given
// relevance level, so source attribution is stable for the earliest pass. The sequence
// mirrors exactly the pass order the orchestrator had before the cutover, so the parity test
// stays green.

import type { Pass } from '../lib/pass-types'
import { actifClassPass } from './actif-class-pass'
import { algoDermPass } from './algo-derm-pass'
import { avoidPass } from './auto-tag-avoid-pass'
import { brandLevelPass } from './brand-cert-pass'
import { crossSignalPass, interactionSecondaryPass } from './cross-signal-pass'
import { FORMULA_PASSES } from './formula/formula-passes'
import { peauNormalePass } from './formula/peau-normale-pass'
import { kindPass } from './kind-pass'
import { percentClaimPass } from './percent-claim-pass'

export const AUTO_TAG_PASSES: readonly Pass[] = [
  // Pass 1: algo-derm (concern / skin_type / comedogenicity / absences)
  algoDermPass,
  // Pass 2: pharmacological clusters; read by cross-signal + avoid via `prior`
  actifClassPass,
  // Pass 3: kind-derived (TYPE / STEP / ZONE / MOMENT / TEXTURE)
  kindPass,
  // Pass 4: formula detectors (declarative table; order preserved from
  // the orchestrator as it was before the cutover, it is the dedup tiebreaker)
  ...FORMULA_PASSES,
  // Pass 5: cross-signal (reads `actif-class` via `prior`)
  crossSignalPass,
  // Pass 5x: structured percent claims (strict fragile-INCI fallback)
  percentClaimPass,
  // Pass 5a: interaction-driven secondary (photosensitivity, etc.)
  interactionSecondaryPass,
  // Pass 5b: brand-level labels (vegan / cruelty-free / bio-naturel)
  brandLevelPass,
  // Pass 6: avoid (reads `actif-class` via `prior` + ctx.assessment)
  avoidPass,
  // Post: peau-normale runs LAST so it can read every skin_type slug already
  // proposed (abstains when any skin_type that isn't neutral fired upstream).
  peauNormalePass,
] as const
