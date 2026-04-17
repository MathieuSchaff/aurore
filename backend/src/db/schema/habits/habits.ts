import { sql } from 'drizzle-orm'
import {
  date,
  index,
  integer,
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

export const habitFrequencyEnum = pgEnum('habit_frequency', [
  'daily',
  'weekly',
  'monthly',
  'every_n_days',
])

export const habitCheckStatusEnum = pgEnum('habit_check_status', ['pending', 'done', 'skipped'])

export const habits = pgTable(
  'habits',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    category: text('category').notNull(), // libre, fetch DISTINCT pour le select
    position: integer('position').notNull().default(0), // tri dans l'UI
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index('habits_user_idx').on(t.userId),
    index('habits_user_category_idx').on(t.userId, t.category),
    // Subquery form enables initPlan caching — faster on repeated row evaluations.
    pgPolicy('habits_tenant_isolation', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`${t.userId} = (SELECT current_setting('app.user_id', true)::uuid)`,
      withCheck: sql`${t.userId} = (SELECT current_setting('app.user_id', true)::uuid)`,
    }),
    pgPolicy('habits_admin_bypass', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
      withCheck: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
    }),
  ]
).enableRLS()

export const habitProducts = pgTable(
  'habit_products',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    habitId: uuid('habit_id')
      .notNull()
      .references(() => habits.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    dosage: text('dosage'), // "2 gouttes", "1 comprimé", "1 noisette"
    order: integer('order').notNull().default(0), // ordre d'application/prise
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('habit_products_unique').on(t.habitId, t.productId),
    index('habit_products_habit_idx').on(t.habitId),
    // Explicit user_id check keeps policy correct for owner role (bypasses RLS until FORCE RLS in T7).
    pgPolicy('habit_products_tenant_isolation', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`EXISTS (
        SELECT 1 FROM ${habits} p
        WHERE p.id = ${t.habitId}
          AND p.user_id = (SELECT current_setting('app.user_id', true)::uuid)
      )`,
      withCheck: sql`EXISTS (
        SELECT 1 FROM ${habits} p
        WHERE p.id = ${t.habitId}
          AND p.user_id = (SELECT current_setting('app.user_id', true)::uuid)
      )`,
    }),
    pgPolicy('habit_products_admin_bypass', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
      withCheck: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
    }),
  ]
).enableRLS()

export const habitSchedules = pgTable(
  'habit_schedules',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    habitId: uuid('habit_id')
      .notNull()
      .references(() => habits.id, { onDelete: 'cascade' }),
    frequency: habitFrequencyEnum('frequency').notNull(),
    // weekly: [0,2,4] = lun, mer, ven
    daysOfWeek: integer('days_of_week').array(),
    // monthly: [1,14,15]
    daysOfMonth: integer('days_of_month').array(),
    // every_n_days: 3, 7, etc.
    intervalDays: integer('interval_days'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex('habit_schedules_habit_unique').on(t.habitId), // force 1:1
    pgPolicy('habit_schedules_tenant_isolation', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`EXISTS (
        SELECT 1 FROM ${habits} p
        WHERE p.id = ${t.habitId}
          AND p.user_id = (SELECT current_setting('app.user_id', true)::uuid)
      )`,
      withCheck: sql`EXISTS (
        SELECT 1 FROM ${habits} p
        WHERE p.id = ${t.habitId}
          AND p.user_id = (SELECT current_setting('app.user_id', true)::uuid)
      )`,
    }),
    pgPolicy('habit_schedules_admin_bypass', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
      withCheck: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
    }),
  ]
).enableRLS()

// Each timing = a time slot for a given day.
// Ex: wednesday 8am + wednesday 8pm = 2 timings with day=2
export const habitTimings = pgTable(
  'habit_timings',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    scheduleId: uuid('schedule_id')
      .notNull()
      .references(() => habitSchedules.id, { onDelete: 'cascade' }),
    // Day context:
    // - weekly → 0-6 (mon-sun)
    // - monthly → 1-31
    // - daily/every_n_days → null (time only)
    day: integer('day'),
    time: text('time').notNull(), // "08:00"
    label: text('label'), // "matin", "aprem", "soir"
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('habit_timings_schedule_idx').on(t.scheduleId),
    pgPolicy('habit_timings_tenant_isolation', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`EXISTS (
        SELECT 1
        FROM ${habitSchedules} s
        JOIN ${habits} h ON h.id = s.habit_id
        WHERE s.id = ${t.scheduleId}
          AND h.user_id = (SELECT current_setting('app.user_id', true)::uuid)
      )`,
      withCheck: sql`EXISTS (
        SELECT 1
        FROM ${habitSchedules} s
        JOIN ${habits} h ON h.id = s.habit_id
        WHERE s.id = ${t.scheduleId}
          AND h.user_id = (SELECT current_setting('app.user_id', true)::uuid)
      )`,
    }),
    pgPolicy('habit_timings_admin_bypass', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
      withCheck: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
    }),
  ]
).enableRLS()

export const habitReminders = pgTable(
  'habit_reminders',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    timingId: uuid('timing_id')
      .notNull()
      .references(() => habitTimings.id, { onDelete: 'cascade' }),
    beforeMinutes: integer('before_minutes').notNull(), // 60, 120, 1440
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('habit_reminders_timing_idx').on(t.timingId),
    pgPolicy('habit_reminders_tenant_isolation', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`EXISTS (
        SELECT 1
        FROM ${habitTimings} ht
        JOIN ${habitSchedules} hs ON hs.id = ht.schedule_id
        JOIN ${habits} h ON h.id = hs.habit_id
        WHERE ht.id = ${t.timingId}
          AND h.user_id = (SELECT current_setting('app.user_id', true)::uuid)
      )`,
      withCheck: sql`EXISTS (
        SELECT 1
        FROM ${habitTimings} ht
        JOIN ${habitSchedules} hs ON hs.id = ht.schedule_id
        JOIN ${habits} h ON h.id = hs.habit_id
        WHERE ht.id = ${t.timingId}
          AND h.user_id = (SELECT current_setting('app.user_id', true)::uuid)
      )`,
    }),
    pgPolicy('habit_reminders_admin_bypass', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
      withCheck: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
    }),
  ]
).enableRLS()

export const habitPeriods = pgTable(
  'habit_periods',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    habitId: uuid('habit_id')
      .notNull()
      .references(() => habits.id, { onDelete: 'cascade' }),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    activeMonths: integer('active_months').array(), // [6, 7, 8] pour juin-août
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex('habit_periods_habit_unique').on(t.habitId),
    index('habit_periods_habit_idx').on(t.habitId),
    pgPolicy('habit_periods_tenant_isolation', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`EXISTS (
        SELECT 1 FROM ${habits} p
        WHERE p.id = ${t.habitId}
          AND p.user_id = (SELECT current_setting('app.user_id', true)::uuid)
      )`,
      withCheck: sql`EXISTS (
        SELECT 1 FROM ${habits} p
        WHERE p.id = ${t.habitId}
          AND p.user_id = (SELECT current_setting('app.user_id', true)::uuid)
      )`,
    }),
    pgPolicy('habit_periods_admin_bypass', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
      withCheck: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
    }),
  ]
).enableRLS()

export const habitChecks = pgTable(
  'habit_checks',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    habitId: uuid('habit_id')
      .notNull()
      .references(() => habits.id, { onDelete: 'cascade' }),
    scheduledDate: date('scheduled_date').notNull(),
    timingId: uuid('timing_id').references(() => habitTimings.id, {
      onDelete: 'set null',
    }),
    status: habitCheckStatusEnum('status').notNull().default('pending'),
    actualTime: text('actual_time'), // "08:15"
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('habit_checks_unique').on(t.habitId, t.scheduledDate, t.timingId), // anti-doublon
    index('habit_checks_user_date_idx').on(t.userId, t.scheduledDate),
    index('habit_checks_habit_idx').on(t.habitId),
    pgPolicy('habit_checks_tenant_isolation', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`${t.userId} = (SELECT current_setting('app.user_id', true)::uuid)`,
      withCheck: sql`${t.userId} = (SELECT current_setting('app.user_id', true)::uuid)`,
    }),
    pgPolicy('habit_checks_admin_bypass', {
      as: 'permissive',
      for: 'all',
      to: pgRole('app_runtime').existing(),
      using: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
      withCheck: sql`(SELECT current_setting('app.role', true)) = 'admin'`,
    }),
  ]
).enableRLS()

export type Habit = typeof habits.$inferSelect
export type HabitProduct = typeof habitProducts.$inferSelect
export type HabitSchedule = typeof habitSchedules.$inferSelect
export type HabitTiming = typeof habitTimings.$inferSelect
export type HabitReminder = typeof habitReminders.$inferSelect
export type HabitPeriod = typeof habitPeriods.$inferSelect
export type HabitCheck = typeof habitChecks.$inferSelect
