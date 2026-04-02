export type DiscussionThread = {
  id: string
  productId: string | null
  ingredientId: string | null
  authorId: string | null
  authorName: string | null
  title: string
  content: string
  replyCount: number
  createdAt: string | Date
}

export type DiscussionReply = {
  id: string
  threadId: string
  authorId: string | null
  authorName: string | null
  content: string
  createdAt: string | Date
}

export type DiscussionThreadWithReplies = DiscussionThread & {
  replies: DiscussionReply[]
}

export type DiscussionErrorCode =
  | 'thread_not_found'
  | 'reply_not_found'
  | 'unauthorized_access'
  | 'thread_creation_failed'
  | 'reply_creation_failed'
  | 'entity_not_found'
