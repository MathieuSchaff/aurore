import type { ArticleErrorCode } from '@aurore/shared'

import { DomainError } from '../../utils/errors/domain-error'

export class BlogError extends DomainError<ArticleErrorCode> {}
