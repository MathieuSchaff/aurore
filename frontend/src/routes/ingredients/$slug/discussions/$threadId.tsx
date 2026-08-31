import { createFileRoute, getRouteApi, notFound } from '@tanstack/react-router'

import { GlobalError } from '@/component/Feedback/app/GlobalError/GlobalError'
import { ThreadDetailPage } from '@/features/discussions/pages/ThreadDetailPage'
import { IngredientThreadSkeleton } from '@/features/ingredients/components/skeletons/IngredientLayoutSkeleton'
import { ApiError } from '@/lib/helpers/apiError'
import { discussionQueries } from '@/lib/queries/discussions'
import { NOINDEX_ROBOTS, seoHead } from '@/lib/seo'

const route = getRouteApi('/ingredients/$slug/discussions/$threadId')

function IngredientThreadDetailRoute() {
  const { slug, threadId } = route.useParams()
  return (
    <ThreadDetailPage
      entityType="ingredient"
      slug={slug}
      threadId={threadId}
      backTo="/ingredients/$slug/discussions"
    />
  )
}

// No routing-level auth guard: threads are public (read). Write actions (post/reply)
// are gated by the backend, frontend shows UI conditionally via SessionView.
export const Route = createFileRoute('/ingredients/$slug/discussions/$threadId')({
  // Loader and head run on the server so the document carries its own title, robots
  // and canonical, the thread itself stays client-rendered
  ssr: 'data-only',
  loader: ({ context, params }) =>
    context.queryClient
      .ensureQueryData(discussionQueries.thread('ingredient', params.slug, params.threadId))
      // Head-only field: the thread reaches the component through the dehydrated Query cache
      .then((thread) => ({ title: thread.title }))
      .catch((err) => {
        // Missing thread = 404, route to notFoundComponent; keep 5xx/429 on the real error UI
        if (err instanceof ApiError && err.status === 404) throw notFound()
        throw err
      }),
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    return seoHead({
      path: `/ingredients/${params.slug}/discussions/${params.threadId}`,
      title: `${loaderData.title} — Aurore`,
      // Member conversations stay out of the index
      robots: NOINDEX_ROBOTS,
    })
  },
  pendingComponent: IngredientThreadSkeleton,
  notFoundComponent: () => <GlobalError error={new Error('not_found')} is404 />,
  component: IngredientThreadDetailRoute,
})
