import { HOLY_GRAIL_SENTIMENT } from '@habit-tracker/shared'

import { useMemo } from 'react'

import type { UserProduct } from '@/lib/queries/user-products'

// Common formula fillers are present in nearly every product and dilute
// the pattern signal — exclude them so the surfaced ingredients describe
// the user's own shelf, not the cosmetics industry baseline.
export const COMMON_FILLERS = [
  'Aqua',
  'Water',
  'Glycerin',
  'Glycerine',
  'Phenoxyethanol',
  'Ethylhexylglycerin',
  'Xanthan Gum',
  'Disodium EDTA',
  'Sodium Benzoate',
  'Potassium Sorbate',
  'Citric Acid',
  'Sodium Citrate',
  'Caprylyl Glycol',
]

export interface IngredientCount {
  name: string
  count: number
}

export interface PatternBucket {
  ingredients: IngredientCount[]
  productCount: number
}

export interface CollectionPatterns {
  keeping: PatternBucket
  setAside: PatternBucket
}

function countIngredients(products: UserProduct[]): IngredientCount[] {
  const counts: Record<string, IngredientCount> = {}
  for (const p of products) {
    const pIngredients = p.product?.productIngredients
    if (!pIngredients) continue
    for (const pi of pIngredients) {
      const ing = pi.ingredient
      if (!ing || COMMON_FILLERS.includes(ing.name)) continue
      if (!counts[ing.id]) counts[ing.id] = { name: ing.name, count: 0 }
      counts[ing.id].count++
    }
  }
  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

export function useCollectionAnalysis(userProducts: UserProduct[]): CollectionPatterns {
  return useMemo(() => {
    // "Keeping" = products the user marked Holy Grail (sentiment=6).
    // HG used to be a status; folded into the sentiment scale (F4).
    const keeping = userProducts.filter((p) => p.sentiment === HOLY_GRAIL_SENTIMENT)

    // "Set aside" merges every signal that the user moved away from a product:
    // explicitly avoided, low tolerance, or low sentiment. One calm bucket
    // beats three alarm-coded ones (see docs/04-design-ux/collection-page-audit.md F1).
    const setAsideSet = new Map<string, UserProduct>()
    for (const p of userProducts) {
      const tolerance = p.review?.tolerance ?? 0
      const sentiment = p.sentiment ?? 0
      const isSetAside =
        p.status === 'avoided' ||
        (tolerance > 0 && tolerance <= 2) ||
        (sentiment > 0 && sentiment <= 2)
      if (isSetAside) setAsideSet.set(p.id, p)
    }
    const setAside = Array.from(setAsideSet.values())

    return {
      keeping: { ingredients: countIngredients(keeping), productCount: keeping.length },
      setAside: { ingredients: countIngredients(setAside), productCount: setAside.length },
    }
  }, [userProducts])
}
