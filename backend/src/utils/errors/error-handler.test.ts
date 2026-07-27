import { afterEach, describe, expect, it, spyOn } from 'bun:test'

import type { Context } from 'hono'

import type { AppEnv } from '../../app-env'
import { logger } from '../../lib/logger'
import { globalErrorHandler } from './error-handler'

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

describe('globalErrorHandler', () => {
  afterEach(() => {
    spyOn(logger, 'error').mockRestore()
  })

  it('returns server_error for an unhandled internal error', async () => {
    const res = await globalErrorHandler(new Error('boom'), fakeContext())

    expect(res).toMatchObject({
      body: { success: false, error: 'server_error' },
      status: 500,
    })
  })

  it('returns the mapped code for an app error', async () => {
    const appError = Object.assign(new Error('nope'), { code: 'not_found' })
    const res = await globalErrorHandler(appError, fakeContext())

    expect(res).toMatchObject({
      body: { success: false, error: 'not_found' },
      status: 404,
    })
  })

  it('logs an app error that resolves to 5xx', async () => {
    const spy = spyOn(logger, 'error').mockImplementation(() => {})
    // Unregistered class + unmapped code: errorToStatus falls back to 500.
    const appError = Object.assign(new Error('nope'), { code: 'writer_exploded' })
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
    const appError = Object.assign(new Error('nope'), { code: 'not_found' })
    await globalErrorHandler(appError, fakeContext())

    expect(spy).not.toHaveBeenCalled()
  })
})
