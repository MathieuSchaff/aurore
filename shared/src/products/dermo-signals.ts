// Slugs flagged as a "signal" in the comparator.

const ACTIVE_INGREDIENT_SLUGS: ReadonlySet<string> = new Set([
  'niacinamide',
  'hyaluronic-acid',
  'sodium-hyaluronate',
  'retinol',
  'retinal',
  'granactive-retinoid',
  'hydroxypinacolone-retinoate',
  'bakuchiol',
  'azelaic-acid',
  'glycolic-acid',
  'lactic-acid',
  'salicylic-acid',
  'vitamin-c',
  'tocopherol',
  'panthenol',
  'centella-asiatica',
  'allantoin',
  'copper-peptides',
  'matrixyl-3000',
  'palmitoyl-tripeptide-1',
  'argireline',
])

// Some alert slugs are not in the seed taxonomy yet. Keep them: a slug that
// does not exist never matches, and they start matching as the seed grows.
const ALERT_INGREDIENT_SLUGS: ReadonlySet<string> = new Set([
  'parfum',
  'fragrance',
  'alcool-denat',
  'denatured-alcohol',
  'methylisothiazolinone',
  'methylchloroisothiazolinone',
  'limonene',
  'linalool',
  'huile-essentielle-citron',
  'huile-essentielle-menthe',
])

export type DermoSignal = 'active' | 'alert'

export function classifyIngredientSignals(slug: string): DermoSignal[] {
  const signals: DermoSignal[] = []
  if (ACTIVE_INGREDIENT_SLUGS.has(slug)) signals.push('active')
  if (ALERT_INGREDIENT_SLUGS.has(slug)) signals.push('alert')
  return signals
}

// One presentation policy keeps formula details and collection motifs consistent (ADR0023)
export const DOSE_SIGNAL_MIN_DOSE_FACTOR = 0.7
export const DOSE_SIGNAL_MIN_CONFIDENCE = 0.5
export const DOSE_EXCIPIENT_MAX_DOSE_FACTOR = 0.3
export const DOSE_EXCIPIENT_MIN_CONFIDENCE = 0.6

type RiskDriverLike = {
  inci?: string
}

type MatchedEvidenceLike = {
  inci: string
  roleAtDose?: {
    doseFactor: number
    confidence: number
  }
}

function isClearExcipient({ roleAtDose }: MatchedEvidenceLike): boolean {
  return (
    !!roleAtDose &&
    roleAtDose.doseFactor <= DOSE_EXCIPIENT_MAX_DOSE_FACTOR &&
    roleAtDose.confidence >= DOSE_EXCIPIENT_MIN_CONFIDENCE
  )
}

export function filterRiskDriversAtDose<T extends RiskDriverLike>(
  drivers: readonly T[],
  matchedEvidence: readonly MatchedEvidenceLike[]
): T[] {
  const clearExcipientByInci = new Map<string, boolean>()

  for (const matched of matchedEvidence) {
    // Repeated INCI rows may differ, so hide a driver only when every occurrence qualifies
    clearExcipientByInci.set(
      matched.inci,
      (clearExcipientByInci.get(matched.inci) ?? true) && isClearExcipient(matched)
    )
  }

  return drivers.filter((driver) => !driver.inci || !clearExcipientByInci.get(driver.inci))
}
