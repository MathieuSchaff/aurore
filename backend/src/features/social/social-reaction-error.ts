import type { SocialReactionErrorCode } from '@aurore/shared'

import { DomainError } from '../../utils/errors/domain-error'

export class SocialReactionError extends DomainError<SocialReactionErrorCode> {}
