import { createFileRoute } from '@tanstack/react-router'

import { ProductPage } from '../../features/products/components/ProductPage'
import { productQueries } from '../../lib/queries/products'

export const Route = createFileRoute('/products/$slug/')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(productQueries.bySlug(params.slug)),
  component: ProductPage,
})
