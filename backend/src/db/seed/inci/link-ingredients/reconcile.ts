// Decide what a relink writes, without touching the DB. Kept pure and separate from main.ts
// so these rules are unit-tested rather than asserted: main.ts runs on import.

export interface CurrentLink {
  id: string
  slug: string
  canonicalKey: string | null
  /** Human-owned: `source` is `manual`, or (for rows written before that column existed)
   *  it carries a concentration or a note. */
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
    // Deriving zero links means the INCI failed to parse (prose, glued tokens), not that the
    // existing links are wrong. Never delete on an empty target.
    return { add: missing, remove: [], keptCurated: [], aliasConflicts: [] }
  }

  // A link the recompute still derives never enters `stale`, so it is never touched here:
  // its concentration and notes survive untouched.
  const stale = new Set(current.filter((c) => !targetSlugs.has(c.slug)))
  // Deleted only when the linker owns it; a human-curated stale row is kept and reported.
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
    // Two `ingredients` rows can share one canonical_key (hyaluronic-acid / sodium-hyaluronate);
    // inserting the derived slug next to a kept human row for that identity would duplicate the
    // ingredient on the sheet, so it is held back and reported instead.
    if (heldBy) aliasConflicts.push({ slug, heldBy })
    else add.push(slug)
  }

  return { add, remove, keptCurated, aliasConflicts }
}
