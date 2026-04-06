import { createFileRoute } from '@tanstack/react-router'

import { ProductCreatePage } from '../../features/products/components/ProductCreatePage'
import { requireAuth } from '../../lib/auth/requireAuth'

export const Route = createFileRoute('/products/new')({
  beforeLoad: async ({ context, location }) => {
    await requireAuth({ queryClient: context.queryClient, pathname: location.pathname })
  },
  component: ProductCreatePage,
})
