import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'

import { ThreadList } from '@/features/discussions/components/ThreadList'
import { IngredientDiscussionSkeleton } from '@/features/ingredients/components/skeletons/IngredientLayoutSkeleton'
import { useSession } from '@/lib/auth/session'
import { discussionQueries } from '@/lib/queries/discussions'

const route = getRouteApi('/ingredients/$slug/discussions/')

function IngredientDiscussionIndex() {
  const { slug } = route.useParams()
  const { data: threads } = useSuspenseQuery(discussionQueries.threads('ingredient', slug))
  const session = useSession()

  return (
    <ThreadList
      threads={threads}
      entityType="ingredient"
      slug={slug}
      isLoggedIn={session.status === 'authenticated'}
    />
  )
}

export const Route = createFileRoute('/ingredients/$slug/discussions/')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(discussionQueries.threads('ingredient', params.slug)),
  pendingComponent: () => <IngredientDiscussionSkeleton />,
  component: IngredientDiscussionIndex,
})
