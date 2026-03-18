import { sql } from 'drizzle-orm'
import { boolean, numeric, pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

import { ingredients } from './ingredients'
import { users } from './users'

export const userIngredientAnalysisScore = pgTable(
  'user_ingredient_analysis_score',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ingredientId: uuid('ingredient_id')
      .notNull()
      .references(() => ingredients.id, { onDelete: 'cascade' }),
    suspicionScore: numeric('suspicion_score').default('0'),
    favoriteScore: numeric('favorite_score').default('0'),
    isSuspect: boolean('is_suspect').default(false),
    isFavorite: boolean('is_favorite').default(false),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (t) => [uniqueIndex('user_ing_intel_idx').on(t.userId, t.ingredientId)]
)
