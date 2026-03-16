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
import { printValidationReport, validateAllIngredients } from './markdown-validator'
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

// ── Utilitaires de Formatage ──────────────────────────────────────────────────

function toNull(value: string | null | undefined): string | null {
  if (value === null || value === undefined || value === '') return null
  return value
}

function toNumeric(val: unknown): string | null {
  if (val == null) return null
  const str = String(val).trim()
  if (str === '' || str === 'null' || str === 'undefined') return null
  const num = Number(str)
  if (isNaN(num)) return null
  return str
}

function toText(val: unknown): string | null {
  if (val == null) return null
  const str = String(val).trim()
  return str === '' || str === 'null' || str === 'undefined' ? null : str
}

function flattenTagGroups(
  map: Record<string, ProductTagGroups>
): Array<{ slug: string; tagSlug: string }> {
  return Object.entries(map).flatMap(([slug, groups]) => {
    const allTagSlugs = [...groups.primary, ...groups.secondary, ...groups.avoid]
    return allTagSlugs.map((tagSlug) => ({ slug, tagSlug }))
  })
}

// ── Utilitaires de Validation ─────────────────────────────────────────────────

function warnInvalidEntries() {
  const invalid = allIngredientProductTags.filter((i) => !i.ingredientSlug)
  if (invalid.length === 0) return

  console.warn(`\n⚠️  ${invalid.length} entrée(s) avec ingredientSlug manquant :`)
  invalid.forEach((i) => console.warn(`  → product=${i.productSlug}`))
  console.warn('  Vérifie que la propriété est bien nommée "slug" dans les fichiers source.\n')
}

function validateNoDuplicates(
  pairs: Array<{ slug: string; tagSlug: string }>,
  label: string
): void {
  const seen = new Set<string>()
  const duplicates: string[] = []

  for (const { slug, tagSlug } of pairs) {
    const key = `${slug}::${tagSlug}`
    if (seen.has(key)) duplicates.push(`${slug} ↔ ${tagSlug}`)
    seen.add(key)
  }

  if (duplicates.length > 0) {
    throw new Error(
      `Doublons détectés dans ${label}:\n` + duplicates.map((d) => `  - ${d}`).join('\n')
    )
  }
}

/**
 * Vérifie génériquement si des entités référencées dans des relations existent bien.
 */
function validateRelationshipSlugs(
  pairs: any[],
  leftSlugField: string,
  rightSlugField: string,
  leftMap: Map<string, string>,
  rightMap: Map<string, string>,
  leftEntityName: string,
  rightEntityName: string
) {
  const missingLeft = new Set<string>()
  const missingRight = new Set<string>()

  for (const pair of pairs) {
    const leftSlug = pair[leftSlugField]
    const rightSlug = pair[rightSlugField]
    if (!leftMap.has(leftSlug)) missingLeft.add(leftSlug)
    if (!rightMap.has(rightSlug)) missingRight.add(rightSlug)
  }

  if (missingLeft.size > 0) {
    console.error(`\n❌ ${missingLeft.size} ${leftEntityName}(s) référencés mais non créés :`)
    missingLeft.forEach((s) => console.error(`   - ${s}`))
  }

  if (missingRight.size > 0) {
    console.error(`\n❌ ${missingRight.size} ${rightEntityName}(s) référencés mais non créés :`)
    missingRight.forEach((s) => console.error(`   - ${s}`))
  }

  if (missingLeft.size > 0 || missingRight.size > 0) {
    throw new Error('Relations invalides : Entités manquantes.')
  }
}

// ── Fonctions de Seed ─────────────────────────────────────────────────────────

async function seedBatch<T>(
  label: string,
  items: T[],
  fn: (item: T) => Promise<unknown>,
  identify: (item: T) => string,
  critical: boolean = false
): Promise<{ success: number; failed: SeedError[]; total: number }> {
  const results = await Promise.allSettled(
    items.map(async (item) => {
      try {
        await fn(item)
        return { success: true, item }
      } catch (err) {
        throw { item: identify(item), reason: err instanceof Error ? err.message : String(err) }
      }
    })
  )

  const failed: SeedError[] = []
  let successCount = 0

  for (const result of results) {
    if (result.status === 'fulfilled') successCount++
    else failed.push(result.reason as SeedError)
  }

  if (failed.length > 0) {
    console.error(`\n❌ ${failed.length}/${items.length} ${label} échoué(s) :`)
    failed.forEach((f, i) => console.error(`  ${i + 1}. [${f.item}]\n      → ${f.reason}`))

    if (critical) {
      throw new Error(`Seed interrompu : ${label} contient des erreurs critiques`)
    }
  } else {
    console.log(`✅ ${successCount} ${label} créé(s)`)
  }

  return { success: successCount, failed, total: items.length }
}

async function cleanDatabase() {
  console.log('🧹 Nettoyage de la base de données...')
  await db.delete(productTags)
  await db.delete(productIngredients)
  await db.delete(ingredientTags)
  await db.delete(products)
  await db.delete(ingredients)
  await db.delete(tags)
  console.log('✅ Base nettoyée\n')
}

async function fetchIdMaps() {
  console.log('\n📊 Récupération des IDs...')
  const [allProducts, allTags, allIngredients] = await Promise.all([
    db.select({ id: products.id, slug: products.slug }).from(products),
    db.select({ id: tags.id, slug: tags.slug }).from(tags),
    db.select({ id: ingredients.id, slug: ingredients.slug }).from(ingredients),
  ])

  console.log(
    `   Produits : ${allProducts.length} | Tags : ${allTags.length} | Ingrédients : ${allIngredients.length}`
  )

  return {
    productSlugToId: new Map(allProducts.map((p) => [p.slug, p.id])),
    tagSlugToId: new Map(allTags.map((t) => [t.slug, t.id])),
    ingredientSlugToId: new Map(allIngredients.map((i) => [i.slug, i.id])),
  }
}

// ── Fonction Principale ───────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Démarrage du seed...\n')

  // 1. Préparation et Nettoyage
  warnInvalidEntries()
  await cleanDatabase()

  console.log("👤 Création de l'utilisateur seed...")
  const user = await getOrCreateSeedUser()
  console.log(`✅ Utilisateur seed : ${user.email} (${user.id})\n`)

  // 2. Validation Markdown
  console.log('🔍 Validation du markdown des ingrédients...')
  const ingredientValidation = validateAllIngredients(ingredientData)
  printValidationReport(ingredientValidation)

  if (ingredientValidation.summary.valid === 0 && ingredientData.length > 0) {
    throw new Error('Aucun ingrédient valide - Seed interrompu')
  }
  const correctedIngredientData = ingredientValidation.fixed

  // 3. Insertion des Entités Principales (Critiques)
  const productResult = await seedBatch(
    'produits',
    [...allProductData],
    (p) => createProduct(user.id, p, db),
    (p) => p.slug,
    true
  )

  const tagResult = await seedBatch(
    'tags',
    tagData,
    (t) => createTag(db, t),
    (t) => t.slug,
    true
  )

  const ingredientResult = await seedBatch(
    'ingrédients',
    correctedIngredientData,
    (ing) => createIngredient(user.id, ing, db),
    (ing) => ing.slug,
    true
  )

  // 4. Récupération des ID pour les relations
  const { productSlugToId, tagSlugToId, ingredientSlugToId } = await fetchIdMaps()

  // 5. Relations : Produit ↔ Tags
  console.log('\n🔗 Préparation des relations produit-tags...')
  const productTagPairs = flattenTagGroups(allProductTagsMap as Record<string, ProductTagGroups>)
  validateRelationshipSlugs(
    productTagPairs,
    'slug',
    'tagSlug',
    productSlugToId,
    tagSlugToId,
    'Produit',
    'Tag'
  )
  validateNoDuplicates(productTagPairs, 'productTags')

  const productTagResult = await seedBatch(
    'productTags',
    productTagPairs,
    ({ slug, tagSlug }) =>
      addTagToProduct(db, productSlugToId.get(slug)!, tagSlugToId.get(tagSlug)!),
    ({ slug, tagSlug }) => `${slug} ↔ ${tagSlug}`
  )

  // 6. Relations : Produit ↔ Ingrédients
  console.log('\n🔗 Préparation des relations produit-ingrédients...')
  const validProductIngredients = allIngredientProductTags.filter((i) => !!i.ingredientSlug)
  validateRelationshipSlugs(
    validProductIngredients,
    'productSlug',
    'ingredientSlug',
    productSlugToId,
    ingredientSlugToId,
    'Produit',
    'Ingrédient'
  )

  const productIngResult = await seedBatch(
    'productIngredients',
    validProductIngredients,
    ({ productSlug, ingredientSlug, notes, concentrationValue, concentrationUnit }) =>
      addIngredientToProduct(db, {
        productId: productSlugToId.get(productSlug)!,
        ingredientId: ingredientSlugToId.get(ingredientSlug!)!,
        notes: toText(notes),
        concentrationValue: toNumeric(concentrationValue),
        concentrationUnit: toText(concentrationUnit),
        concentrationPer: null,
      }),
    ({ productSlug, ingredientSlug }) => `${productSlug} ↔ ${ingredientSlug}`
  )

  // 7. Relations : Ingrédient ↔ Tags
  console.log('\n🔗 Préparation des relations ingrédient-tags...')
  const ingredientTagPairs = flattenTagGroups(ingredientTagMap as Record<string, ProductTagGroups>)
  validateRelationshipSlugs(
    ingredientTagPairs,
    'slug',
    'tagSlug',
    ingredientSlugToId,
    tagSlugToId,
    'Ingrédient',
    'Tag'
  )
  validateNoDuplicates(ingredientTagPairs, 'ingredientTags')

  const ingredientTagResult = await seedBatch(
    'ingredientTags',
    ingredientTagPairs,
    ({ slug, tagSlug }) =>
      addTagToIngredient(db, ingredientSlugToId.get(slug)!, tagSlugToId.get(tagSlug)!),
    ({ slug, tagSlug }) => `${slug} ↔ ${tagSlug}`
  )

  // 8. Bilan Final
  console.log('\n' + '─'.repeat(50))
  console.log('📋 RÉSUMÉ DU SEED')
  console.log('─'.repeat(50))

  const printBilan = (label: string, res: any) => {
    const icon = res.failed.length > 0 ? '⚠️' : '✅'
    console.log(`${label.padEnd(16)}: ${res.success}/${res.total} ${icon}`)
  }

  printBilan('Produits', productResult)
  printBilan('Tags', tagResult)
  printBilan('Ingrédients', ingredientResult)
  printBilan('ProductTags', productTagResult)
  printBilan('ProductIng', productIngResult)
  printBilan('IngredientTags', ingredientTagResult)

  const totalFailed = [
    productResult,
    tagResult,
    ingredientResult,
    productTagResult,
    productIngResult,
    ingredientTagResult,
  ].reduce((acc, curr) => acc + curr.failed.length, 0)

  if (totalFailed > 0) {
    console.log(`\n⚠️  ${totalFailed} erreur(s) non critique(s) - Seed terminé avec avertissements`)
    process.exit(0)
  }

  console.log('\n✨ Seed terminé avec succès !')
}

// Lancement avec gestion globale des erreurs
seed().catch((err) => {
  console.error('\n💥 Erreur fatale non gérée :', err instanceof Error ? err.message : err)
  process.exit(1)
})
