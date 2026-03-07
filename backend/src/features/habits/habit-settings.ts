import { eq } from 'drizzle-orm'

import { db } from '../../db'
import {
  type HabitPeriod,
  type HabitReminder,
  type HabitTiming,
  habitPeriods,
  habitReminders,
  habitSchedules,
  habitTimings,
} from '../../db/schema/habits'
import { type Database, HabitError } from './habit-error'

// ─── FREQUENCY ───────────────────────────────────────────

export async function updateHabitFrequency(
  habitId: string,
  input: {
    type: 'daily' | 'weekly' | 'monthly' | 'every_n_days'
    intervalDays?: number
    daysOfWeek?: number[]
    daysOfMonth?: number[]
  },
  database: Database = db
) {
  const [frequency] = await database
    .insert(habitSchedules)
    .values({
      habitId,
      frequency: input.type,
      intervalDays: input.type === 'every_n_days' ? input.intervalDays : null,
      daysOfWeek: input.type === 'weekly' ? input.daysOfWeek : null,
      daysOfMonth: input.type === 'monthly' ? input.daysOfMonth : null,
    })
    .onConflictDoUpdate({
      target: habitSchedules.habitId,
      set: {
        frequency: input.type,
        intervalDays: input.type === 'every_n_days' ? input.intervalDays : null,
        daysOfWeek: input.type === 'weekly' ? input.daysOfWeek : null,
        daysOfMonth: input.type === 'monthly' ? input.daysOfMonth : null,
        updatedAt: new Date(),
      },
    })
    .returning()

  if (!frequency) {
    throw new HabitError('frequency_update_failed')
  }

  // Map to shared format
  return {
    habitId: frequency.habitId,
    type: frequency.frequency,
    intervalDays: frequency.intervalDays,
    daysOfWeek: frequency.daysOfWeek ?? null,
    daysOfMonth: frequency.daysOfMonth ?? null,
    createdAt: frequency.createdAt,
    updatedAt: frequency.updatedAt,
  }
}

// ─── TIMINGS ─────────────────────────────────────────────

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

export async function setHabitReminders(
  habitId: string,
  reminders: { beforeMinutes: number }[],
  database: Database = db
): Promise<HabitReminder[]> {
  // Find the schedule → timings for this habit
  const schedule = await database.query.habitSchedules.findFirst({
    where: eq(habitSchedules.habitId, habitId),
  })

  if (!schedule) {
    throw new HabitError('habit_not_found')
  }

  // Get all timings for this schedule
  const timings = await database.query.habitTimings.findMany({
    where: eq(habitTimings.scheduleId, schedule.id),
  })

  if (timings.length === 0 && reminders.length > 0) {
    throw new HabitError('timing_not_found')
  }

  return database.transaction(async (tx) => {
    // Delete all existing reminders for all timings of this habit
    for (const timing of timings) {
      await tx.delete(habitReminders).where(eq(habitReminders.timingId, timing.id))
    }

    if (reminders.length === 0 || timings.length === 0) return []

    // Associate each reminder with the first timing (simple approach)
    const firstTimingId = timings[0]!.id
    return tx
      .insert(habitReminders)
      .values(
        reminders.map((r) => ({
          timingId: firstTimingId,
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
    startDate: string
    endDate: string
    activeMonths?: number[]
  },
  database: Database = db
): Promise<HabitPeriod> {
  if (period.startDate > period.endDate) {
    throw new HabitError('invalid_date_range')
  }

  const [result] = await database
    .insert(habitPeriods)
    .values({
      habitId,
      startDate: period.startDate,
      endDate: period.endDate,
      activeMonths: period.activeMonths ?? null,
    })
    .onConflictDoUpdate({
      target: habitPeriods.habitId,
      set: {
        startDate: period.startDate,
        endDate: period.endDate,
        activeMonths: period.activeMonths ?? null,
        updatedAt: new Date(),
      },
    })
    .returning()

  if (!result) {
    throw new HabitError('period_update_failed')
  }

  return result
}
