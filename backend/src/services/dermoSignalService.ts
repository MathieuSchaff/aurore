/**
 * Dermo Signal Engine
 * ====================
 * For every non-filler ingredient that appears in the user's reviewed collection,
 * compute a suspicion/favorite score based on how often it shows up in products
 * the user liked vs disliked.
 *
 * Formula
 * -------
 *   signal = (count_in_bad / total_bad) - (count_in_good / total_good)
 *
 *   total_bad   = user products where tolerance ≤ 2 OR status = 'avoided'
 *   total_good  = user products where tolerance ≥ 4 OR status = 'holy_grail'
 *   count_in_X  = subset of X products that also contain this ingredient
 *
 * Guard-rails
 * -----------
 *   1. Skip ingredients flagged is_filler = true (carriers, pH adjusters, etc.)
 *   2. Require at least MIN_EVIDENCE hits on a side before trusting that ratio
 *   3. Never divide by zero
 *
 * Storage mapping (schema uses suspicion/favorite split instead of raw signal)
 *   suspicionScore = max(0,  signal)   — ingredient over-represented in bad products
 *   favoriteScore  = max(0, -signal)   — ingredient over-represented in good products
 *
 * Note: status changes (avoided / holy_grail) also affect the signal, but this
 * service is only triggered from review saves. To keep scores fully up-to-date,
 * also call it from the PATCH /:id handler when status flips.
 */

import { and, eq, inArray, sql } from 'drizzle-orm'

import type { DB } from '../db'
import { ingredientDermoProfiles } from '../db/schema/ingredients/ingredient-dermo-profiles'
import { userIngredientAnalysisScore } from '../db/schema/ingredients/user-ingredient-analysis-score'
import { userProducts } from '../db/schema/user-products'

// Need at least this many products in a bucket before we trust the ratio.
// With only 1 product, a single coincidence would look like a strong signal.
const MIN_EVIDENCE = 2

// A user product is "bad" if the user explicitly avoided it, or rated tolerance low.
function isBad(status: string, tolerance: number | null): boolean {
  return status === 'avoided' || (tolerance !== null && tolerance <= 2)
}

// A user product is "good" if it is a holy grail, or rated tolerance high.
function isGood(status: string, tolerance: number | null): boolean {
  return status === 'holy_grail' || (tolerance !== null && tolerance >= 4)
}

/**
 * Recalculates dermo signal scores for every non-filler ingredient present in
 * the user's good/bad buckets, then upserts one row per ingredient into
 * user_ingredient_analysis_score.
 *
 * Called after every review save (create / update), and should also be called
 * when a userProduct status flips to 'avoided' or 'holy_grail'.
 *
 * Note: `userProductId` is accepted for API stability with callers, but we
 * recompute the whole collection — a single review save shifts totals for
 * every ingredient, not just the ones in the triggered product.
 */
export async function recalculateSignalForUser(
  userId: string,
  _userProductId: string,
  db: DB
): Promise<void> {
  // 1. Load the user's full collection in ONE query (avoids N+1 per ingredient).
  //    For each userProduct we need: its status, its review tolerance, and the
  //    list of ingredientIds of the underlying product.
  const collection = await db.query.userProducts.findMany({
    where: eq(userProducts.userId, userId),
    columns: { status: true },
    with: {
      review: { columns: { tolerance: true } },
      product: {
        with: {
          productIngredients: { columns: { ingredientId: true } },
        },
      },
    },
  })

  // 2. Split the collection into two buckets and, while we're at it, turn each
  //    product's ingredient list into a Set for O(1) lookups later on.
  //    Note: a product can land in both buckets if e.g. status='holy_grail'
  //    but tolerance was temporarily set low — kept as-is, matches old behavior.
  const badIngredientSets: Set<string>[] = []
  const goodIngredientSets: Set<string>[] = []

  for (const item of collection) {
    const tolerance = item.review?.tolerance ?? null
    const ingredientSet = new Set(item.product.productIngredients.map((pi) => pi.ingredientId))

    if (isBad(item.status, tolerance)) badIngredientSets.push(ingredientSet)
    if (isGood(item.status, tolerance)) goodIngredientSets.push(ingredientSet)
  }

  const totalBad = badIngredientSets.length
  const totalGood = goodIngredientSets.length

  // 3. Dedup union of ingredients that appear in any bad OR good product.
  //    Those are the only ingredients whose score can possibly be non-zero.
  //    An ingredient seen in 5 products is still scored only once.
  const candidateIds = new Set<string>()
  for (const set of badIngredientSets) for (const id of set) candidateIds.add(id)
  for (const set of goodIngredientSets) for (const id of set) candidateIds.add(id)

  if (candidateIds.size === 0) return

  // 4. Exclude fillers (carriers, pH adjusters…) — they're noise.
  //    One small lookup query: "among these candidate ids, which are fillers?".
  //    Ingredients without a profile row are treated as non-filler by default.
  const fillerRows = await db
    .select({ ingredientId: ingredientDermoProfiles.ingredientId })
    .from(ingredientDermoProfiles)
    .where(
      and(
        eq(ingredientDermoProfiles.isFiller, true),
        inArray(ingredientDermoProfiles.ingredientId, [...candidateIds])
      )
    )
  const fillerIds = new Set(fillerRows.map((r) => r.ingredientId))
  const targetIngredientIds = [...candidateIds].filter((id) => !fillerIds.has(id))

  if (targetIngredientIds.length === 0) return

  // 5. For each ingredient, compare how often it shows up in bad vs good products.
  //
  //    signal = (share of bad products containing it) - (share of good products containing it)
  //
  //    > 0  → over-represented in bad products → suspicion
  //    < 0  → over-represented in good products → favorite
  const now = new Date()
  const scores = targetIngredientIds.map((ingredientId) => {
    const countInBad = badIngredientSets.reduce((n, s) => n + (s.has(ingredientId) ? 1 : 0), 0)
    const countInGood = goodIngredientSets.reduce((n, s) => n + (s.has(ingredientId) ? 1 : 0), 0)

    // Require MIN_EVIDENCE hits in a bucket before that side contributes to the signal.
    const badRatio = countInBad >= MIN_EVIDENCE ? countInBad / totalBad : 0
    const goodRatio = countInGood >= MIN_EVIDENCE ? countInGood / totalGood : 0
    const signal = badRatio - goodRatio

    const suspicionScore = Math.max(0, signal)
    const favoriteScore = Math.max(0, -signal)

    return {
      userId,
      ingredientId,
      suspicionScore: suspicionScore.toFixed(6),
      favoriteScore: favoriteScore.toFixed(6),
      isSuspect: countInBad >= MIN_EVIDENCE && suspicionScore > 0,
      isFavorite: countInGood >= MIN_EVIDENCE && favoriteScore > 0,
      updatedAt: now,
    }
  })

  // 6. Single batch upsert. `excluded.*` refers to the values we just tried to
  //    insert, so on conflict we overwrite the previous score with the fresh one.
  await db
    .insert(userIngredientAnalysisScore)
    .values(scores)
    .onConflictDoUpdate({
      target: [userIngredientAnalysisScore.userId, userIngredientAnalysisScore.ingredientId],
      set: {
        suspicionScore: sql`excluded.suspicion_score`,
        favoriteScore: sql`excluded.favorite_score`,
        isSuspect: sql`excluded.is_suspect`,
        isFavorite: sql`excluded.is_favorite`,
        updatedAt: sql`excluded.updated_at`,
      },
    })
}
