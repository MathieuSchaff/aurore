import '../discussions.css'

import type { DiscussionThread } from '@aurore/shared'

import { Link } from '@tanstack/react-router'
import { MessageSquare } from 'lucide-react'

import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import type { DiscussionEntityType } from '@/lib/queries/discussions'
import { threadDetailRoute } from '../links'
import { AuthorLine } from './AuthorLine'
import { ThreadForm } from './ThreadForm'

interface ThreadListProps {
  threads: DiscussionThread[]
  entityType: DiscussionEntityType
  slug: string
  isLoggedIn: boolean
}

export function ThreadList({ threads, entityType, slug, isLoggedIn }: ThreadListProps) {
  return (
    <div className="discussions-section">
      <SectionHeader
        title="Discussions"
        count={threads.length > 0 ? threads.length : undefined}
        variant="primary"
      />
      {isLoggedIn && <ThreadForm entityType={entityType} slug={slug} />}
      {threads.length === 0 ? (
        <p className="ui-empty-panel">Aucune discussion pour l'instant.</p>
      ) : (
        <div className="thread-list">
          {threads.map((thread) => (
            <Link
              key={thread.id}
              to={threadDetailRoute(entityType)}
              params={{ slug, threadId: thread.id }}
              className="thread-item"
            >
              <p className="ui-title-sm">{thread.title}</p>
              <div className="thread-item__meta">
                <AuthorLine
                  authorId={thread.authorId}
                  authorName={thread.authorName}
                  createdAt={thread.createdAt}
                />
                <span className="thread-item__replies">
                  <MessageSquare size={12} />
                  {thread.replyCount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
