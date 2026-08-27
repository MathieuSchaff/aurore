import type { DiscussionErrorCode } from '@aurore/shared'

import { DomainError } from '../../utils/errors/domain-error'

export class DiscussionError extends DomainError<DiscussionErrorCode> {}
