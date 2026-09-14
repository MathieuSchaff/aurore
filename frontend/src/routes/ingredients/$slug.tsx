import { createFileRoute } from '@tanstack/react-router'

import { IngredientLayout } from '@/features/ingredients/components/IngredientLayout/IngredientLayout'
import { IngredientLayoutSkeleton } from '@/features/ingredients/components/skeletons/IngredientLayoutSkeleton'
import { ingredientQueries } from '@/lib/queries/ingredients'
import { notFoundOn404, RouteNotFound } from '@/lib/routeErrors'

export const Route = createFileRoute('/ingredients/$slug')({
  ssr: true,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(ingredientQueries.bySlug(params.slug)).catch(notFoundOn404),
  notFoundComponent: RouteNotFound,
  pendingComponent: IngredientLayoutSkeleton,
  component: IngredientLayout,
})
