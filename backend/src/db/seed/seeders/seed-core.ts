import slugify from '@sindresorhus/slugify'
import { count, eq, sql } from 'drizzle-orm'

import { createIngredient } from '../../../features/ingredients/service'
import { createProduct } from '../../../features/products/service'
import { type DatabaseTransaction, db } from '../..'
import {
  brandCertifications,
  ingredientDermoProfiles,
  ingredients,
  ingredientTagLinks,
  ingredientTagTypes,
  productIngredients,
  products,
  productTagLinks,
  productTagTypes,
} from '../../schema'
import { BRAND_CERTIFICATION_INSERTS } from '../data/brand-certifications'
import { ingredientTagMap } from '../data/ingredient-tags'
import { ingredientData } from '../data/ingredients'
import { FILLER_SLUGS } from '../data/ingredients/skincare/seed-dermo-profiles-fillers'
import { allIngredientProductTags, allProductData, allProductTagsMap } from '../data/products'
import { ingredientTagData, productTagData } from '../data/tags'
import { type ProductTagGroups, seedBatch } from '../utils/batch'
import { cleanDatabase, fetchIdMaps, flattenTagGroups } from '../utils/id-maps'
import {
  type IngredientSeed,
  printValidationReport,
  validateAllIngredients,
} from '../utils/markdown-validator'
import { getOrCreateSeedUser } from './create-user'
import { linkIngredientTags, linkProductIngredients, linkProductTags } from './link-seed-relations'
import { planIngredientTagPairs, printIngredientTagPlan } from './plan-ingredient-tag-pairs'
import { planProductTagPairs, printProductTagPlan } from './plan-product-tag-pairs'
import { seedBlog } from './seed-blog'
import { seedTestUsers } from './seed-test-users'
import { seedUserCollection } from './seed-user-collection'

interface ExistingSeedState {
  ingredientSlugs: Set<string>
  productSlugs: Set<string>
  tagProductPairs: Set<string>
  tagIngredientPairs: Set<string>
  productIngredientPairs: Set<string>
}

// Reproduces createProduct's slug derivation for filtering (input.slug ??
// `${name}-${brand}`, then slugify). Needed because seed product entries can
// omit slug: the filter against existingProductSlugs has to compare the
// same canonical form the insert path would produce.
function computeProductSlug(input: { name: string; brand: string; slug?: string }): string {
  const name = input.name.trim().replace(/\s+/g, ' ')
  const brand = input.brand.trim().replace(/\s+/g, ' ')
  const raw = input.slug ?? `${name}${brand ? `-${brand}` : ''}`
  return slugify(raw)
}

function warnInvalidEntries() {
  const invalid = allIngredientProductTags.filter((i) => !i.ingredientSlug)
  if (invalid.length === 0) return

  console.warn(`\n⚠️  ${invalid.length} entrée(s) avec ingredientSlug manquant :`)
  for (const i of invalid) {
    console.warn(`  → product=${i.productSlug}`)
  }
  console.warn('  Vérifie que la propriété est bien nommée "slug" dans les fichiers source.\n')
}

// Mismatch guard: if the target DB already holds more products than the
// JS seed files would insert, the operator probably wired the wrong DB
// (e.g. dev instead of test). Refuse unless SEED_FORCE_RESET=1. The
// 2026-05-07 incident: dev DB had 3137 snapshot products, seed had 469,
// and the truncate destroyed 2668 rows.
async function assertResetTargetsSeedDatabase(tx: DatabaseTransaction): Promise<void> {
  const [{ value: dbProductCount }] = await tx.select({ value: count() }).from(products)
  const seedProductCount = allProductData.length
  if (dbProductCount > seedProductCount && process.env.SEED_FORCE_RESET !== '1') {
    throw new Error(
      `Refus du --reset : la DB cible contient ${dbProductCount} produits, le seed JS n'en fournit que ${seedProductCount}. ` +
        `Vraisemblablement la mauvaise DB (dev au lieu de test ?). ` +
        `Si tu es sûr, relance avec SEED_FORCE_RESET=1. ` +
        `Pour récupérer une DB dev écrasée : just db-snapshot-load.`
    )
  }
}

// Idempotent mode can't rely on per-row try/catch: `seedBatch` catches the error, but the
// unique-violation has already aborted the whole Postgres transaction, so every later statement
// fails too. SAVEPOINTs would fix it, but Drizzle's nested-tx counter races ("savepoint sN does
// not exist"). So we fetch existing slugs/pairs up front and filter the seed inputs before insert.
async function readExistingSeedState(
  tx: DatabaseTransaction,
  idempotent: boolean
): Promise<ExistingSeedState> {
  if (!idempotent) {
    return {
      ingredientSlugs: new Set<string>(),
      productSlugs: new Set<string>(),
      tagProductPairs: new Set<string>(),
      tagIngredientPairs: new Set<string>(),
      productIngredientPairs: new Set<string>(),
    }
  }

  console.log('🔎 Lecture de l’état DB existant pour pré-filtrage...')
  const [existIng, existProd, existTagProd, existTagIng, existProdIng] = await Promise.all([
    tx.select({ slug: ingredients.slug }).from(ingredients),
    tx.select({ slug: products.slug }).from(products),
    tx
      .select({ pId: productTagLinks.productId, tId: productTagLinks.productTagId })
      .from(productTagLinks),
    tx
      .select({ iId: ingredientTagLinks.ingredientId, tId: ingredientTagLinks.ingredientTagId })
      .from(ingredientTagLinks),
    tx
      .select({ pId: productIngredients.productId, iId: productIngredients.ingredientId })
      .from(productIngredients),
  ])
  const state: ExistingSeedState = {
    ingredientSlugs: new Set(existIng.map((r) => r.slug)),
    productSlugs: new Set(existProd.map((r) => r.slug)),
    tagProductPairs: new Set(existTagProd.map((r) => `${r.pId}::${r.tId}`)),
    tagIngredientPairs: new Set(existTagIng.map((r) => `${r.iId}::${r.tId}`)),
    productIngredientPairs: new Set(existProdIng.map((r) => `${r.pId}::${r.iId}`)),
  }
  console.log(
    `   Existant : ${state.ingredientSlugs.size} ingrédients · ${state.productSlugs.size} produits · ${state.tagProductPairs.size} tag-products · ${state.tagIngredientPairs.size} tag-ingredients · ${state.productIngredientPairs.size} product-ingredients`
  )
  return state
}

// Validate markdown before touching the DB
function validateIngredientMarkdown(): IngredientSeed[] {
  console.log('🔍 Validation du markdown des ingrédients...')
  const ingredientValidation = validateAllIngredients(ingredientData)
  printValidationReport(ingredientValidation)

  if (ingredientValidation.summary.valid === 0 && ingredientData.length > 0) {
    throw new Error('Aucun ingrédient valide - Seed interrompu')
  }
  return ingredientValidation.fixed
}

// Tag definitions (ingredient + product domains are independent). Bulk insert
// bypasses per-row service calls since seed data is already in the schema's
// `{slug, label, tagType}` shape. `onConflictDoNothing` on the slug unique idx
// lets a later run pick up new slugs without erroring on existing ones.
async function seedTagDefinitions(tx: DatabaseTransaction): Promise<void> {
  if (ingredientTagData.length > 0) {
    await tx.insert(ingredientTagTypes).values(ingredientTagData).onConflictDoNothing({
      target: ingredientTagTypes.slug,
    })
  }
  console.log(`✅ ${ingredientTagData.length} ingredient_tags créés`)

  if (productTagData.length > 0) {
    await tx.insert(productTagTypes).values(productTagData).onConflictDoNothing({
      target: productTagTypes.slug,
    })
  }
  console.log(`✅ ${productTagData.length} product_tags créés`)
}

// Brand-level certifications. Independent of product/tag rows: safe to seed before
// products since the lookup is by free-text brand, not FK. Idempotent via PK upsert;
// running it again after editing the curated list refreshes flags + sources.
async function seedBrandCertificationRows(tx: DatabaseTransaction): Promise<void> {
  if (BRAND_CERTIFICATION_INSERTS.length > 0) {
    await tx
      .insert(brandCertifications)
      .values(BRAND_CERTIFICATION_INSERTS)
      .onConflictDoUpdate({
        target: brandCertifications.brandNormalized,
        set: {
          brandDisplay: sql`excluded.brand_display`,
          isVegan: sql`excluded.is_vegan`,
          isCrueltyFree: sql`excluded.is_cruelty_free`,
          isNaturalCertified: sql`excluded.is_natural_certified`,
          sources: sql`excluded.sources`,
          notes: sql`excluded.notes`,
        },
      })
  }
  console.log(`✅ ${BRAND_CERTIFICATION_INSERTS.length} brand_certifications créés`)
}

async function seedIngredientRows(
  tx: DatabaseTransaction,
  input: {
    userId: string
    seeds: IngredientSeed[]
    existingSlugs: Set<string>
    idempotent: boolean
    shouldUpdate: boolean
  }
): Promise<void> {
  const ingredientsToInsert = input.idempotent
    ? input.seeds.filter((i) => !input.existingSlugs.has(i.slug))
    : input.seeds
  if (input.idempotent) {
    const skipped = input.seeds.length - ingredientsToInsert.length
    console.log(
      `   Ingrédients à insérer : ${ingredientsToInsert.length} (${skipped} déjà en DB, sautés)`
    )
  }

  if (input.shouldUpdate && input.idempotent) {
    const toUpdate = input.seeds.filter((i) => input.existingSlugs.has(i.slug))
    console.log(`   Ingrédients à mettre à jour : ${toUpdate.length}`)
    for (const ing of toUpdate) {
      await tx
        .update(ingredients)
        .set({
          name: ing.name,
          description: ing.description ?? '',
          content: ing.content ?? '',
          category: ing.category ?? null,
        })
        .where(eq(ingredients.slug, ing.slug))
    }
    console.log(`   ✅ ${toUpdate.length} ingrédients mis à jour`)
  }

  await seedBatch(
    'ingrédients',
    ingredientsToInsert,
    (ing) => createIngredient(tx, input.userId, 'admin', ing),
    (ing) => ing.slug,
    true
  )
}

async function seedProductRows(
  tx: DatabaseTransaction,
  input: { userId: string; existingSlugs: Set<string>; idempotent: boolean }
): Promise<void> {
  const allProductsCast = [...allProductData] as Parameters<typeof createProduct>[2][]
  const productsToInsert = input.idempotent
    ? allProductsCast.filter((p) => !input.existingSlugs.has(computeProductSlug(p)))
    : allProductsCast
  if (input.idempotent) {
    const skipped = allProductsCast.length - productsToInsert.length
    console.log(
      `   Produits à insérer : ${productsToInsert.length} (${skipped} déjà en DB, sautés)`
    )
  }

  await seedBatch(
    'produits (manuels)',
    productsToInsert,
    // Skip per-product auto-tagging: ingredients aren't linked yet, so it
    // would emit a partial tag set that PK-collides with the dedicated
    // auto-tag phase below (which runs with percent-claims). That phase is
    // the authoritative inserter.
    (p) => createProduct(input.userId, 'admin', p, tx, { autoTag: false }),
    (p) => p.slug ?? p.name,
    true
  )
}

async function seedFillerDermoProfiles(
  tx: DatabaseTransaction,
  ingredientSlugToId: Map<string, string>
): Promise<void> {
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
    for (const s of missingFillers) {
      console.warn(`   - ${s}`)
    }
  }
}

export async function seedCore(shouldClean = false, shouldUpdate = false) {
  const idempotent = !shouldClean
  const modeLabel = !idempotent
    ? ' [RESET — table truncate]'
    : shouldUpdate
      ? ' [idempotent + update existants]'
      : ' [idempotent]'
  console.log(`🌱 Démarrage du seed CORE (Données de base + Produits manuels)${modeLabel}...\n`)

  // All inserts are atomic: if anything fails midway the DB rolls back cleanly
  await db.transaction(async (tx) => {
    // Bypass RLS for the seeder session (owner role)
    await tx.execute(sql`SET LOCAL app.role = 'admin'`)

    if (shouldClean) {
      await assertResetTargetsSeedDatabase(tx)
      warnInvalidEntries()
      await cleanDatabase(tx)
    }

    console.log("👤 Création de l'utilisateur seed...")
    const user = await getOrCreateSeedUser()
    console.log(`✅ Utilisateur seed : ${user.email} (${user.id})\n`)

    const existing = await readExistingSeedState(tx, idempotent)
    const correctedIngredientData = validateIngredientMarkdown()

    // Prepare relation pairs (pure data, no DB) so we can validate before the transaction.
    // `source: 'manual'` marks curated rows so a later auto-tag retag preserves them
    // (write.ts deletes only `source != 'manual'` for the product).
    const manualProductTagPairs = flattenTagGroups(
      allProductTagsMap as Record<string, ProductTagGroups>
    ).map((p) => ({ ...p, source: 'manual' as const }))

    const productTagPlan = planProductTagPairs({
      products: allProductData,
      manual: manualProductTagPairs,
      percentClaims: allIngredientProductTags,
      brandCertifications: BRAND_CERTIFICATION_INSERTS,
    })
    printProductTagPlan(productTagPlan)

    const validProductIngredients = allIngredientProductTags.filter((i) => !!i.ingredientSlug)

    const ingredientTagPlan = planIngredientTagPairs({
      pairs: flattenTagGroups(ingredientTagMap as Record<string, ProductTagGroups>),
      ingredients: correctedIngredientData,
    })
    printIngredientTagPlan(ingredientTagPlan)

    await seedTagDefinitions(tx)
    await seedBrandCertificationRows(tx)

    await seedIngredientRows(tx, {
      userId: user.id,
      seeds: correctedIngredientData,
      existingSlugs: existing.ingredientSlugs,
      idempotent,
      shouldUpdate,
    })

    await seedProductRows(tx, {
      userId: user.id,
      existingSlugs: existing.productSlugs,
      idempotent,
    })

    // Fetch IDs of just-inserted entities within the same transaction
    const { productSlugToId, productTagSlugToId, ingredientTagSlugToId, ingredientSlugToId } =
      await fetchIdMaps(tx)

    await linkProductTags(tx, {
      pairs: productTagPlan.pairs,
      productSlugToId,
      productTagSlugToId,
      existingPairs: existing.tagProductPairs,
      idempotent,
    })

    await linkProductIngredients(tx, {
      rows: validProductIngredients,
      productSlugToId,
      ingredientSlugToId,
      existingPairs: existing.productIngredientPairs,
      idempotent,
    })

    await linkIngredientTags(tx, {
      pairs: ingredientTagPlan.pairs,
      ingredientSlugToId,
      ingredientTagSlugToId,
      existingPairs: existing.tagIngredientPairs,
      idempotent,
    })

    await seedFillerDermoProfiles(tx, ingredientSlugToId)

    await seedUserCollection(tx, user.id, productSlugToId)

    await seedTestUsers(tx, productSlugToId)
  })

  await seedBlog(idempotent)

  console.log('\n✨ Seed CORE terminé avec succès !\n')
}

// Auto-runs when executed directly.
//
// Default behavior is idempotent (`shouldClean=false`): destructive reset
// is opt-in via `--reset`. `--no-clean` is still recognized for legacy
// callers but is now a no-op (default already idempotent).
if (import.meta.main || process.argv[1]?.endsWith('seed-core.ts')) {
  const shouldClean = process.argv.includes('--reset')
  const shouldUpdate = process.argv.includes('--update')
  seedCore(shouldClean, shouldUpdate).catch((err) => {
    console.error('\n💥 Erreur fatale :', err instanceof Error ? err.message : err)
    process.exit(1)
  })
}
