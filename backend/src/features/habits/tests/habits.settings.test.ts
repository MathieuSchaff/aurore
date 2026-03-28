import { beforeEach, describe, expect, it } from 'bun:test'

import { testDb } from '../../../tests/db.test.config'
import { createTestHabit } from '../../../tests/helpers/habit-helpers'
import { createTestUser } from '../../../tests/helpers/test-factories'
import {
  addHabitReminder,
  addHabitTiming,
  deleteHabitPeriod,
  deleteHabitReminder,
  deleteHabitTiming,
  getHabitById,
  HabitError,
  setHabitPeriod,
  setHabitReminders,
  setHabitTimings,
  updateHabitFrequency,
} from '../service'

describe('Habit Settings', () => {
  let user: any

  beforeEach(async () => {
    user = await createTestUser()
  })

  describe('updateHabitFrequency', () => {
    it('should create a daily frequency', async () => {
      const habit = await createTestHabit(user.id)

      const freq = await updateHabitFrequency(habit.id, { type: 'daily' }, testDb)

      expect(freq.habitId).toBe(habit.id)
      expect(freq.type).toBe('daily')
    })

    it('should create a weekly frequency with days', async () => {
      const habit = await createTestHabit(user.id)

      const freq = await updateHabitFrequency(
        habit.id,
        { type: 'weekly', daysOfWeek: ['monday', 'friday'] },
        testDb
      )

      expect(freq.type).toBe('weekly')
      expect(freq.daysOfWeek).toEqual(['monday', 'friday'])
    })

    it('should create a monthly frequency with days of month', async () => {
      const habit = await createTestHabit(user.id)

      const freq = await updateHabitFrequency(
        habit.id,
        { type: 'monthly', daysOfMonth: [1, 15] },
        testDb
      )

      expect(freq.type).toBe('monthly')
      expect(freq.daysOfMonth).toEqual([1, 15])
    })

    it('should create an interval frequency', async () => {
      const habit = await createTestHabit(user.id)

      const freq = await updateHabitFrequency(
        habit.id,
        { type: 'interval', intervalDays: 3 },
        testDb
      )

      expect(freq.type).toBe('interval')
      expect(freq.intervalDays).toBe(3)
    })

    it('should upsert when frequency already exists', async () => {
      const habit = await createTestHabit(user.id)

      await updateHabitFrequency(habit.id, { type: 'daily' }, testDb)
      const updated = await updateHabitFrequency(
        habit.id,
        { type: 'weekly', daysOfWeek: ['tuesday'] },
        testDb
      )

      expect(updated.type).toBe('weekly')
      expect(updated.daysOfWeek).toEqual(['tuesday'])
    })
  })

  describe('addHabitTiming', () => {
    it('should add a single timing with label', async () => {
      const habit = await createTestHabit(user.id)

      const timing = await addHabitTiming(habit.id, '09:00', 'Morning', testDb)

      expect(timing.habitId).toBe(habit.id)
      expect(timing.time).toBe('09:00')
      expect(timing.label).toBe('Morning')
    })

    it('should add a timing without label', async () => {
      const habit = await createTestHabit(user.id)

      const timing = await addHabitTiming(habit.id, '14:00', undefined, testDb)

      expect(timing.time).toBe('14:00')
      expect(timing.label).toBeNull()
    })
  })

  describe('deleteHabitTiming', () => {
    it('should delete a timing by its id', async () => {
      const habit = await createTestHabit(user.id)
      const timing = await addHabitTiming(habit.id, '09:00', undefined, testDb)

      await deleteHabitTiming(timing.id, testDb)

      const full = await getHabitById(habit.id, testDb)
      expect(full.timings).toHaveLength(0)
    })

    it('should throw timing_not_found for unknown id', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await deleteHabitTiming(fakeId, testDb)
        throw new Error('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(HabitError)
        expect((error as HabitError).code).toBe('timing_not_found')
      }
    })
  })

  describe('setHabitTimings', () => {
    it('should replace all existing timings', async () => {
      const habit = await createTestHabit(user.id)
      await addHabitTiming(habit.id, '08:00', 'Old', testDb)

      const timings = await setHabitTimings(
        habit.id,
        [
          { time: '07:00', label: 'Réveil' },
          { time: '12:00', label: 'Midi' },
          { time: '22:00', label: 'Coucher' },
        ],
        testDb
      )

      expect(timings).toHaveLength(3)
      expect(timings.map((t) => t.time)).toEqual(['07:00', '12:00', '22:00'])
    })

    it('should clear all timings when given empty array', async () => {
      const habit = await createTestHabit(user.id)
      await addHabitTiming(habit.id, '08:00', undefined, testDb)

      const timings = await setHabitTimings(habit.id, [], testDb)

      expect(timings).toEqual([])
    })
  })

  describe('addHabitReminder', () => {
    it('should add a reminder', async () => {
      const habit = await createTestHabit(user.id)

      const reminder = await addHabitReminder(habit.id, 15, testDb)

      expect(reminder.habitId).toBe(habit.id)
      expect(reminder.beforeMinutes).toBe(15)
    })
  })

  describe('deleteHabitReminder', () => {
    it('should delete a reminder by its id', async () => {
      const habit = await createTestHabit(user.id)
      const reminder = await addHabitReminder(habit.id, 10, testDb)

      await deleteHabitReminder(reminder.id, testDb)

      const full = await getHabitById(habit.id, testDb)
      expect(full.reminders).toHaveLength(0)
    })

    it('should throw reminder_not_found for unknown id', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await deleteHabitReminder(fakeId, testDb)
        throw new Error('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(HabitError)
        expect((error as HabitError).code).toBe('reminder_not_found')
      }
    })
  })

  describe('setHabitReminders', () => {
    it('should replace all existing reminders', async () => {
      const habit = await createTestHabit(user.id)
      await addHabitReminder(habit.id, 5, testDb)

      const reminders = await setHabitReminders(
        habit.id,
        [{ beforeMinutes: 10 }, { beforeMinutes: 30 }],
        testDb
      )

      expect(reminders).toHaveLength(2)
      expect(reminders.map((r) => r.beforeMinutes).sort((a, b) => a - b)).toEqual([10, 30])
    })

    it('should clear all reminders when given empty array', async () => {
      const habit = await createTestHabit(user.id)
      await addHabitReminder(habit.id, 10, testDb)

      const reminders = await setHabitReminders(habit.id, [], testDb)

      expect(reminders).toEqual([])
    })
  })

  describe('setHabitPeriod', () => {
    it('should create a period with start and end dates', async () => {
      const habit = await createTestHabit(user.id)

      const period = await setHabitPeriod(
        habit.id,
        { startDate: '2025-01-01', endDate: '2025-12-31' },
        testDb
      )

      expect(period.habitId).toBe(habit.id)
      expect(period.startDate).toBe('2025-01-01')
      expect(period.endDate).toBe('2025-12-31')
    })

    it('should create a period with active months', async () => {
      const habit = await createTestHabit(user.id)

      const period = await setHabitPeriod(habit.id, { activeMonths: [6, 7, 8] }, testDb)

      expect(period.activeMonths).toEqual([6, 7, 8])
    })

    it('should upsert when period already exists', async () => {
      const habit = await createTestHabit(user.id)

      await setHabitPeriod(habit.id, { startDate: '2025-01-01' }, testDb)
      const updated = await setHabitPeriod(
        habit.id,
        { startDate: '2025-06-01', activeMonths: [6, 7, 8] },
        testDb
      )

      expect(updated.startDate).toBe('2025-06-01')
      expect(updated.activeMonths).toEqual([6, 7, 8])
    })

    it('should throw invalid_date_range when startDate > endDate', async () => {
      const habit = await createTestHabit(user.id)

      try {
        await setHabitPeriod(habit.id, { startDate: '2025-12-31', endDate: '2025-01-01' }, testDb)
        throw new Error('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(HabitError)
        expect((error as HabitError).code).toBe('invalid_date_range')
      }
    })
  })

  describe('deleteHabitPeriod', () => {
    it('should remove the period', async () => {
      const habit = await createTestHabit(user.id)
      await setHabitPeriod(habit.id, { startDate: '2025-01-01' }, testDb)

      await deleteHabitPeriod(habit.id, testDb)

      const full = await getHabitById(habit.id, testDb)
      expect(full.period).toBeNull()
    })

    it('should throw when no period exists', async () => {
      const habit = await createTestHabit(user.id)

      try {
        await deleteHabitPeriod(habit.id, testDb)
        throw new Error('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(HabitError)
        expect((error as HabitError).code).toBe('habit_not_found')
      }
    })
  })
})
