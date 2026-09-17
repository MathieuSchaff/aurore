import '../discussions.css'

import type { DiscussionReply, DiscussionThreadWithReplies } from '@aurore/shared'

import { useNavigate } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'

import { Button } from '@/component/Button/Button'
import { ReactionRow } from '@/features/social/components/ReactionRow/ReactionRow'
import { useAnnounce } from '@/hooks/useAnnounce'
import {
  type DiscussionEntityType,
  useDeleteReply,
  useDeleteThread,
} from '@/lib/queries/discussions'
import { threadListRoute } from '../links'
import { AuthorLine } from './AuthorLine'
import { ReplyForm } from './ReplyForm'
import { ReportContentButton } from './ReportContentButton'

interface ThreadDetailProps {
  thread: DiscussionThreadWithReplies
  entityType: DiscussionEntityType
  slug: string
  currentUserId: string | null
}

function ReplyItem({
  reply,
  entityType,
  slug,
  threadId,
  currentUserId,
}: {
  reply: DiscussionReply
  entityType: DiscussionEntityType
  slug: string
  threadId: string
  currentUserId: string | null
}) {
  const deleteReply = useDeleteReply(entityType, slug, threadId)
  const announce = useAnnounce()
  return (
    <div className="reply-item">
      <p className="reply-item__content">{reply.content}</p>
      <div className="reply-item__footer">
        <AuthorLine
          authorId={reply.authorId}
          authorName={reply.authorName}
          createdAt={reply.createdAt}
        />
        {currentUserId && reply.authorId === currentUserId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              deleteReply.mutate(reply.id, { onSuccess: () => announce('Réponse supprimée') })
            }
            disabled={deleteReply.isPending}
            aria-label="Supprimer la réponse"
          >
            <Trash2 size={14} aria-hidden="true" />
          </Button>
        )}
        {currentUserId && reply.authorId !== currentUserId && (
          <ReportContentButton targetType="reply" targetId={reply.id} />
        )}
      </div>
      <ReactionRow reactableType="thread_reply" reactableId={reply.id} />
    </div>
  )
}

export function ThreadDetail({ thread, entityType, slug, currentUserId }: ThreadDetailProps) {
  const announce = useAnnounce()
  const navigate = useNavigate()
  const deleteThread = useDeleteThread(entityType, slug, async () => {
    announce('Discussion supprimée')
    await navigate({ to: threadListRoute(entityType), params: { slug } })
  })

  return (
    <div className="discussions-section">
      <div className="thread-detail__opening">
        <h2 className="thread-detail__title">{thread.title}</h2>
        <p className="thread-detail__content">{thread.content}</p>
        <div className="thread-detail__footer">
          <AuthorLine
            authorId={thread.authorId}
            authorName={thread.authorName}
            createdAt={thread.createdAt}
          />
          {currentUserId && thread.authorId === currentUserId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteThread.mutate(thread.id)}
              disabled={deleteThread.isPending}
              aria-label="Supprimer la discussion"
            >
              <Trash2 size={14} aria-hidden="true" />
            </Button>
          )}
          {currentUserId && thread.authorId !== currentUserId && (
            <ReportContentButton targetType="thread" targetId={thread.id} />
          )}
        </div>
        <ReactionRow reactableType="thread" reactableId={thread.id} />
      </div>

      {thread.replies.length > 0 && (
        <div className="thread-replies">
          {thread.replies.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              entityType={entityType}
              slug={slug}
              threadId={thread.id}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}

      {currentUserId && <ReplyForm entityType={entityType} slug={slug} threadId={thread.id} />}
    </div>
  )
}
