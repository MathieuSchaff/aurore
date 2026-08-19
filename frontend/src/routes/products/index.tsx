import { createFileRoute, stripSearchParams } from '@tanstack/react-router'

import { productsSearchDefaults, productsSearchSchema } from '@/features/products/filters'
import { productsListApiFilters } from '@/features/products/helpers'
import { ProductsPage } from '@/features/products/pages/ProductsPage/ProductsPage'
import { awaitBootRefresh } from '@/lib/auth/awaitBootRefresh'
import { isServer } from '@/lib/helpers/isServer'
import { convergeShelfStatusForList, productQueries } from '@/lib/queries/products'
import { seoHead } from '@/lib/seo'
import { useAuthStore } from '@/store/auth'

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
  loader: async ({ context, deps }) => {
    // Cold authenticated sessions wait for the root boot probe; anonymous visitors
    // fetch right away.
    await awaitBootRefresh(context.queryClient)

    const userId = useAuthStore.getState().user?.id ?? null
    const filters = productsListApiFilters(deps, !!userId)

    if (userId) {
      // The boot refresh invalidates this loader, which runs again while the page is
      // still reading the anonymous entry. No key to pick here: filters without rules
      // derive the anonymous key, so the statuses go onto the entry on screen
      void convergeShelfStatusForList(context.queryClient, filters, userId)
      return
    }

    // Wait on the server so the rendered total matches the dehydrated cache.
    // Keep client navigation from blocking so its first render is not delayed.
    const listQuery = productQueries.list(filters, null)
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
