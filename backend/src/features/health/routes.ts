import { err, HTTP_STATUS, ok } from '@aurore/shared'

import { sql } from 'drizzle-orm'
import { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { logger } from '../../lib/logger'

// Liveness: process is up. Used by the container healthcheck — must NOT depend on
// the DB, or a DB outage would keep the container "unhealthy" and stop nginx booting.
export const healthRoute = new Hono<AppEnv>().get('/', (c) => {
  return c.json(ok(true), HTTP_STATUS.OK)
})

type ReadinessCheck = (db: AppEnv['Variables']['db']) => Promise<unknown>

const checkDatabase: ReadinessCheck = (db) => db.execute(sql`SELECT 1`)

// Readiness: the app can serve real traffic (DB reachable). For monitoring, not the
// container probe. 503 lets an uptime check distinguish "up but degraded" from "down".
export function createReadyRoute(check: ReadinessCheck = checkDatabase) {
  return new Hono<AppEnv>().get('/', async (c) => {
    try {
      await check(c.get('db'))
      return c.json(ok(true), HTTP_STATUS.OK)
    } catch (e) {
      // The request middleware logs probes at info, which Alloy drops, so a 503 here would
      // never reach Grafana. Warn is the floor for anything shipped.
      logger.warn({ err: e }, 'Readiness check failed')
      return c.json(err('db_unreachable'), HTTP_STATUS.SERVICE_UNAVAILABLE)
    }
  })
}

export const readyRoute = createReadyRoute()
