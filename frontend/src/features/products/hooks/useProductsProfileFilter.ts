import type { UserDermoProfile } from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect } from 'react'

import { preferenceTargetQueries, profileQueries } from '@/lib/queries/profile'

// Only the "off" choice is stored: the default being on, a new device starts on,
// which is the wanted behaviour and spares a column on an already pending migration.
// Keyed per user, otherwise one account's opt-out silences the next account's
// declared rules on a shared browser.
const optOutKey = (userId: string) => `products-profile-filter-off:${userId}`

function readOptOut(userId: string | null): boolean {
  if (typeof window === 'undefined' || !userId) return false
  try {
    return window.localStorage.getItem(optOutKey(userId)) === '1'
  } catch {
    return false
  }
}

function writeOptOut(userId: string | null, off: boolean) {
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
function hasPortrait(dermo: UserDermoProfile | null | undefined): boolean {
  if (!dermo) return false
  return (dermo.skinTypes?.length ?? 0) > 0 || dermo.skinConcerns.length > 0
}

type Args = {
  // `undefined` means the URL says nothing, which is what lets an unstated
  // toggle resolve to the standing choice instead of a hard false.
  urlValue: boolean | undefined
  userId: string | null
}

// D9: "Selon mon profil" is a standing setting, not a per-visit filter. It
// survives between sessions and starts on as soon as there is something to
// apply, a portrait or a single declared rule. A toggle that starts off left
// the portrait and the rules without any visible effect, which is what made the
// whole /profile screen inert. An explicit value in the URL always wins, so a
// shared link stays literal.
export function useProductsProfileFilter({ urlValue, userId }: Args) {
  const navigate = useNavigate({ from: '/products/' })
  const isAuthed = !!userId

  const dermoQuery = useQuery({ ...profileQueries.dermo(), enabled: isAuthed })
  const targetsQuery = useQuery({ ...preferenceTargetQueries.list(), enabled: isAuthed })

  const setProfileFilter = useCallback(
    (checked: boolean) => {
      writeOptOut(userId, !checked)
      navigate({
        // Turning the toggle off drops show_hidden too: "afficher quand même"
        // only means something while the profile filter is active.
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          profile_filter: checked,
          ...(checked ? {} : { show_hidden: false }),
          page: 1,
        }),
      })
    },
    [navigate, userId]
  )

  const hasSomethingToApply =
    dermoQuery.isSuccess &&
    targetsQuery.isSuccess &&
    (hasPortrait(dermoQuery.data) ||
      targetsQuery.data.ingredients.length > 0 ||
      targetsQuery.data.tags.length > 0)

  useEffect(() => {
    if (!isAuthed || urlValue !== undefined || !hasSomethingToApply || readOptOut(userId)) return
    // page: 1 like the manual setter. The rules shrink the set, and an offset
    // inherited from a link would land past the end and read as "no result".
    navigate({ search: (prev) => ({ ...prev, profile_filter: true, page: 1 }), replace: true })
  }, [isAuthed, userId, urlValue, hasSomethingToApply, navigate])

  return setProfileFilter
}
