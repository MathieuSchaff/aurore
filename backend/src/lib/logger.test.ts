import { describe, expect, it } from 'bun:test'
import { SQL } from 'bun'

import { DrizzleQueryError } from 'drizzle-orm'
import pino from 'pino'

import { logger } from './logger'

const PRIVATE_EMAIL = 'private-log-probe@example.com'

function captureLog(write: (output: pino.Logger) => void) {
  let output = ''
  const child = logger.child({}, { level: 'error' })
  Object.defineProperty(child, pino.symbols.streamSym, {
    value: { write: (line: string) => (output += line) },
  })
  write(child)
  return { output, event: JSON.parse(output) as unknown }
}

function queryError() {
  const cause = new SQL.PostgresError(`invalid input: ${PRIVATE_EMAIL}`, {
    code: 'ERR_POSTGRES_SERVER_ERROR',
    errno: '22P02',
    detail: `Rejected ${PRIVATE_EMAIL}`,
    where: `parameter = '${PRIVATE_EMAIL}'`,
  })
  return new DrizzleQueryError(
    `select '${PRIVATE_EMAIL}'`,
    [`${PRIVATE_EMAIL}\n    at ${PRIVATE_EMAIL}`],
    cause
  )
}

describe('logger error privacy', () => {
  it('removes SQL payloads from messages, stacks, parameters and causes', () => {
    const error = queryError()
    const before = error.message
    const { output, event } = captureLog((log) => log.error({ err: error }, 'Lookup failed'))

    expect(output).not.toContain(PRIVATE_EMAIL)
    expect(event).toMatchObject({
      msg: 'Lookup failed',
      err: {
        type: 'DrizzleQueryError',
        cause: { code: 'ERR_POSTGRES_SERVER_ERROR', errno: '22P02' },
        stack: expect.stringContaining('logger.test.ts'),
      },
    })
    expect(event).not.toHaveProperty('err.query')
    expect(event).not.toHaveProperty('err.params')
    expect(error.message).toBe(before)
  })

  it('sanitizes SQL causes nested beneath ordinary errors', () => {
    const error = new Error('Account lookup failed', {
      cause: new Error('Database request failed', { cause: queryError() }),
    })
    const { output, event } = captureLog((log) => log.error(error))

    expect(output).not.toContain(PRIVATE_EMAIL)
    expect(event).toMatchObject({
      err: { message: 'Account lookup failed', cause: { cause: { cause: { errno: '22P02' } } } },
    })
  })

  it('redacts direct PostgreSQL payloads while preserving the SQLSTATE and constraint', () => {
    const error = new SQL.PostgresError(`Duplicate ${PRIVATE_EMAIL}`, {
      code: 'ERR_POSTGRES_SERVER_ERROR',
      errno: '23505',
      constraint: 'users_email_active_unique_idx',
      detail: PRIVATE_EMAIL,
      where: PRIVATE_EMAIL,
      hint: PRIVATE_EMAIL,
      internalQuery: `select '${PRIVATE_EMAIL}'`,
    })
    const { output, event } = captureLog((log) => log.error(error))

    expect(output).not.toContain(PRIVATE_EMAIL)
    expect(event).toMatchObject({
      msg: 'Database query failed',
      err: { errno: '23505', constraint: 'users_email_active_unique_idx' },
    })
  })

  it('keeps the automatic log message free of SQL parameters', () => {
    const { output, event } = captureLog((log) => log.error({ err: queryError() }))

    expect(output).not.toContain(PRIVATE_EMAIL)
    expect(event).toHaveProperty('msg', 'Database query failed')
  })

  it('preserves ordinary error diagnostics while redacting private attachments', () => {
    const error = Object.assign(new Error('Cache unavailable'), {
      code: 'ECONNREFUSED',
      statusCode: 503,
      detail: PRIVATE_EMAIL,
      where: PRIVATE_EMAIL,
      body: PRIVATE_EMAIL,
      rawResponse: PRIVATE_EMAIL,
    })
    const { output, event } = captureLog((log) => log.error({ err: error }))

    expect(output).not.toContain(PRIVATE_EMAIL)
    expect(event).toMatchObject({
      err: {
        message: 'Cache unavailable',
        code: 'ECONNREFUSED',
        statusCode: 503,
        stack: expect.stringContaining('logger.test.ts'),
      },
    })
  })

  it('handles a cyclic SQL cause without restoring private payloads', () => {
    const error = queryError()
    if (!error.cause) throw new Error('missing test cause')
    error.cause.cause = error

    const { output } = captureLog((log) => log.error({ err: error }))

    expect(output).not.toContain(PRIVATE_EMAIL)
  })
})
