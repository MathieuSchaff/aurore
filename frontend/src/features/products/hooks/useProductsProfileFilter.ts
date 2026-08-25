import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'

import { setProfileFilterOff } from '@/features/products/profileFilterSetting'

type Args = {
  viewerId: string | null
}

// "Selon mon profil" is a standing setting, not a per-visit filter. A mute URL is
// resolved server-side (apply_preferences=auto, see applyDeclaredRules); this hook
// only writes the explicit choice: the URL always wins, and "off" is also stored
// device-local so a mute URL on this device stops resolving to auto
export function useProductsProfileFilter({ viewerId }: Args) {
  const navigate = useNavigate({ from: '/products/' })

  const setProfileFilter = useCallback(
    (checked: boolean) => {
      setProfileFilterOff(viewerId, !checked)
      navigate({
        // Turning the toggle off drops show_hidden too: "afficher quand même"
        // only means something while the profile filter is active
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          profile_filter: checked,
          ...(checked ? {} : { show_hidden: false }),
          page: 1,
        }),
      })
    },
    [navigate, viewerId]
  )

  return { setProfileFilter }
}
