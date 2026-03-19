import { createFileRoute } from '@tanstack/react-router'

import { ProductPage } from '../../features/products/components/ProductPage'

export const Route = createFileRoute('/products/$slug/')({
  component: ProductPage,
})
