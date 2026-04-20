import type { HttpStatus } from '../core'
import { HTTP_STATUS } from '../core'
import type { ArticleErrorCode } from './types'

export const articleErrorMapping = {
  article_not_found: HTTP_STATUS.NOT_FOUND,
  article_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  article_update_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  article_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  slug_already_exists: HTTP_STATUS.CONFLICT,
  unauthorized_access: HTTP_STATUS.FORBIDDEN,
  database_error: HTTP_STATUS.INTERNAL_SERVER_ERROR,
} as const satisfies Record<ArticleErrorCode, HttpStatus>
