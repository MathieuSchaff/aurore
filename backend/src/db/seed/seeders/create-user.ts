import { SQL } from 'bun'

import type { Email, RawPassword } from '@aurore/shared'

import { eq } from 'drizzle-orm'
import { type BunSQLDatabase, drizzle } from 'drizzle-orm/bun-sql'

import { env } from '../../../config/env'
import * as schema from '../../../db/schema'
import { users } from '../../../db/schema/users'
import type { AuthContext } from '../../../features/auth/service'
import { signup } from '../../../features/auth/service'
import { getUser } from '../../../features/auth/user.utils'
import { db } from '../../index'

// Migration 0091 refuses role='admin' from app_runtime and the seed shares that pool, so the
// bootstrap promotion must run as the table owner, the exemption the trigger already assumes.
// Opened per call: the seed exits by falling off the event loop, a lingering pool would hang it.
async function withOwnerDb<T>(fn: (ownerDb: BunSQLDatabase<typeof schema>) => Promise<T>) {
  const client = new SQL(env.DATABASE_URL)
  try {
    return await fn(drizzle(client, { schema }))
  } finally {
    await client.close()
  }
}

export function createCtx(overrides?: Partial<AuthContext>): AuthContext {
  return {
    db: db,
    jwtSecret: env.JWT_SECRET,
    refreshSecret: env.REFRESH_SECRET,
    frontendUrl: env.FRONTEND_URL,
    ...overrides,
  }
}
const UserSeeder = {
  email: 'seed@seed.com',
  password: 'Azerty123!seed',
}
export async function getOrCreateSeedUser(
  email: string = UserSeeder.email,
  password: string = UserSeeder.password
) {
  const ctx = createCtx()

  const user = await getUser(ctx.db, email as Email)

  if (user) {
    console.log(`Reusing existing seed user: ${email}`)
    if (user.role !== 'admin') {
      await withOwnerDb((ownerDb) =>
        ownerDb.update(users).set({ role: 'admin' }).where(eq(users.id, user.id))
      )
    }
    return user
  }

  console.log(`Creating seed user: ${email}`)
  const result = await signup(ctx, email as Email, password as RawPassword)

  if (result.success === false) {
    // TypeScript now knows 'error' exists because success is specifically false
    throw new Error(`Failed to create seed user: ${result.error}`)
  }

  // Signup is enumeration-safe and returns no user (ADR 0009); fetch the created row.
  const created = await getUser(ctx.db, email as Email)
  if (!created) {
    throw new Error(`Seed user not found after creation: ${email}`)
  }

  // Mark as verified and admin so slug is used as-is during ingredient creation
  await withOwnerDb((ownerDb) =>
    ownerDb
      .update(users)
      .set({ emailVerifiedAt: new Date().toISOString(), role: 'admin' })
      .where(eq(users.id, created.id))
  )

  console.log(`Seed user created and verified: ${email}`)
  return created
}
