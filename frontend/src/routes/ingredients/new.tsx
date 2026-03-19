import { createFileRoute } from '@tanstack/react-router'

import { IngredientCreatePage } from '../../features/ingredients/components/Create/IngredientCreatePage'
import { requireAuth } from '../../lib/auth/requireAuth'

export const Route = createFileRoute('/ingredients/new')({
  beforeLoad: async ({ context, location }) => {
    await requireAuth({ queryClient: context.queryClient, pathname: location.pathname })
  },
  component: IngredientCreatePage,
})
