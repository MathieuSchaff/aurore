import { INGREDIENT_CATEGORY_VALUES } from '@habit-tracker/shared'
import { createIngredient } from '../../features/ingredients/service'
import { addIngredientToProduct } from '../../features/products/product-ingredients/product-ingredients.service'
import { createProduct } from '../../features/products/service'
import { addTagToIngredient, addTagToProduct } from '../../features/tags/tags.service'
import { db } from '..'
import { ingredientDermoProfiles, ingredientTagsDefs, productTagsDefs } from '../schema'
import { getOrCreateSeedUser } from './create-user'
import { ingredientTagMap } from './IngredientsTags/seed-ingredients-tags'
import { ingredientData } from './ingredients'
import { FILLER_SLUGS } from './ingredients/skincare/seed-dermo-profiles-fillers'
import { printValidationReport, validateAllIngredients } from './markdown-validator'
import { allProductData } from './products'
import { allIngredientProductTags } from './products/ingredients-products-tags'
import { allProductTagsMap } from './products/product-tags'
import { ingredientTagData, productTagData } from './tags/seed-tags'
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

// Dedupe (slug, tagSlug) pairs — keeps the first relevance seen. Silent
// collapse instead of throwing: the obsolete-tag remap and the native
// category backfill both legitimately produce identical pairs, and the
// DB treats a re-tag as idempotent.
function dedupPairs<T extends { slug: string; tagSlug: string }>(pairs: T[], label: string): T[] {
  const seen = new Set<string>()
  const kept: T[] = []
  for (const pair of pairs) {
    const key = `${pair.slug}::${pair.tagSlug}`
    if (seen.has(key)) continue
    seen.add(key)
    kept.push(pair)
  }
  const dupes = pairs.length - kept.length
  if (dupes > 0) console.log(`ℹ️  ${dupes} doublon(s) ${label} fusionné(s)`)
  return kept
}

// Filters a relationship pair list to rows whose left AND right slug
// resolved to a created entity. Unresolved slugs are reported once per
// entity as warnings — the seed keeps going with the valid subset instead
// of aborting on the first stale reference.
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
    missingLeft.forEach((s) => console.warn(`   - ${s}`))
  }

  if (missingRight.size > 0) {
    console.warn(
      `\n⚠️  ${missingRight.size} ${rightEntityName}(s) référencés mais non créés (ignorés) :`
    )
    missingRight.forEach((s) => console.warn(`   - ${s}`))
  }

  return kept
}

// ── Fonction Principale ───────────────────────────────────────────────────────

export async function seedCore(shouldClean = true) {
  console.log('🌱 Démarrage du seed CORE (Données de base + Produits manuels)...\n')

  // These run outside the transaction: clean first, then atomically insert everything
  if (shouldClean) {
    warnInvalidEntries()
    await cleanDatabase()
  }

  console.log("👤 Création de l'utilisateur seed...")
  const user = await getOrCreateSeedUser()
  console.log(`✅ Utilisateur seed : ${user.email} (${user.id})\n`)

  // Validate markdown before touching the DB
  console.log('🔍 Validation du markdown des ingrédients...')
  const ingredientValidation = validateAllIngredients(ingredientData)
  printValidationReport(ingredientValidation)

  if (ingredientValidation.summary.valid === 0 && ingredientData.length > 0) {
    throw new Error('Aucun ingrédient valide - Seed interrompu')
  }
  const correctedIngredientData = ingredientValidation.fixed

  // Prepare relation pairs (pure data, no DB) so we can validate before the transaction
  const productTagPairs = dedupPairs(
    flattenTagGroups(allProductTagsMap as Record<string, ProductTagGroups>),
    'productTags'
  )

  const validProductIngredients = allIngredientProductTags.filter((i) => !!i.ingredientSlug)

  const rawIngredientTagPairs = flattenTagGroups(
    ingredientTagMap as Record<string, ProductTagGroups>
  )

  // Drop entries whose tagSlug resolved to `undefined` — these originate
  // from `TAG_SLUGS.FOO` references in ingredientTagMap pointing at slugs
  // removed during the tag split (AJUSTEUR_PH, SOLVANT, AHA, ACNE…). We
  // warn once with a unique key list so the taxonomy can be reconciled
  // manually; the seed keeps running.
  const droppedTagKeys = new Set<string>()
  const ingredientTagPairs = rawIngredientTagPairs.filter((p) => {
    if (typeof p.tagSlug !== 'string' || p.tagSlug.length === 0) {
      droppedTagKeys.add(String(p.tagSlug))
      return false
    }
    return true
  })
  if (droppedTagKeys.size > 0) {
    console.warn(
      `⚠️  ${rawIngredientTagPairs.length - ingredientTagPairs.length} pair(s) ingredientTags ignorée(s) — slugs inexistants: ${[...droppedTagKeys].join(', ')}`
    )
  }

  // Backfill: every ingredient with a native `category` matching an
  // ingredient_attribute slug (actif, humectant, emollient, filtre-uv,
  // tensioactif, excipient…) gets a synthetic 'primary' tag pair if the
  // manual map doesn't already list it. This way the attribute filter
  // bucket stays in sync with the native column without hand-editing
  // hundreds of entries. The shared-schemas-vs-tags test guarantees
  // INGREDIENT_CATEGORY_VALUES ↔ ingredient_attribute tag slugs.
  const existing = new Set(
    ingredientTagPairs.map((p) => `${p.slug}::${p.tagSlug}`)
  )
  // Whitelist of skincare formulation roles that exist as ingredient_attribute
  // tag slugs. Supplement ingredients store their functional class in the same
  // `category` column (carotenoide, plante, neuroactif…) — skip them here so
  // the backfill never emits tags that aren't in the ingredient taxonomy.
  const validCategorySlugs = new Set<string>(INGREDIENT_CATEGORY_VALUES)
  let backfilled = 0
  for (const ing of correctedIngredientData) {
    const category = ing.category
    if (!category) continue
    if (!validCategorySlugs.has(category)) continue
    const key = `${ing.slug}::${category}`
    if (existing.has(key)) continue
    ingredientTagPairs.push({ slug: ing.slug, tagSlug: category, relevance: 'primary' })
    existing.add(key)
    backfilled++
  }
  if (backfilled > 0) {
    console.log(`🔁 Backfill: +${backfilled} ingredient_attribute tags depuis la colonne native`)
  }

  const dedupedIngredientTagPairs = dedupPairs(ingredientTagPairs, 'ingredientTags')

  // All inserts are atomic: if anything fails mid-way the DB rolls back cleanly
  await db.transaction(async (tx) => {
    // 1. Tag definitions (ingredient + product domains are independent).
    // Bulk insert bypasses per-row service calls because seed data is already
    // in the `{slug, label, tagType}` shape the schema expects.
    if (ingredientTagData.length > 0) {
      await tx.insert(ingredientTagsDefs).values(ingredientTagData)
    }
    console.log(`✅ ${ingredientTagData.length} ingredient_tags créés`)

    if (productTagData.length > 0) {
      await tx.insert(productTagsDefs).values(productTagData)
    }
    console.log(`✅ ${productTagData.length} product_tags créés`)

    await seedBatch(
      'ingrédients',
      correctedIngredientData,
      (ing) => createIngredient(tx, user.id, ing),
      (ing) => ing.slug,
      true
    )

    await seedBatch(
      'produits (manuels)',
      [...allProductData],
      (p) => createProduct(user.id, p, tx),
      (p) => p.slug ?? p.name,
      true
    )

    // 2. Fetch IDs of just-inserted entities within the same transaction
    const {
      productSlugToId,
      productTagSlugToId,
      ingredientTagSlugToId,
      ingredientSlugToId,
    } = await fetchIdMaps(tx)

    // 3. Relations
    console.log('\n🔗 Préparation des relations produit-tags...')
    const prunedProductTagPairs = pruneRelationshipPairs(
      productTagPairs,
      'slug',
      'tagSlug',
      productSlugToId,
      productTagSlugToId,
      'Produit',
      'ProductTag'
    )

    await seedBatch(
      'productTags',
      prunedProductTagPairs,
      ({ slug, tagSlug, relevance }) =>
        addTagToProduct(tx, productSlugToId.get(slug)!, productTagSlugToId.get(tagSlug)!, relevance),
      ({ slug, tagSlug }) => `${slug} ↔ ${tagSlug}`
    )

    console.log('\n🔗 Préparation des relations produit-ingrédients...')
    const prunedProductIngredients = pruneRelationshipPairs(
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
      prunedProductIngredients,
      ({ productSlug, ingredientSlug, notes, concentrationValue, concentrationUnit }) =>
        addIngredientToProduct(tx, {
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
    const prunedIngredientTagPairs = pruneRelationshipPairs(
      dedupedIngredientTagPairs,
      'slug',
      'tagSlug',
      ingredientSlugToId,
      ingredientTagSlugToId,
      'Ingrédient',
      'IngredientTag'
    )

    await seedBatch(
      'ingredientTags',
      prunedIngredientTagPairs,
      ({ slug, tagSlug, relevance }) =>
        addTagToIngredient(
          tx,
          ingredientSlugToId.get(slug)!,
          ingredientTagSlugToId.get(tagSlug)!,
          relevance
        ),
      ({ slug, tagSlug }) => `${slug} ↔ ${tagSlug}`
    )

    // 4. Dermo profiles — mark all fillers
    console.log('\n🧪 Seed des profils dermo fillers...')
    const fillerProfiles = FILLER_SLUGS.flatMap((slug) => {
      const id = ingredientSlugToId.get(slug)
      if (!id) return []
      return [{ ingredientId: id, isFiller: true }]
    })

    if (fillerProfiles.length > 0) {
      await tx
        .insert(ingredientDermoProfiles)
        .values(fillerProfiles)
        .onConflictDoUpdate({
          target: ingredientDermoProfiles.ingredientId,
          set: { isFiller: true },
        })
      console.log(`✅ ${fillerProfiles.length} profils dermo fillers insérés`)
    }

    const missingFillers = FILLER_SLUGS.filter((s) => !ingredientSlugToId.has(s))
    if (missingFillers.length > 0) {
      console.warn(`⚠️  ${missingFillers.length} slugs fillers non trouvés en DB :`)
      missingFillers.forEach((s) => console.warn(`   - ${s}`))
    }
  })

  console.log('\n✨ Seed CORE terminé avec succès !\n')
}

// Auto-exécution si lancé directement
if (import.meta.main || process.argv[1]?.endsWith('seed-core.ts')) {
  seedCore().catch((err) => {
    console.error('\n💥 Erreur fatale :', err instanceof Error ? err.message : err)
    process.exit(1)
  })
}
