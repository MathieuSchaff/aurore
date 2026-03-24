import { afterAll, beforeAll, describe, expect, it } from 'bun:test'

import { and, eq } from 'drizzle-orm'

import { db } from '../../../db'
import { habitChecks, habits } from '../../../db/schema/habits'
import { users } from '../../../db/schema/users'
import { getHabitStreak } from '../../../features/habits/habit-stats'
import { getDate } from '../../../utils/dates'

describe('habit-stats (Date Logic)', () => {
  let testUser: any
  let testHabit: any

  beforeAll(async () => {
    // Creer un utilisateur et une habitude de test
    const [user] = await db
      .insert(users)
      .values({
        email: `test-stats-${Date.now()}@example.com`,
        passwordHash: 'hash',
      })
      .returning()
    testUser = user

    const [habit] = await db
      .insert(habits)
      .values({
        userId: user.id,
        name: 'Stats Habit',
        category: 'Test',
      })
      .returning()
    testHabit = habit
  })

  afterAll(async () => {
    await db.delete(habitChecks).where(eq(habitChecks.habitId, testHabit.id))
    await db.delete(habits).where(eq(habits.id, testHabit.id))
    await db.delete(users).where(eq(users.id, testUser.id))
  })

  it('should return 0 streak for a new habit', async () => {
    const streak = await getHabitStreak(testHabit.id)
    expect(streak).toBe(0)
  })

  it('should return 1 streak if completed today', async () => {
    await db.insert(habitChecks).values({
      habitId: testHabit.id,
      userId: testUser.id,
      scheduledDate: getDate(0), // aujourd'hui
      status: 'done',
    })

    const streak = await getHabitStreak(testHabit.id)
    expect(streak).toBe(1)

    // Nettoyage
    await db.delete(habitChecks).where(eq(habitChecks.habitId, testHabit.id))
  })

  it('should return 1 streak if completed only yesterday', async () => {
    await db.insert(habitChecks).values({
      habitId: testHabit.id,
      userId: testUser.id,
      scheduledDate: getDate(1), // hier
      status: 'done',
    })

    const streak = await getHabitStreak(testHabit.id)
    expect(streak).toBe(1)

    await db.delete(habitChecks).where(eq(habitChecks.habitId, testHabit.id))
  })

  it('should calculate a continuous streak (Today + Yesterday + 2 days ago)', async () => {
    await db.insert(habitChecks).values([
      { habitId: testHabit.id, userId: testUser.id, scheduledDate: getDate(0), status: 'done' },
      { habitId: testHabit.id, userId: testUser.id, scheduledDate: getDate(1), status: 'done' },
      { habitId: testHabit.id, userId: testUser.id, scheduledDate: getDate(2), status: 'done' },
    ])

    const streak = await getHabitStreak(testHabit.id)
    expect(streak).toBe(3)

    await db.delete(habitChecks).where(eq(habitChecks.habitId, testHabit.id))
  })

  it('should break the streak if a day is missed', async () => {
    // Aujourd'hui fait, mais Hier manqué, Avant-hier fait
    await db.insert(habitChecks).values([
      { habitId: testHabit.id, userId: testUser.id, scheduledDate: getDate(0), status: 'done' },
      { habitId: testHabit.id, userId: testUser.id, scheduledDate: getDate(2), status: 'done' },
    ])

    const streak = await getHabitStreak(testHabit.id)
    // Le streak devrait s'arreter a 1 (car hier est manqué)
    expect(streak).toBe(1)

    await db.delete(habitChecks).where(eq(habitChecks.habitId, testHabit.id))
  })

  it('should return 0 streak if last completion was 2 days ago', async () => {
    await db.insert(habitChecks).values({
      habitId: testHabit.id,
      userId: testUser.id,
      scheduledDate: getDate(2), // Avant-hier
      status: 'done',
    })

    const streak = await getHabitStreak(testHabit.id)
    expect(streak).toBe(0)

    await db.delete(habitChecks).where(eq(habitChecks.habitId, testHabit.id))
  })
})
