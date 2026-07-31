import { preferenceStanceValues } from '@aurore/shared'

import { sql } from 'drizzle-orm'
import { pgEnum, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

import { tenantPolicies } from '../_policies'
import { timestamps } from '../_timestamps'
import { users } from '../auth/users'

export const preferenceStanceEnum = pgEnum('preference_stance', preferenceStanceValues)

export const userIngredientPreferences = pgTable(
  'user_ingredient_preferences',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // Substance identity, deliberately not a FK: canonical_key is nullable and
    // not unique on ingredients (docs/conventions/ingredient-identity.md).
    canonicalKey: text('canonical_key').notNull(),
    stance: preferenceStanceEnum('stance').notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('user_ingredient_pref_idx').on(t.userId, t.canonicalKey),
    ...tenantPolicies('user_ingredient_preferences', t.userId),
  ]
).enableRLS()

export type UserIngredientPreference = typeof userIngredientPreferences.$inferSelect
export type UserIngredientPreferenceInsert = typeof userIngredientPreferences.$inferInsert
