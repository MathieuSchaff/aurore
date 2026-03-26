import { getRouteApi } from '@tanstack/react-router'
import { createContext, useContext, useMemo, type ReactNode } from 'react'

import type { UserProduct } from '../../../../lib/queries/user-products'
import type { CollectionSearch } from '../../../../routes/_authenticated/collection'

const routeApi = getRouteApi('/_authenticated/collection')

type CollectionFilterContextValue = {
  brand: string
  kind: string
  sentiment: number | 'all'
  repurchase: 'yes' | 'no' | 'unsure' | 'all'
  minNote: number
  maxPrice: number | ''
  filterOptions: { brands: string[]; kinds: string[] }
  setFilter: (updates: Partial<CollectionSearch>) => void
  resetFilters: () => void
}

const CollectionFilterContext = createContext<CollectionFilterContextValue | null>(null)

interface CollectionFilterProviderProps {
  userProducts: UserProduct[] | undefined
  children: ReactNode
}

export function CollectionFilterProvider({ userProducts, children }: CollectionFilterProviderProps) {
  const { brand, kind, sentiment, repurchase, minNote, maxPrice } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const filterOptions = useMemo(() => {
    if (!userProducts) return { brands: [], kinds: [] }
    const brands = Array.from(new Set(userProducts.map((p) => p.product.brand))).sort()
    const kinds = Array.from(new Set(userProducts.map((p) => p.product.kind))).sort()
    return { brands, kinds }
  }, [userProducts])

  const setFilter = (updates: Partial<CollectionSearch>) => {
    navigate({ search: (prev) => ({ ...prev, ...updates }) })
  }

  const resetFilters = () => {
    setFilter({
      brand: 'all',
      kind: 'all',
      sentiment: 'all',
      repurchase: 'all',
      minNote: 0,
      maxPrice: '',
    })
  }

  return (
    <CollectionFilterContext.Provider
      value={{ brand, kind, sentiment, repurchase, minNote, maxPrice, filterOptions, setFilter, resetFilters }}
    >
      {children}
    </CollectionFilterContext.Provider>
  )
}

export function useCollectionFilter(): CollectionFilterContextValue {
  const ctx = useContext(CollectionFilterContext)
  if (!ctx) throw new Error('useCollectionFilter must be used within CollectionFilterProvider')
  return ctx
}
