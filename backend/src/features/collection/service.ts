import { analyzeINCI, cleanInciString } from 'algo-derm'
import { and, eq, inArray, isNotNull, ne, or } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db'
import { userIngredientAnalysisScore } from '../../db/schema/ingredients/user-ingredient-analysis-score'
import { productIngredients } from '../../db/schema/products/product-ingredients'
import { products } from '../../db/schema/products/products'
import { userProducts } from '../../db/schema/products/user-products'
import { benefitDriversWithHumanEvidence } from '../../lib/algo-derm-benefit-evidence'
import { mapKindToContext } from '../../lib/algo-derm-product-context'
import { fetchKnownConcentrationsByProduct } from '../../lib/fetch-known-concentrations'
import { loadAlgoDermProfile } from '../dermo-score/service'

// Neutral midpoint of the 0..100 compatibility scale.
const NEUTRAL = 50

// Only ingredients the user has evidence on (isSuspect/isFavorite) count; a
// product sharing none returns null, not a low score.
// Equal weight per ingredient: product_ingredients stores no INCI order, so
// position can't weight the score in v1.
export async function calculateCompatibilityScores(
  userId: string,
  productIds: string[],
  db: DatabaseTransaction
): Promise<Record<string, number | null>> {
  const result: Record<string, number | null> = {}
  for (const id of productIds) result[id] = null
  if (productIds.length === 0) return result

  const signalRows = await db
    .select({
      ingredientId: userIngredientAnalysisScore.ingredientId,
      suspicionScore: userIngredientAnalysisScore.suspicionScore,
      favoriteScore: userIngredientAnalysisScore.favoriteScore,
    })
    .from(userIngredientAnalysisScore)
    .where(
      and(
        eq(userIngredientAnalysisScore.userId, userId),
        or(
          eq(userIngredientAnalysisScore.isSuspect, true),
          eq(userIngredientAnalysisScore.isFavorite, true)
        )
      )
    )

  if (signalRows.length === 0) return result

  const signalById = new Map<string, number>()
  for (const row of signalRows) {
    signalById.set(row.ingredientId, Number(row.favoriteScore) - Number(row.suspicionScore))
  }

  const links = await db
    .select({
      productId: productIngredients.productId,
      ingredientId: productIngredients.ingredientId,
    })
    .from(productIngredients)
    .where(inArray(productIngredients.productId, productIds))

  const contribByProduct = new Map<string, number[]>()
  for (const link of links) {
    const signal = signalById.get(link.ingredientId)
    if (signal === undefined) continue
    const bucket = contribByProduct.get(link.productId)
    if (bucket) bucket.push(signal)
    else contribByProduct.set(link.productId, [signal])
  }

  for (const [productId, signals] of contribByProduct) {
    const mean = signals.reduce((sum, s) => sum + s, 0) / signals.length
    result[productId] = Math.round(NEUTRAL + mean * NEUTRAL)
  }

  return result
}

// A formula motif must recur: one product is an anecdote, not a pattern.
const MIN_AXIS_PRODUCTS = 2

// Every product behind a motif, not a sample of three: the screen has to answer "which ones",
// and a shelf is small enough that the whole list costs nothing. `slug` rides along so the
// screen can link each one to its page
type MotifProduct = { name: string; slug: string }
type AxisMotif = { axis: string; count: number; products: MotifProduct[] }
export type FormulaMotifs = {
  productsAnalyzed: number
  benefits: AxisMotif[]
  notes: AxisMotif[]
}

type AxisAcc = Map<string, MotifProduct[]>

function accumulate(acc: AxisAcc, axes: Iterable<string>, product: MotifProduct): void {
  for (const axis of axes) {
    const entry = acc.get(axis) ?? []
    entry.push(product)
    acc.set(axis, entry)
  }
}

function toSortedMotifs(acc: AxisAcc): AxisMotif[] {
  return [...acc.entries()]
    .filter(([, products]) => products.length >= MIN_AXIS_PRODUCTS)
    .map(([axis, products]) => ({ axis, count: products.length, products }))
    .sort((a, b) => b.count - a.count)
}

// Count recurring benefit/risk axes across the shelf. Never a score, ranking,
// or verdict (product vision). 'avoided' products are excluded: a rejected
// formula is not part of the shelf's signal.
export async function getCollectionFormulaMotifs(
  userId: string,
  db: DatabaseTransaction
): Promise<FormulaMotifs> {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      inci: products.inci,
      kind: products.kind,
    })
    .from(userProducts)
    .innerJoin(products, eq(userProducts.productId, products.id))
    .where(
      and(
        eq(userProducts.userId, userId),
        ne(userProducts.status, 'avoided'),
        isNotNull(products.inci)
      )
    )

  if (rows.length === 0) return { productsAnalyzed: 0, benefits: [], notes: [] }

  const profile = await loadAlgoDermProfile(userId, db)
  const concentrationsByProduct = await fetchKnownConcentrationsByProduct(
    rows.map((r) => r.id),
    db
  )

  const benefitAcc: AxisAcc = new Map()
  const noteAcc: AxisAcc = new Map()
  let productsAnalyzed = 0

  for (const row of rows) {
    const inci = row.inci ? cleanInciString(row.inci) : undefined
    if (!inci) continue

    const context = {
      ...mapKindToContext(row.kind),
      knownConcentrations: concentrationsByProduct.get(row.id),
    }
    const assessment = analyzeINCI(inci, { profile, context })
    const { explanation } = assessment
    productsAnalyzed++

    const benefitAxes = new Set(benefitDriversWithHumanEvidence(assessment).flatMap((d) => d.axes))
    const noteAxes = new Set(
      explanation.topDrivers
        .filter((d) => d.source !== 'interaction' && d.axes.length > 0)
        .flatMap((d) => d.axes)
    )
    const product = { name: row.name, slug: row.slug }
    accumulate(benefitAcc, benefitAxes, product)
    accumulate(noteAcc, noteAxes, product)
  }

  return {
    productsAnalyzed,
    benefits: toSortedMotifs(benefitAcc),
    notes: toSortedMotifs(noteAcc),
  }
}
