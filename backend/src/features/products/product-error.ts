import type { ProductErrorCode } from '@aurore/shared'

import { DomainError } from '../../utils/errors/domain-error'

export class ProductError extends DomainError<ProductErrorCode> {}
