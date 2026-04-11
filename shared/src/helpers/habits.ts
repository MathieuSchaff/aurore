import type { HabitErrorCode } from '../types/habits'
import type { HttpStatus } from '../core'
import { HTTP_STATUS } from '../core'

/**
 * Mapping des codes d'erreur habits vers les status HTTP correspondants.
 *
 * @remarks
 * Utilisé avec {@link errorToStatus} pour résoudre le status HTTP
 * à partir d'un code d'erreur habit.
 * @example
 * const status = errorToStatus(error.code, habitErrorMapping)
 * return c.json(err(error.code), status)
 */
export const habitErrorMapping = {
  habit_not_found: HTTP_STATUS.NOT_FOUND,
  habit_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  habit_update_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  habit_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  frequency_update_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  timing_not_found: HTTP_STATUS.NOT_FOUND,
  timing_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  timing_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  reminder_not_found: HTTP_STATUS.NOT_FOUND,
  reminder_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  reminder_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  period_update_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  period_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  check_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  check_not_found: HTTP_STATUS.NOT_FOUND,
  check_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  product_association_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  product_not_found: HTTP_STATUS.NOT_FOUND,
  unauthorized_access: HTTP_STATUS.FORBIDDEN,
  invalid_date_range: HTTP_STATUS.BAD_REQUEST,
  product_set_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  reorder_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  check_products_query_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  database_error: HTTP_STATUS.INTERNAL_SERVER_ERROR,
} as const satisfies Record<HabitErrorCode, HttpStatus>
