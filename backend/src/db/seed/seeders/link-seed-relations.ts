import { addTagToIngredient } from '../../../features/ingredient-tags/service'
import { addTagToProduct } from '../../../features/product-tags/service'
import { addIngredientToProduct } from '../../../features/products/product-ingredients/product-ingredients.service'
import type { DatabaseTransaction } from '../..'
import type { allIngredientProductTags } from '../data/products'
import { seedBatch, toNumeric, toText } from '../utils/batch'
import type { SeedProductTagPair } from './merge-product-tag-pairs'
import type { SeedIngredientTagPair } from './plan-ingredient-tag-pairs'

type SeedProductIngredientRow = (typeof allIngredientProductTags)[number]

// Lookup in a slug→id map after `pruneRelationshipPairs` guaranteed the key
// exists. A miss here means the prune step is broken, so throw loudly
function requireId(map: Map<string, string>, key: string, entity: string): string {
  const id = map.get(key)
  if (id === undefined) throw new Error(`Missing ${entity} id for slug "${key}"`)
  return id
}

// Filters a relationship pair list to rows whose left AND right slug
// resolved to a created entity. Unresolved slugs are reported once per
// entity as warnings: the seed keeps going with the valid subset instead
// of aborting on the first stale reference
function pruneRelationshipPairs<T extends Record<string, unknown>>(
  pairs: T[],
  leftSlugField: string,
  rightSlugField: string,
  leftMap: Map<string, string>,
  rightMap: Map<string, string>,
  leftEntityName: string,
  rightEntityName: string
): T[] {
  const missingLeft = new Set<string>()
  const missingRight = new Set<string>()
  const kept: T[] = []

  for (const pair of pairs) {
    const leftSlug = pair[leftSlugField]
    const rightSlug = pair[rightSlugField]
    const leftOk = typeof leftSlug === 'string' && leftMap.has(leftSlug)
    const rightOk = typeof rightSlug === 'string' && rightMap.has(rightSlug)

    if (!leftOk && typeof leftSlug === 'string') missingLeft.add(leftSlug)
    if (!rightOk && typeof rightSlug === 'string') missingRight.add(rightSlug)

    if (leftOk && rightOk) kept.push(pair)
  }

  if (missingLeft.size > 0) {
    console.warn(
      `\n⚠️  ${missingLeft.size} ${leftEntityName}(s) référencés mais non créés (ignorés) :`
    )
    for (const s of missingLeft) {
      console.warn(`   - ${s}`)
    }
  }

  if (missingRight.size > 0) {
    console.warn(
      `\n⚠️  ${missingRight.size} ${rightEntityName}(s) référencés mais non créés (ignorés) :`
    )
    for (const s of missingRight) {
      console.warn(`   - ${s}`)
    }
  }

  return kept
}

// Idempotent-mode filter: keep only pairs not already linked in DB. Pairs
// whose slugs resolve to no id are dropped silently: pruneRelationshipPairs
// already warned about them
function filterNewPairs<T extends Record<string, unknown>>(
  idempotent: boolean,
  pairs: T[],
  leftSlugField: string,
  rightSlugField: string,
  leftMap: Map<string, string>,
  rightMap: Map<string, string>,
  existingPairs: Set<string>,
  label: string
): T[] {
  if (!idempotent) return pairs
  const kept = pairs.filter((pair) => {
    const leftSlug = pair[leftSlugField]
    const rightSlug = pair[rightSlugField]
    if (typeof leftSlug !== 'string' || typeof rightSlug !== 'string') return false
    const leftId = leftMap.get(leftSlug)
    const rightId = rightMap.get(rightSlug)
    if (!leftId || !rightId) return false
    return !existingPairs.has(`${leftId}::${rightId}`)
  })
  console.log(
    `   ${label} à insérer : ${kept.length} (${pairs.length - kept.length} déjà liés, sautés)`
  )
  return kept
}

export async function linkProductTags(
  tx: DatabaseTransaction,
  input: {
    pairs: SeedProductTagPair[]
    productSlugToId: Map<string, string>
    productTagSlugToId: Map<string, string>
    existingPairs: Set<string>
    idempotent: boolean
  }
): Promise<void> {
  console.log('\n🔗 Préparation des relations produit-tags...')
  const prunedProductTagPairs = pruneRelationshipPairs(
    input.pairs,
    'slug',
    'tagSlug',
    input.productSlugToId,
    input.productTagSlugToId,
    'Produit',
    'ProductTag'
  )

  const productTagPairsToInsert = filterNewPairs(
    input.idempotent,
    prunedProductTagPairs,
    'slug',
    'tagSlug',
    input.productSlugToId,
    input.productTagSlugToId,
    input.existingPairs,
    'ProductTags'
  )

  await seedBatch(
    'productTags',
    productTagPairsToInsert,
    ({ slug, tagSlug, relevance, source }) =>
      addTagToProduct(
        tx,
        requireId(input.productSlugToId, slug, 'product'),
        requireId(input.productTagSlugToId, tagSlug, 'productTag'),
        relevance,
        source
      ),
    ({ slug, tagSlug }) => `${slug} ↔ ${tagSlug}`
  )
}

export async function linkProductIngredients(
  tx: DatabaseTransaction,
  input: {
    rows: SeedProductIngredientRow[]
    productSlugToId: Map<string, string>
    ingredientSlugToId: Map<string, string>
    existingPairs: Set<string>
    idempotent: boolean
  }
): Promise<void> {
  console.log('\n🔗 Préparation des relations produit-ingrédients...')
  const prunedProductIngredients = pruneRelationshipPairs(
    input.rows,
    'productSlug',
    'ingredientSlug',
    input.productSlugToId,
    input.ingredientSlugToId,
    'Produit',
    'Ingrédient'
  )

  const productIngredientsToInsert = filterNewPairs(
    input.idempotent,
    prunedProductIngredients,
    'productSlug',
    'ingredientSlug',
    input.productSlugToId,
    input.ingredientSlugToId,
    input.existingPairs,
    'ProductIngredients'
  )

  await seedBatch(
    'productIngredients',
    productIngredientsToInsert,
    ({ productSlug, ingredientSlug, notes, concentrationValue, concentrationUnit }) => {
      if (!ingredientSlug) throw new Error(`Missing ingredientSlug for product ${productSlug}`)
      return addIngredientToProduct(tx, {
        productId: requireId(input.productSlugToId, productSlug, 'product'),
        ingredientId: requireId(input.ingredientSlugToId, ingredientSlug, 'ingredient'),
        notes: toText(notes),
        concentrationValue: toNumeric(concentrationValue),
        concentrationUnit: toText(concentrationUnit),
        concentrationPer: null,
      })
    },
    ({ productSlug, ingredientSlug }) => `${productSlug} ↔ ${ingredientSlug}`
  )
}

export async function linkIngredientTags(
  tx: DatabaseTransaction,
  input: {
    pairs: SeedIngredientTagPair[]
    ingredientSlugToId: Map<string, string>
    ingredientTagSlugToId: Map<string, string>
    existingPairs: Set<string>
    idempotent: boolean
  }
): Promise<void> {
  console.log('\n🔗 Préparation des relations ingrédient-tags...')
  const prunedIngredientTagPairs = pruneRelationshipPairs(
    input.pairs,
    'slug',
    'tagSlug',
    input.ingredientSlugToId,
    input.ingredientTagSlugToId,
    'Ingrédient',
    'IngredientTag'
  )

  const ingredientTagPairsToInsert = filterNewPairs(
    input.idempotent,
    prunedIngredientTagPairs,
    'slug',
    'tagSlug',
    input.ingredientSlugToId,
    input.ingredientTagSlugToId,
    input.existingPairs,
    'IngredientTags'
  )

  await seedBatch(
    'ingredientTags',
    ingredientTagPairsToInsert,
    ({ slug, tagSlug, relevance }) =>
      addTagToIngredient(
        tx,
        requireId(input.ingredientSlugToId, slug, 'ingredient'),
        requireId(input.ingredientTagSlugToId, tagSlug, 'ingredientTag'),
        relevance
      ),
    ({ slug, tagSlug }) => `${slug} ↔ ${tagSlug}`
  )
}
