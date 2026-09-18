import { describe, expect, it } from 'bun:test'

import { bannedErrorDetailsSchema } from './ban'

describe('bannedErrorDetailsSchema', () => {
  it('replaces a malformed expiry with the neutral fallback', () => {
    expect(
      bannedErrorDetailsSchema.parse({
        expiresAt: 'not-a-date',
        reason: null,
      })
    ).toEqual({ expiresAt: null, reason: null })
  })
})
