import { HOLY_GRAIL_SENTIMENT } from '@aurore/shared'

import { describe, expect, it } from 'vitest'

import { collectionSearchSchema } from '@/routes/_authenticated/collection.index'

describe('collectionSearchSchema', () => {
  it('accepts the Holy Grail sentiment exposed by the collection filter', () => {
    expect(collectionSearchSchema.parse({ sentiment: HOLY_GRAIL_SENTIMENT }).sentiment).toBe(
      HOLY_GRAIL_SENTIMENT
    )
  })
})
