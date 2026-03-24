import type { ProductIngredientErrorCode } from '../types/product-ingredients'
import type { HttpStatus } from './constants'
import { HTTP_STATUS } from './constants'

export const productIngredientErrorMapping = {
  product_ingredient_not_found: HTTP_STATUS.NOT_FOUND,
  product_ingredient_already_exists: HTTP_STATUS.CONFLICT,
  ingredient_not_found: HTTP_STATUS.NOT_FOUND,
  database_error: HTTP_STATUS.INTERNAL_SERVER_ERROR,
} as const satisfies Record<ProductIngredientErrorCode, HttpStatus>
