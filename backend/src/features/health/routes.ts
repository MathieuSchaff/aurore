import { err, HTTP_STATUS, ok } from '@aurore/shared'

import { sql } from 'drizzle-orm'
import { type Context, Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { logger } from '../../lib/logger'

// Liveness: process is up. Used by the container healthcheck — must NOT depend on
// the DB, or a DB outage would keep the container "unhealthy" and stop nginx booting.
export const healthRoute = new Hono<AppEnv>().get('/', (c) => {
  return c.json(ok(true), HTTP_STATUS.OK)
})

type ReadinessCheck = (db: AppEnv['Variables']['db']) => Promise<unknown>

const checkDatabase: ReadinessCheck = (db) => db.execute(sql`SELECT 1`)

async function respondToReadiness(c: Context<AppEnv>, check: ReadinessCheck) {
  try {
    await check(c.get('db'))
    return c.json(ok(true), HTTP_STATUS.OK)
  } catch (e) {
    // The request middleware logs probes at info, which Alloy drops, so a 503 here would
    // never reach Grafana. Warn is the floor for anything shipped.
    logger.warn({ err: e }, 'Readiness check failed')
    return c.json(err('db_unreachable'), HTTP_STATUS.SERVICE_UNAVAILABLE)
  }
}

// Readiness: the app can serve real traffic (DB reachable). For monitoring, not the
// container probe. 503 lets an uptime check distinguish "up but degraded" from "down".
// Declared as a direct chain, not returned from a factory: AppType is inferred from this
// expression, and routing it through a function widens the route literal away, which drops
// `ready` from the RPC client. createReadyRoute exists only to inject a failing check.
export const readyRoute = new Hono<AppEnv>().get('/', (c) => respondToReadiness(c, checkDatabase))

export const createReadyRoute = (check: ReadinessCheck) =>
  new Hono<AppEnv>().get('/', (c) => respondToReadiness(c, check))
