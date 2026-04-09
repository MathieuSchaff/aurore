import { HTTP_STATUS, ok } from '@habit-tracker/shared'
import { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import type { HabitCheck } from '../../db/schema/habits'
import type { WellbeingLog } from '../../db/schema/logs'

// Minimal stub to unblock ts-build in this worktree. The real logs
// feature doesn't exist yet on this branch; these endpoints are just
// typed placeholders so Hono RPC compiles.
const logsApp = new Hono<AppEnv>()
  .get('/today', (c) =>
    c.json(
      ok({ habitChecks: [] as HabitCheck[], wellbeingLogs: [] as WellbeingLog[] }),
      HTTP_STATUS.OK
    )
  )
  .post('/habit-check', (c) => c.json(ok({ id: '' }), HTTP_STATUS.OK))
  .post('/wellbeing', (c) => c.json(ok({ id: '' }), HTTP_STATUS.OK))

export const logsRoutes = logsApp
