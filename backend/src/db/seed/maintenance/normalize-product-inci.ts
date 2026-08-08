#!/usr/bin/env bun

// Rewrites products.inci to its governed canonical form (algo-derm cleanInci,
// then canonical), so the same substance reads identically across the catalogue.
// Shares normalizeInci with the create/update write path, so backfill and live
// writes can never drift.

// Usage:
//   bun run src/db/seed/maintenance/normalize-product-inci.ts          # dry-run
//   bun run src/db/seed/maintenance/normalize-product-inci.ts --write  # apply

import type { ProductCategory } from '@aurore/shared'

import { and, eq, inArray, isNotNull } from 'drizzle-orm'

import { normalizeInci } from '../../../lib/normalize-inci'
import { db } from '../..'
import { withAdminRls } from '../../rls'
import { products } from '../../schema/products'

const WRITE = process.argv.includes('--write')

// Scoped to skincare-eligible categories: rows outside skincare (supplements, dental,
// fibres) carry usage prose in `inci`, not ingredients, so normalizing them would
// fabricate plausible-looking INCI from garbage.
// Mirrors AUTO_TAG_ELIGIBLE_CATEGORIES (auto-tagging/orchestrator); kept local to
// avoid pulling the tagging engine into a seed script.
const NORMALIZE_CATEGORIES: ProductCategory[] = ['skincare', 'solaire', 'bodycare']

async function main() {
  const rows = await db
    .select({ id: products.id, slug: products.slug, inci: products.inci })
    .from(products)
    .where(and(isNotNull(products.inci), inArray(products.category, NORMALIZE_CATEGORIES)))

  const updates: { id: string; before: string; after: string }[] = []
  let skippedGuardrail = 0
  const guardrailDrops: Array<{ slug: string; tokensBefore: number; tokensAfter: number }> = []

  for (const r of rows) {
    if (!r.inci) continue
    const result = normalizeInci(r.inci)
    // Guardrail (see normalizeInci): keep the original when cleaning halves the
    // token count. Unknown tokens (FR / exotic) pass through unchanged.
    if (result.guardrailTripped) {
      skippedGuardrail++
      if (guardrailDrops.length < 6)
        guardrailDrops.push({
          slug: r.slug,
          tokensBefore: result.tokensBefore,
          tokensAfter: result.tokensAfter,
        })
      continue
    }
    if (result.changed) updates.push({ id: r.id, before: r.inci, after: result.value })
  }

  console.log(`products with inci: ${rows.length}`)
  console.log(`to rewrite:         ${updates.length}`)
  console.log(`skipped guardrail:  ${skippedGuardrail}`)

  console.log('\n=== Previews ===')
  for (const u of updates.slice(0, 12)) {
    console.log(`\n  ${u.before.slice(0, 180)}`)
    console.log(`  → ${u.after.slice(0, 180)}`)
  }

  if (guardrailDrops.length > 0) {
    console.log(`\n=== Guardrail drops (${guardrailDrops.length} of ${skippedGuardrail}) ===`)
    console.table(guardrailDrops)
  }

  if (!WRITE) {
    console.log('\n[dry-run] re-run with --write to apply.')
    return
  }

  await withAdminRls(async (tx) => {
    for (const u of updates) {
      await tx.update(products).set({ inci: u.after }).where(eq(products.id, u.id))
    }
  })

  console.log(`\napplied: rewrote inci on ${updates.length} products.`)
}

await main()
process.exit(0)
