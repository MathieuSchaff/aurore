import { type SsrBootResponse, ssrBootQuerySchema } from '@aurore/shared'

import type { QueryClient } from '@tanstack/react-query'

import type { SsrBootRequestQuery } from '@/lib/auth/ssrBoot'
import {
  buildListProductsQuery,
  type ListProductsFilters,
  productQueries,
  toProductDetailPageData,
} from '@/lib/queries/products'
import { productsSearchSchema } from './filters'
import { productsListApiFilters } from './helpers'

export type ProductsSsrBootView = {
  view: 'products'
  filters: ListProductsFilters
  query: SsrBootRequestQuery
}

type ProductDetailSsrBootView = {
  view: 'product-detail'
  slug: string
  query: SsrBootRequestQuery
}

export type SsrBootView = ProductsSsrBootView | ProductDetailSsrBootView

const PRODUCT_DETAIL_RESERVED_SLUGS = new Set(['compare', 'new'])

export function selectSsrBootView(pathname: string, search: unknown): SsrBootView | undefined {
  const productDetailMatch = pathname.match(
    /^\/products\/([^/]+)(?:\/discussions(?:\/[^/]+)?)?\/?$/
  )
  const slug = productDetailMatch?.[1]
  if (slug && !PRODUCT_DETAIL_RESERVED_SLUGS.has(slug)) {
    const query = { view: 'product-detail', slug }
    const parsedQuery = ssrBootQuerySchema.safeParse(query)
    if (!parsedQuery.success) return undefined
    return {
      view: 'product-detail',
      slug,
      query: query as SsrBootRequestQuery,
    }
  }

  if (pathname !== '/products') return undefined

  const parsed = productsSearchSchema.safeParse(search)
  if (!parsed.success) return undefined

  const filters = productsListApiFilters(parsed.data, true)
  const query = { view: 'products', ...buildListProductsQuery(filters) }
  const parsedQuery = ssrBootQuerySchema.safeParse(query)
  if (!parsedQuery.success) return undefined
  return {
    view: 'products',
    filters,
    query: query as SsrBootRequestQuery,
  }
}

export function seedSsrBootPage(
  queryClient: QueryClient,
  boot: SsrBootResponse,
  selectedView: SsrBootView | undefined
): void {
  const session = boot.session
  const page = boot.page
  if (!selectedView || !session.authenticated || !page) return

  if (selectedView.view === 'products' && page.view === 'products') {
    const { view: _view, ...productsPage } = page
    queryClient.setQueryData(
      productQueries.list(selectedView.filters, session.userId).queryKey,
      productsPage
    )
    return
  }

  if (
    selectedView.view !== 'product-detail' ||
    page.view !== 'product-detail' ||
    page.product.slug !== selectedView.slug
  ) {
    return
  }

  const { view: _view, ...detailPage } = page
  queryClient.setQueryData(
    productQueries.detailPage(selectedView.slug, session.userId).queryKey,
    toProductDetailPageData(detailPage)
  )
}

export function hasSeededSsrBootProductsPage(
  queryClient: QueryClient,
  selectedView: ProductsSsrBootView,
  userId: string
): boolean {
  return (
    queryClient.getQueryData(productQueries.list(selectedView.filters, userId).queryKey) !==
    undefined
  )
}
