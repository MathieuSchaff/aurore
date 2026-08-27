import type { CommonErrorCode } from '@aurore/shared'

import { DomainError } from '../../utils/errors/domain-error'

export class SuggestedEditError extends DomainError<CommonErrorCode> {}
