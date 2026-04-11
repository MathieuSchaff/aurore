import type { PurchaseErrorCode } from '../types/purchases'
import { HTTP_STATUS, type HttpStatus } from '../core'

export const purchaseErrorMapping: Record<PurchaseErrorCode, HttpStatus> = {
  purchase_not_found: HTTP_STATUS.NOT_FOUND,
  active_purchase_exists: HTTP_STATUS.CONFLICT,
  no_active_purchase: HTTP_STATUS.NOT_FOUND,
  user_product_not_found: HTTP_STATUS.NOT_FOUND,
  purchase_creation_failed: HTTP_STATUS.BAD_REQUEST,
}
