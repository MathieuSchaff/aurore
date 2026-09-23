import type { ReportErrorCode } from '@aurore/shared'

import { DomainError } from '../../utils/errors/domain-error'

export class ReportError extends DomainError<ReportErrorCode> {}
