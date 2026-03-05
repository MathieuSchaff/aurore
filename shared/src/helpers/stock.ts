import type { HttpStatus } from '../types/api'
import type { StockErrorCode } from '../types/stock'
import { HTTP_STATUS } from './constants'

export const stockErrorMapping = {
  stock_not_found: HTTP_STATUS.NOT_FOUND,
  stock_update_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  stock_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  product_not_found: HTTP_STATUS.NOT_FOUND,
  unauthorized_access: HTTP_STATUS.FORBIDDEN,
  database_error: HTTP_STATUS.INTERNAL_SERVER_ERROR,
} as const satisfies Record<StockErrorCode, HttpStatus>
