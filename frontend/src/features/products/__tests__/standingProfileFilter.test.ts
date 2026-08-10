import { beforeEach, describe, expect, it, vi } from 'vitest'

import { hasPortrait, readOptOut, writeOptOut } from '../standingProfileFilter'

const USER_ID = 'user-1'

describe('standing profile filter opt-out', () => {
  beforeEach(() => window.localStorage.clear())

  it('defaults to on for a user who never opted out', () => {
    expect(readOptOut(USER_ID)).toBe(false)
  })

  it('round-trips the opt-out', () => {
    writeOptOut(USER_ID, true)
    expect(readOptOut(USER_ID)).toBe(true)
    writeOptOut(USER_ID, false)
    expect(readOptOut(USER_ID)).toBe(false)
  })

  it('keys the opt-out per user on a shared browser', () => {
    writeOptOut('other-user', true)
    expect(readOptOut(USER_ID)).toBe(false)
  })

  it('ignores an anonymous caller on both sides', () => {
    writeOptOut(null, true)
    expect(window.localStorage.length).toBe(0)
    expect(readOptOut(null)).toBe(false)
  })

  it('reads as opted in when storage throws (private mode)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    expect(readOptOut(USER_ID)).toBe(false)
    vi.restoreAllMocks()
  })

  it('swallows a write rejected by storage', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    expect(() => writeOptOut(USER_ID, true)).not.toThrow()
    vi.restoreAllMocks()
  })
})

describe('hasPortrait', () => {
  it('is false without a portrait', () => {
    expect(hasPortrait(null)).toBe(false)
    expect(hasPortrait({ skinTypes: [], skinConcerns: [] } as never)).toBe(false)
  })

  it('is true on skin types or concerns alone', () => {
    expect(hasPortrait({ skinTypes: ['dry'], skinConcerns: [] } as never)).toBe(true)
    expect(hasPortrait({ skinTypes: [], skinConcerns: ['redness'] } as never)).toBe(true)
  })

  // deriveAvoidFor reads neither, so a phototype-only portrait would turn the toggle
  // on for no visible effect.
  it('ignores a phototype-only portrait', () => {
    expect(hasPortrait({ phototype: 3, skinTypes: [], skinConcerns: [] } as never)).toBe(false)
  })
})
