// Read-only. Splits ingredients into the four states that matter for dermo-profile
// coverage, so a "missing profile" is attributed to the right layer instead of being
// read as an aurore defect. Worth re-running after every algo-derm bump.
//   keyed-no-data    — algo-derm knows the substance but records no comedogenicity/functions
//   keyed-data-lost  — algo-derm HAS data yet the row carries no profile  -> aurore bug
//   unkeyed-matchable — no canonical_key but the alias index resolves it  -> coverage to claim
//   unkeyed-unknown  — algo-derm does not know it at all                  -> nothing to do

import { buildAliasIndex, lookupIngredient, MERGED_EVIDENCE_DB } from 'algo-derm/engine'
import { isNotNull } from 'drizzle-orm'

import { db } from '../..'
import { ingredientDermoProfiles } from '../../schema/ingredients/ingredient-dermo-profiles'
import { ingredients } from '../../schema/ingredients/ingredients'

const aliasIndex = buildAliasIndex(MERGED_EVIDENCE_DB)
const byKey = new Map(Object.values(MERGED_EVIDENCE_DB).map((r) => [r.inci, r]))

const hasData = (key: string): boolean => {
  const rec = byKey.get(key)
  if (!rec) return false
  return rec.risk?.comedogenicity !== undefined || (rec.identity?.functions?.length ?? 0) > 0
}

// Same resolution ladder as backfill-canonical-key, kept in sync by hand.
const resolve = (name: string, slug: string): string | null => {
  const bare = slug.replace(/-hair$/, '').replace(/-/g, ' ')
  const paren = name.match(/\(([^)]+)\)\s*$/)?.[1]
  return (
    lookupIngredient(name, aliasIndex)?.inci ??
    lookupIngredient(slug, aliasIndex)?.inci ??
    lookupIngredient(bare, aliasIndex)?.inci ??
    (paren ? (lookupIngredient(paren, aliasIndex)?.inci ?? null) : null)
  )
}

const rows = await db
  .select({
    id: ingredients.id,
    name: ingredients.name,
    slug: ingredients.slug,
    key: ingredients.canonicalKey,
  })
  .from(ingredients)

const profiled = new Set(
  (
    await db
      .select({ id: ingredientDermoProfiles.ingredientId })
      .from(ingredientDermoProfiles)
      .where(isNotNull(ingredientDermoProfiles.ingredientId))
  ).map((r) => r.id)
)

const buckets = {
  'keyed-no-data': [] as string[],
  'keyed-data-lost': [] as string[],
  'unkeyed-matchable': [] as string[],
  'unkeyed-unknown': [] as string[],
}

for (const r of rows) {
  if (r.key) {
    if (profiled.has(r.id)) continue
    buckets[hasData(r.key) ? 'keyed-data-lost' : 'keyed-no-data'].push(`${r.slug} [${r.key}]`)
    continue
  }
  const match = resolve(r.name, r.slug)
  if (match)
    buckets['unkeyed-matchable'].push(`${r.slug} -> ${match}${hasData(match) ? ' *DATA*' : ''}`)
  else buckets['unkeyed-unknown'].push(r.slug)
}

for (const [label, list] of Object.entries(buckets)) {
  console.log(`\n${label}: ${list.length}`)
  if (label !== 'unkeyed-unknown') for (const line of list) console.log(`  ${line}`)
}
process.exit(0)
