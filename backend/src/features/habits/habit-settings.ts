import { and, eq } from 'drizzle-orm'

import type { Database } from '../../db'
import { db } from '../../db'
import {
  type HabitPeriod,
  type HabitReminder,
  type HabitTiming,
  habitPeriods,
  habitProducts,
  habitReminders,
  habitSchedules,
  habits,
  habitTimings,
} from '../../db/schema/habits'
import { HabitError } from './habit-error'

// ─── FREQUENCY ───────────────────────────────────────────

// 'interval' is an alias for 'every_n_days' kept for backward compat with older tests
type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'every_n_days' | 'interval'

// Day names ↔ integers (0=monday … 6=sunday, matches schema comment)
const DAY_TO_INT: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
}
const INT_TO_DAY: Record<number, string> = {
  0: 'monday',
  1: 'tuesday',
  2: 'wednesday',
  3: 'thursday',
  4: 'friday',
  5: 'saturday',
  6: 'sunday',
}

function normalizeDaysOfWeek(days: (string | number)[]): number[] {
  return days.map((d) => (typeof d === 'string' ? (DAY_TO_INT[d] ?? Number(d)) : d))
}

function formatDaysOfWeek(days: Int32Array | number[] | null | undefined): string[] | null {
  if (!days) return null
  return Array.from(days).map((d) => INT_TO_DAY[d] ?? String(d))
}

export async function updateHabitFrequency(
  habitId: string,
  input: {
    type: FrequencyType
    intervalDays?: number
    daysOfWeek?: (string | number)[]
    daysOfMonth?: number[]
  },
  database: Database = db
) {
  const dbType = input.type === 'interval' ? 'every_n_days' : input.type
  const isEveryNDays = input.type === 'every_n_days' || input.type === 'interval'
  const daysOfWeek =
    input.type === 'weekly' && input.daysOfWeek ? normalizeDaysOfWeek(input.daysOfWeek) : null

  const [frequency] = await database
    .insert(habitSchedules)
    .values({
      habitId,
      frequency: dbType,
      intervalDays: isEveryNDays ? input.intervalDays : null,
      daysOfWeek,
      daysOfMonth: input.type === 'monthly' ? input.daysOfMonth : null,
    })
    .onConflictDoUpdate({
      target: habitSchedules.habitId,
      set: {
        frequency: dbType,
        intervalDays: isEveryNDays ? input.intervalDays : null,
        daysOfWeek,
        daysOfMonth: input.type === 'monthly' ? input.daysOfMonth : null,
        updatedAt: new Date(),
      },
    })
    .returning()

  if (!frequency) {
    throw new HabitError('frequency_update_failed')
  }

  return {
    habitId: frequency.habitId,
    // Return 'interval' if that was the input type, otherwise use the stored value
    type: input.type === 'interval' ? 'interval' : frequency.frequency,
    intervalDays: frequency.intervalDays,
    // Int32Array → string names (Bun returns integer[] columns as Int32Array)
    daysOfWeek: formatDaysOfWeek(frequency.daysOfWeek as Int32Array | null),
    // Int32Array → plain array
    daysOfMonth: frequency.daysOfMonth ? Array.from(frequency.daysOfMonth) : null,
    createdAt: frequency.createdAt,
    updatedAt: frequency.updatedAt,
  }
}

// ─── TIMINGS ─────────────────────────────────────────────

export async function addHabitTiming(
  habitId: string,
  time: string,
  label: string | undefined,
  database: Database = db
): Promise<HabitTiming & { habitId: string }> {
  const schedule = await database.query.habitSchedules.findFirst({
    where: eq(habitSchedules.habitId, habitId),
  })

  if (!schedule) {
    throw new HabitError('habit_not_found')
  }

  const [timing] = await database
    .insert(habitTimings)
    .values({ scheduleId: schedule.id, time, label: label ?? null })
    .returning()

  if (!timing) {
    throw new HabitError('habit_not_found')
  }

  return { ...timing, habitId }
}

export async function deleteHabitTiming(timingId: string, database: Database = db): Promise<void> {
  const timing = await database.query.habitTimings.findFirst({
    where: eq(habitTimings.id, timingId),
  })

  if (!timing) {
    throw new HabitError('timing_not_found')
  }

  await database.delete(habitTimings).where(eq(habitTimings.id, timingId))
}

export async function setHabitTimings(
  habitId: string,
  timings: { time: string; day?: number; label?: string }[],
  database: Database = db
): Promise<HabitTiming[]> {
  // Find the schedule for this habit
  const schedule = await database.query.habitSchedules.findFirst({
    where: eq(habitSchedules.habitId, habitId),
  })

  if (!schedule) {
    throw new HabitError('habit_not_found')
  }

  return database.transaction(async (tx) => {
    await tx.delete(habitTimings).where(eq(habitTimings.scheduleId, schedule.id))

    if (timings.length === 0) return []

    return tx
      .insert(habitTimings)
      .values(
        timings.map((t) => ({
          scheduleId: schedule.id,
          day: t.day ?? null,
          time: t.time,
          label: t.label ?? null,
        }))
      )
      .returning()
  })
}

// ─── REMINDERS ───────────────────────────────────────────

export async function addHabitReminder(
  habitId: string,
  beforeMinutes: number,
  database: Database = db
): Promise<HabitReminder & { habitId: string }> {
  const schedule = await database.query.habitSchedules.findFirst({
    where: eq(habitSchedules.habitId, habitId),
  })

  if (!schedule) {
    throw new HabitError('habit_not_found')
  }

  // Reminders must be attached to a timing — create a default one if none exists
  let timing = await database.query.habitTimings.findFirst({
    where: eq(habitTimings.scheduleId, schedule.id),
  })

  if (!timing) {
    const [created] = await database
      .insert(habitTimings)
      .values({ scheduleId: schedule.id, time: '00:00', label: null })
      .returning()
    timing = created
  }

  if (!timing) {
    throw new HabitError('habit_not_found')
  }

  const [reminder] = await database
    .insert(habitReminders)
    .values({ timingId: timing.id, beforeMinutes })
    .returning()

  if (!reminder) {
    throw new HabitError('habit_not_found')
  }

  return { ...reminder, habitId }
}

export async function deleteHabitReminder(
  reminderId: string,
  database: Database = db
): Promise<void> {
  const reminder = await database.query.habitReminders.findFirst({
    where: eq(habitReminders.id, reminderId),
  })

  if (!reminder) {
    throw new HabitError('reminder_not_found')
  }

  await database.delete(habitReminders).where(eq(habitReminders.id, reminderId))
}

export async function setHabitReminders(
  habitId: string,
  reminders: { timingId?: string; beforeMinutes: number }[],
  database: Database = db
): Promise<HabitReminder[]> {
  const schedule = await database.query.habitSchedules.findFirst({
    where: eq(habitSchedules.habitId, habitId),
  })

  if (!schedule) {
    throw new HabitError('habit_not_found')
  }

  const timings = await database.query.habitTimings.findMany({
    where: eq(habitTimings.scheduleId, schedule.id),
  })

  // Reminders without a timingId attach to the first available timing
  const needsDefaultTiming = reminders.some((r) => !r.timingId)
  if (needsDefaultTiming && timings.length === 0 && reminders.length > 0) {
    throw new HabitError('timing_not_found')
  }

  const defaultTimingId = timings[0]?.id

  // Validate explicit timingIds belong to this habit
  const validTimingIds = new Set(timings.map((t) => t.id))
  for (const r of reminders) {
    if (r.timingId && !validTimingIds.has(r.timingId)) {
      throw new HabitError('timing_not_found')
    }
  }

  return database.transaction(async (tx) => {
    for (const timing of timings) {
      await tx.delete(habitReminders).where(eq(habitReminders.timingId, timing.id))
    }

    if (reminders.length === 0) return []

    return tx
      .insert(habitReminders)
      .values(
        reminders.map((r) => ({
          timingId: r.timingId ?? defaultTimingId!,
          beforeMinutes: r.beforeMinutes,
        }))
      )
      .returning()
  })
}

// ─── PERIODS ─────────────────────────────────────────────

export async function setHabitPeriod(
  habitId: string,
  period: {
    startDate?: string
    endDate?: string
    activeMonths?: number[]
  },
  database: Database = db
): Promise<HabitPeriod & { activeMonths: number[] | null }> {
  const startDate = period.startDate ?? '0001-01-01'
  const endDate = period.endDate ?? '9999-12-31'

  if (period.startDate && period.endDate && startDate > endDate) {
    throw new HabitError('invalid_date_range')
  }

  const [result] = await database
    .insert(habitPeriods)
    .values({
      habitId,
      startDate,
      endDate,
      activeMonths: period.activeMonths ?? null,
    })
    .onConflictDoUpdate({
      target: habitPeriods.habitId,
      set: {
        startDate,
        endDate,
        activeMonths: period.activeMonths ?? null,
        updatedAt: new Date(),
      },
    })
    .returning()

  if (!result) {
    throw new HabitError('period_update_failed')
  }

  // Int32Array → plain array (Bun returns integer[] columns as Int32Array)
  return {
    ...result,
    activeMonths: result.activeMonths ? Array.from(result.activeMonths) : null,
  }
}

export async function deleteHabitPeriod(habitId: string, database: Database = db): Promise<void> {
  const period = await database.query.habitPeriods.findFirst({
    where: eq(habitPeriods.habitId, habitId),
  })

  if (!period) {
    throw new HabitError('habit_not_found')
  }

  await database.delete(habitPeriods).where(eq(habitPeriods.habitId, habitId))
}

// ─── PRODUCTS ───────────────────────────────────────────

export async function setHabitProducts(
  habitId: string,
  userId: string,
  productsInput: { productId: string; dosage?: string; order?: number }[],
  database: Database = db
) {
  // Verify ownership
  const habit = await database.query.habits.findFirst({
    where: and(eq(habits.id, habitId), eq(habits.userId, userId)),
  })

  if (!habit) {
    throw new HabitError('habit_not_found')
  }

  return database.transaction(async (tx) => {
    await tx.delete(habitProducts).where(eq(habitProducts.habitId, habitId))

    if (productsInput.length === 0) return []

    return tx
      .insert(habitProducts)
      .values(
        productsInput.map((p) => ({
          habitId,
          productId: p.productId,
          dosage: p.dosage ?? null,
          order: p.order ?? 0,
        }))
      )
      .returning()
  })
}
