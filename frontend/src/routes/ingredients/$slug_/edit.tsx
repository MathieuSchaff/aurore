import { createFileRoute } from '@tanstack/react-router'

import { IngredientInfoSkeleton } from '@/features/ingredients/components/skeletons/IngredientLayoutSkeleton'
import { IngredientEditPage } from '@/features/ingredients/page/IngredientEditPage/IngredientEditPage'
import { requireSession } from '@/lib/auth/requireSession'
import { ingredientQueries } from '@/lib/queries/ingredients'
import { notFoundOn404, RouteNotFound } from '@/lib/routeErrors'

// Trailing `_` on $slug_ opts this route out of $slug.tsx (IngredientLayout)
// so the edit page does not inherit the parent's hero/tabs/top actions.
export const Route = createFileRoute('/ingredients/$slug_/edit')({
  beforeLoad: async ({ context, location }) => {
    await requireSession({
      queryClient: context.queryClient,
      href: location.href,
    })
  },
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(ingredientQueries.bySlug(params.slug)).catch(notFoundOn404),
  pendingComponent: IngredientInfoSkeleton,
  notFoundComponent: RouteNotFound,
  component: IngredientEditPage,
})
