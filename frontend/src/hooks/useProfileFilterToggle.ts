import { useNavigate } from '@tanstack/react-router'
import type { RoutePaths } from '@tanstack/router-core'
import { useCallback } from 'react'

import type { routeTree } from '@/routeTree.gen'

export function useProfileFilterToggle(from: RoutePaths<typeof routeTree>) {
  const navigate = useNavigate({ from })

  return useCallback(
    (checked: boolean) => {
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
    [navigate]
  )
}
