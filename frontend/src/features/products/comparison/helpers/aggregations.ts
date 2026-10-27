import type { EnrichedComparisonProduct } from '@aurore/shared'
import { DERMO_CONFLICTS } from '@aurore/shared'

type Ingredient = EnrichedComparisonProduct['ingredients'][number]

function ingredientsBySlug(products: EnrichedComparisonProduct[]) {
  const map = new Map<string, { ingredient: Ingredient; productIds: Set<string> }>()
  for (const p of products) {
    for (const i of p.ingredients) {
      const entry = map.get(i.slug) ?? { ingredient: i, productIds: new Set<string>() }
      entry.productIds.add(p.id)
      map.set(i.slug, entry)
    }
  }
  return map
}

type IngredientSignalSummary = {
  slug: string
  inciName: string
  presentIn: string[]
}

function computeSignals(
  products: EnrichedComparisonProduct[],
  signal: Ingredient['signals'][number]
): IngredientSignalSummary[] {
  return [...ingredientsBySlug(products).values()]
    .filter(({ ingredient }) => ingredient.signals.includes(signal))
    .map(({ ingredient, productIds }) => ({
      slug: ingredient.slug,
      inciName: ingredient.inciName,
      presentIn: products.filter((p) => productIds.has(p.id)).map((p) => p.id),
    }))
}

export function computeActives(products: EnrichedComparisonProduct[]) {
  return computeSignals(products, 'active')
}

export function computeAlerts(products: EnrichedComparisonProduct[]) {
  return computeSignals(products, 'alert')
}

export function computeIngredientPairs(products: EnrichedComparisonProduct[]) {
  const ingredients = ingredientsBySlug(products)
  return DERMO_CONFLICTS.flatMap(({ a, b }) => {
    const first = ingredients.get(a)
    const second = ingredients.get(b)
    if (!first || !second) return []
    const betweenProducts: [string, string][] = []
    for (const [index, product] of products.entries()) {
      for (const other of products.slice(index + 1)) {
        if (
          (first.productIds.has(product.id) && second.productIds.has(other.id)) ||
          (second.productIds.has(product.id) && first.productIds.has(other.id))
        ) {
          betweenProducts.push([product.id, other.id])
        }
      }
    }
    return [
      {
        a: first.ingredient,
        b: second.ingredient,
        aPresentIn: products.filter((p) => first.productIds.has(p.id)).map((p) => p.id),
        bPresentIn: products.filter((p) => second.productIds.has(p.id)).map((p) => p.id),
        sameFormula: products
          .filter((p) => first.productIds.has(p.id) && second.productIds.has(p.id))
          .map((p) => p.id),
        betweenProducts,
      },
    ]
  })
}
