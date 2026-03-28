import { beforeEach, describe, expect, it } from 'bun:test'

import { testDb } from '../../../tests/db.test.config'
import { createTestHabit } from '../../../tests/helpers/habit-helpers'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { getToday } from '../../../utils/dates'
import { checkHabit, getTodayHabits, setHabitPeriod, setHabitTimings } from '../service'

describe('Habit Today', () => {
  let user: any

  beforeEach(async () => {
    user = await createTestUser()
  })

  describe('getTodayHabits', () => {
    it('should return all active habits for the user', async () => {
      await createTestHabit(user.id, { name: 'Habit 1' })
      await createTestHabit(user.id, { name: 'Habit 2' })

      const todayHabits = await getTodayHabits(user.id, undefined, testDb)

      expect(todayHabits).toHaveLength(2)
      expect(todayHabits[0]?.isCompleted).toBe(false)
      expect(todayHabits[0]?.checks).toEqual([])
    })

    it('should mark a habit as completed when checked today', async () => {
      const habit = await createTestHabit(user.id)

      const today = getToday()
      await checkHabit({ userId: user.id, habitId: habit.id, date: today }, testDb)

      const todayHabits = await getTodayHabits(user.id, undefined, testDb)

      expect(todayHabits).toHaveLength(1)
      expect(todayHabits[0]?.isCompleted).toBe(true)
      expect(todayHabits[0]?.checks).toHaveLength(1)
    })

    it('should require all timings to be checked for completion', async () => {
      const habit = await createTestHabit(user.id)

      const timings = await setHabitTimings(
        habit.id,
        [
          { time: '08:00', label: 'Matin' },
          { time: '20:00', label: 'Soir' },
        ],
        testDb
      )

      const today = getToday()

      await checkHabit(
        { userId: user.id, habitId: habit.id, date: today, timingId: timings[0]?.id },
        testDb
      )

      let todayHabits = await getTodayHabits(user.id, undefined, testDb)
      expect(todayHabits[0]?.isCompleted).toBe(false)
      expect(todayHabits[0]?.checks).toHaveLength(1)

      await checkHabit(
        { userId: user.id, habitId: habit.id, date: today, timingId: timings[1]?.id },
        testDb
      )

      todayHabits = await getTodayHabits(user.id, undefined, testDb)
      expect(todayHabits[0]?.isCompleted).toBe(true)
      expect(todayHabits[0]?.checks).toHaveLength(2)
    })

    it('should exclude habits with an expired period', async () => {
      await createTestHabit(user.id, { name: 'Active' })

      const expired = await createTestHabit(user.id, { name: 'Expired' })
      await setHabitPeriod(expired.id, { startDate: '2020-01-01', endDate: '2020-12-31' }, testDb)

      const todayHabits = await getTodayHabits(user.id, undefined, testDb)

      expect(todayHabits).toHaveLength(1)
      expect(todayHabits[0]?.habit.name).toBe('Active')
    })

    it('should exclude habits with a future start date', async () => {
      await createTestHabit(user.id, { name: 'Now' })

      const future = await createTestHabit(user.id, { name: 'Future' })
      await setHabitPeriod(future.id, { startDate: '2099-01-01', endDate: '2099-12-31' }, testDb)

      const todayHabits = await getTodayHabits(user.id, undefined, testDb)

      expect(todayHabits).toHaveLength(1)
      expect(todayHabits[0]?.habit.name).toBe('Now')
    })

    it('should exclude habits outside their active months', async () => {
      await createTestHabit(user.id, { name: 'Always' })

      const currentMonth = new Date().getMonth() + 1
      const inactiveMonth = currentMonth === 12 ? 1 : 12

      const seasonal = await createTestHabit(user.id, { name: 'Seasonal' })
      await setHabitPeriod(
        seasonal.id,
        { startDate: '2000-01-01', endDate: '2099-12-31', activeMonths: [inactiveMonth] },
        testDb
      )

      const todayHabits = await getTodayHabits(user.id, undefined, testDb)

      expect(todayHabits).toHaveLength(1)
      expect(todayHabits[0]?.habit.name).toBe('Always')
    })

    it('should include habits within their active month', async () => {
      const currentMonth = new Date().getMonth() + 1

      const seasonal = await createTestHabit(user.id, { name: 'In Season' })
      await setHabitPeriod(
        seasonal.id,
        { startDate: '2000-01-01', endDate: '2099-12-31', activeMonths: [currentMonth] },
        testDb
      )

      const todayHabits = await getTodayHabits(user.id, undefined, testDb)

      expect(todayHabits).toHaveLength(1)
      expect(todayHabits[0]?.habit.name).toBe('In Season')
    })

    it('should not leak habits from other users', async () => {
      const stranger = await createTestUser('stranger@test.com')
      await createTestHabit(user.id, { name: 'Mine' })
      await createTestHabit(stranger.id, { name: 'Not Mine' })

      const todayHabits = await getTodayHabits(user.id, undefined, testDb)

      expect(todayHabits).toHaveLength(1)
      expect(todayHabits[0]?.habit.name).toBe('Mine')
    })
  })
})
