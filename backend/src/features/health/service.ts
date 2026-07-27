import { sql } from 'drizzle-orm'

import type { AppEnv } from '../../app-env'

export type ReadinessCheck = (db: AppEnv['Variables']['db']) => Promise<unknown>

export const checkDatabase: ReadinessCheck = (db) => db.execute(sql`SELECT 1`)
