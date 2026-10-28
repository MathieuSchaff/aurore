import type { InciToken } from '@aurore/shared'

import { buildAliasIndex, lookupIngredient, MERGED_EVIDENCE_DB } from 'algo-derm/engine'

import type { Ingredient } from '../../db/schema/ingredients/ingredients'

type LinkedIngredient = Pick<Ingredient, 'name' | 'slug' | 'canonicalKey'>

let aliasIndex: ReturnType<typeof buildAliasIndex> | undefined

export function linkFormulaTokens(
  tokens: InciToken[] | null,
  linkedIngredients: LinkedIngredient[]
): InciToken[] | null {
  if (!tokens || linkedIngredients.length === 0) return tokens
  aliasIndex ??= buildAliasIndex(MERGED_EVIDENCE_DB)
  const index = aliasIndex

  return tokens.map((token) => {
    // The comparison key drops parentheses, which can carry a pigment's identity
    const canonicalKey = lookupIngredient(token.label, index)?.inci
    const matches = linkedIngredients.filter((ingredient) =>
      canonicalKey
        ? ingredient.canonicalKey === canonicalKey
        : ingredient.name.trim().toLowerCase() === token.label.trim().toLowerCase()
    )
    // A shared identity does not choose between two catalogue sheets
    const ingredient = matches.length === 1 ? matches[0] : undefined
    return ingredient ? { ...token, ingredientSlug: ingredient.slug } : token
  })
}
