import type { UserDermoProfile } from '@aurore/shared'

// Only "off" is ever stored: the toggle defaults to on, so a new device needs no
// stored value to behave right, and no DB column has to carry the setting.
// Keyed per user, otherwise one account's "off" silences the next account's
// declared rules on a shared browser.
const profileFilterOffKey = (userId: string) => `products-profile-filter-off:${userId}`

export function isProfileFilterOff(userId: string | null): boolean {
  if (typeof window === 'undefined' || !userId) return false
  try {
    return window.localStorage.getItem(profileFilterOffKey(userId)) === '1'
  } catch {
    return false
  }
}

export function setProfileFilterOff(userId: string | null, off: boolean) {
  if (!userId) return
  try {
    if (off) window.localStorage.setItem(profileFilterOffKey(userId), '1')
    else window.localStorage.removeItem(profileFilterOffKey(userId))
  } catch {
    /* ignore quota / private-mode errors */
  }
}

// True while neither the URL nor this device has said whether the toggle is on, so it
// may still resolve to on. `undefined` is not `false` here: an absent URL value is an
// open question, a stated `false` is an answer. Callers hold the anonymous cache key
// while this is true, rather than fetch a personalized list they may have to redo.
// Synchronous and hook-free on purpose: the route loader calls it too.
export function isProfileFilterUndecided(
  urlProfileFilter: boolean | undefined,
  userId: string | null
): boolean {
  return urlProfileFilter === undefined && !isProfileFilterOff(userId)
}

// Phototype excluded on purpose: the server derives avoid badges from skin types and
// concerns only, so a phototype-only portrait would turn the toggle on with nothing to
// show. Same rule as portrait-reach.ts, which keeps phototype off the catalogue surface.
export function hasUsablePortrait(dermo: UserDermoProfile | null | undefined): boolean {
  if (!dermo) return false
  return (dermo.skinTypes?.length ?? 0) > 0 || dermo.skinConcerns.length > 0
}
