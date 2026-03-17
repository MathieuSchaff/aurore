import type { HttpStatus } from '../types/api'
import type { StockErrorCode } from '../types/stock'
import { HTTP_STATUS } from './constants'

export const stockErrorMapping = {
  product_not_found: HTTP_STATUS.NOT_FOUND,
  stock_entry_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  database_error: HTTP_STATUS.INTERNAL_SERVER_ERROR,
} as const satisfies Record<StockErrorCode, HttpStatus>
