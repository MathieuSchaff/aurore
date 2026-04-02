import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { ThreadList } from '@/features/discussions/components/ThreadList'
import { discussionQueries } from '@/lib/queries/discussions'
import { useAuthStore } from '@/store/auth'

function IngredientDiscussionIndex() {
  const { slug } = Route.useParams()
  const { data: threads } = useSuspenseQuery(discussionQueries.threads('ingredient', slug))
  const user = useAuthStore((s) => s.user)

  return (
    <ThreadList
      threads={threads}
      entityType="ingredient"
      slug={slug}
      isLoggedIn={user !== null}
      threadDetailPath={(threadId) => `/ingredients/${slug}/discussions/${threadId}`}
    />
  )
}

export const Route = createFileRoute('/ingredients/$slug/discussions/')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(discussionQueries.threads('ingredient', params.slug)),
  component: IngredientDiscussionIndex,
})
