import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  hasUsablePortrait,
  isProfileFilterOff,
  isProfileFilterUndecided,
  setProfileFilterOff,
} from '../profileFilterSetting'

const USER_ID = 'user-1'

describe('standing profile filter opt-out', () => {
  beforeEach(() => window.localStorage.clear())

  it('defaults to on for a user who never opted out', () => {
    expect(isProfileFilterOff(USER_ID)).toBe(false)
  })

  it('round-trips the opt-out', () => {
    setProfileFilterOff(USER_ID, true)
    expect(isProfileFilterOff(USER_ID)).toBe(true)
    setProfileFilterOff(USER_ID, false)
    expect(isProfileFilterOff(USER_ID)).toBe(false)
  })

  it('keys the opt-out per user on a shared browser', () => {
    setProfileFilterOff('other-user', true)
    expect(isProfileFilterOff(USER_ID)).toBe(false)
  })

  it('ignores an anonymous caller on both sides', () => {
    setProfileFilterOff(null, true)
    expect(window.localStorage.length).toBe(0)
    expect(isProfileFilterOff(null)).toBe(false)
  })

  it('reads as opted in when storage throws (private mode)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    expect(isProfileFilterOff(USER_ID)).toBe(false)
    vi.restoreAllMocks()
  })

  it('swallows a write rejected by storage', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    expect(() => setProfileFilterOff(USER_ID, true)).not.toThrow()
    vi.restoreAllMocks()
  })
})

describe('isProfileFilterUndecided', () => {
  beforeEach(() => window.localStorage.clear())

  it('is true only while neither the URL nor storage states the choice', () => {
    expect(isProfileFilterUndecided(undefined, USER_ID)).toBe(true)
  })

  it('is false once storage states the choice', () => {
    setProfileFilterOff(USER_ID, true)
    expect(isProfileFilterUndecided(undefined, USER_ID)).toBe(false)
  })

  it('is false once the URL states the choice', () => {
    expect(isProfileFilterUndecided(true, USER_ID)).toBe(false)
    // The one that a truthiness test gets wrong: a stated "off" is an answer,
    // and profile_filter has no schema default so `false` survives the URL strip.
    expect(isProfileFilterUndecided(false, USER_ID)).toBe(false)
  })
})

describe('hasUsablePortrait', () => {
  it('is false without a portrait', () => {
    expect(hasUsablePortrait(null)).toBe(false)
    expect(hasUsablePortrait({ skinTypes: [], skinConcerns: [] } as never)).toBe(false)
  })

  it('is true on skin types or concerns alone', () => {
    expect(hasUsablePortrait({ skinTypes: ['dry'], skinConcerns: [] } as never)).toBe(true)
    expect(hasUsablePortrait({ skinTypes: [], skinConcerns: ['redness'] } as never)).toBe(true)
  })

  // The server derives avoid badges from neither, so a phototype-only portrait would
  // turn the toggle on for no visible effect.
  it('ignores a phototype-only portrait', () => {
    expect(hasUsablePortrait({ phototype: 3, skinTypes: [], skinConcerns: [] } as never)).toBe(
      false
    )
  })
})
