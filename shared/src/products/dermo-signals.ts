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
