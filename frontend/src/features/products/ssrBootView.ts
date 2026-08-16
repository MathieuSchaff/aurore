import { type SsrBootResponse, ssrBootQuerySchema } from '@aurore/shared'

import type { QueryClient } from '@tanstack/react-query'

import type { SsrBootRequestQuery } from '@/lib/auth/ssrBoot'
import {
  buildListProductsQuery,
  type ListProductsFilters,
  productQueries,
} from '@/lib/queries/products'
import { profileQueries } from '@/lib/queries/profile'
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
  const productDetailMatch = pathname.match(/^\/products\/([^/]+)\/?$/)
  const slug = productDetailMatch?.[1]
  if (slug && !PRODUCT_DETAIL_RESERVED_SLUGS.has(slug)) {
    const query = { view: 'product-detail', slug }
    ssrBootQuerySchema.parse(query)
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
  ssrBootQuerySchema.parse(query)
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

    const productIds = productsPage.items.map((product) => product.id)
    if (productIds.length === 0) return

    const shelfStatus = new Map(
      productsPage.items.flatMap((product) =>
        product.userStatus === null ? [] : [[product.id, product.userStatus] as const]
      )
    )
    queryClient.setQueryData(
      productQueries.shelfStatus(session.userId, productIds).queryKey,
      shelfStatus
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

  queryClient.setQueryData(productQueries.bySlug(selectedView.slug).queryKey, page.product)
  queryClient.setQueryData(
    productQueries.shelfStatus(session.userId, [page.product.id]).queryKey,
    new Map(page.userStatus === null ? [] : [[page.product.id, page.userStatus]])
  )
  queryClient.setQueryData(profileQueries.dermo().queryKey, page.dermoProfile)
  if (page.assessment !== null) {
    // Shared keeps algo-derm opaque while this cache follows the route contract
    queryClient.setQueryData<unknown>(
      productQueries.dermoScore(selectedView.slug, session.userId).queryKey,
      page.assessment
    )
  }
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
