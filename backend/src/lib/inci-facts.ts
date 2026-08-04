// Product facts read off the raw INCI. They are true for every user, so they are computed
// once here, with algo-derm directly, and shipped in the product payload, instead of the
// browser re-deriving them from a hand-copied split rule it cannot import.

import { splitINCI } from 'algo-derm'

// `splitINCI` cuts on commas. Its period fallback needs a comma-sparse list (at most two),
// which a real INCI never is. So a `;` the scraper used as a list comma, and a footnote legend
// welded to the last token (`limonene**. * issu de l'agriculture biologique`), both hide what
// follows them. Not a subset of the seed's `foldScraperDelimiters`: this one adds the period,
// and drops that one's HTML-entity guard and mangled-dash fold, which serve the linking path
// and would move verdicts here.
function foldWeldedSeparators(inci: string): string {
  return inci.replace(/;/g, ',').replace(/\.(?!\d)/g, ',')
}

// Presence only, never a count or a position: the fold cuts inside tokens algo-derm keeps whole.
function splitInciLoose(inci: string): string[] {
  return splitINCI(foldWeldedSeparators(inci))
}

// EU 1223/2009 Annex III fragrance allergens, in INCI spelling. `Benzyl Alcohol` is left
// out on purpose: it is a preservative far more often than a fragrance, and the seed
// already treats it as too common to be informative.
const FRAGRANCE_ALLERGENS: ReadonlySet<string> = new Set([
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

const FRAGRANCE_COMPONENTS: ReadonlySet<string> = new Set([
  ...FRAGRANCE_ALLERGENS,
  'parfum',
  'fragrance',
  'aroma',
])

/**
 * `keepParentheticals` keeps `Paraffinum Liquidum (Mineral Oil)` readable as one token
 * instead of dropping the gloss. Off by default because the gloss is marketing noise for
 * an identity lookup; on for the contradiction audit, where a misspelt head
 * (`Paranum Liquidum (Mineral Oil)`) leaves the parenthesis as the only readable
 * declaration on the label.
 */
export interface InciTokenOptions {
  keepParentheticals?: boolean
}

// One tokenizer, several predicates. The fragrance question alone has three distinct answers
// (Annex III allergens, the bare `Parfum` marker, or either) and a second copy of this
// normalization would drift. New markers go through here, never through their own split.
// Returns the matching token rather than a boolean: an audit has to name what tripped it,
// and a second walk to find that out would be the drift this function exists to prevent.
export function findInciToken(
  inci: string | null | undefined,
  hit: (token: string) => boolean,
  options?: InciTokenOptions
): string | null {
  if (!inci) return null
  for (const raw of splitInciLoose(inci)) {
    // Same scraper artefacts the seed strips: supplier codes, organic markers, stray dots.
    const token = raw
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(options?.keepParentheticals ? /[()[\]]/g : /\([^)]*\)|\[[^\]]*\]/g, ' ')
      .replace(/[*†‡•]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^[.\s]+|[.\s]+$/g, '')
    if (!token) continue
    if (hit(token)) return token
  }
  return null
}

function anyInciToken(
  inci: string | null | undefined,
  hit: (token: string) => boolean,
  options?: InciTokenOptions
): boolean {
  return findInciToken(inci, hit, options) !== null
}

const GENERIC_FRAGRANCE_MARKER = /^(parfum|fragrance|aroma)\b/

/**
 * Read from the raw INCI, not from linked ingredients: fragrance allergens are declared last
 * and carry no `ingredients` row, so they never reach `product_ingredients`.
 */
function hasFragranceComponent(inci: string | null | undefined): boolean {
  return anyInciToken(
    inci,
    (token) => FRAGRANCE_COMPONENTS.has(token) || GENERIC_FRAGRANCE_MARKER.test(token)
  )
}

/**
 * Narrower than `hasFragranceComponent` on purpose: the declared `Parfum`/`Fragrance`/`Aroma`
 * marker only, never the Annex III allergens. A product can carry `Limonene` from an essential
 * oil and still be legitimately fragrance-free, so `sans-parfum` and `sans-allergenes-parfumants`
 * do not answer the same question. Vetoing a `sans-parfum` claim on the wide set would refute
 * 354 correct links instead of the 21 false ones (measured 2026-07-31).
 */
export function fragranceMarkerToken(inci: string | null | undefined): string | null {
  return findInciToken(inci, (token) => GENERIC_FRAGRANCE_MARKER.test(token))
}

/**
 * The other half of `hasFragranceComponent`: the Annex III allergens alone, never the bare
 * marker. A declared `Parfum` says nothing about which allergens are above the labelling
 * threshold, so it must not refute a `sans-allergenes-parfumants` claim: 1193 of the 3639
 * links carrying that tag declare `Parfum` legitimately (measured 2026-07-31).
 */
export function fragranceAllergenToken(inci: string | null | undefined): string | null {
  return findInciToken(inci, (token) => FRAGRANCE_ALLERGENS.has(token))
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
