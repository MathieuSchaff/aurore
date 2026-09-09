import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, getRouteApi, notFound } from '@tanstack/react-router'

import { ThreadList } from '@/features/discussions/components/ThreadList'
import { PostComposer } from '@/features/products/components/PostComposer/PostComposer'
import { ProductPostsSection } from '@/features/products/components/ProductPostsSection/ProductPostsSection'
import { PublicReviewsSection } from '@/features/products/components/PublicReviewsSection/PublicReviewsSection'
import { ProductDiscussionSkeleton } from '@/features/products/components/skeletons/ProductLayoutSkeleton/ProductLayoutSkeleton'
import { resolveProductDetailViewer } from '@/features/products/loadProductDetailViewer'
import { viewerId as getSessionViewerId, useSession } from '@/lib/auth/session'
import { ApiError } from '@/lib/helpers/apiError'
import { discussionQueries } from '@/lib/queries/discussions'
import { productQueries } from '@/lib/queries/products'
import { NOINDEX_ROBOTS, seoHead } from '@/lib/seo'

const route = getRouteApi('/products/$slug/discussions/')

function ProductDiscussionIndex() {
  const { slug } = route.useParams()
  const session = useSession()
  const viewerId = getSessionViewerId(session)
  const hasViewer = session.status === 'authenticated'
  const { data: detailPage } = useSuspenseQuery(productQueries.detailPage(slug, viewerId))
  const product = detailPage.product
  const { data: threads } = useSuspenseQuery(discussionQueries.threads('product', slug))

  return (
    <>
      <PublicReviewsSection slug={slug} />

      <ProductPostsSection
        slug={slug}
        composer={hasViewer ? <PostComposer productId={product.id} slug={slug} /> : undefined}
      />

      <ThreadList threads={threads} entityType="product" slug={slug} isLoggedIn={hasViewer} />
    </>
  )
}

export const Route = createFileRoute('/products/$slug/discussions/')({
  // Loader and head run on the server so the document carries its own title, robots
  // and canonical, the conversation itself stays client-rendered
  ssr: 'data-only',
  loader: async ({ context, params, parentMatchPromise }) => {
    const viewerId = await resolveProductDetailViewer(context.queryClient, parentMatchPromise)
    const [{ product }] = await Promise.all([
      context.queryClient
        .ensureQueryData(productQueries.detailPage(params.slug, viewerId))
        .catch((err) => {
          // Missing product = 404, route to the parent's notFoundComponent
          if (err instanceof ApiError && err.status === 404) throw notFound()
          throw err
        }),
      context.queryClient.ensureQueryData(discussionQueries.threads('product', params.slug)),
    ])
    // Head-only fields: the page reaches the component through the dehydrated Query cache
    return { name: product.name, brand: product.brand }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    return seoHead({
      path: `/products/${params.slug}/discussions`,
      title: `Discussions · ${loaderData.name} · ${loaderData.brand} — Aurore`,
      // Member conversations stay out of the index; the product page is the indexable one
      robots: NOINDEX_ROBOTS,
    })
  },
  pendingComponent: () => <ProductDiscussionSkeleton />,
  component: ProductDiscussionIndex,
})
