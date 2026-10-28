import type { ComparisonFormulaMarker, InciToken } from '@aurore/shared'

import { findInciToken, fragranceAllergenToken, fragranceMarkerToken } from '../../lib/inci-facts'

function formulaMarker(label: string): ComparisonFormulaMarker | undefined {
  if (fragranceMarkerToken(label)) return 'fragrance'
  if (fragranceAllergenToken(label)) return 'fragrance-component'
  if (
    findInciToken(label, (name) =>
      /^(?:alcohol denat|alcool denature|sd alcohol(?: \d+(?:-?[a-z])?)?)$/.test(name)
    )
  )
    return 'denatured-alcohol'
  return undefined
}

export function markComparisonTokens(tokens: InciToken[] | null): InciToken[] | null {
  return (
    tokens?.map((token) => {
      const comparisonMarker = formulaMarker(token.label)
      return comparisonMarker ? { ...token, comparisonMarker } : token
    }) ?? null
  )
}
