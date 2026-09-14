import { isNotFound } from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'

import { ApiError } from '../helpers/apiError'
import { notFoundOn404 } from '../routeErrors'

describe('notFoundOn404', () => {
  it('turns a 404 from the API into the router notFound', () => {
    let thrown: unknown
    try {
      notFoundOn404(new ApiError('product_not_found', 404))
    } catch (err) {
      thrown = err
    }
    expect(isNotFound(thrown)).toBe(true)
  })

  it('rethrows every other status so 5xx and 429 keep the real error UI', () => {
    const boom = new ApiError('internal_error', 500)
    expect(() => notFoundOn404(boom)).toThrow(boom)
    const throttled = new ApiError('rate_limited', 429)
    expect(() => notFoundOn404(throttled)).toThrow(throttled)
  })

  it('rethrows a foreign error untouched', () => {
    const offline = new TypeError('Failed to fetch')
    expect(() => notFoundOn404(offline)).toThrow(offline)
  })
})
