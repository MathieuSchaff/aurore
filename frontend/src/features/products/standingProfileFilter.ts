import type { UserDermoProfile } from '@aurore/shared'

// Only the "off" choice is stored: the default being on, a new device starts on,
// which is the wanted behaviour and spares a column on an already pending migration.
// Keyed per user, otherwise one account's opt-out silences the next account's
// declared rules on a shared browser.
const optOutKey = (userId: string) => `products-profile-filter-off:${userId}`

export function readOptOut(userId: string | null): boolean {
  if (typeof window === 'undefined' || !userId) return false
  try {
    return window.localStorage.getItem(optOutKey(userId)) === '1'
  } catch {
    return false
  }
}

export function writeOptOut(userId: string | null, off: boolean) {
  if (!userId) return
  try {
    if (off) window.localStorage.setItem(optOutKey(userId), '1')
    else window.localStorage.removeItem(optOutKey(userId))
  } catch {
    /* ignore quota / private-mode errors */
  }
}

// Phototype deliberately excluded: `deriveAvoidFor` only reads skin types and
// concerns, so a phototype-only portrait would turn the toggle on for no visible
// effect. Same rule as portrait-reach.ts, which keeps it out of the catalogue surface.
export function hasPortrait(dermo: UserDermoProfile | null | undefined): boolean {
  if (!dermo) return false
  return (dermo.skinTypes?.length ?? 0) > 0 || dermo.skinConcerns.length > 0
}
