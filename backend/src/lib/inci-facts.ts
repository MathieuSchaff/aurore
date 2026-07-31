// Product facts read off the raw INCI. They are true for every user, so they are computed
// once here — with algo-derm directly — and shipped in the product payload, instead of the
// browser re-deriving them from a hand-copied split rule it cannot import.

import { splitINCI } from 'algo-derm'

// `splitINCI` cuts on commas — its period fallback needs a comma-sparse list (at most two),
// which a real INCI never is. So a `;` the scraper used as a list comma, and a footnote legend
// welded to the last token (`limonene**. * issu de l'agriculture biologique`), both hide what
// follows them. Not a subset of the seed's `foldScraperDelimiters`: this one adds the period,
// and drops that one's HTML-entity guard and mangled-dash fold, which serve the linking path
// and would move verdicts here.
function foldWeldedSeparators(inci: string): string {
  return inci.replace(/;/g, ',').replace(/\.(?!\d)/g, ',')
}

// Presence only — never a count or a position: the fold cuts inside tokens algo-derm keeps whole.
function splitInciLoose(inci: string): string[] {
  return splitINCI(foldWeldedSeparators(inci))
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
function hasFragranceComponent(inci: string | null | undefined): boolean {
  if (!inci) return false
  for (const raw of splitInciLoose(inci)) {
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

export interface InciFacts {
  inciCount: number
  hasFragrance: boolean
}

export function computeInciFacts(inci: string | null | undefined): InciFacts {
  if (!inci) return { inciCount: 0, hasFragrance: false }
  return {
    // Strict split: this one is a count, so it must match what algo-derm calls an ingredient.
    inciCount: splitINCI(inci).length,
    hasFragrance: hasFragranceComponent(inci),
  }
}
