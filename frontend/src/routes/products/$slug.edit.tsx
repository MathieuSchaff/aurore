import { createFileRoute } from '@tanstack/react-router'

import { ProductEditPage } from '../../features/products/components/Edit/ProductEditPage'
import { requireAuth } from '../../lib/auth/requireAuth'
import { productQueries } from '../../lib/queries/products'

export const Route = createFileRoute('/products/$slug/edit')({
  beforeLoad: async ({ context, location }) => {
    await requireAuth({ queryClient: context.queryClient, pathname: location.pathname })
  },

  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(productQueries.bySlug(params.slug)),

  component: ProductEditPage,
})
