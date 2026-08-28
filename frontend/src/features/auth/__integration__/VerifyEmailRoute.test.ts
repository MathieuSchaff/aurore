import { describe, expect, it } from 'vitest'

import { Route } from '@/routes/auth/verify-email'

describe('verify-email route search', () => {
  it('drops a non-string token', () => {
    const validateSearch = Route.options.validateSearch

    if (typeof validateSearch !== 'function') {
      throw new TypeError('Expected route search validator to be a function')
    }
    expect(validateSearch({ token: 123 })).toEqual({ token: undefined })
  })
})
