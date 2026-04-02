import type { DiscussionErrorCode } from '../types/discussions'
import type { HttpStatus } from './constants'
import { HTTP_STATUS } from './constants'

export const discussionErrorMapping = {
  thread_not_found: HTTP_STATUS.NOT_FOUND,
  reply_not_found: HTTP_STATUS.NOT_FOUND,
  unauthorized_access: HTTP_STATUS.FORBIDDEN,
  thread_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  reply_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  entity_not_found: HTTP_STATUS.NOT_FOUND,
} as const satisfies Record<DiscussionErrorCode, HttpStatus>
