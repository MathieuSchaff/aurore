// Detect visible products claiming SPF (name or kind='sunscreen') whose stored INCI links no
// filtre-uv ingredient. The cause lives upstream in the scrape, not in linking: the INCIDecoder
// ingest only repairs a weak INCI (its three gates never fill an empty one), so a new hole would
// otherwise go unnoticed until the next manual recount. Report-only: no auto-fix exists for a
// missing source.

import { sql } from 'drizzle-orm'

import { withAdminRls } from '../../../../db/rls'
import { exitOnError } from '../cli-args'

async function main() {
  // Elevated read: products_select_visible would silently drop non-`visible` rows from a
  // coverage audit meant to scan the whole catalogue.
  const rows = await withAdminRls((tx) =>
    tx.execute(sql`
      SELECT p.slug, p.brand, p.name, p.kind
      FROM products p
      WHERE p.moderation_status = 'visible'
        AND (p.name ~* 'spf' OR p.kind = 'sunscreen')
        AND NOT EXISTS (
          SELECT 1 FROM product_ingredients pi
          JOIN ingredients i ON i.id = pi.ingredient_id
          WHERE pi.product_id = p.id AND i.category = 'filtre-uv'
        )
      ORDER BY p.brand, p.name
    `)
  )

  console.log('🔎 UV filter coverage (report-only)\n')
  console.log(`   ${rows.length} produit(s) SPF sans filtre-uv lié\n`)

  if (rows.length === 0) {
    console.log('✓ no SPF product without a linked filtre-uv')
    return
  }

  for (const p of rows) {
    console.log(`  ${p.kind.padEnd(10)} ${p.brand} | ${p.name} (${p.slug})`)
  }

  console.log(
    '\n  Not auto-fixed: the source INCI is usually empty or non-INCI prose (scrape quality).'
  )
  console.log('  New rows here after a catalogue ingest need triage, not a relink or a taxonomy')
  console.log('  pass.')
}

main()
  .then(() => process.exit(0))
  .catch(exitOnError)
