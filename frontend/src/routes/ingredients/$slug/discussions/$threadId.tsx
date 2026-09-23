import { createFileRoute, getRouteApi } from '@tanstack/react-router'

import { ThreadDetailPage } from '@/features/discussions/pages/ThreadDetailPage'
import { IngredientThreadSkeleton } from '@/features/ingredients/components/skeletons/IngredientLayoutSkeleton'
import { discussionQueries } from '@/lib/queries/discussions'
import { notFoundOn404, RouteNotFound } from '@/lib/routeErrors'
import { NOINDEX_ROBOTS, seoHead } from '@/lib/seo'

const route = getRouteApi('/ingredients/$slug/discussions/$threadId')

function IngredientThreadDetailRoute() {
  const { slug, threadId } = route.useParams()
  return <ThreadDetailPage entityType="ingredient" slug={slug} threadId={threadId} />
}

// No routing auth guard: threads are public (read). Write actions (post/reply)
// are gated by the backend, frontend shows UI conditionally via SessionView
export const Route = createFileRoute('/ingredients/$slug/discussions/$threadId')({
  // Loader and head run on the server so the document carries its own title, robots
  // and canonical, the thread itself stays rendered on the client
  ssr: 'data-only',
  loader: ({ context, params }) =>
    context.queryClient
      .ensureQueryData(discussionQueries.thread('ingredient', params.slug, params.threadId))
      // Head metadata field: the thread reaches the component through the dehydrated Query cache
      .then((thread) => ({ title: thread.title }))
      .catch(notFoundOn404),
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    return seoHead({
      path: `/ingredients/${params.slug}/discussions/${params.threadId}`,
      title: `${loaderData.title} | Aurore`,
      // Member conversations stay out of the index
      robots: NOINDEX_ROBOTS,
    })
  },
  pendingComponent: IngredientThreadSkeleton,
  notFoundComponent: RouteNotFound,
  component: IngredientThreadDetailRoute,
})
