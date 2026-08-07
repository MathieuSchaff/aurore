import { describe, expect, it } from 'bun:test'

import type { Candidate, ClassifyResult } from '../runners/backfill/classify'
import { createBackfillReport } from '../runners/backfill/report'

const candidates = Array.from(
  { length: 60 },
  (_, index): Candidate => ({
    productId: `product-${String(index).padStart(2, '0')}`,
    productTagId: `tag-${index % 3}`,
    slug: `product-${index}`,
    tagSlug: `tag-${index % 3}`,
    relevance: index % 5 === 0 ? 'primary' : 'secondary',
    source: 'formula',
  })
)

function addCandidates(
  report: ReturnType<typeof createBackfillReport>,
  pageCandidates: Candidate[]
): void {
  const result: ClassifyResult = {
    toInsert: pageCandidates,
    toUpsert: [],
    skipped: 0,
    primaryInserts: pageCandidates.filter((candidate) => candidate.relevance === 'primary').length,
    primaryUpserts: 0,
  }
  report.addPage({
    products: pageCandidates.map((candidate) => ({
      id: candidate.productId,
      slug: candidate.slug,
      name: candidate.slug,
      inci: 'Aqua',
    })),
    noInci: 0,
    candidateCount: pageCandidates.length,
    result,
    eczemaReviewQueue: [],
  })
}

describe('createBackfillReport', () => {
  it('keeps aggregation stable across page splits without retaining the full plan', () => {
    const singlePage = createBackfillReport({ sampleSize: 3, seed: 42 })
    addCandidates(singlePage, candidates)

    const paged = createBackfillReport({ sampleSize: 3, seed: 42 })
    for (let index = 0; index < candidates.length; index += 20) {
      addCandidates(paged, candidates.slice(index, index + 20))
    }

    const { pages: singlePageCount, ...singlePageReport } = singlePage.snapshot()
    const { pages: pagedCount, ...pagedReport } = paged.snapshot()

    expect(pagedReport).toEqual(singlePageReport)
    expect([singlePageCount, pagedCount]).toEqual([1, 3])
    expect(pagedReport.sample).toHaveLength(3)
    expect(pagedReport.insertDetails).toHaveLength(50)
  })
})
