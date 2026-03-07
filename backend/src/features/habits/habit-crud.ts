import type { CreateHabitInput, HabitWithRelations, UpdateHabitInput } from '@habit-tracker/shared'

import { and, asc, eq, isNull } from 'drizzle-orm'

import { db } from '../../db'
import type { Database } from '../../db/index'
import {
  type Habit,
  habitPeriods,
  habitProducts,
  habitReminders,
  habitSchedules,
  habits,
  habitTimings,
} from '../../db/schema/habits'
import { HabitError } from './habit-error'

// ─── Helpers internes ────────────────────────────────────────────────────────

/**
 * Charge les relations d'une habitude à partir de son ID.
 * Passe par `habitSchedules` (1:1) puis `habitTimings` et `habitReminders`
 * qui sont liés au `scheduleId`, pas directement au `habitId`.
 */
async function loadHabitRelations(
  habitId: string,
  database: Database
): Promise<Omit<HabitWithRelations, keyof Habit>> {
  // Schedule est 1:1 avec habit — on le récupère d'abord
  const schedule = await database.query.habitSchedules.findFirst({
    where: eq(habitSchedules.habitId, habitId),
  })

  const scheduleId = schedule?.id

  // Timings et reminders sont liés au schedule, pas à l'habit directement
  const [timings, period, products] = await Promise.all([
    scheduleId
      ? database.query.habitTimings.findMany({
          where: eq(habitTimings.scheduleId, scheduleId),
          orderBy: asc(habitTimings.time),
        })
      : Promise.resolve([]),
    database.query.habitPeriods.findFirst({
      where: eq(habitPeriods.habitId, habitId),
    }),
    database.query.habitProducts.findMany({
      where: eq(habitProducts.habitId, habitId),
      orderBy: asc(habitProducts.order),
    }),
  ])

  // Reminders : liés aux timings (timing_id) en Database, mais shared attend habitId.
  // On récupère tous les reminders de tous les timings de cette habitude et on remap.
  let mappedReminders: HabitWithRelations['reminders'] = []
  if (timings.length > 0) {
    const timingIds = timings.map((t) => t.id)
    const dbReminders = await database.query.habitReminders.findMany({
      where: (r, { inArray }) => inArray(r.timingId, timingIds),
    })
    mappedReminders = dbReminders.map((r) => ({
      id: r.id,
      habitId,
      beforeMinutes: r.beforeMinutes,
      createdAt: r.createdAt,
    }))
  }

  // Mapper le schedule Database → format shared `HabitFrequency`
  // Database stocke daysOfWeek en number[], shared attend string[]
  const frequency = schedule
    ? {
        habitId: schedule.habitId,
        type: schedule.frequency,
        intervalDays: schedule.intervalDays,
        daysOfWeek: schedule.daysOfWeek ?? null,
        daysOfMonth: schedule.daysOfMonth,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
      }
    : null

  // Mapper les timings Database (scheduleId) → format shared (habitId)
  const mappedTimings = timings.map((t) => ({
    id: t.id,
    habitId,
    day: t.day,
    time: t.time,
    label: t.label,
    createdAt: t.createdAt,
  }))

  return {
    frequency,
    timings: mappedTimings,
    reminders: mappedReminders,
    period: period ?? null,
    products,
  }
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function createHabit(
  input: CreateHabitInput,
  userId: string,
  database: Database = db
): Promise<Habit> {
  const habit = await database.transaction(async (tx) => {
    // 1. Habit
    const [habit] = await tx
      .insert(habits)
      .values({
        userId,
        name: input.name,
        category: input.category,
      })
      .returning()

    if (!habit) {
      throw new HabitError('habit_creation_failed')
    }

    // 2. Schedule (frequency)
    let scheduleId: string | undefined
    if (input.frequency) {
      const [schedule] = await tx
        .insert(habitSchedules)
        .values({
          habitId: habit.id,
          frequency: input.frequency.type,
          daysOfWeek: input.frequency.type === 'weekly' ? input.frequency.daysOfWeek : null,
          daysOfMonth: input.frequency.type === 'monthly' ? input.frequency.daysOfMonth : null,
          intervalDays:
            input.frequency.type === 'every_n_days' ? input.frequency.intervalDays : null,
        })
        .returning({ id: habitSchedules.id })

      scheduleId = schedule?.id
    }

    // 3. Timings (liés au schedule)
    let createdTimingIds: string[] = []
    if (input.timings?.length && scheduleId) {
      const created = await tx
        .insert(habitTimings)
        .values(
          input.timings.map((t) => ({
            scheduleId,
            day: t.day ?? null,
            time: t.time,
            label: t.label ?? null,
          }))
        )
        .returning({ id: habitTimings.id })

      createdTimingIds = created.map((t) => t.id)
    }

    // 4. Reminders (produit cartésien : chaque reminder × chaque timing)
    if (input.reminders?.length && createdTimingIds.length > 0) {
      await tx.insert(habitReminders).values(
        createdTimingIds.flatMap((timingId) =>
          input.reminders!.map((r) => ({
            timingId,
            beforeMinutes: r.beforeMinutes,
          }))
        )
      )
    }

    // 5. Period
    if (input.period) {
      await tx.insert(habitPeriods).values({
        habitId: habit.id,
        startDate: input.period.startDate,
        endDate: input.period.endDate,
        activeMonths: input.period.activeMonths ?? null,
      })
    }

    // 6. Products
    if (input.products?.length) {
      await tx.insert(habitProducts).values(
        input.products.map((p) => ({
          habitId: habit.id,
          productId: p.productId,
          dosage: p.dosage ?? null,
          order: p.order,
        }))
      )
    }

    return habit
  })

  return habit
}

export async function getHabitById(
  habitId: string,
  database: Database = db
): Promise<HabitWithRelations> {
  const habit = await database.query.habits.findFirst({
    where: eq(habits.id, habitId),
  })

  if (!habit) {
    throw new HabitError('habit_not_found')
  }

  const relations = await loadHabitRelations(habitId, database)

  return { ...habit, ...relations }
}

export async function getUserHabits(userId: string, database: Database = db): Promise<Habit[]> {
  return database
    .select()
    .from(habits)
    .where(and(eq(habits.userId, userId), isNull(habits.archivedAt)))
    .orderBy(asc(habits.position), asc(habits.createdAt))
}

export async function getUserHabitsWithRelations(
  userId: string,
  database: Database = db
): Promise<HabitWithRelations[]> {
  const userHabits = await getUserHabits(userId, database)

  return Promise.all(
    userHabits.map(async (h) => {
      const relations = await loadHabitRelations(h.id, database)
      return { ...h, ...relations }
    })
  )
}

export async function updateHabit(
  habitId: string,
  userId: string,
  input: UpdateHabitInput,
  database: Database = db
): Promise<Habit> {
  // Vérifier que l'habitude appartient bien à l'utilisateur
  const existing = await database.query.habits.findFirst({
    where: and(eq(habits.id, habitId), eq(habits.userId, userId)),
  })

  if (!existing) {
    throw new HabitError('habit_not_found')
  }

  const [updated] = await database
    .update(habits)
    .set({
      ...(input.name !== undefined && { name: input.name }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.position !== undefined && { position: input.position }),
    })
    .where(eq(habits.id, habitId))
    .returning()

  if (!updated) {
    throw new HabitError('habit_update_failed')
  }

  return updated
}

export async function archiveHabit(
  habitId: string,
  userId: string,
  database: Database = db
): Promise<Habit> {
  const [archived] = await database
    .update(habits)
    .set({ archivedAt: new Date() })
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId), isNull(habits.archivedAt)))
    .returning()

  if (!archived) {
    throw new HabitError('habit_not_found')
  }

  return archived
}

export async function restoreHabit(
  habitId: string,
  userId: string,
  database: Database = db
): Promise<Habit> {
  const [restored] = await database
    .update(habits)
    .set({ archivedAt: null })
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
    .returning()

  if (!restored) {
    throw new HabitError('habit_not_found')
  }

  return restored
}

export async function deleteHabit(
  habitId: string,
  userId: string,
  database: Database = db
): Promise<void> {
  // CASCADE supprime schedules → timings → reminders, periods, products, checks
  const result = await database
    .delete(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))

  if ((result.rowCount ?? 0) === 0) {
    throw new HabitError('habit_not_found')
  }
}
