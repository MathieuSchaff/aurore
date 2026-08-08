import { SQL } from 'bun'

import type { ExtractTablesWithRelations } from 'drizzle-orm'
import { type BunSQLTransaction, drizzle } from 'drizzle-orm/bun-sql'

import { env } from '../config/env'
import * as schema from './schema'

const client = new SQL(env.APP_DATABASE_URL)

export type DatabaseTransaction = BunSQLTransaction<
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>

export const db = drizzle(client, { schema })

export type Database = typeof db

export type DbOrTransaction = Database | DatabaseTransaction
