import { createFileRoute } from '@tanstack/react-router'

import { ProductInfoSkeleton } from '@/features/products/components/skeletons/ProductLayoutSkeleton/ProductLayoutSkeleton'
import { ProductEditPage } from '@/features/products/pages/ProductEditPage/ProductEditPage'
import { requireSession } from '@/lib/auth/requireSession'
import { productQueries } from '@/lib/queries/products'
import { notFoundOn404, RouteNotFound } from '@/lib/routeErrors'

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
    context.queryClient.ensureQueryData(productQueries.bySlug(params.slug)).catch(notFoundOn404),
  pendingComponent: ProductInfoSkeleton,
  notFoundComponent: RouteNotFound,
  component: ProductEditPage,
})
