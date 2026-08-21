import type { TagErrorCode } from '@aurore/shared'

import { DomainError } from '../../utils/errors/domain-error'

export class TagError extends DomainError<TagErrorCode> {}
