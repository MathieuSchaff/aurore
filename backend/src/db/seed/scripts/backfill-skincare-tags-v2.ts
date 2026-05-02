#!/usr/bin/env bun

/**
 * Phase 2 backfill — derive `product_type_v2`, `texture`, `skin_zone` rows from
 * legacy `product_type` tags on skincare/solaire/bodycare products.
 *
 * Idempotent:
 *   1. INSERTs missing product_tags_defs rows for new V2/texture/zone-pieds slugs.
 *   2. For every (product, legacy product_type) pair, INSERTs derived rows in
 *      tag_products with ON CONFLICT DO NOTHING.
 *
 * Usage:
 *   bun run src/db/seed/scripts/backfill-skincare-tags-v2.ts          # dry run
 *   bun run src/db/seed/scripts/backfill-skincare-tags-v2.ts --write  # apply
 */

import {
  PRODUCT_DOMAIN_DB_CATEGORIES,
  type ProductCategory,
  SKINCARE_LEGACY_TYPE_TO_TEXTURE,
  SKINCARE_LEGACY_TYPE_TO_V2,
  SKINCARE_LEGACY_TYPE_TO_ZONE,
  SKINCARE_PRODUCT_TAG_SLUGS,
  SKINCARE_PRODUCT_TAG_TAXONOMY,
} from '@habit-tracker/shared'

import { and, eq, inArray } from 'drizzle-orm'

import { db } from '../..'
import { products, productTagsDefs, tagProducts } from '../../schema'

const WRITE = process.argv.includes('--write')

const NEW_SLUGS = [
  // V2 type
  SKINCARE_PRODUCT_TAG_SLUGS.TYPE_NETTOYANT,
  SKINCARE_PRODUCT_TAG_SLUGS.TYPE_TONER,
  SKINCARE_PRODUCT_TAG_SLUGS.TYPE_MIST,
  SKINCARE_PRODUCT_TAG_SLUGS.TYPE_SERUM,
  SKINCARE_PRODUCT_TAG_SLUGS.TYPE_HYDRATANT,
  SKINCARE_PRODUCT_TAG_SLUGS.TYPE_MASQUE,
  SKINCARE_PRODUCT_TAG_SLUGS.TYPE_EXFOLIATION,
  SKINCARE_PRODUCT_TAG_SLUGS.TYPE_SOLAIRE,
  SKINCARE_PRODUCT_TAG_SLUGS.TYPE_TRAITEMENT,
  SKINCARE_PRODUCT_TAG_SLUGS.TYPE_PRIMER,
  SKINCARE_PRODUCT_TAG_SLUGS.TYPE_DEODORANT,
  SKINCARE_PRODUCT_TAG_SLUGS.TYPE_OUTIL,
  // Texture
  SKINCARE_PRODUCT_TAG_SLUGS.TEXTURE_GEL,
  SKINCARE_PRODUCT_TAG_SLUGS.TEXTURE_CREME,
  SKINCARE_PRODUCT_TAG_SLUGS.TEXTURE_BAUME,
  SKINCARE_PRODUCT_TAG_SLUGS.TEXTURE_HUILE,
  SKINCARE_PRODUCT_TAG_SLUGS.TEXTURE_LAIT,
  SKINCARE_PRODUCT_TAG_SLUGS.TEXTURE_MOUSSE,
  SKINCARE_PRODUCT_TAG_SLUGS.TEXTURE_EAU,
  SKINCARE_PRODUCT_TAG_SLUGS.TEXTURE_PATCH,
  SKINCARE_PRODUCT_TAG_SLUGS.TEXTURE_STICK,
  // Zone
  SKINCARE_PRODUCT_TAG_SLUGS.ZONE_PIEDS,
] as const

const SKINCARE_DB_CATEGORIES: ProductCategory[] = [...PRODUCT_DOMAIN_DB_CATEGORIES.skincare]

async function main() {
  console.log(WRITE ? '🔧 WRITE mode' : '🟡 DRY-RUN (use --write to apply)')

  // ─── Step 1: insert missing defs ────────────────────────────────────
  const existingDefs = await db
    .select({ slug: productTagsDefs.slug })
    .from(productTagsDefs)
    .where(inArray(productTagsDefs.slug, [...NEW_SLUGS]))
  const existingSlugs = new Set(existingDefs.map((r) => r.slug))

  const defsToInsert = NEW_SLUGS.filter((s) => !existingSlugs.has(s)).map((slug) => {
    const meta = SKINCARE_PRODUCT_TAG_TAXONOMY[slug]
    return { slug, label: meta.label, tagType: meta.category as string }
  })

  console.log(
    `📦 defs: ${existingSlugs.size}/${NEW_SLUGS.length} déjà présents, ${defsToInsert.length} à insérer`
  )

  // Insert defs eagerly (idempotent via slug filter above) — needed in both
  // dry-run and write so step 3's slugToId lookup resolves. The legacyRows /
  // tagProducts inserts below are still gated by WRITE.
  if (defsToInsert.length > 0) {
    if (WRITE) {
      await db.insert(productTagsDefs).values(defsToInsert)
      console.log(`  → ${defsToInsert.length} defs insérés`)
    } else {
      console.log(`  → ${defsToInsert.length} defs seraient insérés (dry-run)`)
    }
  }

  // ─── Step 2: load legacy → product_type pairs (skincare scope) ──────
  const legacyKeys = Object.keys(SKINCARE_LEGACY_TYPE_TO_V2)
  const legacyRows = await db
    .select({
      productId: tagProducts.productId,
      productTagId: tagProducts.productTagId,
      legacySlug: productTagsDefs.slug,
      relevance: tagProducts.relevance,
    })
    .from(tagProducts)
    .innerJoin(productTagsDefs, eq(tagProducts.productTagId, productTagsDefs.id))
    .innerJoin(products, eq(tagProducts.productId, products.id))
    .where(
      and(
        eq(productTagsDefs.tagType, 'product_type'),
        inArray(productTagsDefs.slug, legacyKeys),
        inArray(products.category, SKINCARE_DB_CATEGORIES)
      )
    )

  console.log(`🔍 ${legacyRows.length} legacy product_type rows à traiter`)

  // ─── Step 3: resolve new-slug → tagDefId map (write mode only) ──────
  // In dry-run, defs may not exist yet — skip resolution and count from mapping.
  const allDefs = WRITE
    ? await db
        .select({ id: productTagsDefs.id, slug: productTagsDefs.slug })
        .from(productTagsDefs)
        .where(inArray(productTagsDefs.slug, [...NEW_SLUGS]))
    : []
  const slugToId = new Map(allDefs.map((r) => [r.slug, r.id]))

  // ─── Step 4: derive new pairs ───────────────────────────────────────
  type Pair = {
    productId: string
    productTagId: string
    relevance: 'primary' | 'secondary' | 'avoid'
  }
  const newPairs: Pair[] = []
  const stats = { v2: 0, texture: 0, zone: 0, skipped: 0 }

  for (const row of legacyRows) {
    const legacy = row.legacySlug as keyof typeof SKINCARE_LEGACY_TYPE_TO_V2
    const v2Slug = SKINCARE_LEGACY_TYPE_TO_V2[legacy]
    const zoneSlug = SKINCARE_LEGACY_TYPE_TO_ZONE[legacy]
    const textureSlug = SKINCARE_LEGACY_TYPE_TO_TEXTURE[legacy]
    const rel = row.relevance

    if (v2Slug) {
      stats.v2++
      const id = slugToId.get(v2Slug)
      if (id) newPairs.push({ productId: row.productId, productTagId: id, relevance: rel })
    } else stats.skipped++

    if (zoneSlug) {
      stats.zone++
      const id = slugToId.get(zoneSlug)
      if (id) newPairs.push({ productId: row.productId, productTagId: id, relevance: rel })
    }
    if (textureSlug) {
      stats.texture++
      const id = slugToId.get(textureSlug)
      if (id) newPairs.push({ productId: row.productId, productTagId: id, relevance: rel })
    }
  }

  console.log(
    `🧮 dérivés: v2=${stats.v2}, zone=${stats.zone}, texture=${stats.texture}, skipped=${stats.skipped}`
  )
  console.log(`💾 ${newPairs.length} rows à insérer dans tag_products (avant dédoublonnage DB)`)

  if (!WRITE) {
    console.log('—\nDry-run terminé. Relancer avec --write pour appliquer.')
    return
  }

  // ─── Step 5: insert with ON CONFLICT DO NOTHING ─────────────────────
  // Chunk to avoid huge single statement.
  const CHUNK = 500
  let inserted = 0
  for (let i = 0; i < newPairs.length; i += CHUNK) {
    const slice = newPairs.slice(i, i + CHUNK)
    const res = await db.insert(tagProducts).values(slice).onConflictDoNothing()
    // bun-sql doesn't always return rowCount for batch insert — fall back to length.
    inserted +=
      slice.length - ((res as unknown as { rowCount?: number }).rowCount === undefined ? 0 : 0)
  }
  console.log(`✅ Insertion terminée (${inserted} candidats, doublons silencieusement skipés).`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
