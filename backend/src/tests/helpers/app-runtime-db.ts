import { afterAll } from 'bun:test'
import { SQL } from 'bun'

import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/bun-sql'

import type { DatabaseTransaction } from '../../db/index'

// Connects as `app_runtime` (no BYPASSRLS), unlike testDb which owns the tables.
// Registers its own afterAll so each RLS suite keeps an isolated pool and teardown.
export async function createAppRuntimeDb() {
  const APP_DATABASE_URL = process.env.APP_DATABASE_URL
  if (!APP_DATABASE_URL) throw new Error('APP_DATABASE_URL not set')
  const pool = new SQL(APP_DATABASE_URL)
  const db = drizzle(pool, { schema: await import('../../db/schema') })
  afterAll(async () => {
    await pool.close()
  })
  return db
}

export type AppRuntimeDb = Awaited<ReturnType<typeof createAppRuntimeDb>>

// Mirrors withRlsContext: binds app.user_id + app.role LOCAL to the tx so
// auth.uid()/auth.role() see the identity a real request would carry. Pass an
// empty role/userId to probe the anonymous policies.
export function withRlsAs<T>(
  db: AppRuntimeDb,
  role: string,
  userId: string,
  fn: (tx: DatabaseTransaction) => Promise<T>
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.user_id', ${userId}, true)`)
    await tx.execute(sql`SELECT set_config('app.role', ${role}, true)`)
    return fn(tx)
  })
}
