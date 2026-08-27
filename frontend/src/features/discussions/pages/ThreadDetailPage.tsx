import { useSuspenseQuery } from '@tanstack/react-query'
import type { LinkProps } from '@tanstack/react-router'

import { BackButton } from '@/component/Button/BackButton'
import { useSession, viewerId } from '@/lib/auth/session'
import { discussionQueries } from '@/lib/queries/discussions'
import { ThreadDetail } from '../components/ThreadDetail'

interface ThreadDetailPageProps {
  entityType: 'product' | 'ingredient'
  slug: string
  threadId: string
  backTo: LinkProps['to']
}

export function ThreadDetailPage({ entityType, slug, threadId, backTo }: ThreadDetailPageProps) {
  const { data: thread } = useSuspenseQuery(discussionQueries.thread(entityType, slug, threadId))
  const session = useSession()

  return (
    <>
      <BackButton to={backTo} params={{ slug }}>
        Retour aux discussions
      </BackButton>
      <ThreadDetail
        thread={thread}
        entityType={entityType}
        slug={slug}
        currentUserId={viewerId(session)}
      />
    </>
  )
}
