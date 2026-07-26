// Slugs flagged as a "signal" in the comparator. Active slugs map to the seed
// taxonomy; alert slugs are partly prospective (see note below).

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

// Alert slugs are prospective: most are not yet present in the seed taxonomy,
// so the alert path is currently inert. They will activate as the seed grows.
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
  const out: DermoSignal[] = []
  if (ACTIVE_INGREDIENT_SLUGS.has(slug)) out.push('active')
  if (ALERT_INGREDIENT_SLUGS.has(slug)) out.push('alert')
  return out
}

// EU 1223/2009 Annex III fragrance allergens, in INCI spelling, plus the raw fragrance
// markers. `Benzyl Alcohol` is left out on purpose: it is a preservative far more often
// than a fragrance, and the seed already treats it as too common to be informative.
const FRAGRANCE_COMPONENTS: ReadonlySet<string> = new Set([
  'parfum',
  'fragrance',
  'aroma',
  'alpha-isomethyl ionone',
  'amyl cinnamal',
  'amylcinnamyl alcohol',
  // Annex III entry 90 is declared `Anise Alcohol` on labels; `Anisyl Alcohol` is the
  // perfumery synonym for the same substance. Both spellings reach us, so both are listed.
  'anise alcohol',
  'anisyl alcohol',
  'benzyl benzoate',
  'benzyl cinnamate',
  'benzyl salicylate',
  'butylphenyl methylpropional',
  'cinnamal',
  'cinnamyl alcohol',
  'citral',
  'citronellol',
  'coumarin',
  'eugenol',
  'evernia furfuracea extract',
  'evernia prunastri extract',
  'farnesol',
  'geraniol',
  'hexyl cinnamal',
  'hydroxycitronellal',
  'hydroxyisohexyl 3-cyclohexene carboxaldehyde',
  'isoeugenol',
  'limonene',
  'linalool',
  'methyl 2-octynoate',
])

/**
 * Read from the raw INCI, not from linked ingredients: fragrance allergens are declared last
 * and carry no `ingredients` row, so they never reach `product_ingredients`.
 */
export function hasFragranceComponent(inci: string | null | undefined): boolean {
  if (!inci) return false
  // Some scraped lists separate items with a period. A period followed by a digit is a decimal
  // dose (`Salicylic Acid 2.0%`), never a separator.
  for (const raw of inci.split(/[,;]|\.(?!\d)/)) {
    // Same scraper artefacts the seed strips: supplier codes, organic markers, stray dots.
    const token = raw
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/\([^)]*\)/g, ' ')
      .replace(/\[[^\]]*\]/g, ' ')
      .replace(/[*†‡•]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^[.\s]+|[.\s]+$/g, '')
    if (!token) continue
    if (FRAGRANCE_COMPONENTS.has(token)) return true
    if (/^(parfum|fragrance|aroma)\b/.test(token)) return true
  }
  return false
}
