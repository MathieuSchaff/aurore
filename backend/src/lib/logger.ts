import { DrizzleQueryError } from 'drizzle-orm'
import pino from 'pino'

type ErrorRecord = Record<string, unknown> & { message: string }

function isErrorRecord(error: unknown): error is ErrorRecord {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  )
}

function isDatabaseError(error: ErrorRecord): boolean {
  return (
    error instanceof DrizzleQueryError ||
    error.name === 'PostgresError' ||
    (typeof error.code === 'string' &&
      (/^(?:[0-9][A-Z0-9]|F0|HV|P0|XX)[A-Z0-9]{3}$/.test(error.code) ||
        error.code.startsWith('ERR_POSTGRES')))
  )
}

function serializeStack(
  error: ErrorRecord,
  databaseError: boolean,
  type: unknown,
  message: string
): string | undefined {
  const stack = typeof error.stack === 'string' ? error.stack : undefined
  if (!databaseError || !stack) return stack

  // Drizzle embeds multiline params before the frames, so matching frame text is insufficient
  const header = `${error.name ?? 'Error'}: ${error.message}`
  return stack.startsWith(header) ? `${type}: ${message}${stack.slice(header.length)}` : undefined
}

function serializeMetadata(error: ErrorRecord): Record<string, unknown> {
  const metadata: Record<string, unknown> = {}
  for (const key of [
    'code',
    'errno',
    'status',
    'statusCode',
    'severity',
    'schema',
    'table',
    'column',
    'constraint',
    'routine',
  ]) {
    if (typeof error[key] === 'string' || typeof error[key] === 'number') {
      metadata[key] = error[key]
    }
  }
  for (const key of ['detail', 'where', 'body', 'rawResponse']) {
    if (key in error) metadata[key] = '[redacted]'
  }
  return metadata
}

export function serializeError(
  error: unknown,
  seen = new WeakSet<object>(),
  sqlCause = false
): unknown {
  if (!isErrorRecord(error)) return sqlCause ? '[redacted]' : error
  if (seen.has(error)) return { type: 'CircularError', message: '[circular]' }
  seen.add(error)

  const databaseError = sqlCause || isDatabaseError(error)
  const type = typeof error.constructor === 'function' ? error.constructor.name : error.name
  const message = databaseError ? 'Database query failed' : error.message
  const result: Record<string, unknown> = {
    type,
    message,
    stack: serializeStack(error, databaseError, type, message),
    ...serializeMetadata(error),
  }
  if (error.cause !== undefined) {
    result.cause = serializeError(error.cause, seen, databaseError)
  }
  if (Array.isArray(error.errors)) {
    result.aggregateErrors = error.errors.map((cause) => serializeError(cause, seen, databaseError))
  }
  return result
}

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  // Pino otherwise appends unsanitized cause messages and stacks to the parent error
  serializers: { err: serializeError },
  hooks: {
    logMethod(args, method) {
      const first = args[0]
      const error =
        first instanceof Error
          ? first
          : typeof first === 'object' && first !== null && 'err' in first
            ? first.err
            : undefined
      // Pino chooses its automatic msg before invoking the error serializer
      if (error !== undefined && args[1] === undefined) {
        const serialized = serializeError(error)
        if (isErrorRecord(serialized)) args[1] = serialized.message
      }
      method.apply(this, args)
    },
  },
  // Errors ship to Grafana Cloud (>= warn). Postgres and Brevo attach private payloads
  // to error objects, so keep the direct keys redacted
  redact: {
    paths: ['err.detail', 'err.where', 'err.body', 'err.rawResponse'],
    censor: '[redacted]',
  },
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true, ignore: 'pid,hostname' } }
      : undefined,
})
