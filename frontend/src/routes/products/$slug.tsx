import { createFileRoute } from '@tanstack/react-router'

import { ProductLayoutSkeleton } from '@/features/products/components/skeletons/ProductLayoutSkeleton/ProductLayoutSkeleton'
import { resolveProductDetailViewer } from '@/features/products/loadProductDetailViewer'
import { ProductLayout } from '@/features/products/pages/ProductLayout/ProductLayout'
import { productQueries } from '@/lib/queries/products'
import { notFoundOn404, RouteNotFound } from '@/lib/routeErrors'

export const Route = createFileRoute('/products/$slug')({
  ssr: true,
  loader: async ({ context, params, parentMatchPromise }) => {
    const viewerId = await resolveProductDetailViewer(context.queryClient, parentMatchPromise)

    return context.queryClient
      .ensureQueryData(productQueries.detailPage(params.slug, viewerId))
      .catch(notFoundOn404)
  },
  notFoundComponent: RouteNotFound,
  pendingComponent: ProductLayoutSkeleton,
  component: ProductLayout,
})
