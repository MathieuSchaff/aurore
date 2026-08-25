// Only "off" is ever stored: the toggle defaults to on, so a new device needs no
// stored value to behave right, and no DB column has to carry the setting.
// Keyed per user, otherwise one account's "off" silences the next account's
// declared rules on a shared browser.
const profileFilterOffKey = (viewerId: string) => `products-profile-filter-off:${viewerId}`

export function isProfileFilterOff(viewerId: string | null): boolean {
  if (typeof window === 'undefined' || !viewerId) return false
  try {
    return window.localStorage.getItem(profileFilterOffKey(viewerId)) === '1'
  } catch {
    return false
  }
}

export function setProfileFilterOff(viewerId: string | null, off: boolean) {
  if (!viewerId) return
  try {
    if (off) window.localStorage.setItem(profileFilterOffKey(viewerId), '1')
    else window.localStorage.removeItem(profileFilterOffKey(viewerId))
  } catch {
    /* ignore quota / private-mode errors */
  }
}
