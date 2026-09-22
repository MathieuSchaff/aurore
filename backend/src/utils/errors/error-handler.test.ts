import { afterEach, describe, expect, it, spyOn } from 'bun:test'

import type { HttpStatus } from '@aurore/shared'
import * as shared from '@aurore/shared'

import { SpanStatusCode, trace } from '@opentelemetry/api'
import { tracing } from '@opentelemetry/sdk-node'
import { DrizzleQueryError } from 'drizzle-orm'
import type { Context } from 'hono'

import type { AppEnv } from '../../app-env'
import { logger } from '../../lib/logger'
import { DomainError } from './domain-error'
import { globalErrorHandler, thrownDomainErrorMappingRegistry } from './error-handler'

class TestDomainError extends DomainError<string> {}

const nonThrownErrorMappings = new Set([
  'adminBanErrorMapping',
  'adminRoleErrorMapping',
  'authErrorMapping',
  'baseErrorMapping',
  'cancelRoleRequestErrorMapping',
  'resetPasswordErrorMapping',
  'reviewRoleRequestErrorMapping',
  'submitRoleRequestErrorMapping',
])

function isErrorMappingExport(
  entry: [string, unknown]
): entry is [string, Record<string, HttpStatus>] {
  const [name, value] = entry
  return name.endsWith('ErrorMapping') && typeof value === 'object' && value !== null
}

const sharedExports: [string, unknown][] = Object.entries(shared)
const expectedThrownDomainErrorMappings = Object.fromEntries(
  sharedExports.filter(isErrorMappingExport).filter(([name]) => !nonThrownErrorMappings.has(name))
)
const registeredThrownDomainErrorMappings: Record<
  string,
  Record<string, HttpStatus>
> = thrownDomainErrorMappingRegistry

// Minimal Context stand-in: the handler only reads req.path/method, the requestId set by
// the logging middleware, and calls c.json.
function fakeContext(userId?: string): Context<AppEnv> {
  return {
    req: { path: '/api/boom', method: 'GET' },
    get: (key: string) => {
      if (key === 'userId') return userId
      if (key === 'requestId') return 'req-42'
      return undefined
    },
    json: (body: unknown, status?: number) => ({ body, status }),
  } as unknown as Context<AppEnv>
}

async function captureErrorSpan(error: Error) {
  const exporter = new tracing.InMemorySpanExporter()
  const provider = new tracing.BasicTracerProvider({
    spanProcessors: [new tracing.SimpleSpanProcessor(exporter)],
  })
  const span = provider.getTracer('error-handler-test').startSpan('privacy export')
  const activeSpan = spyOn(trace, 'getActiveSpan').mockReturnValue(span)
  try {
    await globalErrorHandler(error, fakeContext())
    span.end()
    await provider.forceFlush()
    return exporter.getFinishedSpans().map(({ events, status, attributes }) => ({
      events,
      status,
      attributes,
    }))
  } finally {
    activeSpan.mockRestore()
    await provider.shutdown()
  }
}

describe('globalErrorHandler', () => {
  afterEach(() => {
    spyOn(logger, 'error').mockRestore()
  })

  it('removes SQL parameters from exported exception events and span status', async () => {
    const secret = 'SYNTHETIC_PRIVATE_EXPORT_EMAIL@example.test'
    const error = new DrizzleQueryError(
      'select auth.find_user_with_hash_by_email($1)',
      [secret],
      new Error('Lookup failed')
    )
    const originalMessage = error.message

    const spans = await captureErrorSpan(error)

    expect(JSON.stringify(spans)).not.toContain(secret)
    expect(spans).toHaveLength(1)
    expect(spans[0]).toMatchObject({
      status: { code: SpanStatusCode.ERROR, message: 'Database query failed' },
      attributes: { 'http.method': 'GET', 'http.route': '/api/boom', 'http.status_code': 500 },
      events: [
        {
          name: 'exception',
          attributes: {
            'exception.type': 'DrizzleQueryError',
            'exception.message': 'Database query failed',
            'exception.stacktrace': expect.stringContaining('error-handler.test.ts'),
          },
        },
      ],
    })
    expect(error.message).toBe(originalMessage)
  })

  it('preserves ordinary error diagnostics in exported spans', async () => {
    const spans = await captureErrorSpan(new Error('Cache unavailable'))

    expect(spans[0]).toMatchObject({
      status: { code: SpanStatusCode.ERROR, message: 'Cache unavailable' },
      events: [
        {
          name: 'exception',
          attributes: {
            'exception.type': 'Error',
            'exception.message': 'Cache unavailable',
            'exception.stacktrace': expect.stringContaining('error-handler.test.ts'),
          },
        },
      ],
    })
  })

  it('returns server_error for an unhandled internal error', async () => {
    const res = await globalErrorHandler(new Error('boom'), fakeContext())

    expect(res).toMatchObject({
      body: { success: false, error: 'server_error' },
      status: 500,
    })
  })

  it('returns the mapped code for an app error', async () => {
    const appError = new TestDomainError('not_found')
    const res = await globalErrorHandler(appError, fakeContext())

    expect(res).toMatchObject({
      body: { success: false, error: 'not_found' },
      status: 404,
    })
  })

  it('maps a domain code independently of the error subclass name', async () => {
    const appError = new TestDomainError('product_already_exists')
    const res = await globalErrorHandler(appError, fakeContext())

    expect(res).toMatchObject({
      body: { success: false, error: 'product_already_exists' },
      status: 409,
    })
  })

  it('registers every thrown domain mapping exported by shared', () => {
    expect(registeredThrownDomainErrorMappings).toEqual(expectedThrownDomainErrorMappings)
  })

  it('logs an app error that resolves to 5xx', async () => {
    const spy = spyOn(logger, 'error').mockImplementation(() => {})
    // Unmapped code: errorToStatus falls back to 500
    const appError = new TestDomainError('writer_exploded')
    const res = await globalErrorHandler(appError, fakeContext())

    expect(res).toMatchObject({ status: 500 })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0]?.[0]).toMatchObject({
      code: 'writer_exploded',
      // Correlates the 500 back to the request line the middleware logged.
      requestId: 'req-42',
      path: '/api/boom',
      method: 'GET',
    })
  })

  it('stays silent on an app error that resolves to 4xx', async () => {
    const spy = spyOn(logger, 'error').mockImplementation(() => {})
    const appError = new TestDomainError('not_found')
    await globalErrorHandler(appError, fakeContext())

    expect(spy).not.toHaveBeenCalled()
  })

  it('serializes only explicitly public domain details', async () => {
    const cause = Object.assign(new Error('query failed'), { code: '23505' })
    const error = new TestDomainError('not_found', {
      publicDetails: { resource: 'product' },
      cause,
    })

    const res = await globalErrorHandler(error, fakeContext())

    expect(res).toMatchObject({
      body: {
        success: false,
        error: 'not_found',
        details: { resource: 'product' },
      },
      status: 404,
    })
    expect(JSON.stringify(res)).not.toContain('query failed')
    expect(JSON.stringify(res)).not.toContain('23505')
  })

  it('treats foreign coded errors as internal errors', async () => {
    const error = Object.assign(new Error('query failed'), {
      code: '23505',
      details: { query: 'secret statement' },
    })

    const res = await globalErrorHandler(error, fakeContext())

    expect(res).toMatchObject({
      body: { success: false, error: 'server_error' },
      status: 500,
    })
    expect(JSON.stringify(res)).not.toContain('23505')
    expect(JSON.stringify(res)).not.toContain('secret statement')
  })
})
