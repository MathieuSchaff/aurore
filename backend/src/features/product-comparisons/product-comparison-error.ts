import type { ProductComparisonErrorCode } from '@aurore/shared'

import { DomainError } from '../../utils/errors/domain-error'

export class ProductComparisonError extends DomainError<ProductComparisonErrorCode> {}
