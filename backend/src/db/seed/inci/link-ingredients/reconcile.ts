// Decide what a re-link writes, without touching the DB. Kept pure and separate from main.ts
// so the guarantees below are unit-tested rather than asserted: main.ts runs on import.
//
// `product_ingredients` has no provenance column, so a concentration or a note is the only
// evidence a row was written by a human. Three rules follow:
//   - a link the recompute still derives is never rewritten, so its concentration survives
//   - a stale link is deleted only when it holds no human data
//   - an empty target deletes nothing: deriving zero links means the INCI failed to parse
//     (prose, glued tokens), not that the existing links are wrong

export interface CurrentLink {
  id: string
  slug: string
  curated: boolean
}

export interface ReconcilePlan {
  /** slugs present in the target but missing from the DB */
  add: string[]
  /** stale rows safe to delete */
  remove: CurrentLink[]
  /** stale rows a human edited — kept, and reported for arbitration */
  keptCurated: CurrentLink[]
}

export function planReconcile(current: CurrentLink[], target: Iterable<string>): ReconcilePlan {
  const targetSlugs = new Set(target)
  const currentSlugs = new Set(current.map((c) => c.slug))
  const add = [...targetSlugs].filter((slug) => !currentSlugs.has(slug))

  if (targetSlugs.size === 0) return { add, remove: [], keptCurated: [] }

  const stale = current.filter((c) => !targetSlugs.has(c.slug))
  return {
    add,
    remove: stale.filter((c) => !c.curated),
    keptCurated: stale.filter((c) => c.curated),
  }
}
