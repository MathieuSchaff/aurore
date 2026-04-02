import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { ThreadList } from '@/features/discussions/components/ThreadList'
import { discussionQueries } from '@/lib/queries/discussions'
import { useAuthStore } from '@/store/auth'

function ProductDiscussionIndex() {
  const { slug } = Route.useParams()
  const { data: threads } = useSuspenseQuery(discussionQueries.threads('product', slug))
  const user = useAuthStore((s) => s.user)

  return (
    <ThreadList
      threads={threads}
      entityType="product"
      slug={slug}
      isLoggedIn={user !== null}
      threadDetailPath={(threadId) => `/products/${slug}/discussions/${threadId}`}
    />
  )
}

export const Route = createFileRoute('/products/$slug/discussions/')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(discussionQueries.threads('product', params.slug)),
  component: ProductDiscussionIndex,
})
