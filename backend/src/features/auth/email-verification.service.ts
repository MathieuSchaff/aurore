import { err, ok } from '@aurore/shared'

import { and, eq, isNull, sql } from 'drizzle-orm'

import type { Database, DbOrTransaction } from '../../db/index'
import { emailVerifications, users, usersSafe } from '../../db/schema'
import { generateRawToken, hashToken } from './token.utils'

const TOKEN_EXPIRY_MS = 60 * 60 * 1000

export async function createVerificationToken(
  db: DbOrTransaction,
  userId: string
): Promise<string> {
  const rawToken = generateRawToken()
  const tokenHash = hashToken(rawToken)
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS).toISOString()

  // Invalidate all previous tokens so only one is valid at a time.
  await db
    .update(emailVerifications)
    .set({ usedAt: sql`now()` })
    .where(and(eq(emailVerifications.userId, userId), isNull(emailVerifications.usedAt)))

  await db.insert(emailVerifications).values({
    userId,
    tokenHash,
    expiresAt,
  })

  return rawToken
}

export async function verifyEmailToken(db: Database, rawToken: string) {
  const tokenHash = hashToken(rawToken)

  const [row] = await db
    .select()
    .from(emailVerifications)
    .where(eq(emailVerifications.tokenHash, tokenHash))
    .limit(1)

  if (!row || row.usedAt !== null) {
    return err('invalid_token' as const)
  }

  if (Date.parse(row.expiresAt) < Date.now()) {
    return err('token_expired' as const)
  }

  // Guard against concurrent verification requests: treat already-verified as success.
  const [userRow] = await db
    .select({ emailVerifiedAt: usersSafe.emailVerifiedAt })
    .from(usersSafe)
    .where(eq(usersSafe.id, row.userId))
    .limit(1)

  if (userRow?.emailVerifiedAt !== null) {
    await db
      .update(emailVerifications)
      .set({ usedAt: sql`now()` })
      .where(eq(emailVerifications.id, row.id))
    return ok(row.userId)
  }

  await db.transaction(async (tx) => {
    await tx
      .update(emailVerifications)
      .set({ usedAt: sql`now()` })
      .where(eq(emailVerifications.id, row.id))

    await tx.update(users).set({ emailVerifiedAt: sql`now()` }).where(eq(users.id, row.userId))
  })

  return ok(row.userId)
}

// Resend reads both in one go: null means unknown user or already verified,
// and both cases answer the same neutral OK (no enumeration signal)
export async function getUnverifiedEmail(
  db: DbOrTransaction,
  userId: string
): Promise<string | null> {
  const [row] = await db
    .select({ emailVerifiedAt: usersSafe.emailVerifiedAt, email: usersSafe.email })
    .from(usersSafe)
    .where(eq(usersSafe.id, userId))
    .limit(1)
  if (!row || row.emailVerifiedAt !== null) return null
  return row.email
}

export async function getUnverifiedRecipientByToken(db: Database, rawToken: string) {
  const [row] = await db
    .select({ userId: emailVerifications.userId, email: usersSafe.email })
    .from(emailVerifications)
    .innerJoin(usersSafe, eq(usersSafe.id, emailVerifications.userId))
    .where(
      and(
        eq(emailVerifications.tokenHash, hashToken(rawToken)),
        isNull(emailVerifications.usedAt),
        isNull(usersSafe.emailVerifiedAt)
      )
    )
    .limit(1)

  return row ?? null
}

export async function hasVerifiedEmail(db: Database, userId: string): Promise<boolean> {
  const [row] = await db
    .select({ emailVerifiedAt: usersSafe.emailVerifiedAt })
    .from(usersSafe)
    .where(eq(usersSafe.id, userId))
    .limit(1)
  return row?.emailVerifiedAt !== null && row?.emailVerifiedAt !== undefined
}
