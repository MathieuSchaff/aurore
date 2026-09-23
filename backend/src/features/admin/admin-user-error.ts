import { DomainError } from '../../utils/errors/domain-error'

export class AdminUserError extends DomainError<'not_found'> {}
