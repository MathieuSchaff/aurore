import slugify from '@sindresorhus/slugify'

import { createProduct } from '../../features/products/service'
import { addManyTagsToProduct } from '../../features/tags/tags.service'
import { db } from '..'
import type { DB } from '../index'
import { products } from '../schema'
import { getOrCreateSeedUser } from './create-user'
import {
  CSV_CATEGORY_TAG_MAP,
  INGREDIENT_TAG_MAP,
  NAME_KEYWORD_TAG_MAP,
} from './otherdata/tag-associations'
import { seedCore } from './seed-core'
import { extractCapacity, parseCSV, seedBatch } from './utils'

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
  const results = await database.query.tags.findMany({
    where: (fields, { inArray }) => inArray(fields.slug, slugs),
  })
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

  await db.transaction(async (tx) => {
    await seedBatch(
      'produits CSV',
      productsToCreate,
      async (item) => {
        const product = await createProduct(
          item.user.id,
          {
            name: item.name,
            brand: item.brand,
            kind: item.usageType || 'Pas spécifié',
            unit: item.unit,
            totalAmount: item.totalAmount ?? undefined,
            inci: item.inci,
            url: item.productUrl,
            slug: item.targetSlug,
            notes: item.category ? `Category: ${item.category}` : undefined,
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
      },
      (item) => item.targetSlug
    )
  })

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
