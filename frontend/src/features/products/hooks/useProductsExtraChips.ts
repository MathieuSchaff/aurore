import { useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'

import type { ExtraChip } from '@/component/Filter'

const eurFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

// profile_filter has no chip here: it is a standing setting, not a filter, and
// "Tout effacer" next to the chips does not clear it. Its controls are the drawer
// toggle and AvoidedBanner.
type Args = {
  hasPriceRange: boolean
  priceMin?: number
  priceMax?: number
  q?: string
}

export function useProductsExtraChips({ hasPriceRange, priceMin, priceMax, q }: Args): ExtraChip[] {
  const navigate = useNavigate({ from: '/products/' })

  return useMemo(() => {
    const chips: ExtraChip[] = []

    if (q) {
      chips.push({
        id: 'q',
        prefix: 'Recherche',
        label: `"${q}"`,
        onRemove: () =>
          navigate({
            search: (prev) => ({ ...prev, q: undefined, page: 1 }),
            replace: true,
          }),
      })
    }

    if (hasPriceRange) {
      const minLabel = priceMin != null ? eurFormatter.format(priceMin / 100) : null
      const maxLabel = priceMax != null ? eurFormatter.format(priceMax / 100) : null
      const label =
        minLabel && maxLabel
          ? `${minLabel} – ${maxLabel}`
          : minLabel
            ? `≥ ${minLabel}`
            : `≤ ${maxLabel}`
      chips.push({
        id: 'price',
        prefix: 'Prix',
        label,
        onRemove: () =>
          navigate({
            search: (prev) => ({ ...prev, priceMin: undefined, priceMax: undefined, page: 1 }),
            replace: true,
          }),
      })
    }

    return chips
  }, [hasPriceRange, priceMin, priceMax, q, navigate])
}
