import type { UserProductErrorCode } from '@aurore/shared'

import { DomainError } from '../../utils/errors/domain-error'

export class UserProductError extends DomainError<UserProductErrorCode> {}
