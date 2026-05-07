// Pharmacological cluster detection for skincare products.
//
// Reads a product's INCI string, splits + normalizes via algo-derm
// (`splitINCI` + `normalize`), and matches each ingredient name against
// per-cluster substring patterns to emit the `actif_class` product tag
// slugs that apply.
//
// Patterns target canonical INCI fragments (lowercase, after algo-derm
// normalization). Order inside `patterns` doesn't matter; the matcher
// is OR-of-substring. Adding a new pattern = adding a new INCI alias
// the cluster should catch.

import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@habit-tracker/shared'

import { normalize, splitINCI } from 'algo-derm'

export interface ActifClassDef {
  slug: SkincareProductTagSlug
  patterns: string[]
}

export const ACTIF_CLASS_DEFS: ActifClassDef[] = [
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.RETINOIDS,
    patterns: [
      'retinol',
      'retinal',
      'retinaldehyde',
      'tretinoin',
      'isotretinoin',
      'alitretinoin',
      'adapalene',
      'tazarotene',
      'trifarotene',
      'retinyl palmitate',
      'retinyl acetate',
      'retinyl propionate',
      'retinyl linoleate',
      'retinyl retinoate',
      'hydroxypinacolone retinoate',
      'sodium retinoyl hyaluronate',
    ],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.RETINOL_ALTERNATIVES,
    patterns: ['bakuchiol'],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.VITAMIN_C,
    patterns: [
      'ascorbic acid',
      'ascorbyl glucoside',
      'sodium ascorbyl phosphate',
      'magnesium ascorbyl phosphate',
      'tetrahexyldecyl ascorbate',
      'ethyl ascorbic acid',
      'ascorbyl palmitate',
      'ascorbyl tetraisopalmitate',
      'glyceryl ascorbate',
    ],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.VITAMIN_E,
    patterns: ['tocopherol', 'tocopheryl acetate', 'tocopheryl glucoside'],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.NIACINAMIDE,
    patterns: ['niacinamide', 'nicotinamide'],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.AHA,
    patterns: [
      'glycolic acid',
      'lactic acid',
      'mandelic acid',
      'malic acid',
      'tartaric acid',
      'ammonium lactate',
    ],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.BHA,
    patterns: ['salicylic acid', 'capryloyl salicylic acid', 'betaine salicylate'],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.PHA,
    patterns: ['gluconolactone', 'lactobionic acid', 'galactose'],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.ENZYMES_EXFOLIANTS,
    patterns: ['papain', 'bromelain', 'subtilisin', 'protease'],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.CERAMIDES,
    patterns: [
      'ceramide np',
      'ceramide ap',
      'ceramide ns',
      'ceramide eop',
      'ceramide eos',
      'ceramide 1',
      'ceramide 2',
      'ceramide 3',
      'ceramide 6',
    ],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.HYALURONIC_ACID,
    patterns: [
      'hyaluronic acid',
      'sodium hyaluronate',
      'hydrolyzed hyaluronic acid',
      'sodium acetylated hyaluronate',
      'hydroxypropyltrimonium hyaluronate',
      'potassium hyaluronate',
      'sodium hyaluronate crosspolymer',
    ],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.PEPTIDES,
    patterns: ['peptide', 'matrixyl', 'argireline', 'syn-ake', 'pdrn'],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.POLYPHENOLS,
    patterns: [
      'resveratrol',
      'epigallocatechin',
      'ferulic acid',
      'camellia sinensis leaf extract',
      'curcuma longa',
      'rosmarinus officinalis',
      'punica granatum',
      'polygonum cuspidatum',
      'cistus monspeliensis',
      'quercetin',
    ],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.CENTELLA,
    patterns: [
      'centella asiatica',
      'asiaticoside',
      'asiatic acid',
      'madecassoside',
      'madecassic acid',
    ],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.TYROSINASE_INHIBITORS,
    patterns: ['kojic acid', 'arbutin', 'tranexamic acid', 'ellagic acid', 'morus alba'],
  },
  {
    slug: SKINCARE_PRODUCT_TAG_SLUGS.AZELAIC_ACID,
    patterns: ['azelaic acid', 'potassium azeloyl diglycinate'],
  },
]

export function detectActifClasses(inci: string | null | undefined): SkincareProductTagSlug[] {
  if (!inci || !inci.trim()) return []
  const ingredients = splitINCI(inci).map(normalize).filter(Boolean)
  if (ingredients.length === 0) return []

  const found = new Set<SkincareProductTagSlug>()
  for (const def of ACTIF_CLASS_DEFS) {
    if (def.patterns.some((p) => ingredients.some((ing) => ing.includes(p)))) {
      found.add(def.slug)
    }
  }
  return [...found]
}
