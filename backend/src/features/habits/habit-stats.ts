import { differenceInDays, startOfDay } from 'date-fns'
import { and, between, desc, eq, sql } from 'drizzle-orm'

import { db } from '../../db'
import { habitChecks } from '../../db/schema/habits'
import type { Database } from '../../db'

export async function countHabitChecks(
  habitId: string,
  startDate: string,
  endDate: string,
  database: Database = db
): Promise<number> {
  const result = await database
    .select({ count: sql<number>`count(*)::int` })
    .from(habitChecks)
    .where(
      and(
        eq(habitChecks.habitId, habitId),
        between(habitChecks.scheduledDate, startDate, endDate)
      )
    )

  return result[0]?.count ?? 0
}

export async function getHabitStreak(habitId: string, database: Database = db): Promise<number> {
  const checks = await database
    .select({ date: habitChecks.scheduledDate })
    .from(habitChecks)
    .where(and(eq(habitChecks.habitId, habitId), eq(habitChecks.status, 'done')))
    .orderBy(desc(habitChecks.scheduledDate))

  if (checks.length === 0) {
    return 0
  }

  let streak = 0
  let expectedDate = startOfDay(new Date())

  for (const check of checks) {
    const checkDate = startOfDay(new Date(check.date))
    const diff = differenceInDays(expectedDate, checkDate)

    if (diff === 0 || diff === 1) {
      streak++
      expectedDate = checkDate
    } else {
      break
    }
  }

  return streak
}

export async function getHabitStats(
  habitId: string,
  startDate: string,
  endDate: string,
  database: Database = db
) {
  const [totalChecks, currentStreak] = await Promise.all([
    countHabitChecks(habitId, startDate, endDate, database),
    getHabitStreak(habitId, database),
  ])

  const start = new Date(startDate)
  const end = new Date(endDate)
  const totalDays = differenceInDays(end, start) + 1

  const completionRate = totalDays > 0 ? (totalChecks / totalDays) * 100 : 0

  return {
    totalChecks,
    currentStreak,
    completionRate: Math.round(completionRate * 10) / 10,
  }
}
