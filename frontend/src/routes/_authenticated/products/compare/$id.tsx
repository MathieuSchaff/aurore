import { createFileRoute } from '@tanstack/react-router'

import { ComparisonBuilderPage } from '@/features/products/comparison/pages/ComparisonBuilderPage'
import { comparisonQueries } from '@/lib/queries/comparisons'
import { notFoundOn404, RouteNotFound } from '@/lib/routeErrors'

export const Route = createFileRoute('/_authenticated/products/compare/$id')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(comparisonQueries.detail(params.id)).catch(notFoundOn404),
  notFoundComponent: RouteNotFound,
  component: function ComparisonDetailRoute() {
    const { id } = Route.useParams()
    return <ComparisonBuilderPage mode="edit" id={id} />
  },
})
