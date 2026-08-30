import { useNavigate } from '@tanstack/react-router'
import type { RoutePaths } from '@tanstack/router-core'
import { useCallback } from 'react'

import type { routeTree } from '@/routeTree.gen'

// No show_hidden here: the "afficher quand même" escape hatch is a /products search param,
// and validateSearch drops the key anywhere else. Only useProductsProfileFilter writes it.
export function useProfileFilterToggle(from: RoutePaths<typeof routeTree>) {
  const navigate = useNavigate({ from })

  return useCallback(
    (checked: boolean) => {
      navigate({
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          profile_filter: checked,
          page: 1,
        }),
      })
    },
    [navigate]
  )
}
