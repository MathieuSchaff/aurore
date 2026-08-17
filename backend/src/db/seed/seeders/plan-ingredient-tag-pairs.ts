// Pure module (no DB / no env imports) so it unit-tests without a database

import { SKINCARE_INGREDIENT_CATEGORY_VALUES } from '@aurore/shared'

// Type alias, not interface: the alias keeps an implicit index signature so
// planned pairs still satisfy pruneRelationshipPairs' Record<string, unknown> bound
export type SeedIngredientTagPair = {
  slug: string
  tagSlug: string
  relevance: 'primary' | 'secondary' | 'avoid'
}

export type PlannedIngredient = {
  slug: string
  category?: string | null
}

export interface IngredientTagPlan {
  pairs: SeedIngredientTagPair[]
  droppedTagKeys: string[]
  droppedPairCount: number
  backfilled: number
  dupes: number
}

export function planIngredientTagPairs(input: {
  pairs: readonly SeedIngredientTagPair[]
  ingredients: readonly PlannedIngredient[]
}): IngredientTagPlan {
  // Drop entries whose tagSlug resolved to `undefined`: these originate
  // from domain slug references in ingredientTagMap pointing at slugs
  // removed during a tag split (AJUSTEUR_PH, SOLVANT, AHA, ACNE…). We warn
  // once with a unique key list so the taxonomy can be reconciled manually;
  // the seed keeps running
  const droppedTagKeys = new Set<string>()
  const ingredientTagPairs = input.pairs.filter((p) => {
    if (typeof p.tagSlug !== 'string' || p.tagSlug.length === 0) {
      droppedTagKeys.add(String(p.tagSlug))
      return false
    }
    return true
  })
  const droppedPairCount = input.pairs.length - ingredientTagPairs.length

  const existing = new Set(ingredientTagPairs.map((p) => `${p.slug}::${p.tagSlug}`))
  // Whitelist of skincare formulation roles that exist as ingredient_attribute
  // tag slugs. Supplement ingredients store their functional class in the same
  // `category` column (carotenoide, plante, neuroactif…): skip them here so
  // the backfill never emits tags that aren't in the ingredient taxonomy

  // The shared-schemas-vs-tags test guarantees SKINCARE_INGREDIENT_CATEGORY_VALUES
  // ↔ ingredient_attribute tag slugs
  const validCategorySlugs = new Set<string>(SKINCARE_INGREDIENT_CATEGORY_VALUES)
  let backfilled = 0
  // Every ingredient with a native `category` matching an ingredient_attribute
  // slug gets a synthetic 'primary' tag pair if the manual map doesn't already
  // list it. Keeps the attribute filter bucket in sync with the native column
  // without hand-editing hundreds of entries
  for (const ing of input.ingredients) {
    const category = ing.category
    if (!category) continue
    if (!validCategorySlugs.has(category)) continue
    const key = `${ing.slug}::${category}`
    if (existing.has(key)) continue
    ingredientTagPairs.push({ slug: ing.slug, tagSlug: category, relevance: 'primary' })
    existing.add(key)
    backfilled++
  }

  // Dedupe (slug, tagSlug) pairs, keeping the first relevance seen. Silent
  // collapse instead of throwing: the obsolete-tag remap and the native
  // category backfill both legitimately produce identical pairs, and the
  // DB treats tagging again as idempotent
  const seen = new Set<string>()
  const kept: SeedIngredientTagPair[] = []
  for (const pair of ingredientTagPairs) {
    const key = `${pair.slug}::${pair.tagSlug}`
    if (seen.has(key)) continue
    seen.add(key)
    kept.push(pair)
  }

  return {
    pairs: kept,
    droppedTagKeys: [...droppedTagKeys],
    droppedPairCount,
    backfilled,
    dupes: ingredientTagPairs.length - kept.length,
  }
}

export function printIngredientTagPlan(plan: IngredientTagPlan): void {
  if (plan.droppedTagKeys.length > 0) {
    console.warn(
      `⚠️  ${plan.droppedPairCount} pair(s) ingredientTags ignorée(s) — slugs inexistants: ${plan.droppedTagKeys.join(', ')}`
    )
  }
  if (plan.backfilled > 0) {
    console.log(
      `🔁 Backfill: +${plan.backfilled} ingredient_attribute tags depuis la colonne native`
    )
  }
  if (plan.dupes > 0) console.log(`ℹ️  ${plan.dupes} doublon(s) ingredientTags fusionné(s)`)
}
