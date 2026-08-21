export type DomainErrorOptions = {
  publicDetails?: unknown
  cause?: unknown
}

export abstract class DomainError<E extends string> extends Error {
  readonly code: E
  readonly details?: unknown

  constructor(code: E, options: DomainErrorOptions = {}) {
    super(code, { cause: options.cause })
    this.name = new.target.name
    this.code = code
    this.details = options.publicDetails
  }
}
