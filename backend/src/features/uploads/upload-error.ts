import type { UploadErrorCode } from '@aurore/shared'

import { DomainError } from '../../utils/errors/domain-error'

export class UploadError extends DomainError<UploadErrorCode | 'not_found'> {}
