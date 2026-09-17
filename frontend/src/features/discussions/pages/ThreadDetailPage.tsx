import { useSuspenseQuery } from '@tanstack/react-query'

import { BackButton } from '@/component/Button/BackButton'
import { useSession, viewerId } from '@/lib/auth/session'
import { type DiscussionEntityType, discussionQueries } from '@/lib/queries/discussions'
import { ThreadDetail } from '../components/ThreadDetail'
import { threadListRoute } from '../links'

interface ThreadDetailPageProps {
  entityType: DiscussionEntityType
  slug: string
  threadId: string
}

export function ThreadDetailPage({ entityType, slug, threadId }: ThreadDetailPageProps) {
  const { data: thread } = useSuspenseQuery(discussionQueries.thread(entityType, slug, threadId))
  const session = useSession()

  return (
    <>
      <BackButton to={threadListRoute(entityType)} params={{ slug }}>
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
