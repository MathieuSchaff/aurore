import type { ProfileErrorCode } from '@aurore/shared'

import { DomainError } from '../../utils/errors/domain-error'

export class ProfileError extends DomainError<ProfileErrorCode> {}
