import { sql } from 'drizzle-orm'

import type { Database } from '../../db'

export type ReadinessCheck = (db: Database) => Promise<void>

// An exhausted pool does not reject: a new statement queues behind it for as long as the
// leak lasts, so an untimed probe hangs instead of reporting the outage. Cap the wait so
// "up but degraded" stays distinguishable from "up".
const READINESS_TIMEOUT_MS = 2_000

export const checkDatabase: ReadinessCheck = async (db) => {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('readiness_timeout')), READINESS_TIMEOUT_MS)
  })
  try {
    await Promise.race([db.execute(sql`SELECT 1`), timeout])
  } finally {
    clearTimeout(timer)
  }
}
