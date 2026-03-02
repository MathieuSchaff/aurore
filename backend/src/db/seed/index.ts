import { createIngredient } from '../../features/products/ingredients/service'
import { addIngredientToProduct } from '../../features/products/product-ingredients/product-ingredients.service'
import { createProduct } from '../../features/products/service'
import {
  addTagToIngredient,
  addTagToProduct,
  createTag,
} from '../../features/products/tags/tags.service'
import { db } from '..'
import { ingredients, products, tags } from '../schema'
import { getOrCreateSeedUser } from './create-user'
import { ingredientTagMap } from './IngredientsTags/seed-ingredients-tags'
import { ingredientData } from './ingredients/ingredient-data'
import { allProductData } from './products'
import { allIngredientProductTags } from './products/ingredients-products-tags'
import { allProductTagsMap } from './products/product-tags'
import { tagData } from './tags/seed-tags'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProductTagGroups {
  primary: string[]
  secondary: string[]
  avoid: string[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function seedBatch<T>(
  label: string,
  items: T[],
  fn: (item: T) => Promise<unknown>,
  identify: (item: T) => string
) {
  const results = await Promise.allSettled(
    items.map(async (item) => {
      try {
        return await fn(item)
      } catch (err) {
        const context = identify(item)
        const message = err instanceof Error ? err.message : String(err)
        throw new Error(`[${label}] ${context} → ${message}`)
      }
    })
  )

  const failed = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[]

  if (failed.length) {
    console.error(`\n❌ ${failed.length}/${items.length} ${label} échoués:`)
    failed.forEach((r, i) => console.error(`  ${i + 1}. ${r.reason.message}`))
  } else {
    console.log(`✅ ${results.length} ${label} créés`)
  }

  return results
}

/**
 * Normalise une valeur potentiellement vide vers null.
 * Évite d'envoyer "" à la DB sur des colonnes nullable.
 */
function toNull(value: string | null | undefined): string | null {
  if (value === null || value === undefined || value === '') return null
  return value
}

/**
 * Aplatit un Record<slug, { primary, secondary, avoid }> en array de paires { slug, tagSlug }
 */
function flattenTagGroups(
  map: Record<string, ProductTagGroups>
): Array<{ slug: string; tagSlug: string }> {
  return Object.entries(map).flatMap(([slug, groups]) => {
    const allTagSlugs = [...groups.primary, ...groups.secondary, ...groups.avoid]
    return allTagSlugs.map((tagSlug) => ({ slug, tagSlug }))
  })
}

// ── Diagnostic ────────────────────────────────────────────────────────────────

function warnInvalidEntries() {
  const invalid = allIngredientProductTags.filter((i) => !i.ingredientSlug)
  if (invalid.length) {
    console.warn(
      `\n⚠️  ${invalid.length} entrée(s) avec ingredientSlug manquant dans les INGREDIENTS_MAP :`
    )
    invalid.forEach((i) => console.warn(`  → product=${i.productSlug}`))
    console.warn(
      '  Vérifie que la propriété est bien nommée "slug" (et non "ingredientSlug") dans les fichiers source.\n'
    )
  }
}

// ── Seed ──────────────────────────────────────────────────────────────────────

async function seed() {
  warnInvalidEntries()

  const user = await getOrCreateSeedUser()
  const userId = user.id

  // 1. Entités de base (sans FK entre elles)
  await seedBatch(
    'produits',
    [...allProductData],
    (p) => createProduct(userId, p, db),
    (p) => `product:${p.slug}`
  )

  await seedBatch(
    'tags',
    tagData,
    (t) => createTag(db, t),
    (t) => `tag:${t.slug}`
  )

  await seedBatch(
    'ingrédients',
    ingredientData,
    (ing) => createIngredient(userId, ing, db),
    (ing) => `ingredient:${ing.slug}`
  )

  // 2. Récupération des IDs réels en DB
  const [allProducts, allTags, allIngredients] = await Promise.all([
    db.select({ id: products.id, slug: products.slug }).from(products),
    db.select({ id: tags.id, slug: tags.slug }).from(tags),
    db.select({ id: ingredients.id, slug: ingredients.slug }).from(ingredients),
  ])

  const productSlugToId = new Map(allProducts.map((p) => [p.slug, p.id]))
  const tagSlugToId = new Map(allTags.map((t) => [t.slug, t.id]))
  const ingredientSlugToId = new Map(allIngredients.map((i) => [i.slug, i.id]))

  // 3. Relations product ↔ tag
  const productTagPairs = flattenTagGroups(allProductTagsMap as Record<string, ProductTagGroups>)

  await seedBatch(
    'productTags',
    productTagPairs,
    ({ slug: productSlug, tagSlug }) => {
      const productId = productSlugToId.get(productSlug)
      const tagId = tagSlugToId.get(tagSlug)
      if (!productId || !tagId)
        throw new Error(`Slug introuvable: product=${productSlug}, tag=${tagSlug}`)
      return addTagToProduct(db, productId, tagId)
    },
    ({ slug: productSlug, tagSlug }) => `${productSlug} ↔ ${tagSlug}`
  )

  // 4. Relations product ↔ ingredient
  // Filtre les entrées sans ingredientSlug (données source mal formées)
  const validProductIngredients = allIngredientProductTags.filter((i) => !!i.ingredientSlug)

  await seedBatch(
    'productIngredients',
    validProductIngredients,
    ({ productSlug, ingredientSlug, notes, concentrationValue, concentrationUnit }) => {
      const productId = productSlugToId.get(productSlug)
      const ingredientId = ingredientSlugToId.get(ingredientSlug)
      if (!productId || !ingredientId)
        throw new Error(`Slug introuvable: product=${productSlug}, ingredient=${ingredientSlug}`)
      return addIngredientToProduct(db, {
        productId,
        ingredientId,
        notes: toNull(notes),
        concentrationValue:
          concentrationValue != null && concentrationValue !== ''
            ? String(concentrationValue)
            : null,
        concentrationUnit: toNull(concentrationUnit),
        concentrationPer: null,
      })
    },
    ({ productSlug, ingredientSlug }) => `${productSlug} ↔ ${ingredientSlug}`
  )

  // 5. Relations ingredient ↔ tag
  const ingredientTagPairs = flattenTagGroups(ingredientTagMap as Record<string, ProductTagGroups>)

  await seedBatch(
    'ingredientTags',
    ingredientTagPairs,
    ({ slug: ingredientSlug, tagSlug }) => {
      const ingredientId = ingredientSlugToId.get(ingredientSlug)
      const tagId = tagSlugToId.get(tagSlug)
      if (!ingredientId || !tagId)
        throw new Error(`Slug introuvable: ingredient=${ingredientSlug}, tag=${tagSlug}`)
      return addTagToIngredient(db, ingredientId, tagId)
    },
    ({ slug: ingredientSlug, tagSlug }) => `${ingredientSlug} ↔ ${tagSlug}`
  )

  console.log('\n√ Seed exécuté')
}

seed()
