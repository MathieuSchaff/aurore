import type { UserProductErrorCode } from '../types/user-products'
import type { HttpStatus } from './constants'
import { HTTP_STATUS } from './constants'

export const userProductErrorMapping = {
  user_product_not_found: HTTP_STATUS.NOT_FOUND,
  user_product_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  user_product_update_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  user_product_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  database_error: HTTP_STATUS.INTERNAL_SERVER_ERROR,
} as const satisfies Record<UserProductErrorCode, HttpStatus>
