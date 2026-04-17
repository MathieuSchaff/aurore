import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  numeric,
  pgEnum,
  pgPolicy,
  pgRole,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { users } from '../auth/users'
import { products } from '../products/products'
import { habitChecks, habitProducts } from './habits'

export const wellbeingMetricEnum = pgEnum('wellbeing_metric', [
  'energy',
  'sleep',
  'fog',
  'stress',
  'mood',
  'skin',
  'pain',
])

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
    // Explicit user_id check keeps policy correct for owner role (bypasses RLS until FORCE RLS in T7).
    pgPolicy('habit_check_products_tenant_isolation', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`EXISTS (
        SELECT 1 FROM ${habitChecks} p
        WHERE p.id = ${t.checkId}
          AND p.user_id = (SELECT current_setting('app.user_id', true)::uuid)
      )`,
      withCheck: sql`EXISTS (
        SELECT 1 FROM ${habitChecks} p
        WHERE p.id = ${t.checkId}
          AND p.user_id = (SELECT current_setting('app.user_id', true)::uuid)
      )`,
    }),
    pgPolicy('habit_check_products_admin_bypass', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
      withCheck: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
    }),
  ]
).enableRLS()

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
    pgPolicy('wellbeing_logs_tenant_isolation', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`${t.userId} = (SELECT current_setting('app.user_id', true)::uuid)`,
      withCheck: sql`${t.userId} = (SELECT current_setting('app.user_id', true)::uuid)`,
    }),
    pgPolicy('wellbeing_logs_admin_bypass', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
      withCheck: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
    }),
  ]
).enableRLS()

export type HabitCheckProduct = typeof habitCheckProducts.$inferSelect
export type HabitCheckProductInsert = typeof habitCheckProducts.$inferInsert
export type WellbeingLog = typeof wellbeingLogs.$inferSelect
export type WellbeingLogInsert = typeof wellbeingLogs.$inferInsert
