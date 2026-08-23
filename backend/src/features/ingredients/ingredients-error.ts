import type { IngredientErrorCode } from '@aurore/shared'

import { DomainError } from '../../utils/errors/domain-error'

export class IngredientError extends DomainError<IngredientErrorCode> {}
