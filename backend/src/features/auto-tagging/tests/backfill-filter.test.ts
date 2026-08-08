import { describe, expect, it } from 'bun:test'

import type { Candidate, ClassifyResult } from '../runners/backfill/classify'
import { filterBackfillPlan } from '../runners/backfill/filter'

function candidate(tagSlug: string, relevance: Candidate['relevance']): Candidate {
  return {
    productId: `product-${tagSlug}`,
    productTagId: `id-${tagSlug}`,
    slug: `product-${tagSlug}`,
    tagSlug,
    relevance,
    source: 'formula',
  }
}

describe('filterBackfillPlan', () => {
  it('filters insert and upsert plans while preserving full-plan skipped counts', () => {
    const result: ClassifyResult = {
      toInsert: [candidate('keep', 'primary'), candidate('drop', 'secondary')],
      toUpsert: [candidate('keep', 'primary'), candidate('drop', 'avoid')],
      skipped: 7,
      primaryInserts: 1,
      primaryUpserts: 1,
    }

    expect(filterBackfillPlan(result, { tag: 'keep', excludeTag: null })).toEqual({
      toInsert: [candidate('keep', 'primary')],
      toUpsert: [candidate('keep', 'primary')],
      skipped: 7,
      primaryInserts: 1,
      primaryUpserts: 1,
    })
    expect(filterBackfillPlan(result, { tag: null, excludeTag: 'keep' })).toEqual({
      toInsert: [candidate('drop', 'secondary')],
      toUpsert: [candidate('drop', 'avoid')],
      skipped: 7,
      primaryInserts: 0,
      primaryUpserts: 0,
    })
  })
})
