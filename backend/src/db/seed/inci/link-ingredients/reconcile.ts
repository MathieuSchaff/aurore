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
  /** automatic stale rows held while the declaration cannot prove absence */
  heldDeletions: CurrentLink[]
  /** stale rows a human owns: kept, and reported for arbitration */
  keptCurated: CurrentLink[]
  /** derived slugs held back because a surviving row already carries the same canonical_key */
  aliasConflicts: Array<{ slug: string; heldBy: CurrentLink }>
}

function indexSurvivingIdentities(
  current: CurrentLink[],
  stale: ReadonlySet<CurrentLink>,
  holdDeletions: boolean
): Map<string, CurrentLink> {
  const survivors = new Map<string, CurrentLink>()
  for (const link of current) {
    if (!link.canonicalKey || (stale.has(link) && !link.curated && !holdDeletions)) continue
    if (!survivors.has(link.canonicalKey)) survivors.set(link.canonicalKey, link)
  }
  return survivors
}

export function planReconcile(
  current: CurrentLink[],
  target: Iterable<string>,
  canonicalKeyBySlug: ReadonlyMap<string, string> = new Map(),
  holdDeletions = false
): ReconcilePlan {
  const targetSlugs = new Set(target)
  const currentSlugs = new Set(current.map((c) => c.slug))
  const missing = [...targetSlugs].filter((slug) => !currentSlugs.has(slug))

  if (targetSlugs.size === 0) {
    // Deriving zero links means the INCI failed to parse (prose, glued tokens), not that the
    // existing links are wrong. Never delete on an empty target.
    return { add: missing, remove: [], heldDeletions: [], keptCurated: [], aliasConflicts: [] }
  }

  // A link the recompute still derives never enters `stale`, so it is never touched here:
  // its concentration and notes survive untouched.
  const stale = new Set(current.filter((c) => !targetSlugs.has(c.slug)))
  // Deleted only when the linker owns it; a human-curated stale row is kept and reported.
  const automaticStale = [...stale].filter((c) => !c.curated)
  const remove = holdDeletions ? [] : automaticStale
  const heldDeletions = holdDeletions ? automaticStale : []
  const keptCurated = [...stale].filter((c) => c.curated)

  const survivorByIdentity = indexSurvivingIdentities(current, stale, holdDeletions)

  const add: string[] = []
  const aliasConflicts: ReconcilePlan['aliasConflicts'] = []
  for (const slug of missing) {
    const identity = canonicalKeyBySlug.get(slug)
    const heldBy = identity ? survivorByIdentity.get(identity) : undefined
    // Two `ingredients` rows can share one canonical_key (hyaluronic-acid / sodium-hyaluronate);
    // inserting the derived slug next to a surviving row for that identity would duplicate the
    // ingredient on the sheet, so it is held back and reported instead.
    if (heldBy) aliasConflicts.push({ slug, heldBy })
    else add.push(slug)
  }

  return { add, remove, heldDeletions, keptCurated, aliasConflicts }
}
