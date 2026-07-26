import { afterEach, describe, expect, it, spyOn } from 'bun:test'

import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { cors } from 'hono/cors'

import type { AppEnv } from '../app-env'
import { logger } from '../lib/logger'
import { globalErrorHandler } from '../utils/errors/error-handler'
import { requestLoggingMiddleware } from './request-logging'

function createBoundaryApp(): Hono<AppEnv> {
  const app = new Hono<AppEnv>()
  app.onError(globalErrorHandler)
  app.use('*', requestLoggingMiddleware)
  app.use(bodyLimit({ maxSize: 4 }))
  app.use(
    '*',
    cors({
      origin: 'https://example.com',
      allowMethods: ['POST', 'OPTIONS'],
    })
  )
  app.post('/payload', (c) => c.text('ok'))
  return app
}

describe('requestLoggingMiddleware', () => {
  afterEach(() => {
    spyOn(logger, 'info').mockRestore()
  })

  it('corrèle une erreur 413 déclenchée avant les routes', async () => {
    const info = spyOn(logger, 'info').mockImplementation(() => {})
    const res = await createBoundaryApp().request('/payload', {
      method: 'POST',
      headers: { 'Content-Length': '5' },
      body: '12345',
    })

    const requestId = res.headers.get('X-Request-Id')
    expect(res.status).toBe(413)
    expect(requestId).toMatch(/^[0-9a-f-]{36}$/)
    expect(info).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId,
        method: 'POST',
        path: '/payload',
        status: 413,
      })
    )
  })

  it('corrèle un preflight OPTIONS court-circuité par CORS', async () => {
    spyOn(logger, 'info').mockImplementation(() => {})
    const res = await createBoundaryApp().request('/payload', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://example.com',
        'Access-Control-Request-Method': 'POST',
      },
    })

    expect(res.status).toBe(204)
    expect(res.headers.get('X-Request-Id')).toMatch(/^[0-9a-f-]{36}$/)
  })
})
