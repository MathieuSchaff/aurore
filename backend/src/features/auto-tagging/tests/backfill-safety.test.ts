import { describe, expect, it } from 'bun:test'

import { assertSafeBackfillExecution } from '../runners/backfill/safety'

describe('assertSafeBackfillExecution', () => {
  it('requires the isolated runner for every production run', () => {
    for (const rejected of [
      { nodeEnv: 'production', isolatedRunner: false, slug: null, limit: null },
      { nodeEnv: 'production', isolatedRunner: false, slug: 'one-product', limit: null },
      { nodeEnv: 'production', isolatedRunner: false, slug: null, limit: 100 },
    ] as const) {
      expect(() => assertSafeBackfillExecution(rejected)).toThrow(
        'production backfill requires the isolated runner'
      )
    }

    for (const allowed of [
      { nodeEnv: 'development', isolatedRunner: false, slug: null, limit: null },
      { nodeEnv: 'development', isolatedRunner: false, slug: 'one-product', limit: null },
      { nodeEnv: 'development', isolatedRunner: false, slug: null, limit: 100 },
      { nodeEnv: 'production', isolatedRunner: true, slug: null, limit: null },
      { nodeEnv: 'production', isolatedRunner: true, slug: 'one-product', limit: null },
      { nodeEnv: 'production', isolatedRunner: true, slug: null, limit: 100 },
    ] as const) {
      expect(() => assertSafeBackfillExecution(allowed)).not.toThrow()
    }
  })
})
