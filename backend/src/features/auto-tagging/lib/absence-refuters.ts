import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import {
  findInciToken,
  fragranceAllergenToken,
  fragranceMarkerToken,
} from '../../../lib/inci-facts'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// What disproves an absence tag, per tag. Two consumers: the text-claim veto
// (`passes/formula/absence-claims.ts`, text-side, scoped to `sans-parfum`) and the
// contradiction audit (`runners/audit/tag-contradictions.ts`, INCI-side, all absence tags).

// Pattern grammar mirrors algo-derm's `data/rules/heuristic_rules.json` so the two lists stay
// diffable: `patterns` are substrings ORed together, `groups` AND across groups and OR inside,
// and a pattern written with `\b` opts that single pattern into anchored matching.
interface TokenRule {
  readonly patterns?: readonly string[]
  readonly groups?: readonly (readonly string[])[]
  // Tokens containing any of these are skipped before matching.
  readonly excludes?: readonly string[]
  readonly keepParentheticals?: boolean
}

function compile(patterns: readonly string[]): (token: string) => boolean {
  const literals = patterns.filter((p) => !p.includes('\\b'))
  const anchored = patterns.filter((p) => p.includes('\\b')).map((p) => new RegExp(p))
  return (token) => literals.some((p) => token.includes(p)) || anchored.some((re) => re.test(token))
}

function tokenRule(rule: TokenRule): (inci: string | null | undefined) => string | null {
  const matchPatterns = rule.patterns ? compile(rule.patterns) : null
  const matchGroups = rule.groups?.map(compile)
  return (inci) =>
    findInciToken(
      inci,
      (token) => {
        if (rule.excludes?.some((p) => token.includes(p))) return false
        if (matchPatterns) return matchPatterns(token)
        if (matchGroups) return matchGroups.every((m) => m(token))
        return false
      },
      { keepParentheticals: rule.keepParentheticals }
    )
}

export interface AbsenceRefuter {
  readonly tag: SkincareProductTagSlug
  // Returns the offending token, not a boolean, so reports can name what tripped it.
  readonly refutingToken: (inci: string | null | undefined) => string | null
  // A refuter reads declarations, it does not re-implement algo-derm. Where wider than the
  // heuristic that emits the tag, that's intentional: the audit surfaces the gap.
  readonly note: string
}

// Some scraped `inci` fields carry the brand's free-from list ("SANS : silicone, paraben…").
// A token naming an ABSENCE must never be read as a declaration of presence: it says the
// opposite. Applied here, not in the inci-facts tokenizer, so `hasFragrance` in the product
// payload keeps its measured behaviour.
const FREE_FROM_TOKEN = /\bsans\b|\bfree\b|\bwithout\b|\b0\s*%/

function guarded(refuter: AbsenceRefuter['refutingToken']): AbsenceRefuter['refutingToken'] {
  return (inci) => {
    const token = refuter(inci)
    return token && !FREE_FROM_TOKEN.test(token) ? token : null
  }
}

const DECLARED_REFUTERS: readonly AbsenceRefuter[] = [
  {
    tag: S.SANS_PARFUM,
    refutingToken: fragranceMarkerToken,
    note: 'Bare Parfum/Fragrance/Aroma marker only. Refuting on the Annex III allergens instead would kill 354 correct links to catch 21 wrong ones.',
  },
  {
    tag: S.SANS_ALLERGENES_PARFUMANTS,
    // algo-derm emits this one off `["fragrance_allergen", "menthol"]`, so menthol counts here
    // even though it is a 2023/1545 addition and stays out of the Annex III set in inci-facts.
    refutingToken: (inci) =>
      fragranceAllergenToken(inci) ?? tokenRule({ patterns: ['\\bmenthol\\b'] })(inci),
    note: 'Annex III allergens + menthol. The bare Parfum marker is deliberately NOT a refuter — it says nothing about which allergens cross the labelling threshold.',
  },
  {
    tag: S.SANS_ALCOOL_DENATURE,
    refutingToken: tokenRule({ patterns: ['alcohol denat', 'sd alcohol', 'alcool denature'] }),
    note: 'Adds the French spelling to algo-derm’s two patterns; plain `Alcohol` stays out, it is not denatured.',
  },
  {
    tag: S.SANS_SULFATES,
    refutingToken: tokenRule({
      groups: [['lauryl', 'laureth', 'myreth', 'coco'], ['sulfate']],
      // Same two exclusions algo-derm applies: a C16-18 co-emulsifier and a mild
      // multifunctional variant are not washing sulfates (see sans-sulfates-coherence.ts).
      excludes: ['cetearyl', 'coceth'],
    }),
    note: 'Mirrors algo-derm’s sulfate_surfactant group exactly.',
  },
  {
    tag: S.SANS_SILICONES,
    refutingToken: tokenRule({
      patterns: [
        'methicone',
        'siloxane',
        'silsesquioxane',
        'silanol',
        'siloxysilicate',
        'silicone',
      ],
    }),
    note: 'WIDER than algo-derm: its silicone heuristic spells out dimethicone/trimethicone/cyclomethicone/amodimethicone but has no bare `methicone`, and no `silsesquioxane` at all, so `Caprylyl Methicone`, `Simethicone` and `Polymethylsilsesquioxane` slip through upstream.',
  },
  {
    tag: S.SANS_HUILES_MINERALES,
    refutingToken: tokenRule({
      patterns: [
        'paraffinum',
        '\\bparaffin\\b',
        'petrolatum',
        'mineral oil',
        'cera microcristallina',
        'microcrystalline wax',
        'ozokerite',
        'ceresin',
      ],
      // `Paranum Liquidum (Mineral Oil)` and `praffinum liquidum (mineral oil)` are scraper
      // corruptions whose only intact declaration is the gloss.
      keepParentheticals: true,
    }),
    note: 'WIDER than algo-derm on two spellings of substances it already covers: `Microcrystalline Wax` (it lists only the Latin `cera microcristallina`) and solid `Paraffin` (only `paraffin wax`). `\\bparaffin\\b` is anchored so `C13-14 Isoparaffin` does not trip it.',
  },
  {
    tag: S.SANS_SAVON,
    refutingToken: tokenRule({
      groups: [
        ['sodium', 'potassium'],
        [
          '\\bcocoate\\b',
          '\\bolivate\\b',
          '\\bpalmate\\b',
          '\\bpalm kernelate\\b',
          '\\btallowate\\b',
          '\\bstearate\\b',
          '\\blaurate\\b',
          '\\bpalmitate\\b',
          '\\bcastorate\\b',
          '\\brapeseedate\\b',
          '\\bsunflowerate\\b',
        ],
      ],
    }),
    note: 'algo-derm’s soap group, but anchored: its substring form reads `Disodium 2-Sulfolaurate` (a sulfonate) as a laurate soap. The alkali and the fatty-acid salt must also sit in the SAME token, so `Glyceryl Stearate` next to `Sodium Benzoate` is not a soap.',
  },
  // sans-huiles-essentielles has NO refuter on purpose. An essential oil is declared under its
  // species name (`Lavandula Angustifolia Oil`), so there is no literal marker to read: it
  // needs a species list, i.e. taxonomy work, not a pattern.
]

export const ABSENCE_REFUTERS: readonly AbsenceRefuter[] = DECLARED_REFUTERS.map((r) => ({
  ...r,
  refutingToken: guarded(r.refutingToken),
}))

const BY_TAG = new Map(ABSENCE_REFUTERS.map((r) => [r.tag, r.refutingToken]))

/**
 * Throws rather than returning undefined: a caller asking for a refuter it does not have would
 * silently degrade into "nothing disproves this claim", which is the exact failure the veto
 * exists to prevent.
 */
export function refuterFor(
  tag: SkincareProductTagSlug
): (inci: string | null | undefined) => boolean {
  const refuter = BY_TAG.get(tag)
  if (!refuter) throw new Error(`No absence refuter declared for tag "${tag}"`)
  return (inci) => refuter(inci) !== null
}
