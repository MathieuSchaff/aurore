import type { EnrichedComparisonProduct } from '@aurore/shared'

import { computeCommon } from './aggregations'

export type CompatibilitySummary = {
  commonCount: number | null
  headline: string
  description: string
}

export function computeCompatibility(products: EnrichedComparisonProduct[]): CompatibilitySummary {
  if (products.length < 2 || products.some((p) => p.ingredients.length === 0)) {
    return {
      commonCount: null,
      headline: 'Données insuffisantes',
      description:
        'La comparaison nécessite au moins deux produits avec une liste d’ingrédients renseignée pour chacun.',
    }
  }

  const commonCount = computeCommon(products).length
  const plural = commonCount > 1 ? 's' : ''

  return {
    commonCount,
    headline:
      commonCount === 0
        ? 'Aucun ingrédient renseigné en commun'
        : `${commonCount} ingrédient${plural} renseigné${plural} en commun`,
    description: `Ce constat porte sur les ingrédients renseignés dans chacun des ${products.length} produits comparés. Les listes peuvent être incomplètes.`,
  }
}
