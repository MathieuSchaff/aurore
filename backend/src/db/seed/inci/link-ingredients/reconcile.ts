// Decide what a re-link writes, without touching the DB. Kept pure and separate from main.ts
// so the guarantees below are unit-tested rather than asserted: main.ts runs on import.
//
// A row is human-owned when `product_ingredients.source` says `manual`, or, for rows written
// before that column existed, when it carries a concentration or a note. Three rules follow:
//   - a link the recompute still derives is never rewritten, so its concentration survives
//   - a stale link is deleted only when the linker owns it
//   - an empty target deletes nothing: deriving zero links means the INCI failed to parse
//     (prose, glued tokens), not that the existing links are wrong
//
// A fourth rule covers substance identity. Two `ingredients` rows can be the same substance
// under one `canonical_key` (`hyaluronic-acid` beside `sodium-hyaluronate`). Adding the derived
// slug next to a kept human row for that identity puts the ingredient on the sheet twice, the
// class of duplicate a hand-written SQL already had to fold once. Hold it back and report it.

export interface CurrentLink {
  id: string
  slug: string
  canonicalKey: string | null
  curated: boolean
}

export interface ReconcilePlan {
  /** slugs present in the target but missing from the DB */
  add: string[]
  /** stale rows safe to delete */
  remove: CurrentLink[]
  /** stale rows a human owns: kept, and reported for arbitration */
  keptCurated: CurrentLink[]
  /** derived slugs held back because a surviving row already carries the same canonical_key */
  aliasConflicts: Array<{ slug: string; heldBy: CurrentLink }>
}

export function planReconcile(
  current: CurrentLink[],
  target: Iterable<string>,
  canonicalKeyBySlug: ReadonlyMap<string, string> = new Map()
): ReconcilePlan {
  const targetSlugs = new Set(target)
  const currentSlugs = new Set(current.map((c) => c.slug))
  const missing = [...targetSlugs].filter((slug) => !currentSlugs.has(slug))

  if (targetSlugs.size === 0) {
    return { add: missing, remove: [], keptCurated: [], aliasConflicts: [] }
  }

  const stale = new Set(current.filter((c) => !targetSlugs.has(c.slug)))
  const remove = [...stale].filter((c) => !c.curated)
  const keptCurated = [...stale].filter((c) => c.curated)

  // Only a row that survives this run can shadow an insert. A row about to be deleted cannot.
  const survivorByIdentity = new Map<string, CurrentLink>()
  for (const c of current) {
    if (!c.canonicalKey || (stale.has(c) && !c.curated)) continue
    if (!survivorByIdentity.has(c.canonicalKey)) survivorByIdentity.set(c.canonicalKey, c)
  }

  const add: string[] = []
  const aliasConflicts: ReconcilePlan['aliasConflicts'] = []
  for (const slug of missing) {
    const identity = canonicalKeyBySlug.get(slug)
    const heldBy = identity ? survivorByIdentity.get(identity) : undefined
    if (heldBy) aliasConflicts.push({ slug, heldBy })
    else add.push(slug)
  }

  return { add, remove, keptCurated, aliasConflicts }
}
