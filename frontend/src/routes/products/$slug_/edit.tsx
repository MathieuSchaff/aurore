import { createFileRoute, notFound } from '@tanstack/react-router'

import { GlobalError } from '@/component/Feedback/app/GlobalError/GlobalError'
import { ProductInfoSkeleton } from '@/features/products/components/skeletons/ProductLayoutSkeleton/ProductLayoutSkeleton'
import { ProductEditPage } from '@/features/products/pages/ProductEditPage/ProductEditPage'
import { requireSession } from '@/lib/auth/requireSession'
import { ApiError } from '@/lib/helpers/apiError'
import { productQueries } from '@/lib/queries/products'

// Trailing `_` on $slug_ opts this route out of $slug.tsx (ProductLayout) so
// the edit page does not inherit the parent's hero/tabs/top actions.
export const Route = createFileRoute('/products/$slug_/edit')({
  beforeLoad: async ({ context, location }) => {
    await requireSession({
      queryClient: context.queryClient,
      href: location.href,
    })
  },
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(productQueries.bySlug(params.slug)).catch((err) => {
      // Missing product = 404, route to notFoundComponent; keep 5xx/429 on the real error UI
      if (err instanceof ApiError && err.status === 404) throw notFound()
      throw err
    }),
  pendingComponent: ProductInfoSkeleton,
  notFoundComponent: () => <GlobalError error={new Error('not_found')} is404 />,
  component: ProductEditPage,
})
