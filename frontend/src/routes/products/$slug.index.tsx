import { createFileRoute } from '@tanstack/react-router'

import { ProductPage } from '../../component/pages/Product/ProductPage'

export const Route = createFileRoute('/products/$slug/')({
  component: ProductPage,
})
