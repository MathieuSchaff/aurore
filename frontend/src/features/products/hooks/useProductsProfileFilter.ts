import { useQuery } from '@tanstack/react-query'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'

import { hasPortrait, readOptOut, writeOptOut } from '@/features/products/standingProfileFilter'
import { preferenceTargetQueries, profileQueries } from '@/lib/queries/profile'

// Ceiling on the hold below. The profile requests carry an 8s abort and one retry,
// so an outage would otherwise freeze the catalogue on its anonymous key for ~16s.
const RESOLVE_CAP_MS = 700

type Args = {
  // `undefined` means the URL says nothing, which is what lets an unstated
  // toggle resolve to the standing choice instead of a hard false.
  urlValue: boolean | undefined
  userId: string | null
}

// "Selon mon profil" is a standing setting, not a per-visit filter. It survives
// between sessions and starts on as soon as there's a portrait or a declared rule to
// apply (a toggle that starts off left /profile with no visible effect). An explicit
// value in the URL always wins, so a shared link stays literal.
export function useProductsProfileFilter({ urlValue, userId }: Args) {
  const navigate = useNavigate({ from: '/products/' })
  const pathname = useRouterState({ select: (s) => s.location.pathname })
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

  const [capExpired, setCapExpired] = useState(false)
  useEffect(() => {
    if (!isAuthed) return
    const timer = setTimeout(() => setCapExpired(true), RESOLVE_CAP_MS)
    return () => clearTimeout(timer)
  }, [isAuthed])

  // The standing choice is not knowable yet, so the caller should keep serving the
  // anonymous cache key rather than pay a second list fetch when it lands. Monotone
  // by construction: a settled query never returns to pending, and `urlValue` is
  // defined for good once the replace below commits.
  const unresolved =
    isAuthed &&
    urlValue === undefined &&
    !capExpired &&
    !readOptOut(userId) &&
    (dermoQuery.isPending || targetsQuery.isPending)

  useEffect(() => {
    if (!isAuthed || urlValue !== undefined || !hasSomethingToApply || readOptOut(userId)) return
    // The profile queries can land after a card click has already pushed the
    // product location: replacing then commits over it and drops the visitor back
    // on the list. `location` moves at commitLocation, before the loaders run, so
    // it is the one piece of router state that already sees the click.
    if (pathname !== '/products') return
    // page: 1 like the manual setter. The rules shrink the set, and an offset
    // inherited from a link would land past the end and read as "no result".
    navigate({ search: (prev) => ({ ...prev, profile_filter: true, page: 1 }), replace: true })
  }, [isAuthed, userId, urlValue, hasSomethingToApply, navigate, pathname])

  return { setProfileFilter, unresolved }
}
