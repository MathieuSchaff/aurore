// Deletes auto-sourced tag links for products whose category left AUTO_TAG_ELIGIBLE_CATEGORIES.
// Real recategorisations go through raw SQL in `.db-fixes`, bypassing the usual purge on write,
// and other runners select via fetchEligibleProducts() so they can't see these products either.
// Usage: `just autotag-purge-off-corpus` (dry-run by default, --write to apply).
import { and, eq, inArray, ne, notInArray } from 'drizzle-orm'

import { withAdminRls } from '../../../../db/rls'
import { products, productTagLinks, productTagTypes } from '../../../../db/schema'
import { AUTO_TAG_ELIGIBLE_CATEGORIES } from '../../lib/eligibility'
import { exitOnError, parseWriteSlugArgs } from '../cli-args'

const { write: WRITE } = parseWriteSlugArgs()

async function main() {
  console.log(
    `🧹 Purge auto-tags hors corpus · mode=${WRITE ? 'WRITE' : 'DRY-RUN'} · corpus=${AUTO_TAG_ELIGIBLE_CATEGORIES.join(', ')}`
  )

  // Admin RLS on the read too: products_select_visible would hide non-`visible`
  // rows and silently report less than what a later --write actually deletes.
  const staleLinks = await withAdminRls((tx) =>
    tx
      .select({
        productId: products.id,
        slug: products.slug,
        category: products.category,
        tagSlug: productTagTypes.slug,
      })
      .from(productTagLinks)
      .innerJoin(products, eq(productTagLinks.productId, products.id))
      .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
      .where(
        and(
          ne(productTagLinks.source, 'manual'),
          notInArray(products.category, [...AUTO_TAG_ELIGIBLE_CATEGORIES])
        )
      )
  )

  if (staleLinks.length === 0) {
    console.log('\n✨ Rien à purger.')
    return
  }

  const productIds = [...new Set(staleLinks.map((l) => l.productId))]
  const byCategory = new Map<string, number>()
  const productsByCategory = new Map<string, Set<string>>()
  for (const l of staleLinks) {
    byCategory.set(l.category, (byCategory.get(l.category) ?? 0) + 1)
    const set = productsByCategory.get(l.category) ?? new Set()
    set.add(l.productId)
    productsByCategory.set(l.category, set)
  }
  console.log(`   ${staleLinks.length} liens non-manuels sur ${productIds.length} produits`)
  for (const [category, links] of [...byCategory].sort((a, b) => b[1] - a[1]))
    console.log(
      `     ${category}: ${links} liens / ${productsByCategory.get(category)?.size} produits`
    )
  // Named per tag: an anonymous total hides which claim is about to leave the
  // catalogue, same reason as reconcile's per-slug breakdown.
  const byTag = new Map<string, number>()
  for (const l of staleLinks) byTag.set(l.tagSlug, (byTag.get(l.tagSlug) ?? 0) + 1)
  console.log('   --- liens par tag (top 25) ---')
  for (const [tagSlug, n] of [...byTag].sort((a, b) => b[1] - a[1]).slice(0, 25))
    console.log(`     ${n}\t${tagSlug}`)

  if (!WRITE) {
    console.log('\nRun avec --write pour supprimer.')
    return
  }
  // In-tx deletes carry no affected-row count on this driver; RETURNING is the
  // only truthful source (same reason as purge-stale-tag.ts).
  const deletedRows = await withAdminRls((tx) =>
    tx
      .delete(productTagLinks)
      .where(
        and(ne(productTagLinks.source, 'manual'), inArray(productTagLinks.productId, productIds))
      )
      .returning({ productId: productTagLinks.productId })
  )
  if (deletedRows.length !== staleLinks.length) {
    console.warn(
      `   ⚠ ${deletedRows.length} lignes supprimées pour ${staleLinks.length} planifiées`
    )
  }
  console.log(`✓ ${deletedRows.length} liens supprimés (manuels intacts)`)
}

main().catch(exitOnError)
