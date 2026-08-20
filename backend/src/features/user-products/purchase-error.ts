import type { PurchaseErrorCode } from '@aurore/shared'

import { DomainError } from '../../utils/errors/domain-error'

export class PurchaseError extends DomainError<PurchaseErrorCode> {}
