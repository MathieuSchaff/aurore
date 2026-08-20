import type { ProductIngredientErrorCode } from '@aurore/shared'

import { DomainError } from '../../../utils/errors/domain-error'

export class ProductIngredientError extends DomainError<ProductIngredientErrorCode> {}
