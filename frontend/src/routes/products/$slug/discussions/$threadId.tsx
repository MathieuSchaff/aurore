import { createFileRoute, getRouteApi, notFound } from '@tanstack/react-router'

import { GlobalError } from '@/component/Feedback/app/GlobalError/GlobalError'
import { ThreadDetailPage } from '@/features/discussions/pages/ThreadDetailPage'
import { ProductThreadSkeleton } from '@/features/products/components/skeletons/ProductLayoutSkeleton/ProductLayoutSkeleton'
import { ApiError } from '@/lib/helpers/apiError'
import { discussionQueries } from '@/lib/queries/discussions'
import { NOINDEX_ROBOTS, seoHead } from '@/lib/seo'

const route = getRouteApi('/products/$slug/discussions/$threadId')

function ProductThreadDetailRoute() {
  const { slug, threadId } = route.useParams()
  return (
    <ThreadDetailPage
      entityType="product"
      slug={slug}
      threadId={threadId}
      backTo="/products/$slug/discussions"
    />
  )
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
      .catch((err) => {
        // Missing thread = 404, route to notFoundComponent; keep 5xx/429 on the real error UI
        if (err instanceof ApiError && err.status === 404) throw notFound()
        throw err
      }),
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
  notFoundComponent: () => <GlobalError error={new Error('not_found')} is404 />,
  component: ProductThreadDetailRoute,
})
