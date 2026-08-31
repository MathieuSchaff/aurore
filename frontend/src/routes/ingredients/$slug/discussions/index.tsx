import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, getRouteApi, notFound } from '@tanstack/react-router'

import { ThreadList } from '@/features/discussions/components/ThreadList'
import { IngredientDiscussionSkeleton } from '@/features/ingredients/components/skeletons/IngredientLayoutSkeleton'
import { useSession } from '@/lib/auth/session'
import { ApiError } from '@/lib/helpers/apiError'
import { discussionQueries } from '@/lib/queries/discussions'
import { ingredientQueries } from '@/lib/queries/ingredients'
import { NOINDEX_ROBOTS, seoHead } from '@/lib/seo'

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
  // Loader and head run on the server so the document carries its own title, robots
  // and canonical, the conversation itself stays client-rendered
  ssr: 'data-only',
  loader: async ({ context, params }) => {
    const [ingredient] = await Promise.all([
      context.queryClient.ensureQueryData(ingredientQueries.bySlug(params.slug)).catch((err) => {
        // Missing ingredient = 404, route to the parent's notFoundComponent
        if (err instanceof ApiError && err.status === 404) throw notFound()
        throw err
      }),
      context.queryClient.ensureQueryData(discussionQueries.threads('ingredient', params.slug)),
    ])
    // Head-only field: the ingredient reaches the component through the dehydrated Query cache
    return { name: ingredient.name }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    return seoHead({
      path: `/ingredients/${params.slug}/discussions`,
      title: `Discussions · ${loaderData.name} — Aurore`,
      // Member conversations stay out of the index; the ingredient page is the indexable one
      robots: NOINDEX_ROBOTS,
    })
  },
  pendingComponent: () => <IngredientDiscussionSkeleton />,
  component: IngredientDiscussionIndex,
})
