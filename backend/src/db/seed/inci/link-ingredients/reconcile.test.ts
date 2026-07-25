import { describe, expect, it } from 'bun:test'

import { type CurrentLink, planReconcile } from './reconcile'

const link = (slug: string, curated = false): CurrentLink => ({ id: `id-${slug}`, slug, curated })

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

  it('does not re-add a slug already linked, whatever the target order', () => {
    const plan = planReconcile(
      [link('panthenol'), link('niacinamide')],
      ['niacinamide', 'panthenol']
    )
    expect(plan.add).toEqual([])
    expect(plan.remove).toEqual([])
  })
})
