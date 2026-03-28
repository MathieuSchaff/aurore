import { createIngredient } from '../../features/products/ingredients/service'
import { addIngredientToProduct } from '../../features/products/product-ingredients/product-ingredients.service'
import { createProduct } from '../../features/products/service'
import {
  addTagToIngredient,
  addTagToProduct,
  createTag,
} from '../../features/products/tags/tags.service'
import { db } from '..'
import { getOrCreateSeedUser } from './create-user'
import { ingredientTagMap } from './IngredientsTags/seed-ingredients-tags'
import { ingredientData } from './ingredients/ingredient-data'
import { printValidationReport, validateAllIngredients } from './markdown-validator'
import { allProductData } from './products'
import { allIngredientProductTags } from './products/ingredients-products-tags'
import { allProductTagsMap } from './products/product-tags'
import { tagData } from './tags/seed-tags'
import {
  cleanDatabase,
  fetchIdMaps,
  flattenTagGroups,
  type ProductTagGroups,
  seedBatch,
  toNumeric,
  toText,
} from './utils'

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
      `Doublons détectés dans ${label}:\n${duplicates.map((d) => `  - ${d}`).join('\n')}`
    )
  }
}

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

// ── Fonction Principale ───────────────────────────────────────────────────────

export async function seedCore(shouldClean = true) {
  console.log('🌱 Démarrage du seed CORE (Données de base + Produits manuels)...\n')

  if (shouldClean) {
    warnInvalidEntries()
    await cleanDatabase()
  }

  console.log("👤 Création de l'utilisateur seed...")
  const user = await getOrCreateSeedUser()
  console.log(`✅ Utilisateur seed : ${user.email} (${user.id})\n`)

  // 1. Validation Markdown & Ingrédients
  console.log('🔍 Validation du markdown des ingrédients...')
  const ingredientValidation = validateAllIngredients(ingredientData)
  printValidationReport(ingredientValidation)

  if (ingredientValidation.summary.valid === 0 && ingredientData.length > 0) {
    throw new Error('Aucun ingrédient valide - Seed interrompu')
  }
  const correctedIngredientData = ingredientValidation.fixed

  // 2. Insertion des Entités Principales
  await seedBatch(
    'tags',
    tagData,
    (t) => createTag(db, t),
    (t) => t.slug,
    true
  )

  await seedBatch(
    'ingrédients',
    correctedIngredientData,
    (ing) => createIngredient(user.id, ing, db),
    (ing) => ing.slug,
    true
  )

  await seedBatch(
    'produits (manuels)',
    [...allProductData],
    (p) => createProduct(user.id, p, db),
    (p) => p.slug,
    true
  )

  // 3. Relations
  const { productSlugToId, tagSlugToId, ingredientSlugToId } = await fetchIdMaps()

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

  await seedBatch(
    'productTags',
    productTagPairs,
    ({ slug, tagSlug }) =>
      addTagToProduct(db, productSlugToId.get(slug)!, tagSlugToId.get(tagSlug)!),
    ({ slug, tagSlug }) => `${slug} ↔ ${tagSlug}`
  )

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

  await seedBatch(
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

  await seedBatch(
    'ingredientTags',
    ingredientTagPairs,
    ({ slug, tagSlug }) =>
      addTagToIngredient(db, ingredientSlugToId.get(slug)!, tagSlugToId.get(tagSlug)!),
    ({ slug, tagSlug }) => `${slug} ↔ ${tagSlug}`
  )

  console.log('\n✨ Seed CORE terminé avec succès !\n')
}

// Auto-exécution si lancé directement
if (import.meta.main || process.argv[1]?.endsWith('seed-core.ts')) {
  seedCore().catch((err) => {
    console.error('\n💥 Erreur fatale :', err instanceof Error ? err.message : err)
    process.exit(1)
  })
}
