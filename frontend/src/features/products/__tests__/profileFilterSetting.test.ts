import { beforeEach, describe, expect, it, vi } from 'vitest'

import { isProfileFilterOff, setProfileFilterOff } from '../profileFilterSetting'

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
