import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/component/Button/Button'
import { ThreadDetail } from '@/features/discussions/components/ThreadDetail'
import { discussionQueries } from '@/lib/queries/discussions'
import { useAuthStore } from '@/store/auth'

function ProductThreadDetail() {
  const { slug, threadId } = Route.useParams()
  const { data: thread } = useSuspenseQuery(discussionQueries.thread('product', slug, threadId))
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/products/$slug/discussions', params: { slug } })}
        style={{ marginBottom: 'var(--space-2)' }}
      >
        <ArrowLeft size={14} />
        Retour aux discussions
      </Button>
      <ThreadDetail
        thread={thread}
        entityType="product"
        slug={slug}
        currentUserId={user?.id ?? null}
      />
    </>
  )
}

export const Route = createFileRoute('/products/$slug/discussions/$threadId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      discussionQueries.thread('product', params.slug, params.threadId)
    ),
  component: ProductThreadDetail,
})
