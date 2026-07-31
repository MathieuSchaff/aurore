import { sql } from 'drizzle-orm'
import { pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

import { tenantPolicies } from '../_policies'
import { timestamps } from '../_timestamps'
import { users } from '../auth/users'
import { preferenceStanceEnum } from '../ingredients/user-ingredient-preferences'
import { productTagTypes } from './tags'

export const userTagPreferences = pgTable(
  'user_tag_preferences',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => productTagTypes.id, { onDelete: 'cascade' }),
    stance: preferenceStanceEnum('stance').notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('user_tag_pref_idx').on(t.userId, t.tagId),
    ...tenantPolicies('user_tag_preferences', t.userId),
  ]
).enableRLS()

export type UserTagPreference = typeof userTagPreferences.$inferSelect
export type UserTagPreferenceInsert = typeof userTagPreferences.$inferInsert
