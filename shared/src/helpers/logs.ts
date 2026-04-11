import type { LogsErrorCode } from '../types/logs'
import type { HttpStatus } from '../core'
import { HTTP_STATUS } from '../core'

export const logsErrorMapping = {
  habit_not_found: HTTP_STATUS.NOT_FOUND,
  check_not_found: HTTP_STATUS.NOT_FOUND,
  invalid_input: HTTP_STATUS.BAD_REQUEST,
  database_error: HTTP_STATUS.INTERNAL_SERVER_ERROR,
} as const satisfies Record<LogsErrorCode, HttpStatus>
