import type { QueryClient } from '@tanstack/react-query'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'

import {
  type ProductsSearch,
  productsSearchDefaults,
  productsSearchSchema,
} from '@/features/products/filters'
import { productsListApiFilters } from '@/features/products/helpers'
import { ProductsPage } from '@/features/products/pages/ProductsPage/ProductsPage'
import { hasSeededSsrBootProductsPage, selectSsrBootView } from '@/features/products/ssrBootView'
import { awaitBootRefresh } from '@/lib/auth/awaitBootRefresh'
import {
  viewerId as getSessionViewerId,
  readClientSession,
  readRequestSession,
} from '@/lib/auth/session'
import { isServer } from '@/lib/helpers/isServer'
import { productQueries } from '@/lib/queries/products'
import { seoHead } from '@/lib/seo'

function hasAuthenticatedSsrProductsPage(
  queryClient: QueryClient,
  search: ProductsSearch
): boolean {
  const viewerId = getSessionViewerId(readRequestSession(queryClient))
  if (!viewerId) return false

  const selectedView = selectSsrBootView('/products', search)
  if (selectedView?.view !== 'products') return false

  return hasSeededSsrBootProductsPage(queryClient, selectedView, viewerId)
}

export const Route = createFileRoute('/products/')({
  validateSearch: productsSearchSchema,
  loaderDeps: ({ search }) => search,
  // SSR the hub so the bare path ships index,follow + canonical in the server HTML
  // instead of inheriting the root's noindex until hydration. Filtered variants
  // stay on the same route and consolidate to this canonical.
  ssr: true,
  search: {
    middlewares: [stripSearchParams(productsSearchDefaults)],
  },
  loader: async ({ context, deps, parentMatchPromise }) => {
    if (isServer) {
      await parentMatchPromise
      if (hasAuthenticatedSsrProductsPage(context.queryClient, deps)) return
    } else {
      await awaitBootRefresh(context.queryClient)
    }

    const session = isServer ? readRequestSession(context.queryClient) : readClientSession()
    const viewerId = getSessionViewerId(session)
    const filters = productsListApiFilters(deps, !!viewerId, viewerId)

    // Wait on the server so the rendered total matches the dehydrated cache.
    // Keep client navigation from blocking so its first render is not delayed.
    const listQuery = productQueries.list(filters, viewerId)
    if (isServer) await context.queryClient.prefetchQuery(listQuery)
    else void context.queryClient.prefetchQuery(listQuery)
  },
  head: () =>
    seoHead({
      path: '/products',
      title: 'Produits — Aurore',
      description:
        'Parcourez le catalogue skincare : formules, ingrédients et notes, sans score ni verdict, sur Aurore.',
    }),
  component: ProductsPage,
})
