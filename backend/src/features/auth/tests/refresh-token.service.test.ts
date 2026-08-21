import { afterEach, describe, expect, it, spyOn } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { Hono } from 'hono'

import type { AppEnv } from '../../../app-env'
import { isUniqueViolation } from '../../../lib/helpers'
import { logger } from '../../../lib/logger'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { expectError } from '../../../tests/helpers/expectStatus'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { globalErrorHandler } from '../../../utils/errors/error-handler'
import { storeRefreshToken } from '../refresh-token.service'

setupDbTests()

describe('storeRefreshToken error handling', () => {
  afterEach(() => {
    spyOn(logger, 'error').mockRestore()
  })

  it('logs a duplicate token once and retains the database cause', async () => {
    const user = await createTestUser()
    const duplicateToken = {
      userId: user.id,
      jti: crypto.randomUUID(),
      expiresAt: '2099-01-01T00:00:00.000Z',
    }
    await storeRefreshToken(testDb, duplicateToken)

    const app = new Hono<AppEnv>()
    app.onError(globalErrorHandler)
    app.get('/', async (c) => {
      await storeRefreshToken(testDb, duplicateToken)
      return c.body(null, HTTP_STATUS.NO_CONTENT)
    })
    const logSpy = spyOn(logger, 'error').mockImplementation(() => {})

    await expectError(app.request('/'), HTTP_STATUS.INTERNAL_SERVER_ERROR, 'server_error')

    expect(logSpy).toHaveBeenCalledTimes(1)
    const logEntry = logSpy.mock.calls[0]?.[0] as { err?: Error } | undefined
    expect(logEntry?.err?.message).toBe('duplicate_refresh_token')
    expect(logEntry?.err?.cause).toBeInstanceOf(Error)
    expect(isUniqueViolation(logEntry?.err?.cause)).toBe(true)
  })
})
