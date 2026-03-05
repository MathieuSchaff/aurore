import type { HttpStatus } from '../types/api'
import type { TagErrorCode } from '../types/tags'
import { HTTP_STATUS } from './constants'

export const tagErrorMapping = {
    tag_not_found: HTTP_STATUS.NOT_FOUND,
    tag_already_exists: HTTP_STATUS.CONFLICT,
    tag_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    database_error: HTTP_STATUS.INTERNAL_SERVER_ERROR,
} as const satisfies Record<TagErrorCode, HttpStatus>
