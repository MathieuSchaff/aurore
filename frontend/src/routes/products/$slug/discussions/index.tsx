import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'

import { ThreadList } from '@/features/discussions/components/ThreadList'
import { PostComposer } from '@/features/products/components/PostComposer/PostComposer'
import { ProductPostsSection } from '@/features/products/components/ProductPostsSection/ProductPostsSection'
import { PublicReviewsSection } from '@/features/products/components/PublicReviewsSection/PublicReviewsSection'
import { ProductDiscussionSkeleton } from '@/features/products/components/skeletons/ProductLayoutSkeleton/ProductLayoutSkeleton'
import { viewerId as getSessionViewerId, useSession } from '@/lib/auth/session'
import { discussionQueries } from '@/lib/queries/discussions'
import { productQueries } from '@/lib/queries/products'

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
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(discussionQueries.threads('product', params.slug)),
  pendingComponent: () => <ProductDiscussionSkeleton />,
  component: ProductDiscussionIndex,
})
