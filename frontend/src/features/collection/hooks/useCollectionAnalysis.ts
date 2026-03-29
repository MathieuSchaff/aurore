import { useMemo } from 'react'

import type { UserProduct } from '@/lib/queries/user-products'

// We don't show these common things like Water or Glycerin in the analysis
// because they are in almost every product and it's not very interesting.
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

export function useCollectionAnalysis(userProducts: UserProduct[]) {
  const analysis = useMemo(() => {
    const holyGrails = userProducts.filter((p) => p.status === 'holy_grail')
    const lowTolerance = userProducts.filter(
      (p) => (p.review?.tolerance ?? 0) > 0 && (p.review?.tolerance ?? 0) <= 2
    )
    const badSentiment = userProducts.filter(
      (p) => (p.sentiment ?? 0) > 0 && (p.sentiment ?? 0) <= 2
    )
    const avoided = userProducts.filter((p) => p.status === 'avoided')

    const countIngredients = (products: UserProduct[]): IngredientCount[] => {
      const counts: Record<string, { name: string; count: number }> = {}
      products.forEach((p) => {
        const pIngredients = p.product?.productIngredients
        pIngredients?.forEach((pi) => {
          const ing = pi.ingredient
          if (!ing || COMMON_FILLERS.includes(ing.name)) return
          if (!counts[ing.id]) counts[ing.id] = { name: ing.name, count: 0 }
          counts[ing.id].count++
        })
      })
      return Object.values(counts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    }

    return {
      holyGrailCommon: countIngredients(holyGrails),
      lowToleranceCommon: countIngredients(lowTolerance),
      badSentimentCommon: countIngredients(badSentiment),
      avoidedCommon: countIngredients(avoided),
    }
  }, [userProducts])

  return analysis
}
