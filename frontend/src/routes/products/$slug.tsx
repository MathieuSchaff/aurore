import { createFileRoute, notFound } from '@tanstack/react-router'

import { GlobalError } from '@/component/Feedback/app/GlobalError/GlobalError'
import { ProductLayoutSkeleton } from '@/features/products/components/skeletons/ProductLayoutSkeleton/ProductLayoutSkeleton'
import { resolveProductDetailViewer } from '@/features/products/loadProductDetailViewer'
import { ProductLayout } from '@/features/products/pages/ProductLayout/ProductLayout'
import { ApiError } from '@/lib/helpers/apiError'
import { productQueries } from '@/lib/queries/products'

export const Route = createFileRoute('/products/$slug')({
  ssr: true,
  loader: async ({ context, params, parentMatchPromise }) => {
    const viewerId = await resolveProductDetailViewer(context.queryClient, parentMatchPromise)

    return context.queryClient
      .ensureQueryData(productQueries.detailPage(params.slug, viewerId))
      .catch((err) => {
        // Missing product = 404, route to notFoundComponent; keep 5xx/429 on the real error UI
        if (err instanceof ApiError && err.status === 404) throw notFound()
        throw err
      })
  },
  notFoundComponent: () => <GlobalError error={new Error('not_found')} is404 />,
  pendingComponent: ProductLayoutSkeleton,
  component: ProductLayout,
})
