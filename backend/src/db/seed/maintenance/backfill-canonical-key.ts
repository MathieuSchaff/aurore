#!/usr/bin/env bun

/**
 * backfill-canonical-key.ts: populate ingredients.canonical_key from algo-derm's
 * curated evidence DB.
 *
 * The catalogue mixes slug schemes (English / French `huile-*` / INCI) and holds
 * `-hair` shadow duplicates, so `slug` is not a substance identity. algo-derm's
 * aliasIndex already normalizes INCI / common names / botanical parts; its
 * `evidence.inci` is the canonical identity. Every alias of one substance resolves
 * to the same key, so `-hair` shadows collapse onto their bare counterpart without
 * renaming or deleting any row.
 *
 * Best-effort: leaves canonical_key NULL when algo-derm has no match (FR / exotic
 * botanicals). `product_ingredients` is a curated optional subset, not a
 * completeness contract. An unkeyed ingredient is a coverage nit, not a defect.
 *
 * Resolution order per ingredient: name, then slug, then de-hyphenated slug with
 * the `-hair` suffix stripped (so `coconut-oil-hair` retries as `coconut oil`),
 * then the trailing parenthetical of the name. Catalogue names embed the INCI
 * there ("Huile de Macadamia (Macadamia Ternifolia Seed Oil)"), which resolves
 * when neither the full name nor the slug is a known alias. Blocked slugs stay
 * NULL and hard overrides win before the ladder runs; among the rungs' hits, an
 * ungraded French spelling stub yields to the graded English record.
 *
 * Usage:
 *   bun run src/db/seed/maintenance/backfill-canonical-key.ts          # dry-run
 *   bun run src/db/seed/maintenance/backfill-canonical-key.ts --write  # apply
 */

import { buildAliasIndex, lookupIngredient, MERGED_EVIDENCE_DB } from 'algo-derm/engine'
import { eq } from 'drizzle-orm'

import { db } from '../..'
import { withAdminRls } from '../../rls'
import { ingredients } from '../../schema/ingredients/ingredients'

const WRITE = process.argv.includes('--write')
const aliasIndex = buildAliasIndex(MERGED_EVIDENCE_DB)

// Slugs whose alias resolution collapses two distinct substances. The ladder below matches
// on words, so a narrower slug lands on its broader neighbour and inherits a dermo profile
// that was never measured on it. Left unkeyed on purpose: no key beats a wrong one.
//   - the bitter-orange trio: flower (neroli) and leaf (petitgrain) both fall on the peel oil,
//     which is the one carrying furocoumarins.
//   - Camellia oleifera is not Camellia sinensis (tea-seed vs green tea).
//   - EOS/EOP and NG/NS are separate CosIng names; the vendored alias index conflates them,
//     fixed upstream but not in this pin.
//   - a branded thermal spring water is not `Aqua`: the ladder resolves it there through the
//     name, which would hand one brand's fiche the identity of plain water.
export const UNRESOLVABLE_SLUGS = new Set([
  'avene-thermal-spring-water',
  'camellia-oleifera-leaf-extract',
  'ceramide-eos',
  'ceramide-ng',
  'citrus-aurantium-amara-flower-oil',
  'citrus-aurantium-amara-leaf-oil',
])

// The graded record and its French spelling are two unrelated rows in algo-derm, so when every
// rung lands on the stub there is nothing in the data to follow to the real one. Declared here
// rather than left to the ladder: keying a fiche on a stub makes it unreachable from a
// dermo-score driver AND from the INCI linker's canonical_key fallback.
// A bump that finally aliases the French spelling makes an entry redundant, not wrong (same key
// either way), so there is no staleness guard; target existence is asserted in the test instead.
//   - inuline is an editorial call: the fiche declares `Cichorium Intybus Root Extract`, which
//     has no algo-derm row, and `Inulin` is chicory-derived per its record. The granularity gap
//     (root extract vs purified inulin) is accepted.
export const CANONICAL_KEY_OVERRIDES: Record<string, string> = {
  astaxanthine: 'Astaxanthin',
  'astaxanthine-supplement': 'Astaxanthin',
  coq10: 'Ubiquinone',
  inuline: 'Inulin',
}

type EvidenceRecord = NonNullable<ReturnType<typeof lookupIngredient>>

// Not every `secondClass` record is a stub: Avobenzone or Idebenone carry a CAS and a graded
// risk, and some are the only record for their substance. The spelling placeholder that must
// yield is the ungraded one: no CosIng ref, no CAS, empty `risk`.
const isSpellingStub = (e: EvidenceRecord) =>
  Boolean(e.identity?.secondClass) &&
  !e.identity?.cosingRef &&
  !e.identity?.cas?.length &&
  Object.keys(e.risk ?? {}).length === 0

// The catalogue names are French, so the first rung lands on a spelling stub whenever the
// substance is graded under its English INCI name. Keep the stub only when no rung found the
// real record.
export const resolveFromLadder = (name: string, slug: string): string | null => {
  const bare = slug.replace(/-hair$/, '').replace(/-/g, ' ')
  const paren = name.match(/\(([^)]+)\)\s*$/)?.[1]
  const hits = [name, slug, bare, paren]
    .map((q) => (q ? lookupIngredient(q, aliasIndex) : undefined))
    .filter((e) => e !== undefined)

  return (hits.find((e) => !isSpellingStub(e)) ?? hits[0])?.inci ?? null
}

export const resolveCanonicalKey = (name: string, slug: string): string | null => {
  if (UNRESOLVABLE_SLUGS.has(slug)) return null
  return CANONICAL_KEY_OVERRIDES[slug] ?? resolveFromLadder(name, slug)
}

async function main() {
  const rows = await db
    .select({ id: ingredients.id, name: ingredients.name, slug: ingredients.slug })
    .from(ingredients)

  const updates: { id: string; key: string }[] = []
  for (const r of rows) {
    const key = resolveCanonicalKey(r.name, r.slug)
    if (key) updates.push({ id: r.id, key })
  }

  const groups = new Map<string, number>()
  for (const u of updates) groups.set(u.key, (groups.get(u.key) ?? 0) + 1)
  const collapsed = [...groups.values()].filter((n) => n > 1).length

  console.log(`ingredients: ${rows.length}`)
  console.log(
    `resolved:    ${updates.length} (${Math.round((updates.length / rows.length) * 100)}%)`
  )
  console.log(`null:        ${rows.length - updates.length}`)
  console.log(`canonical keys shared by >1 ingredient (identity collapse): ${collapsed}`)

  if (!WRITE) {
    console.log('\n[dry-run] re-run with --write to apply.')
    return
  }

  await withAdminRls(async (tx) => {
    // reset first so a re-run reflects an updated evidence DB (drops stale keys)
    await tx.update(ingredients).set({ canonicalKey: null })
    for (const u of updates) {
      await tx.update(ingredients).set({ canonicalKey: u.key }).where(eq(ingredients.id, u.id))
    }
  })

  console.log(`\napplied: set canonical_key on ${updates.length} ingredients.`)
}

// Guarded so the resolution ladder can be imported and tested without running the backfill.
if (import.meta.main) {
  await main()
  process.exit(0)
}
