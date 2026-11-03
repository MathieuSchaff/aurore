import { DOMAIN_PRODUCT_FILTER_CATEGORIES, type ProductDomainTab } from '@aurore/shared'

import type { FilterValues } from '@/component/Filter/types'
import type { ListProductsFilters, ProductSort } from '@/lib/queries/products'
import { FILTER_KEYS, type FilterKey, type ProductsSearch, type TagFilterKey } from './filters'
import { isProfileFilterOff } from './profileFilterSetting'

// 24 divides evenly by 2/3/4 columns (auto-fill grid) so pages other than the last have no ragged last row
export const PRODUCTS_PAGE_SIZE = 24

export function hasActivePriceRange(priceMin?: number, priceMax?: number): boolean {
  return priceMin !== undefined || priceMax !== undefined
}

// Discovery mode = untouched listing. Any filter/price/query/sort exits it
export function isDiscoveryMode(args: {
  hasFilters: boolean
  hasPriceRange: boolean
  hasQuery: boolean
  sort: ProductSort
}): boolean {
  return !args.hasFilters && !args.hasPriceRange && !args.hasQuery && args.sort === 'newest'
}

export function buildProductsApiFilters(args: {
  category: ProductDomainTab
  filters: FilterValues<FilterKey>
  sort: ProductSort
  priceMin?: number
  priceMax?: number
  q?: string
  page: number
  hasFilters: boolean
}): ListProductsFilters {
  const hasPriceRange = hasActivePriceRange(args.priceMin, args.priceMax)
  const hasQuery = !!args.q

  if (isDiscoveryMode({ hasFilters: args.hasFilters, hasPriceRange, hasQuery, sort: args.sort })) {
    return {
      category: args.category,
      sort: 'newest',
      limit: PRODUCTS_PAGE_SIZE,
      page: args.page,
    }
  }

  const domainKeys = DOMAIN_PRODUCT_FILTER_CATEGORIES[args.category]
  const tagFields = Object.fromEntries(
    domainKeys.map((k) => {
      const val = args.filters[k as TagFilterKey]
      return [k, val?.length > 0 ? val : undefined]
    })
  ) as Partial<ListProductsFilters>

  const brand = args.filters.brand
  const ingredient = args.filters.ingredient

  return {
    category: args.category,
    ...tagFields,
    brand: brand && brand.length > 0 ? brand : undefined,
    ingredient: ingredient && ingredient.length > 0 ? ingredient : undefined,
    q: args.q,
    sort: args.sort,
    priceMin: args.priceMin,
    priceMax: args.priceMax,
    page: args.page,
    limit: PRODUCTS_PAGE_SIZE,
  }
}

// List and drawer preview must apply the same authenticated user's declared rules
// With no URL override, SSR asks the server for 'auto'; a device with the toggle off
// corrects that with one client read because SSR cannot see its local setting
// rulesApplied reports what the server used
export function applyDeclaredRules(
  base: ListProductsFilters,
  search: Pick<ProductsSearch, 'profile_filter' | 'show_hidden'>,
  isAuthed: boolean,
  viewerId: string | null = null
): ListProductsFilters {
  if (!isAuthed) return base
  if (search.profile_filter) base.apply_preferences = true
  else if (search.profile_filter === undefined && !isProfileFilterOff(viewerId)) {
    base.apply_preferences = 'auto'
  }
  if (base.apply_preferences && search.show_hidden) base.include_excluded = true
  return base
}

// The /products loader (prefetch) and ProductsPage both build the list query here,
// so the queryKey matches and the page uses the prefetched data
export function productsListApiFilters(
  search: ProductsSearch,
  isAuthed: boolean,
  viewerId: string | null = null
): ListProductsFilters {
  const filters = Object.fromEntries(
    FILTER_KEYS.map((k) => [k, search[k] ?? []])
  ) as FilterValues<FilterKey>
  const hasFilters = FILTER_KEYS.some((k) => (search[k]?.length ?? 0) > 0)
  const base = buildProductsApiFilters({
    category: search.category,
    filters,
    sort: search.sort,
    priceMin: search.priceMin,
    priceMax: search.priceMax,
    q: search.q,
    page: search.page,
    hasFilters,
  })
  return applyDeclaredRules(base, search, isAuthed, viewerId)
}

// UI-level toggles outside FilterDrawer state. Tag filters reset via useListFilters.resetFilters().
// profile_filter survives: it is a standing setting, not a filter chip. Clearing
// the criteria must not silently revoke a choice the user made once and for all
export function buildResetSearchParams<T extends Record<string, unknown>>(prev: T) {
  return {
    ...prev,
    show_hidden: false,
    priceMin: undefined,
    priceMax: undefined,
    q: undefined,
  }
}

// brand and ingredient carry over across domains; tag filters and pagination reset
export function buildDomainSwitchSearch<T extends Record<string, unknown>>(
  prev: T,
  next: ProductDomainTab,
  emptyTagFilters: Record<string, string[]>
) {
  return {
    ...prev,
    ...emptyTagFilters,
    category: next,
    show_hidden: false,
    q: undefined,
    page: 1,
  }
}
