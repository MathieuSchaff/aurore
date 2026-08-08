// Read-only. Splits ingredients into the states that matter for dermo-profile
// coverage, so a "missing profile" is attributed to the right layer instead of being
// read as an aurore defect. Worth running again after every algo-derm bump.

import { MERGED_EVIDENCE_DB } from 'algo-derm/engine'
import { isNotNull } from 'drizzle-orm'

import { db } from '../..'
import { ingredientDermoProfiles } from '../../schema/ingredients/ingredient-dermo-profiles'
import { ingredients } from '../../schema/ingredients/ingredients'
import {
  resolveCanonicalKey,
  resolveFromLadder,
  UNRESOLVABLE_SLUGS,
} from './backfill-canonical-key'

const byKey = new Map(Object.values(MERGED_EVIDENCE_DB).map((r) => [r.inci, r]))

const hasData = (key: string): boolean => {
  const rec = byKey.get(key)
  if (!rec) return false
  return rec.risk?.comedogenicity !== undefined || (rec.identity?.functions?.length ?? 0) > 0
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
  // algo-derm knows the substance but records no comedogenicity/functions
  'keyed-no-data': [] as string[],
  // algo-derm HAS data yet the row carries no profile: aurore bug
  'keyed-data-lost': [] as string[],
  // no canonical_key but the alias index resolves it: coverage to claim
  'unkeyed-matchable': [] as string[],
  // resolvable but the match is a known conflation: must stay unkeyed
  'unkeyed-blocked': [] as string[],
  // algo-derm does not know it at all: nothing to do
  'unkeyed-unknown': [] as string[],
}

for (const r of rows) {
  if (r.key) {
    if (profiled.has(r.id)) continue
    buckets[hasData(r.key) ? 'keyed-data-lost' : 'keyed-no-data'].push(`${r.slug} [${r.key}]`)
    continue
  }
  // Blocked slugs resolve to null by design; the audit still wants to show what the
  // ladder would reach for them, so they query the ladder directly.
  const match = UNRESOLVABLE_SLUGS.has(r.slug)
    ? resolveFromLadder(r.name, r.slug)
    : resolveCanonicalKey(r.name, r.slug)
  if (!match) {
    buckets['unkeyed-unknown'].push(r.slug)
    continue
  }
  const bucket = UNRESOLVABLE_SLUGS.has(r.slug) ? 'unkeyed-blocked' : 'unkeyed-matchable'
  buckets[bucket].push(`${r.slug} -> ${match}${hasData(match) ? ' *DATA*' : ''}`)
}

for (const [label, list] of Object.entries(buckets)) {
  console.log(`\n${label}: ${list.length}`)
  if (label !== 'unkeyed-unknown') for (const line of list) console.log(`  ${line}`)
}
process.exit(0)
