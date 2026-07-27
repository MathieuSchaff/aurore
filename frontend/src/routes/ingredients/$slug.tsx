import { createFileRoute, notFound } from '@tanstack/react-router'

import { GlobalError } from '@/component/Feedback/app/GlobalError/GlobalError'
import { IngredientLayout } from '@/features/ingredients/components/IngredientLayout/IngredientLayout'
import { IngredientLayoutSkeleton } from '@/features/ingredients/components/skeletons/IngredientLayoutSkeleton'
import { ApiError } from '@/lib/helpers/apiError'
import { ingredientQueries } from '@/lib/queries/ingredients'

export const Route = createFileRoute('/ingredients/$slug')({
  ssr: true,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(ingredientQueries.bySlug(params.slug)).catch((err) => {
      // Missing ingredient = 404, route to notFoundComponent; keep 5xx/429 on the real error UI
      if (err instanceof ApiError && err.status === 404) throw notFound()
      throw err
    }),
  notFoundComponent: () => <GlobalError error={new Error('not_found')} is404 />,
  pendingComponent: IngredientLayoutSkeleton,
  component: IngredientLayout,
})
