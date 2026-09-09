import { createFileRoute, stripSearchParams } from '@tanstack/react-router'

import {
  INGREDIENTS_LIST_STALE_MS,
  ingredientsListApiFilters,
  ingredientsSearchDefaults,
  ingredientsSearchSchema,
} from '@/features/ingredients/filters'
import { isServer } from '@/lib/helpers/isServer'
import { ingredientQueries } from '@/lib/queries/ingredients'
import { seoHead } from '@/lib/seo'
import { IngredientsPage } from '../../features/ingredients/page/IngredientsPage/IngredientsPage'

export const Route = createFileRoute('/ingredients/')({
  validateSearch: ingredientsSearchSchema,
  loaderDeps: ({ search }) => search,
  // SSR the hub so the bare path ships index,follow + canonical in the server HTML
  // instead of inheriting the root's noindex until hydration. Filtered variants
  // stay on the same route and consolidate to this canonical.
  ssr: true,
  search: {
    middlewares: [stripSearchParams(ingredientsSearchDefaults)],
  },
  loader: ({ context, deps }) => {
    // The standing profile filter resolves on the client once the dermo profile is
    // known; the server serves the unfiltered grid, the same first render the client does.
    const listQuery = {
      ...ingredientQueries.list(ingredientsListApiFilters(deps)),
      staleTime: INGREDIENTS_LIST_STALE_MS,
    }
    // Wait on the server so the rendered grid matches the dehydrated cache.
    // Keep client navigation from blocking so its first render is not delayed.
    if (isServer) return context.queryClient.prefetchQuery(listQuery)
    void context.queryClient.prefetchQuery(listQuery)
  },
  head: () =>
    seoHead({
      path: '/ingredients',
      title: 'Ingrédients — Aurore',
      description:
        'Parcourez les ingrédients cosmétiques : leur rôle dans une formule et les produits qui en contiennent, à lire au calme sur Aurore.',
    }),
  component: IngredientsPage,
})
