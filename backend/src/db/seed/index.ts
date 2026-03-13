import { createIngredient } from '../../features/products/ingredients/service'
import { addIngredientToProduct } from '../../features/products/product-ingredients/product-ingredients.service'
import { createProduct } from '../../features/products/service'
import {
  addTagToIngredient,
  addTagToProduct,
  createTag,
} from '../../features/products/tags/tags.service'
import { db } from '..'
import {
  ingredients,
  ingredientTags,
  productIngredients,
  products,
  productTags,
  tags,
} from '../schema'
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

interface SeedError {
  item: string
  reason: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Normalise une valeur potentiellement vide vers null.
 */
function toNull(value: string | null | undefined): string | null {
  if (value === null || value === undefined || value === '') return null
  return value
}

/**
 * Aplatit un Record<slug, { primary, secondary, avoid }> en array de paires.
 */
function flattenTagGroups(
  map: Record<string, ProductTagGroups>
): Array<{ slug: string; tagSlug: string }> {
  return Object.entries(map).flatMap(([slug, groups]) => {
    const allTagSlugs = [...groups.primary, ...groups.secondary, ...groups.avoid]
    return allTagSlugs.map((tagSlug) => ({ slug, tagSlug }))
  })
}

/**
 * Vérifie les entrées invalides dans les données d'ingrédients.
 */
function warnInvalidEntries() {
  const invalid = allIngredientProductTags.filter((i) => !i.ingredientSlug)
  if (invalid.length === 0) return

  console.warn(`\n⚠️  ${invalid.length} entrée(s) avec ingredientSlug manquant :`)
  // biome-ignore lint: toto
  invalid.forEach((i) => console.warn(`  → product=${i.productSlug}`))
  console.warn('  Vérifie que la propriété est bien nommée "slug" dans les fichiers source.\n')
}

/**
 * Valide qu'il n'y a pas de doublons dans les paires produit-tag.
 */
function validateNoDuplicates(
  pairs: Array<{ slug: string; tagSlug: string }>,
  label: string
): void {
  const seen = new Set<string>()
  const duplicates: string[] = []

  for (const { slug, tagSlug } of pairs) {
    const key = `${slug}::${tagSlug}`
    if (seen.has(key)) {
      duplicates.push(`${slug} ↔ ${tagSlug}`)
    }
    seen.add(key)
  }

  if (duplicates.length > 0) {
    throw new Error(
      `Doublons détectés dans ${label}:\n` + duplicates.map((d) => `  - ${d}`).join('\n')
    )
  }
}

/**
 * Seed un batch avec gestion d'erreurs détaillées.
 * Si `critical=true`, arrête le process en cas d'erreur.
 */
async function seedBatch<T>(
  label: string,
  items: T[],
  fn: (item: T) => Promise<unknown>,
  identify: (item: T) => string,
  critical: boolean = false
): Promise<{ success: number; failed: SeedError[] }> {
  const results = await Promise.allSettled(
    items.map(async (item) => {
      try {
        await fn(item)
        return { success: true, item }
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err)
        throw { item: identify(item), reason }
      }
    })
  )

  const failed: SeedError[] = []
  let successCount = 0

  for (const result of results) {
    if (result.status === 'fulfilled') {
      successCount++
    } else {
      failed.push(result.reason as SeedError)
    }
  }

  if (failed.length > 0) {
    console.error(`\n❌ ${failed.length}/${items.length} ${label} échoué(s) :`)
    failed.forEach((f, i) => {
      console.error(`  ${i + 1}. [${f.item}]`)
      console.error(`     → ${f.reason}`)
    })

    if (critical) {
      console.error(`\n🛑 Seed interrompu : ${label} contient des erreurs critiques`)
      process.exit(1)
    }
  } else {
    console.log(`✅ ${successCount} ${label} créé(s)`)
  }

  return { success: successCount, failed }
}

// ── Seed Principal ────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Démarrage du seed...\n')

  // 1. Nettoyage complet
  console.log('🧹 Nettoyage de la base de données...')
  try {
    // Ordre important : relations d'abord (FK), puis entités
    await db.delete(productTags)
    await db.delete(productIngredients)
    await db.delete(ingredientTags)
    await db.delete(products)
    await db.delete(ingredients)
    await db.delete(tags)
    console.log('✅ Base nettoyée\n')
  } catch (err) {
    console.error('❌ Échec du nettoyage :', err)
    process.exit(1)
  }

  warnInvalidEntries()

  // 2. Création de l'utilisateur seed
  console.log("👤 Création de l'utilisateur seed...")
  // biome-ignore lint: toto
  let user
  try {
    user = await getOrCreateSeedUser()
    console.log(`✅ Utilisateur seed : ${user.email} (${user.id})\n`)
  } catch (err) {
    console.error('❌ Échec création utilisateur :', err)
    process.exit(1)
  }
  const userId = user.id

  // 3. Entités de base (CRITIQUES : arrêt si erreur)
  const productResult = await seedBatch(
    'produits',
    [...allProductData],
    (p) => createProduct(userId, p, db),
    (p) => p.slug,
    true // critical
  )

  const tagResult = await seedBatch(
    'tags',
    tagData,
    (t) => createTag(db, t),
    (t) => t.slug,
    true // critical
  )

  const ingredientResult = await seedBatch(
    'ingrédients',
    ingredientData,
    (ing) => createIngredient(userId, ing, db),
    (ing) => ing.slug,
    true // critical
  )

  // 4. Récupération des IDs réels
  console.log('\n📊 Récupération des IDs...')
  let allProducts: { id: string; slug: string }[]
  let allTags: { id: string; slug: string }[]
  let allIngredients: { id: string; slug: string }[]

  try {
    ;[allProducts, allTags, allIngredients] = await Promise.all([
      db.select({ id: products.id, slug: products.slug }).from(products),
      db.select({ id: tags.id, slug: tags.slug }).from(tags),
      db.select({ id: ingredients.id, slug: ingredients.slug }).from(ingredients),
    ])
  } catch (err) {
    console.error('❌ Échec récupération des IDs :', err)
    process.exit(1)
  }

  console.log(`   Produits : ${allProducts.length}`)
  console.log(`   Tags : ${allTags.length}`)
  console.log(`   Ingrédients : ${allIngredients.length}`)

  // 5. Construction des Maps
  const productSlugToId = new Map(allProducts.map((p) => [p.slug, p.id]))
  const tagSlugToId = new Map(allTags.map((t) => [t.slug, t.id]))
  const ingredientSlugToId = new Map(allIngredients.map((i) => [i.slug, i.id]))

  // 6. Validation des relations productTags
  console.log('\n🔗 Préparation des relations produit-tags...')
  const productTagPairs = flattenTagGroups(allProductTagsMap as Record<string, ProductTagGroups>)

  // Vérifie les slugs manquants AVANT d'insérer
  const missingProducts = new Set<string>()
  const missingTags = new Set<string>()

  for (const { slug, tagSlug } of productTagPairs) {
    if (!productSlugToId.has(slug)) missingProducts.add(slug)
    if (!tagSlugToId.has(tagSlug)) missingTags.add(tagSlug)
  }

  if (missingProducts.size > 0) {
    console.error(`\n❌ ${missingProducts.size} produit(s) référencés mais non créés :`)
    missingProducts.forEach((p) => console.error(`   - ${p}`))
  }

  if (missingTags.size > 0) {
    console.error(`\n❌ ${missingTags.size} tag(s) référencés mais non créés :`)
    missingTags.forEach((t) => console.error(`   - ${t}`))
  }

  if (missingProducts.size > 0 || missingTags.size > 0) {
    console.error('\n🛑 Seed interrompu : relations invalides')
    process.exit(1)
  }

  // Vérifie les doublons
  try {
    validateNoDuplicates(productTagPairs, 'productTags')
  } catch (err) {
    console.error('\n' + (err as Error).message)
    process.exit(1)
  }

  // 7. Insertion des productTags
  const productTagResult = await seedBatch(
    'productTags',
    productTagPairs,
    ({ slug: productSlug, tagSlug }) => {
      const productId = productSlugToId.get(productSlug)!
      const tagId = tagSlugToId.get(tagSlug)!
      return addTagToProduct(db, productId, tagId)
    },
    ({ slug, tagSlug }) => `${slug} ↔ ${tagSlug}`
  )

  // 8. Relations product ↔ ingredient
  console.log('\n🔗 Préparation des relations produit-ingrédients...')
  const validProductIngredients = allIngredientProductTags.filter((i) => !!i.ingredientSlug)

  // Vérifie les slugs manquants
  const missingProdIng = new Set<string>()
  const missingIng = new Set<string>()

  for (const { productSlug, ingredientSlug } of validProductIngredients) {
    if (!productSlugToId.has(productSlug)) missingProdIng.add(productSlug)
    if (!ingredientSlugToId.has(ingredientSlug!)) missingIng.add(ingredientSlug!)
  }

  if (missingProdIng.size > 0) {
    console.error(`\n❌ ${missingProdIng.size} produit(s) manquants :`)
    missingProdIng.forEach((p) => console.error(`   - ${p}`))
  }

  if (missingIng.size > 0) {
    console.error(`\n❌ ${missingIng.size} ingrédient(s) manquants :`)
    missingIng.forEach((i) => console.error(`   - ${i}`))
  }

  if (missingProdIng.size > 0 || missingIng.size > 0) {
    console.error('\n🛑 Seed interrompu : relations invalides')
    process.exit(1)
  }

  const productIngResult = await seedBatch(
    'productIngredients',
    validProductIngredients,
    ({ productSlug, ingredientSlug, notes, concentrationValue, concentrationUnit }) => {
      const productId = productSlugToId.get(productSlug)!
      const ingredientId = ingredientSlugToId.get(ingredientSlug!)!

      const toNumeric = (val: unknown): string | null => {
        if (val == null) return null
        const str = String(val).trim()
        if (str === '' || str === 'null' || str === 'undefined') return null
        const num = Number(str)
        if (isNaN(num)) return null
        return str
      }

      const toText = (val: unknown): string | null => {
        if (val == null) return null
        const str = String(val).trim()
        return str === '' || str === 'null' || str === 'undefined' ? null : str
      }

      // Dans le seed :
      return addIngredientToProduct(db, {
        productId,
        ingredientId,
        notes: toText(notes),
        concentrationValue: toNumeric(concentrationValue),
        concentrationUnit: toText(concentrationUnit),
        concentrationPer: null,
      })
    },
    ({ productSlug, ingredientSlug }) => `${productSlug} ↔ ${ingredientSlug}`
  )
  // 9. Relations ingredient ↔ tag
  console.log('\n🔗 Préparation des relations ingrédient-tags...')
  const ingredientTagPairs = flattenTagGroups(ingredientTagMap as Record<string, ProductTagGroups>)

  // Vérifie les slugs manquants
  const missingIngForTag = new Set<string>()
  const missingTagForIng = new Set<string>()

  for (const { slug: ingredientSlug, tagSlug } of ingredientTagPairs) {
    if (!ingredientSlugToId.has(ingredientSlug)) missingIngForTag.add(ingredientSlug)
    if (!tagSlugToId.has(tagSlug)) missingTagForIng.add(tagSlug)
  }

  if (missingIngForTag.size > 0) {
    console.error(`\n❌ ${missingIngForTag.size} ingrédient(s) manquants :`)
    missingIngForTag.forEach((i) => console.error(`   - ${i}`))
  }

  if (missingTagForIng.size > 0) {
    console.error(`\n❌ ${missingTagForIng.size} tag(s) manquants :`)
    missingTagForIng.forEach((t) => console.error(`   - ${t}`))
  }

  if (missingIngForTag.size > 0 || missingTagForIng.size > 0) {
    console.error('\n🛑 Seed interrompu : relations invalides')
    process.exit(1)
  }

  try {
    validateNoDuplicates(ingredientTagPairs, 'ingredientTags')
  } catch (err) {
    console.error('\n' + (err as Error).message)
    process.exit(1)
  }

  const ingredientTagResult = await seedBatch(
    'ingredientTags',
    ingredientTagPairs,
    ({ slug: ingredientSlug, tagSlug }) => {
      const ingredientId = ingredientSlugToId.get(ingredientSlug)!
      const tagId = tagSlugToId.get(tagSlug)!
      return addTagToIngredient(db, ingredientId, tagId)
    },
    ({ slug, tagSlug }) => `${slug} ↔ ${tagSlug}`
  )

  // 10. Résumé final
  console.log('\n' + '─'.repeat(50))
  console.log('📋 RÉSUMÉ DU SEED')
  console.log('─'.repeat(50))
  console.log(`Produits      : ${productResult.success}/${allProductData.length} ✅`)
  console.log(`Tags          : ${tagResult.success}/${tagData.length} ✅`)
  console.log(`Ingrédients   : ${ingredientResult.success}/${ingredientData.length} ✅`)
  console.log(
    `ProductTags   : ${productTagResult.success}/${productTagPairs.length} ${productTagResult.failed.length > 0 ? '⚠️' : '✅'}`
  )
  console.log(
    `ProductIng    : ${productIngResult.success}/${validProductIngredients.length} ${productIngResult.failed.length > 0 ? '⚠️' : '✅'}`
  )
  console.log(
    `IngredientTags: ${ingredientTagResult.success}/${ingredientTagPairs.length} ${ingredientTagResult.failed.length > 0 ? '⚠️' : '✅'}`
  )

  const totalFailed =
    productResult.failed.length +
    tagResult.failed.length +
    ingredientResult.failed.length +
    productTagResult.failed.length +
    productIngResult.failed.length +
    ingredientTagResult.failed.length

  if (totalFailed > 0) {
    console.log(`\n⚠️  ${totalFailed} erreur(s) non critique(s) - Seed terminé avec avertissements`)
    process.exit(0)
  }

  console.log('\n✨ Seed terminé avec succès !')
}

seed().catch((err) => {
  console.error('\n💥 Erreur fatale non gérée :', err)
  process.exit(1)
})
