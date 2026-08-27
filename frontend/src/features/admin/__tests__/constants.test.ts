import { describe, expect, it } from 'vitest'

import { formatAdminCount } from '../constants'

describe('formatAdminCount', () => {
  it('uses the singular label for zero in French', () => {
    expect(formatAdminCount(0, { singular: 'compte', plural: 'comptes' })).toBe('0 compte')
  })
})
