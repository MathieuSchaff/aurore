import slugify from '@sindresorhus/slugify'

import { createProduct } from '../../features/products/service'
import { addManyIngredientsToProduct } from '../../features/products/product-ingredients/product-ingredients.service'
import { addManyTagsToProduct } from '../../features/tags/tags.service'
import { db } from '..'
import type { DB } from '../index'
import { inArray } from 'drizzle-orm'

import { ingredients, products, tags } from '../schema'
import { getOrCreateSeedUser } from './create-user'
import {
  CSV_CATEGORY_TAG_MAP,
  INGREDIENT_TAG_MAP,
  NAME_KEYWORD_TAG_MAP,
} from './otherdata/tag-associations'
import { seedCore } from './seed-core'
import { extractCapacity, parseCSV, seedBatch } from './utils'

// ── INCI → Ingredient matching ────────────────────────────────────────────────

// Builds a map from normalized INCI token → ingredient ID.
// For a name like "Soufre (Sulfur)" we add keys: "soufre (sulfur)", "soufre", "sulfur".
async function buildInciIndex(database: DB): Promise<Map<string, string>> {
  const allIngredients = await database.select({ id: ingredients.id, name: ingredients.name }).from(ingredients)
  const index = new Map<string, string>()

  for (const ing of allIngredients) {
    const full = ing.name.toLowerCase().trim()
    index.set(full, ing.id)

    // Extract content inside parens as an alternate key, e.g. "sulfur" from "Soufre (Sulfur)"
    const parenMatch = full.match(/\(([^)]+)\)/)
    if (parenMatch) {
      const inner = parenMatch[1].trim()
      index.set(inner, ing.id)
      // Also add the part before the paren
      const outer = full.replace(/\s*\([^)]+\)/, '').trim()
      if (outer) index.set(outer, ing.id)
    }
  }

  return index
}

// Splits a CSV INCI string and returns ingredient IDs for matched entries.
function matchInciIngredients(inciString: string, index: Map<string, string>): string[] {
  if (!inciString) return []
  const seen = new Set<string>()
  const matched: string[] = []

  for (const token of inciString.split(',')) {
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

// ── Kind normalization ────────────────────────────────────────────────────────

const CSV_KIND_MAP: Record<string, string> = {
  Body: 'bodycare',
  Hand: 'bodycare',
}

function normalizeKind(usageType: string): string {
  return CSV_KIND_MAP[usageType] ?? 'skincare'
}

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
  unit: string
  rawName: string
}

// ── Utilitaires CSV ───────────────────────────────────────────────────────────

async function getTagIdsBySlugs(database: DB, slugs: string[]) {
  if (slugs.length === 0) return []
  const results = await database.select({ id: tags.id }).from(tags).where(inArray(tags.slug, slugs))
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

    const { name, totalAmount, unit } = extractCapacity(rawName, csvBrand)
    const targetSlug = slugify(`${csvBrand}-${name}`)

    if (existingSlugs.has(targetSlug)) continue

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
        const product = await createProduct(
          item.user.id,
          {
            name: item.name,
            brand: item.brand,
            kind: normalizeKind(item.usageType),
            unit: item.unit,
            totalAmount: item.totalAmount ?? undefined,
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
