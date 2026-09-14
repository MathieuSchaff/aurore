import { createFileRoute, getRouteApi } from '@tanstack/react-router'

import { ThreadDetailPage } from '@/features/discussions/pages/ThreadDetailPage'
import { ProductThreadSkeleton } from '@/features/products/components/skeletons/ProductLayoutSkeleton/ProductLayoutSkeleton'
import { discussionQueries } from '@/lib/queries/discussions'
import { notFoundOn404, RouteNotFound } from '@/lib/routeErrors'
import { NOINDEX_ROBOTS, seoHead } from '@/lib/seo'

const route = getRouteApi('/products/$slug/discussions/$threadId')

function ProductThreadDetailRoute() {
  const { slug, threadId } = route.useParams()
  return <ThreadDetailPage entityType="product" slug={slug} threadId={threadId} />
}

// No routing-level auth guard: threads are public (read). Write actions (post/reply)
// are gated by the backend, frontend shows UI conditionally via SessionView.
export const Route = createFileRoute('/products/$slug/discussions/$threadId')({
  // Loader and head run on the server so the document carries its own title, robots
  // and canonical, the thread itself stays client-rendered
  ssr: 'data-only',
  loader: ({ context, params }) =>
    context.queryClient
      .ensureQueryData(discussionQueries.thread('product', params.slug, params.threadId))
      // Head-only field: the thread reaches the component through the dehydrated Query cache
      .then((thread) => ({ title: thread.title }))
      .catch(notFoundOn404),
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    return seoHead({
      path: `/products/${params.slug}/discussions/${params.threadId}`,
      title: `${loaderData.title} — Aurore`,
      // Member conversations stay out of the index
      robots: NOINDEX_ROBOTS,
    })
  },
  pendingComponent: ProductThreadSkeleton,
  notFoundComponent: RouteNotFound,
  component: ProductThreadDetailRoute,
})
