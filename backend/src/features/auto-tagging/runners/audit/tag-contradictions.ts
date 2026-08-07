// Absence tags whose INCI declares the very thing they deny (report-only). Read-only.
// The blind spot this closes: a backfill's red-flag scan only sees links about to INSERT, so
// a product that already carries the tag is never a candidate: a backfill run can report "0
// alerts" while liars stay in the DB. Measured on the 2026-07-30 CSV: 101 candidate
// `sans-parfum` rows, 0 of the 21 liars among them. This audit reads the already-written links.

import { eq, inArray } from 'drizzle-orm'

import { withAdminRls } from '../../../../db/rls'
import { products, productTagLinks, productTagTypes } from '../../../../db/schema'
import { ABSENCE_REFUTERS } from '../../lib/absence-refuters'
import { exitOnError } from '../cli-args'

interface Contradiction {
  tag: string
  slug: string
  brand: string
  source: string
  token: string
}

const TAGS = ABSENCE_REFUTERS.map((r) => r.tag)
const REFUTING_TOKEN = new Map(ABSENCE_REFUTERS.map((r) => [r.tag as string, r.refutingToken]))
const NOTES = new Map(ABSENCE_REFUTERS.map((r) => [r.tag as string, r.note]))

async function main() {
  // Elevated read: products_select_visible would drop non-`visible` rows, and a moderated-out
  // product still carries its links, and hiding them would understate the corpus.
  const rows = await withAdminRls((tx) =>
    tx
      .select({
        tag: productTagTypes.slug,
        slug: products.slug,
        brand: products.brand,
        source: productTagLinks.source,
        inci: products.inci,
      })
      .from(productTagLinks)
      .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
      .innerJoin(products, eq(productTagLinks.productId, products.id))
      .where(inArray(productTagTypes.slug, TAGS))
  )

  const hits: Contradiction[] = []
  for (const r of rows) {
    if (!r.inci?.trim()) continue
    const token = REFUTING_TOKEN.get(r.tag)?.(r.inci)
    if (!token) continue
    hits.push({ tag: r.tag, slug: r.slug, brand: r.brand, source: r.source, token })
  }

  console.log('🚩 Absence tags contredits par leur propre INCI (report-only)\n')
  console.log(
    `   ${rows.length} liens scannés sur ${TAGS.length} tags · ${hits.length} contradiction(s)\n`
  )

  if (hits.length === 0) {
    console.log('✓ aucun tag d’absence contredit par son INCI')
    return
  }

  const byTag = new Map<string, Contradiction[]>()
  for (const h of hits) {
    const list = byTag.get(h.tag)
    if (list) list.push(h)
    else byTag.set(h.tag, [h])
  }

  // Ventilated by `source`: algo-derm = vendored heuristic missed it (fix via heuristic_rules.json
  // vendor bump); formula = text-claim veto (absence-claims.ts) has a hole; manual = curated row
  // nobody checks again; reconcile.ts filters `ne(source, 'manual')` and purge-stale obeys the
  // same rule, so it stays until a human deletes it.
  console.log('| tag | contradictions | dont manual | dont algo-derm | dont autre |')
  console.log('|---|---|---|---|---|')
  for (const tag of TAGS) {
    const list = byTag.get(tag) ?? []
    if (list.length === 0) continue
    const manual = list.filter((h) => h.source === 'manual').length
    const algo = list.filter((h) => h.source === 'algo-derm').length
    console.log(
      `| ${tag} | ${list.length} | ${manual} | ${algo} | ${list.length - manual - algo} |`
    )
  }

  for (const tag of TAGS) {
    const list = byTag.get(tag)
    if (!list?.length) continue
    console.log(`\n── ${tag} (${list.length}) ──`)
    console.log(`   ${NOTES.get(tag)}`)
    // Grouped by triggering token: one bad pattern shows up as one block, not as N products.
    const byToken = new Map<string, Contradiction[]>()
    for (const h of list) {
      const same = byToken.get(h.token)
      if (same) same.push(h)
      else byToken.set(h.token, [h])
    }
    const blocks = [...byToken.entries()].sort((a, b) => b[1].length - a[1].length)
    for (const [token, group] of blocks) {
      console.log(`  « ${token} » — ${group.length}`)
      for (const h of group.sort((a, b) => a.slug.localeCompare(b.slug))) {
        console.log(`     [${h.source}] ${h.brand} | ${h.slug}`)
      }
    }
  }

  console.log('\n  Ni le tag ni l’INCI ne fait foi ici : les deux se présentent identiquement en')
  console.log('  base. Trancher contre la page source du produit, jamais à la lecture de la liste.')
  console.log('  INCI juste, tag faux → supprimer la ligne par `.db-fixes` (scopé au couple).')
  console.log('  INCI faux, tag juste → réparer l’INCI, puis link-ingredients et reconcile.')
}

main()
  .then(() => process.exit(0))
  .catch(exitOnError)
