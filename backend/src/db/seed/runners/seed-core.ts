import { type ProductKind, SKINCARE_INGREDIENT_CATEGORY_VALUES } from '@habit-tracker/shared'

import slugify from '@sindresorhus/slugify'
import { count, sql } from 'drizzle-orm'

import { createIngredient } from '../../../features/ingredients/service'
import { addIngredientToProduct } from '../../../features/products/product-ingredients/product-ingredients.service'
import { createProduct } from '../../../features/products/service'
import { addTagToIngredient, addTagToProduct } from '../../../features/tags/tags.service'
import { db } from '../..'
import {
  ingredientDermoProfiles,
  ingredients,
  ingredientTagsDefs,
  productIngredients,
  products,
  productTagsDefs,
  tagIngredients,
  tagProducts,
} from '../../schema'
import { ingredientTagMap } from '../data/ingredient-tags'
import { ingredientData } from '../data/ingredients'
import { FILLER_SLUGS } from '../data/ingredients/skincare/seed-dermo-profiles-fillers'
import { allIngredientProductTags, allProductData, allProductTagsMap } from '../data/products'
import { ingredientTagData, productTagData } from '../data/tags'
import { detectActifClasses } from '../utils/actif-class-detection'
import { detectAutoTags } from '../utils/auto-tag-detection'
import { type ProductTagGroups, seedBatch, toNumeric, toText } from '../utils/batch'
import { cleanDatabase, fetchIdMaps, flattenTagGroups } from '../utils/id-maps'
import { printValidationReport, validateAllIngredients } from '../utils/markdown-validator'
import { getOrCreateSeedUser } from './create-user'
import { seedBlog } from './seed-blog'
import { seedUserCollection } from './seed-user-collection'

// ── Utilitaires de Validation ─────────────────────────────────────────────────

// Lookup in a slug→id map after `pruneRelationshipPairs` guaranteed the key
// exists. A miss here means the prune step is broken, so throw loudly.
function requireId(map: Map<string, string>, key: string, entity: string): string {
  const id = map.get(key)
  if (id === undefined) throw new Error(`Missing ${entity} id for slug "${key}"`)
  return id
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

// ── Fonction Principale ───────────────────────────────────────────────────────

// Reproduces createProduct's slug derivation for filtering (input.slug ??
// `${name}-${brand}`, then slugify). Needed because seed product entries can
// omit slug — the filter against existingProductSlugs has to compare the
// same canonical form the insert path would produce.
function computeProductSlug(input: { name: string; brand: string; slug?: string }): string {
  const name = input.name.trim().replace(/\s+/g, ' ')
  const brand = input.brand.trim().replace(/\s+/g, ' ')
  const raw = input.slug ?? `${name}${brand ? `-${brand}` : ''}`
  return slugify(raw)
}

export async function seedCore(shouldClean = false) {
  const idempotent = !shouldClean
  console.log(
    `🌱 Démarrage du seed CORE (Données de base + Produits manuels)${idempotent ? ' [idempotent]' : ' [RESET — table truncate]'}...\n`
  )

  // All inserts are atomic: if anything fails mid-way the DB rolls back cleanly
  await db.transaction(async (tx) => {
    // Bypass RLS for the seeder session (owner role)
    await tx.execute(sql`SET LOCAL app.role = 'admin'`)

    if (shouldClean) {
      // Mismatch guard: if the target DB already holds more products than
      // the JS seed files would re-insert, the operator probably wired the
      // wrong DB (e.g. dev instead of test) — refuse unless they opt in
      // explicitly with `SEED_FORCE_RESET=1`. The 2026-05-07 incident is
      // exactly this scenario: dev DB had 3137 snapshot products, seed had
      // 469 squelettes, and the truncate destroyed 2668 rows.
      const [{ value: dbProductCount }] = await tx.select({ value: count() }).from(products)
      const seedProductCount = allProductData.length
      if (dbProductCount > seedProductCount && process.env.SEED_FORCE_RESET !== '1') {
        throw new Error(
          `Refus du --reset : la DB cible contient ${dbProductCount} produits, le seed JS n'en fournit que ${seedProductCount}. ` +
            `Vraisemblablement la mauvaise DB (dev au lieu de test ?). ` +
            `Si tu es sûr, relance avec SEED_FORCE_RESET=1. ` +
            `Pour récupérer une DB dev écrasée : make db-snapshot-load.`
        )
      }
      warnInvalidEntries()
      await cleanDatabase(tx)
    }

    console.log("👤 Création de l'utilisateur seed...")
    const user = await getOrCreateSeedUser()
    console.log(`✅ Utilisateur seed : ${user.email} (${user.id})\n`)

    // In idempotent mode we can't rely on per-row try/catch for uniqueness:
    // Promise.allSettled in `seedBatch` runs inserts concurrently and a single
    // unique-violation aborts the outer transaction so every later insert
    // cascade-fails ("current transaction is aborted"). SAVEPOINTs would fix
    // the abort but Drizzle's nested-tx counter races under concurrency
    // ("savepoint sN does not exist"). So we pre-fetch existing slugs/pairs
    // and filter the seed inputs before they ever hit the DB.
    let existingIngredientSlugs = new Set<string>()
    let existingProductSlugs = new Set<string>()
    let existingTagProductPairs = new Set<string>()
    let existingTagIngredientPairs = new Set<string>()
    let existingProductIngredientPairs = new Set<string>()

    if (idempotent) {
      console.log('🔎 Lecture de l’état DB existant pour pré-filtrage...')
      const [existIng, existProd, existTagProd, existTagIng, existProdIng] = await Promise.all([
        tx.select({ slug: ingredients.slug }).from(ingredients),
        tx.select({ slug: products.slug }).from(products),
        tx.select({ pId: tagProducts.productId, tId: tagProducts.productTagId }).from(tagProducts),
        tx
          .select({ iId: tagIngredients.ingredientId, tId: tagIngredients.ingredientTagId })
          .from(tagIngredients),
        tx
          .select({ pId: productIngredients.productId, iId: productIngredients.ingredientId })
          .from(productIngredients),
      ])
      existingIngredientSlugs = new Set(existIng.map((r) => r.slug))
      existingProductSlugs = new Set(existProd.map((r) => r.slug))
      existingTagProductPairs = new Set(existTagProd.map((r) => `${r.pId}::${r.tId}`))
      existingTagIngredientPairs = new Set(existTagIng.map((r) => `${r.iId}::${r.tId}`))
      existingProductIngredientPairs = new Set(existProdIng.map((r) => `${r.pId}::${r.iId}`))
      console.log(
        `   Existant : ${existingIngredientSlugs.size} ingrédients · ${existingProductSlugs.size} produits · ${existingTagProductPairs.size} tag-products · ${existingTagIngredientPairs.size} tag-ingredients · ${existingProductIngredientPairs.size} product-ingredients`
      )
    }

    // Validate markdown before touching the DB
    console.log('🔍 Validation du markdown des ingrédients...')
    const ingredientValidation = validateAllIngredients(ingredientData)
    printValidationReport(ingredientValidation)

    if (ingredientValidation.summary.valid === 0 && ingredientData.length > 0) {
      throw new Error('Aucun ingrédient valide - Seed interrompu')
    }
    const correctedIngredientData = ingredientValidation.fixed

    // Prepare relation pairs (pure data, no DB) so we can validate before the transaction
    const manualProductTagPairs = flattenTagGroups(
      allProductTagsMap as Record<string, ProductTagGroups>
    )

    // Auto-derive `actif_class` cluster tags from each skincare product's INCI
    // string via algo-derm (`splitINCI` + `normalize` substring match). The
    // cluster taxonomy lives Aurore-side (shared/products/skincare/tag-slugs.ts);
    // algo-derm only provides the parser/normalizer. Tags emitted as `secondary`
    // — informational, never as `avoid` — so they're invisible to the
    // exclusion filter but show up in the family chip on the products page.
    let actifClassDerived = 0
    const actifClassPairs: { slug: string; tagSlug: string; relevance: 'secondary' }[] = []
    for (const product of allProductData) {
      if (product.category !== 'skincare') continue
      const inci = (product as { inci?: string | null }).inci
      const clusters = detectActifClasses(inci)
      for (const tagSlug of clusters) {
        actifClassPairs.push({ slug: product.slug, tagSlug, relevance: 'secondary' })
        actifClassDerived++
      }
    }
    if (actifClassDerived > 0) {
      console.log(
        `🧬 Backfill actif_class: +${actifClassDerived} pair(s) auto-déduit(es) depuis INCI`
      )
    }

    // Auto-derive concern / skin_type / skin_effect / comedogenicity tags from
    // INCI via algo-derm `tagProduct`. Per-tag policy lives in `auto-tag-detection`
    // (TAG_CONFIG), calibrated 2026-05-07 — see docs/tags/AUTO-TAGS.md §7.4–7.6.
    // Manual tags win on conflict because manualProductTagPairs is listed first in
    // dedupPairs.
    let autoTagsDerived = 0
    const autoTagPairs: { slug: string; tagSlug: string; relevance: 'secondary' }[] = []
    for (const product of allProductData) {
      if (product.category !== 'skincare') continue
      const inci = (product as { inci?: string | null }).inci
      // `allProductData.kind` is widened to string from the unified union;
      // we already filter on category=skincare so the value is a valid ProductKind.
      const detected = detectAutoTags(inci, product.kind as ProductKind)
      for (const tag of detected) {
        autoTagPairs.push({ slug: product.slug, tagSlug: tag.slug, relevance: tag.relevance })
        autoTagsDerived++
      }
    }
    if (autoTagsDerived > 0) {
      console.log(
        `🏷  Backfill auto-tags: +${autoTagsDerived} pair(s) auto-déduit(es) depuis INCI (concern, skin_type, comedogenicity…)`
      )
    }

    const productTagPairs = dedupPairs(
      [...manualProductTagPairs, ...actifClassPairs, ...autoTagPairs],
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
    // SKINCARE_INGREDIENT_CATEGORY_VALUES ↔ ingredient_attribute tag slugs.
    const existing = new Set(ingredientTagPairs.map((p) => `${p.slug}::${p.tagSlug}`))
    // Whitelist of skincare formulation roles that exist as ingredient_attribute
    // tag slugs. Supplement ingredients store their functional class in the same
    // `category` column (carotenoide, plante, neuroactif…) — skip them here so
    // the backfill never emits tags that aren't in the ingredient taxonomy.
    const validCategorySlugs = new Set<string>(SKINCARE_INGREDIENT_CATEGORY_VALUES)
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

    // 1. Tag definitions (ingredient + product domains are independent).
    // Bulk insert bypasses per-row service calls because seed data is already
    // in the `{slug, label, tagType}` shape the schema expects.
    // Bulk tag defs use `onConflictDoNothing` on the slug unique idx so a
    // re-run picks up new slugs without erroring on existing ones. Harmless
    // after `cleanDatabase` (table is empty).
    if (ingredientTagData.length > 0) {
      await tx.insert(ingredientTagsDefs).values(ingredientTagData).onConflictDoNothing({
        target: ingredientTagsDefs.slug,
      })
    }
    console.log(`✅ ${ingredientTagData.length} ingredient_tags créés`)

    if (productTagData.length > 0) {
      await tx.insert(productTagsDefs).values(productTagData).onConflictDoNothing({
        target: productTagsDefs.slug,
      })
    }
    console.log(`✅ ${productTagData.length} product_tags créés`)

    const ingredientsToInsert = idempotent
      ? correctedIngredientData.filter((i) => !existingIngredientSlugs.has(i.slug))
      : correctedIngredientData
    if (idempotent) {
      const skipped = correctedIngredientData.length - ingredientsToInsert.length
      console.log(
        `   Ingrédients à insérer : ${ingredientsToInsert.length} (${skipped} déjà en DB, sautés)`
      )
    }

    await seedBatch(
      'ingrédients',
      ingredientsToInsert,
      (ing) => createIngredient(tx, user.id, ing),
      (ing) => ing.slug,
      true
    )

    const allProductsCast = [...allProductData] as Parameters<typeof createProduct>[1][]
    const productsToInsert = idempotent
      ? allProductsCast.filter((p) => !existingProductSlugs.has(computeProductSlug(p)))
      : allProductsCast
    if (idempotent) {
      const skipped = allProductsCast.length - productsToInsert.length
      console.log(
        `   Produits à insérer : ${productsToInsert.length} (${skipped} déjà en DB, sautés)`
      )
    }

    await seedBatch(
      'produits (manuels)',
      productsToInsert,
      (p) => createProduct(user.id, p, tx),
      (p) => p.slug ?? p.name,
      true
    )

    // 2. Fetch IDs of just-inserted entities within the same transaction
    const { productSlugToId, productTagSlugToId, ingredientTagSlugToId, ingredientSlugToId } =
      await fetchIdMaps(tx)

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

    const productTagPairsToInsert = idempotent
      ? prunedProductTagPairs.filter(({ slug, tagSlug }) => {
          const pId = productSlugToId.get(slug)
          const tId = productTagSlugToId.get(tagSlug)
          if (!pId || !tId) return false
          return !existingTagProductPairs.has(`${pId}::${tId}`)
        })
      : prunedProductTagPairs
    if (idempotent) {
      console.log(
        `   ProductTags à insérer : ${productTagPairsToInsert.length} (${prunedProductTagPairs.length - productTagPairsToInsert.length} déjà liés, sautés)`
      )
    }

    await seedBatch(
      'productTags',
      productTagPairsToInsert,
      ({ slug, tagSlug, relevance }) =>
        addTagToProduct(
          tx,
          requireId(productSlugToId, slug, 'product'),
          requireId(productTagSlugToId, tagSlug, 'productTag'),
          relevance
        ),
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

    const productIngredientsToInsert = idempotent
      ? prunedProductIngredients.filter(({ productSlug, ingredientSlug }) => {
          if (!ingredientSlug) return false
          const pId = productSlugToId.get(productSlug)
          const iId = ingredientSlugToId.get(ingredientSlug)
          if (!pId || !iId) return false
          return !existingProductIngredientPairs.has(`${pId}::${iId}`)
        })
      : prunedProductIngredients
    if (idempotent) {
      console.log(
        `   ProductIngredients à insérer : ${productIngredientsToInsert.length} (${prunedProductIngredients.length - productIngredientsToInsert.length} déjà liés, sautés)`
      )
    }

    await seedBatch(
      'productIngredients',
      productIngredientsToInsert,
      ({ productSlug, ingredientSlug, notes, concentrationValue, concentrationUnit }) => {
        if (!ingredientSlug) throw new Error(`Missing ingredientSlug for product ${productSlug}`)
        return addIngredientToProduct(tx, {
          productId: requireId(productSlugToId, productSlug, 'product'),
          ingredientId: requireId(ingredientSlugToId, ingredientSlug, 'ingredient'),
          notes: toText(notes),
          concentrationValue: toNumeric(concentrationValue),
          concentrationUnit: toText(concentrationUnit),
          concentrationPer: null,
        })
      },
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

    const ingredientTagPairsToInsert = idempotent
      ? prunedIngredientTagPairs.filter(({ slug, tagSlug }) => {
          const iId = ingredientSlugToId.get(slug)
          const tId = ingredientTagSlugToId.get(tagSlug)
          if (!iId || !tId) return false
          return !existingTagIngredientPairs.has(`${iId}::${tId}`)
        })
      : prunedIngredientTagPairs
    if (idempotent) {
      console.log(
        `   IngredientTags à insérer : ${ingredientTagPairsToInsert.length} (${prunedIngredientTagPairs.length - ingredientTagPairsToInsert.length} déjà liés, sautés)`
      )
    }

    await seedBatch(
      'ingredientTags',
      ingredientTagPairsToInsert,
      ({ slug, tagSlug, relevance }) =>
        addTagToIngredient(
          tx,
          requireId(ingredientSlugToId, slug, 'ingredient'),
          requireId(ingredientTagSlugToId, tagSlug, 'ingredientTag'),
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
      for (const s of missingFillers) {
        console.warn(`   - ${s}`)
      }
    }

    // 5. User collection
    await seedUserCollection(tx, user.id, productSlugToId)
  })

  await seedBlog(idempotent)

  console.log('\n✨ Seed CORE terminé avec succès !\n')
}

// Auto-exécution si lancé directement.
//
// Default behavior is idempotent (`shouldClean=false`) — destructive reset
// is opt-in via `--reset`. `--no-clean` is still recognized for legacy
// callers but is now a no-op (default already idempotent).
if (import.meta.main || process.argv[1]?.endsWith('seed-core.ts')) {
  const shouldClean = process.argv.includes('--reset')
  seedCore(shouldClean).catch((err) => {
    console.error('\n💥 Erreur fatale :', err instanceof Error ? err.message : err)
    process.exit(1)
  })
}
