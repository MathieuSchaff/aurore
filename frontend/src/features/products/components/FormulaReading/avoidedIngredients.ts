// Which of a formula's ingredients the reader has declared they avoid.
// Kept out of the component so the product rule (`exclude` only, matched on
// canonical_key) is assertable without rendering.

interface PreferenceTarget {
  canonicalKey: string
  stance: string
}

interface DeclarableIngredient {
  canonicalKey: string
  name: string
}

// `require` is deliberately absent: it needs no mention, since finding the
// ingredient in the formula is what the reader asked for. `exclude` is the
// stance whose silence misleads: the product is already missing from their
// searches and nothing on its page says why.
export function avoidedIngredientNames(
  declarable: readonly DeclarableIngredient[],
  targets: readonly PreferenceTarget[] | undefined
): string[] {
  if (!targets) return []
  const excluded = new Set(targets.filter((t) => t.stance === 'exclude').map((t) => t.canonicalKey))
  return declarable.filter((i) => excluded.has(i.canonicalKey)).map((i) => i.name)
}
