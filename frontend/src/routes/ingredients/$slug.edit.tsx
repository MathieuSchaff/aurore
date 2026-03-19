import { createFileRoute } from '@tanstack/react-router'

import { IngredientEditPage } from '../../features/ingredients/components/Edit/IngredientEditpage'
import { requireAuth } from '../../lib/auth/requireAuth'
import { ingredientQueries } from '../../lib/queries/ingredients'

export const Route = createFileRoute('/ingredients/$slug/edit')({
  beforeLoad: async ({ context, location }) => {
    await requireAuth({ queryClient: context.queryClient, pathname: location.pathname })
  },

  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(ingredientQueries.bySlug(params.slug)),

  component: IngredientEditPage,
})
