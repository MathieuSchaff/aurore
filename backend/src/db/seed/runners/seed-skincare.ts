import slugify from '@sindresorhus/slugify'
import {
  PRODUCT_CATEGORIES,
  PRODUCT_KINDS,
  type ProductCategory,
} from '@habit-tracker/shared'

import { createProduct } from '../../features/products/service'
import { addManyIngredientsToProduct } from '../../features/products/product-ingredients/product-ingredients.service'
import { addManyTagsToProduct } from '../../features/tags/tags.service'
import { db } from '..'
import type { DB } from '../index'
import { inArray } from 'drizzle-orm'

import { ingredients, products, productTagsDefs } from '../schema'
import { getOrCreateSeedUser } from './create-user'

import {
  CSV_CATEGORY_TAG_MAP,
  INGREDIENT_TAG_MAP,
  NAME_KEYWORD_TAG_MAP,
} from './otherdata/tag-associations'
import { getProductKind, unitFromCategory } from './otherdata/product-associations'
import { seedCore } from './seed-core'
import { extractCapacity, parseCSV, seedBatch } from './utils'

// ── INCI → Ingredient matching ────────────────────────────────────────────────

// Builds a map from normalized INCI token → ingredient ID.
// For a name like "Soufre (Sulfur)" we add keys: "soufre (sulfur)", "soufre", "sulfur".
async function buildInciIndex(database: DB): Promise<Map<string, string>> {
  const allIngredients = await database
    .select({ id: ingredients.id, name: ingredients.name, slug: ingredients.slug })
    .from(ingredients)
  const index = new Map<string, string>()

  // First-writer wins — ingredient files are ordered so the canonical name is added first.
  const add = (key: string, id: string) => {
    const k = key.trim()
    if (!k) return
    if (!index.has(k)) index.set(k, id)
  }

  for (const ing of allIngredients) {
    const full = ing.name.toLowerCase().trim()
    add(full, ing.id)

    // "Soufre (Sulfur)" → also index "sulfur" and "soufre"
    const parenMatch = full.match(/\(([^)]+)\)/)
    if (parenMatch) {
      add(parenMatch[1], ing.id)
      add(full.replace(/\s*\([^)]+\)/, ''), ing.id)
    }

    // Slug variants: "azelaic-acid" → "azelaic acid"
    const slug = ing.slug.toLowerCase()
    add(slug, ing.id)
    add(slug.replace(/-/g, ' '), ing.id)
  }

  return index
}

// Splits a CSV INCI string and returns ingredient IDs for matched entries (max 5).
function matchInciIngredients(inciString: string, index: Map<string, string>): string[] {
  if (!inciString) return []
  const seen = new Set<string>()
  const matched: string[] = []

  for (const token of inciString.split(',')) {
    if (matched.length >= 5) break

    // strip percentage annotations like "10%", "[1]" and extra whitespace
    const normalized = token.toLowerCase().trim().replace(/\s*\d+(\.\d+)?%.*$/, '').replace(/\[.*?\]/g, '').trim()
    if (!normalized) continue

    const id = index.get(normalized)
    if (id && !seen.has(id)) {
      seen.add(id)
      matched.push(id)
    }
  }

  return matched
}

// CSV rows we cannot cleanly represent as a single product.
const SKIPPED_CATEGORIES = new Set(['Sets & Kits'])

// ── Types ─────────────────────────────────────────────────────────────────────

type SeedUser = Awaited<ReturnType<typeof getOrCreateSeedUser>>

type CsvProductEntry = {
  user: SeedUser
  name: string
  brand: string
  usageType: string
  category: string
  inci: string
  productUrl: string
  targetSlug: string
  totalAmount: number | null
  amountUnit: string | null
  unit: string
  rawName: string
}

// ── Utilitaires CSV ───────────────────────────────────────────────────────────

async function getTagIdsBySlugs(database: DB, slugs: string[]) {
  if (slugs.length === 0) return []
  const results = await database
    .select({ id: productTagsDefs.id })
    .from(productTagsDefs)
    .where(inArray(productTagsDefs.slug, slugs))
  return results.map((t) => t.id)
}

function getTargetTagSlugs(
  usageType: string,
  category: string,
  rawName: string,
  inci: string
): string[] {
  const slugs = new Set<string>()

  CSV_CATEGORY_TAG_MAP[usageType]?.forEach((s) => slugs.add(s))
  CSV_CATEGORY_TAG_MAP[category]?.forEach((s) => slugs.add(s))

  const lowerName = rawName.toLowerCase()
  Object.entries(NAME_KEYWORD_TAG_MAP).forEach(([kw, tagSlugs]) => {
    if (lowerName.includes(kw)) tagSlugs.forEach((s) => slugs.add(s))
  })

  if (inci) {
    const lowerInci = inci.toLowerCase()
    Object.entries(INGREDIENT_TAG_MAP).forEach(([ing, tagSlugs]) => {
      const regex = new RegExp(`\\b${ing}\\b`, 'i')
      if (regex.test(lowerInci)) tagSlugs.forEach((s) => slugs.add(s))
    })
  }

  return Array.from(slugs)
}

// ── Fonction Principale ───────────────────────────────────────────────────────

export async function seedSkincare(
  csvPath = 'src/db/seed/products/otherData.csv',
  limit?: number
) {
  console.log('🚀 DÉMARRAGE DU SEED SKINCARE (Import CSV)\n')

  const user = await getOrCreateSeedUser()
  const existingProducts = await db.select({ slug: products.slug }).from(products)
  const existingSlugs = new Set(existingProducts.map((p) => p.slug))

  const file = Bun.file(csvPath)
  if (!(await file.exists())) {
    console.warn(`⚠️ Fichier CSV introuvable : ${csvPath}`)
    return
  }

  console.log(`📂 Importation CSV : ${csvPath}`)

  const content = await file.text()
  const rows = parseCSV(content).slice(1) // Skip header

  const dataRows = limit !== undefined ? rows.slice(0, limit) : rows
  console.log(
    `📊 ${dataRows.length} produits à traiter${limit !== undefined ? ` (limité à ${limit})` : ''}.`
  )

  const productsToCreate: CsvProductEntry[] = []
  for (const row of dataRows) {
    const [_file, rawName, csvBrand, usageType, category, inci, , productUrl] = row
    if (!rawName || !csvBrand) continue
    if (SKIPPED_CATEGORIES.has(category)) continue

    const { name, totalAmount, amountUnit } = extractCapacity(rawName, csvBrand)
    const unit = unitFromCategory(category)
    const targetSlug = slugify(`${csvBrand}-${name}`)

    if (!name || existingSlugs.has(targetSlug)) continue
    // Avoid creating two rows that would collapse onto the same slug within the batch.
    existingSlugs.add(targetSlug)

    productsToCreate.push({
      user,
      name,
      brand: csvBrand,
      usageType,
      category,
      inci,
      productUrl,
      targetSlug,
      totalAmount,
      amountUnit,
      unit,
      rawName,
    })
  }

  console.log(`🆕 ${productsToCreate.length} nouveaux produits à créer.`)

  const inciIndex = await buildInciIndex(db)
  console.log(`🔬 Index INCI : ${inciIndex.size} entrées`)

  let inciMatchCount = 0
  let inciNoMatchCount = 0

  await seedBatch(
    'produits CSV',
    productsToCreate,
    async (item) => {
      await db.transaction(async (tx) => {
        const productKind = getProductKind(item.usageType, item.category)

        let productCategory: ProductCategory = PRODUCT_CATEGORIES.SKINCARE
        if (
          ['Body', 'Hand', 'Feet'].includes(item.usageType) ||
          productKind === PRODUCT_KINDS.bodycare.HAND_CREAM ||
          productKind === PRODUCT_KINDS.bodycare.FOOT_CREAM ||
          productKind === PRODUCT_KINDS.bodycare.BODY_LOTION ||
          productKind === PRODUCT_KINDS.bodycare.BODY_WASH ||
          productKind === PRODUCT_KINDS.bodycare.BODY_SCRUB ||
          productKind === PRODUCT_KINDS.bodycare.BODY_OIL ||
          productKind === PRODUCT_KINDS.bodycare.DEODORANT
        ) {
          productCategory = PRODUCT_CATEGORIES.BODYCARE
        } else if (productKind === PRODUCT_KINDS.solaire.SUNSCREEN) {
          productCategory = PRODUCT_CATEGORIES.SOLAIRE
        }
        const product = await createProduct(
          item.user.id,
          {
            name: item.name,
            brand: item.brand,
            category: productCategory,
            kind: productKind,
            unit: item.unit,
            totalAmount: item.totalAmount ?? undefined,
            amountUnit: item.amountUnit ?? undefined,
            inci: item.inci,
            url: item.productUrl,
            slug: item.targetSlug,
          },
          tx
        )

        const targetSlugs = getTargetTagSlugs(
          item.usageType,
          item.category,
          item.rawName,
          item.inci
        )
        const tagIds = await getTagIdsBySlugs(tx, targetSlugs)
        if (tagIds.length > 0) await addManyTagsToProduct(tx, product.id, tagIds)

        const matchedIngredientIds = matchInciIngredients(item.inci, inciIndex)
        if (matchedIngredientIds.length > 0) {
          await addManyIngredientsToProduct(
            tx,
            matchedIngredientIds.map((ingredientId) => ({ productId: product.id, ingredientId }))
          )
          inciMatchCount++
        } else if (item.inci) {
          inciNoMatchCount++
        }
      })
    },
    (item) => item.targetSlug
  )

  console.log(
    `🔬 INCI : ${inciMatchCount} produits liés à des ingrédients, ${inciNoMatchCount} sans correspondance`
  )

  console.log('\n✨ Seed SKINCARE terminé avec succès !')
}

// ── Auto-exécution ────────────────────────────────────────────────────────────

if (import.meta.main || process.argv[1]?.endsWith('seed-skincare.ts')) {
  const fullSeed = process.argv.includes('--full')

  const limitArg = process.argv.find((a) => a.startsWith('--limit='))
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined

  if (fullSeed) {
    seedCore()
      .then(() => seedSkincare(undefined, limit))
      .catch((err) => {
        console.error('\n💥 Erreur fatale :', err instanceof Error ? err.message : err)
        process.exit(1)
      })
  } else {
    seedSkincare(undefined, limit).catch((err) => {
      console.error('\n💥 Erreur fatale :', err instanceof Error ? err.message : err)
      process.exit(1)
    })
  }
}
