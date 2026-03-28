import { beforeEach, describe, expect, it } from 'bun:test'

import { testDb } from '../../../tests/db.test.config'
import { checkConsecutiveDays, createTestHabit } from '../../../tests/helpers/habit-helpers'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { getTestDate, getToday, getYesterday } from '../../../utils/dates'
import { checkHabit, countHabitChecks, getHabitStats, getHabitStreak } from '../service'

describe('Habit Stats & Streaks', () => {
  let user: any

  beforeEach(async () => {
    user = await createTestUser()
  })

  describe('getHabitStreak', () => {
    it('returns 0 if the habit is brand new', async () => {
      const { id } = await createTestHabit(user.id, { name: 'Sport' })
      const streak = await getHabitStreak(id, testDb)

      expect(streak).toBe(0)
    })

    it('counts 1 when checked only today', async () => {
      const habit = await createTestHabit(user.id, { name: 'Lecture' })

      await checkHabit(
        {
          userId: user.id,
          habitId: habit.id,
          date: getToday(),
        },
        testDb
      )

      expect(await getHabitStreak(habit.id, testDb)).toBe(1)
    })

    it('calculates long streaks correctly (5 days)', async () => {
      const habit = await createTestHabit(user.id, { name: 'Méditation' })

      await checkConsecutiveDays(habit.id, user.id, 5)

      const res = await getHabitStreak(habit.id, testDb)
      expect(res).toBe(5)
    })

    it("resets streak calculation when there's a gap in history", async () => {
      const habit = await createTestHabit(user.id, { name: 'Code' })

      await checkConsecutiveDays(habit.id, user.id, 2)

      for (const day of [4, 5]) {
        await checkHabit(
          {
            userId: user.id,
            habitId: habit.id,
            date: getTestDate(day),
          },
          testDb
        )
      }

      const streak = await getHabitStreak(habit.id, testDb)
      expect(streak).toBe(2)
    })

    it('still counts 1 if today is missed but yesterday was done', async () => {
      const habit = await createTestHabit(user.id, { name: 'Arroser plantes' })

      await checkHabit(
        {
          userId: user.id,
          habitId: habit.id,
          date: getYesterday(),
        },
        testDb
      )

      expect(await getHabitStreak(habit.id, testDb)).toBe(1)
    })
  })

  describe('countHabitChecks', () => {
    it('should count checks within a date range', async () => {
      const habit = await createTestHabit(user.id)

      await checkHabit({ userId: user.id, habitId: habit.id, date: '2025-06-10' }, testDb)
      await checkHabit({ userId: user.id, habitId: habit.id, date: '2025-06-15' }, testDb)
      await checkHabit({ userId: user.id, habitId: habit.id, date: '2025-06-20' }, testDb)
      await checkHabit({ userId: user.id, habitId: habit.id, date: '2025-07-01' }, testDb)

      const count = await countHabitChecks(habit.id, '2025-06-01', '2025-06-30', testDb)

      expect(count).toBe(3)
    })

    it('should return 0 when no checks in range', async () => {
      const habit = await createTestHabit(user.id)

      const count = await countHabitChecks(habit.id, '2099-01-01', '2099-12-31', testDb)

      expect(count).toBe(0)
    })

    it('should include boundary dates (inclusive range)', async () => {
      const habit = await createTestHabit(user.id)

      await checkHabit({ userId: user.id, habitId: habit.id, date: '2025-06-01' }, testDb)
      await checkHabit({ userId: user.id, habitId: habit.id, date: '2025-06-30' }, testDb)

      const count = await countHabitChecks(habit.id, '2025-06-01', '2025-06-30', testDb)

      expect(count).toBe(2)
    })
  })

  describe('getHabitStats', () => {
    it('should return a complete stats object', async () => {
      const habit = await createTestHabit(user.id)

      await checkHabit({ userId: user.id, habitId: habit.id, date: '2025-06-01' }, testDb)
      await checkHabit({ userId: user.id, habitId: habit.id, date: '2025-06-05' }, testDb)
      await checkHabit({ userId: user.id, habitId: habit.id, date: '2025-06-10' }, testDb)

      const stats = await getHabitStats(habit.id, '2025-06-01', '2025-06-10', testDb)

      expect(stats.totalChecks).toBe(3)
      expect(stats.currentStreak).toBeGreaterThanOrEqual(0)
      expect(stats.completionRate).toBe(30)
    })

    it('should return zero stats for a period with no checks', async () => {
      const habit = await createTestHabit(user.id)

      const stats = await getHabitStats(habit.id, '2025-01-01', '2025-01-31', testDb)

      expect(stats.totalChecks).toBe(0)
      expect(stats.currentStreak).toBe(0)
      expect(stats.completionRate).toBe(0)
    })

    it('should round completion rate to one decimal', async () => {
      const habit = await createTestHabit(user.id)

      await checkHabit({ userId: user.id, habitId: habit.id, date: '2025-06-01' }, testDb)

      const stats = await getHabitStats(habit.id, '2025-06-01', '2025-06-03', testDb)

      expect(stats.completionRate).toBe(33.3)
    })

    it('should return 100% when all days are checked', async () => {
      const habit = await createTestHabit(user.id)

      await checkHabit({ userId: user.id, habitId: habit.id, date: '2025-06-01' }, testDb)
      await checkHabit({ userId: user.id, habitId: habit.id, date: '2025-06-02' }, testDb)
      await checkHabit({ userId: user.id, habitId: habit.id, date: '2025-06-03' }, testDb)

      const stats = await getHabitStats(habit.id, '2025-06-01', '2025-06-03', testDb)

      expect(stats.completionRate).toBe(100)
    })

    it('should include current streak from getHabitStreak', async () => {
      const habit = await createTestHabit(user.id)

      await checkConsecutiveDays(habit.id, user.id, 3)

      const today = getToday()
      const stats = await getHabitStats(habit.id, '2020-01-01', today, testDb)

      expect(stats.currentStreak).toBe(3)
      expect(stats.totalChecks).toBe(3)
    })
  })
})
