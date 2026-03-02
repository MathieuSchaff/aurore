import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { habitChecks, habitProducts } from './habits'
import { products } from './products'
import { users } from './users'

// ─── Enums ──────────────────────────────────────────────

export const wellbeingMetricEnum = pgEnum('wellbeing_metric', [
  'energy',
  'sleep',
  'fog',
  'stress',
  'mood',
  'skin',
  'pain',
])

// ─── Habit Check Products ───────────────────────────────

export const habitCheckProducts = pgTable(
  'habit_check_products',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    checkId: uuid('check_id')
      .notNull()
      .references(() => habitChecks.id, { onDelete: 'cascade' }),
    habitProductId: uuid('habit_product_id')
      .notNull()
      .references(() => habitProducts.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    used: boolean('used').notNull().default(true),
    actualDosage: text('actual_dosage'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('habit_check_products_unique').on(t.checkId, t.habitProductId),
    index('habit_check_products_check_idx').on(t.checkId),
    index('habit_check_products_product_idx').on(t.productId),
  ]
)

// ─── Wellbeing Logs ─────────────────────────────────────

export const wellbeingLogs = pgTable(
  'wellbeing_logs',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    metric: wellbeingMetricEnum('metric').notNull(),
    value: numeric('value', { precision: 5, scale: 2 }).notNull(),
    unit: text('unit'),
    note: text('note'),
    loggedAt: timestamp('logged_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('wellbeing_logs_user_metric_logged_idx').on(t.userId, t.metric, t.loggedAt),
    index('wellbeing_logs_user_logged_idx').on(t.userId, t.loggedAt),
  ]
)

// ─── Types ──────────────────────────────────────────────

export type HabitCheckProduct = typeof habitCheckProducts.$inferSelect
export type HabitCheckProductInsert = typeof habitCheckProducts.$inferInsert
export type WellbeingLog = typeof wellbeingLogs.$inferSelect
export type WellbeingLogInsert = typeof wellbeingLogs.$inferInsert
