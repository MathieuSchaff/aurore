import type { HttpStatus } from '../types/api'
import type { TaskErrorCode } from '../types/tasks'
import { HTTP_STATUS } from './constants'

export const taskErrorMapping = {
  task_not_found: HTTP_STATUS.NOT_FOUND,
  task_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  task_update_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  task_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  subtask_not_found: HTTP_STATUS.NOT_FOUND,
  subtask_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  subtask_update_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  subtask_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  unauthorized_access: HTTP_STATUS.FORBIDDEN,
} as const satisfies Record<TaskErrorCode, HttpStatus>
