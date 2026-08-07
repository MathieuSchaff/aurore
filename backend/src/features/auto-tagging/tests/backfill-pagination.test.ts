import { describe, expect, it } from 'bun:test'

import { type Candidate, classifyCandidates, type Relevance } from '../runners/backfill/classify'
import { runBackfillPages } from '../runners/backfill/pagination'

interface Product {
  id: string
}

describe('runBackfillPages', () => {
  it('processes the corpus once while exposing at most one page', async () => {
    const corpus = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id }))
    const processed: string[] = []
    let largestPage = 0

    const result = await runBackfillPages<Product>(
      { pageSize: 2, limit: null, slug: null },
      {
        fetchPage: ({ afterId, limit }) =>
          Promise.resolve(
            corpus.filter((product) => !afterId || product.id > afterId).slice(0, limit)
          ),
        processPage: (products) => {
          largestPage = Math.max(largestPage, products.length)
          processed.push(...products.map((product) => product.id))
          return Promise.resolve()
        },
      }
    )

    expect(processed).toEqual(['a', 'b', 'c', 'd', 'e'])
    expect(new Set(processed).size).toBe(corpus.length)
    expect(largestPage).toBe(2)
    expect(result).toEqual({ pages: 3, products: 5, lastCursor: 'e' })
  })

  it('converges after a later page fails and the whole run restarts', async () => {
    const corpus = ['a', 'b', 'c', 'd'].map((id) => ({ id }))
    const existing = new Map<string, Relevance>()
    let failSecondPage = true

    const run = () =>
      runBackfillPages<Product>(
        { pageSize: 2, limit: null, slug: null },
        {
          fetchPage: ({ afterId, limit }) =>
            Promise.resolve(
              corpus.filter((product) => !afterId || product.id > afterId).slice(0, limit)
            ),
          processPage: (products) => {
            const candidates = new Map<string, Candidate>()
            for (const product of products) {
              const pairKey = `${product.id}:tag`
              candidates.set(pairKey, {
                productId: product.id,
                productTagId: 'tag',
                slug: product.id,
                tagSlug: 'tag',
                relevance: 'secondary',
                source: 'formula',
              })
            }
            const result = classifyCandidates(candidates, existing, new Set(), new Set())
            if (failSecondPage && products[0]?.id === 'c') {
              failSecondPage = false
              throw new Error('injected page failure')
            }
            for (const candidate of result.toInsert) {
              existing.set(`${candidate.productId}:${candidate.productTagId}`, candidate.relevance)
            }
            return Promise.resolve()
          },
        }
      )

    await expect(run()).rejects.toThrow('injected page failure')
    expect([...existing.keys()]).toEqual(['a:tag', 'b:tag'])

    await run()

    expect([...existing.keys()]).toEqual(['a:tag', 'b:tag', 'c:tag', 'd:tag'])
  })
})
