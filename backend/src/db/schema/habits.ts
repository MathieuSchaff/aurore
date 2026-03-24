import { sql } from 'drizzle-orm'
import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { products } from './products'
import { users } from './users'

// ─── Enums ───────────────────────────────────────────────

export const habitFrequencyEnum = pgEnum('habit_frequency', [
  'daily',
  'weekly',
  'monthly',
  'every_n_days',
])

export const habitCheckStatusEnum = pgEnum('habit_check_status', ['pending', 'done', 'skipped'])

// ─── Habits ──────────────────────────────────────────────

export const habits = pgTable(
  'habits',
  {
    // id: uuid('id').defaultRandom().primaryKey(),
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
  ]
)

// ─── Habit ↔ Products (many-to-many) ────────────────────

export const habitProducts = pgTable(
  'habit_products',
  {
    // id: uuid('id').defaultRandom().primaryKey(),
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
  ]
)

// ─── Schedule (1:1 avec habit) ───────────────────────────

export const habitSchedules = pgTable(
  'habit_schedules',
  {
    // id: uuid('id').defaultRandom().primaryKey(),
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
  ]
)

// ─── Timings (N par schedule) ────────────────────────────
// Chaque timing = un créneau horaire pour un jour donné
// Ex: mercredi 8h + mercredi 20h = 2 timings avec day=2

export const habitTimings = pgTable(
  'habit_timings',
  {
    // id: uuid('id').defaultRandom().primaryKey(),
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    scheduleId: uuid('schedule_id')
      .notNull()
      .references(() => habitSchedules.id, { onDelete: 'cascade' }),

    // Jour concerné :
    // - weekly → 0-6 (lun-dim)
    // - monthly → 1-31
    // - daily/every_n_days → null (juste l'heure)
    day: integer('day'),

    time: text('time').notNull(), // "08:00"
    label: text('label'), // "matin", "aprem", "soir"

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('habit_timings_schedule_idx').on(t.scheduleId)]
)

// ─── Reminders ───────────────────────────────────────────

export const habitReminders = pgTable(
  'habit_reminders',
  {
    // id: uuid('id').defaultRandom().primaryKey(),
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    timingId: uuid('timing_id')
      .notNull()
      .references(() => habitTimings.id, { onDelete: 'cascade' }),
    beforeMinutes: integer('before_minutes').notNull(), // 60, 120, 1440
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('habit_reminders_timing_idx').on(t.timingId)]
)

// ─── Periods (saisonnalité / plages actives) ────────────

export const habitPeriods = pgTable(
  'habit_periods',
  {
    // id: uuid('id').defaultRandom().primaryKey(),
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
  ]
)

// ─── Checks (logs de complétion) ────────────────────────

export const habitChecks = pgTable(
  'habit_checks',
  {
    // id: uuid('id').defaultRandom().primaryKey(),
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
  ]
)

// ─── Types ───────────────────────────────────────────────

export type Habit = typeof habits.$inferSelect
export type HabitProduct = typeof habitProducts.$inferSelect
export type HabitSchedule = typeof habitSchedules.$inferSelect
export type HabitTiming = typeof habitTimings.$inferSelect
export type HabitReminder = typeof habitReminders.$inferSelect
export type HabitPeriod = typeof habitPeriods.$inferSelect
export type HabitCheck = typeof habitChecks.$inferSelect
