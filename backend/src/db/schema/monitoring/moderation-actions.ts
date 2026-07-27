import type { BanScope } from '@aurore/shared'

import { sql } from 'drizzle-orm'
import { index, jsonb, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'

import { users } from '../auth/users'

// Only the moderation acts that leave nothing behind. Ban creation, content moderation,
// report review, suggested-edit review and role-request review all record their actor on
// the domain row itself, and duplicating them here would contradict audit-logs.mdx.
export const moderationActionValues = ['ban_lifted', 'ban_updated', 'role_changed'] as const

export type ModerationActionName = (typeof moderationActionValues)[number]

export type ModerationActionDetailsByAction = {
  ban_lifted: {
    scope: BanScope
    bannedBy: string
    reason: string | null
  }
  ban_updated: {
    scope: BanScope
    expiresAtChanged: boolean
    expiresAt: string | null
    reasonChanged: boolean
  }
  role_changed: {
    role: 'user'
    reason: string | null
  }
}

export type ModerationActionDetails = ModerationActionDetailsByAction[ModerationActionName]

export const moderationActionEnum = pgEnum('moderation_action', moderationActionValues)

// Append-only. Nothing updates or deletes a row here.
export const moderationActions = pgTable(
  'moderation_actions',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    // Nullable on purpose: the trail has to outlive the accounts it describes, so a
    // deleted admin nulls the reference instead of cascading the row away.
    actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
    targetUserId: uuid('target_user_id').references(() => users.id, { onDelete: 'set null' }),
    action: moderationActionEnum('action').notNull(),
    // Action-specific payload, kept structured so operators can query it reliably.
    details: jsonb('details').notNull().$type<ModerationActionDetails>(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('moderation_actions_created_idx').on(t.createdAt),
    index('moderation_actions_target_idx').on(t.targetUserId),
  ]
)

export type ModerationAction = typeof moderationActions.$inferSelect
export type ModerationActionInsert = typeof moderationActions.$inferInsert
