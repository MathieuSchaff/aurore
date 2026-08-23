import type { SocialPostErrorCode } from '@aurore/shared'

import { DomainError } from '../../utils/errors/domain-error'

export class SocialPostError extends DomainError<SocialPostErrorCode> {}
