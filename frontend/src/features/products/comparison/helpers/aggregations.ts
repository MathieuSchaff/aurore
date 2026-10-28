import type { EnrichedComparisonProduct } from '@aurore/shared'

export function computeActives(products: EnrichedComparisonProduct[]) {
  const map = new Map<
    string,
    EnrichedComparisonProduct['actives'][number] & { presentIn: string[] }
  >()
  for (const product of products) {
    for (const active of product.actives) {
      const entry = map.get(active.key) ?? { ...active, presentIn: [] }
      if (entry.ingredientSlug !== active.ingredientSlug) {
        entry.ingredientSlug = null
        entry.name = active.key
      }
      if (!entry.presentIn.includes(product.id)) entry.presentIn.push(product.id)
      map.set(active.key, entry)
    }
  }
  return [...map.values()]
}

export function computeFormulaMarkers(products: EnrichedComparisonProduct[]) {
  const map = new Map<
    string,
    {
      token: NonNullable<EnrichedComparisonProduct['inciTokens']>[number]
      presentIn: string[]
    }
  >()
  for (const product of products) {
    for (const token of product.inciTokens ?? []) {
      if (!token.comparisonMarker) continue
      const entry = map.get(token.key) ?? { token: { ...token }, presentIn: [] }
      if (entry.token.ingredientSlug !== token.ingredientSlug) {
        delete entry.token.ingredientSlug
      }
      if (!entry.presentIn.includes(product.id)) entry.presentIn.push(product.id)
      map.set(token.key, entry)
    }
  }
  return [...map.values()]
}
