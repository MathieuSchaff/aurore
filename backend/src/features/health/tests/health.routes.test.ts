import { afterEach, beforeAll, describe, expect, it, spyOn } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { Hono } from 'hono'

import type { AppEnv } from '../../../app-env'
import { logger } from '../../../lib/logger'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestClient, type TestClient } from '../../../tests/helpers/createTestClient'
import { createReadyRoute } from '../routes'
import { checkDatabase } from '../service'

setupDbTests()

describe('Health Routes', () => {
  let client: TestClient

  beforeAll(async () => {
    client = await createTestClient()
  })

  describe('GET /health', () => {
    it('should return 200 with success', async () => {
      const res = await client.health.$get()

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
      if (!data.success) throw new Error('health failed')
      expect(data.data).toBe(true)
    })

    it('should not require authentication', async () => {
      const res = await client.health.$get()
      expect(res.status).toBe(HTTP_STATUS.OK)
    })
  })

  describe('GET /ready', () => {
    afterEach(() => {
      spyOn(logger, 'warn').mockRestore()
    })

    it('should return 200 when the DB is reachable', async () => {
      const res = await client.ready.$get()

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    // The uptime probe reads this contract: 503 tells it "up but degraded", and the warn
    // is what carries the outage to Grafana (the request middleware only logs probes at info).
    it('should return 503 and warn when the DB is unreachable', async () => {
      const warn = spyOn(logger, 'warn').mockImplementation(() => {})
      const app = new Hono<AppEnv>()
        .use('*', async (c, next) => {
          c.set('db', testDb)
          await next()
        })
        .route(
          '/',
          createReadyRoute(async () => {
            throw new Error('down')
          })
        )

      const res = await app.request('/')

      expect(res.status).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE)
      expect(await res.json()).toMatchObject({ success: false, error: 'db_unreachable' })
      expect(warn).toHaveBeenCalledTimes(1)
    })

    // A pool exhausted by leaked transactions queues new statements instead of rejecting,
    // so an untimed probe reports nothing at all. checkDatabase must give up and let the
    // route answer 503.
    it('gives up on a statement that never comes back', async () => {
      const stuck = { execute: () => new Promise(() => {}) } as unknown as Parameters<
        typeof checkDatabase
      >[0]

      await expect(checkDatabase(stuck)).rejects.toThrow('readiness_timeout')
    })
  })
})
