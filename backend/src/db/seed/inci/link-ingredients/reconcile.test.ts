import { describe, expect, it } from 'bun:test'

import { type CurrentLink, planReconcile } from './reconcile'

const link = (slug: string, curated = false, canonicalKey: string | null = null): CurrentLink => ({
  id: `id-${slug}`,
  slug,
  canonicalKey,
  curated,
})

describe('planReconcile', () => {
  it('inserts only the slugs missing from the DB', () => {
    const plan = planReconcile([link('niacinamide')], ['niacinamide', 'panthenol'])
    expect(plan.add).toEqual(['panthenol'])
  })

  it('leaves a still-derived link alone, so its concentration is never rewritten', () => {
    const plan = planReconcile([link('vitamin-c', true)], ['vitamin-c'])
    expect(plan.add).toEqual([])
    expect(plan.remove).toEqual([])
    expect(plan.keptCurated).toEqual([])
  })

  it('deletes a stale link that carries no human data', () => {
    const plan = planReconcile([link('propanediol'), link('niacinamide')], ['niacinamide'])
    expect(plan.remove.map((c) => c.slug)).toEqual(['propanediol'])
    expect(plan.keptCurated).toEqual([])
  })

  it('keeps a stale link that carries a concentration or a note', () => {
    const plan = planReconcile([link('dimethicone', true), link('niacinamide')], ['niacinamide'])
    expect(plan.remove).toEqual([])
    expect(plan.keptCurated.map((c) => c.slug)).toEqual(['dimethicone'])
  })

  it('deletes nothing when the recompute derives no slug at all', () => {
    const current = [link('glycerin'), link('vitamin-c', true)]
    const plan = planReconcile(current, [])
    expect(plan.add).toEqual([])
    expect(plan.remove).toEqual([])
    expect(plan.keptCurated).toEqual([])
  })

  it('holds back an insert when a kept human row is already the same substance', () => {
    const identities = new Map([
      ['hyaluronic-acid', 'Hyaluronic Acid'],
      ['sodium-hyaluronate', 'Hyaluronic Acid'],
    ])
    const current = [link('sodium-hyaluronate', true, 'Hyaluronic Acid')]

    const plan = planReconcile(current, ['hyaluronic-acid', 'niacinamide'], identities)

    expect(plan.add).toEqual(['niacinamide'])
    expect(plan.aliasConflicts.map((c) => c.slug)).toEqual(['hyaluronic-acid'])
    expect(plan.aliasConflicts[0]?.heldBy.slug).toBe('sodium-hyaluronate')
  })

  // The row is about to go, so it cannot shadow the slug that replaces it.
  it('still inserts when the row holding that substance is being deleted', () => {
    const identities = new Map([
      ['hyaluronic-acid', 'Hyaluronic Acid'],
      ['sodium-hyaluronate', 'Hyaluronic Acid'],
    ])
    const current = [link('sodium-hyaluronate', false, 'Hyaluronic Acid')]

    const plan = planReconcile(current, ['hyaluronic-acid'], identities)

    expect(plan.add).toEqual(['hyaluronic-acid'])
    expect(plan.remove.map((c) => c.slug)).toEqual(['sodium-hyaluronate'])
    expect(plan.aliasConflicts).toEqual([])
  })

  it('does not add a slug that is already linked, whatever the target order', () => {
    const plan = planReconcile(
      [link('panthenol'), link('niacinamide')],
      ['niacinamide', 'panthenol']
    )
    expect(plan.add).toEqual([])
    expect(plan.remove).toEqual([])
  })
})
