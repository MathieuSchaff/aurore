import { beforeEach, describe, expect, it } from 'bun:test'

import type { CreateHabitInput } from '@habit-tracker/shared'

import { eq } from 'drizzle-orm'

import { habits } from '../../../db/schema/habits'
import { testDb } from '../../../tests/db.test.config'
import { createTestUser } from '../../../tests/helpers/test-factories'
import {
  archiveHabit,
  createHabit,
  deleteHabit,
  getHabitById,
  getUserHabits,
  getUserHabitsWithRelations,
  HabitError,
  restoreHabit,
  updateHabit,
} from '../service'

/** Crée une habitude minimale pour les tests qui n'ont pas besoin de config fine. */
async function createTestHabit(userId: string, overrides: Partial<CreateHabitInput> = {}) {
  return createHabit(
    {
      name: overrides.name ?? 'Test habit',
      category: overrides.category ?? 'test',
      ...overrides,
    },
    userId,
    testDb
  )
}

describe('Habit CRUD', () => {
  let user: { id: string }

  beforeEach(async () => {
    user = await createTestUser()
  })

  describe('createHabit', () => {
    it('should save a basic habit correctly', async () => {
      const habit = await createHabit({ name: 'Pompes', category: 'fitness' }, user.id, testDb)

      expect(habit.id).toBeDefined()
      expect(habit.name).toBe('Pompes')
      expect(habit.userId).toBe(user.id)
      expect(habit.archivedAt).toBeNull()
      expect(habit.position).toBe(0)
    })

    it('should handle weekly frequency with specific days', async () => {
      const input: CreateHabitInput = {
        name: 'Musculation',
        category: 'health',
        frequency: {
          type: 'weekly',
          daysOfWeek: [0, 2, 4],
        },
      }

      const created = await createHabit(input, user.id, testDb)
      const full = await getHabitById(created.id, testDb)

      expect(full.frequency?.type).toBe('weekly')
      expect(full.frequency?.daysOfWeek).toContain(2)
    })

    it('should handle monthly frequency', async () => {
      const input: CreateHabitInput = {
        name: 'Bilan mensuel',
        category: 'admin',
        frequency: {
          type: 'monthly',
          daysOfMonth: [1, 15],
        },
      }

      const created = await createHabit(input, user.id, testDb)
      const full = await getHabitById(created.id, testDb)

      expect(full.frequency?.type).toBe('monthly')
      expect(full.frequency?.daysOfMonth).toEqual([1, 15])
    })

    it('should handle every_n_days frequency', async () => {
      const input: CreateHabitInput = {
        name: 'Lessive',
        category: 'maison',
        frequency: {
          type: 'every_n_days',
          intervalDays: 3,
        },
      }

      const created = await createHabit(input, user.id, testDb)
      const full = await getHabitById(created.id, testDb)

      expect(full.frequency?.type).toBe('every_n_days')
      expect(full.frequency?.intervalDays).toBe(3)
    })

    it('should support multiple timings and labels', async () => {
      const input: CreateHabitInput = {
        name: 'Vitamines',
        category: 'health',
        frequency: { type: 'daily' },
        timings: [
          { time: '08:00', label: 'Petit-déjeuner' },
          { time: '20:00', label: 'Dîner' },
        ],
      }

      const created = await createHabit(input, user.id, testDb)
      const full = await getHabitById(created.id, testDb)

      expect(full.timings).toHaveLength(2)
      expect(full.timings[0]?.label).toBe('Petit-déjeuner')
    })

    it('should not create timings without a frequency (no schedule)', async () => {
      const input: CreateHabitInput = {
        name: 'Orphan timings',
        category: 'test',
        timings: [{ time: '10:00' }],
      }

      const created = await createHabit(input, user.id, testDb)
      const full = await getHabitById(created.id, testDb)

      expect(full.frequency).toBeNull()
      expect(full.timings).toHaveLength(0)
    })

    it('should handle seasonal periods (active months)', async () => {
      const input: CreateHabitInput = {
        name: "Course d'été",
        category: 'fitness',
        period: {
          startDate: '2025-06-01',
          endDate: '2025-08-31',
          activeMonths: [6, 7, 8],
        },
      }

      const created = await createHabit(input, user.id, testDb)
      const full = await getHabitById(created.id, testDb)

      expect(full.period?.activeMonths).toEqual([6, 7, 8])
      expect(full.period?.startDate).toBe('2025-06-01')
      expect(full.period?.endDate).toBe('2025-08-31')
    })

    it('should work when everything is combined (all relations)', async () => {
      const input: CreateHabitInput = {
        name: 'Routine complète',
        category: 'health',
        frequency: { type: 'daily' },
        timings: [{ time: '07:00' }],
        period: {
          startDate: '2025-01-01',
          endDate: '2025-12-31',
        },
      }

      const created = await createHabit(input, user.id, testDb)
      const full = await getHabitById(created.id, testDb)

      expect(full.frequency).not.toBeNull()
      expect(full.frequency?.type).toBe('daily')
      expect(full.timings).toHaveLength(1)
      expect(full.period).not.toBeNull()
    })
  })

  describe('getHabitById', () => {
    it('should throw habit_not_found if the ID does not exist', async () => {
      const fakeId = crypto.randomUUID()

      expect(getHabitById(fakeId, testDb)).rejects.toThrow(HabitError)
    })

    it('should throw HabitError with correct code', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await getHabitById(fakeId, testDb)
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(HabitError)
        expect((e as HabitError).code).toBe('habit_not_found')
      }
    })

    it('should fetch a habit with all its nested relations', async () => {
      const input: CreateHabitInput = {
        name: 'Course matinale',
        category: 'health',
        frequency: { type: 'daily' },
        timings: [{ time: '08:00', label: 'Matin' }],
      }

      const created = await createHabit(input, user.id, testDb)
      const habit = await getHabitById(created.id, testDb)

      expect(habit.id).toBe(created.id)
      expect(habit.frequency?.type).toBe('daily')
      expect(habit.timings).toHaveLength(1)
      expect(habit.timings[0]?.time).toBe('08:00')
    })

    it('should handle simple habits without extra relations', async () => {
      const basic = await createTestHabit(user.id)
      const full = await getHabitById(basic.id, testDb)

      expect(full.frequency).toBeNull()
      expect(full.timings).toHaveLength(0)
      expect(full.reminders).toHaveLength(0)
      expect(full.period).toBeNull()
      expect(full.products).toHaveLength(0)
    })

    it('should return correct habitId on mapped timings', async () => {
      const created = await createHabit(
        {
          name: 'Mapping test',
          category: 'test',
          frequency: { type: 'daily' },
          timings: [{ time: '09:00' }],
        },
        user.id,
        testDb
      )

      const full = await getHabitById(created.id, testDb)

      expect(full.timings[0]?.habitId).toBe(created.id)
    })
  })

  describe('getUserHabits', () => {
    it('should return an empty list when user has no habits', async () => {
      const list = await getUserHabits(user.id, testDb)
      expect(list).toEqual([])
    })

    it('should not leak habits from other users', async () => {
      const stranger = await createTestUser('stranger@test.com')

      await createTestHabit(user.id, { name: 'Ma tâche' })
      await createTestHabit(stranger.id, { name: 'Autre tâche' })

      const results = await getUserHabits(user.id, testDb)

      expect(results).toHaveLength(1)
      expect(results[0]?.name).toBe('Ma tâche')
    })

    it('should filter out archived habits', async () => {
      const habit = await createTestHabit(user.id, { name: 'Vieille habitude' })

      await testDb.update(habits).set({ archivedAt: new Date() }).where(eq(habits.id, habit.id))

      const active = await getUserHabits(user.id, testDb)
      expect(active).toHaveLength(0)
    })

    it('should return habits ordered by position then createdAt', async () => {
      const h1 = await createTestHabit(user.id, { name: 'Third' })
      const h2 = await createTestHabit(user.id, { name: 'First' })
      const h3 = await createTestHabit(user.id, { name: 'Second' })

      await testDb.update(habits).set({ position: 2 }).where(eq(habits.id, h1.id))
      await testDb.update(habits).set({ position: 0 }).where(eq(habits.id, h2.id))
      await testDb.update(habits).set({ position: 1 }).where(eq(habits.id, h3.id))

      const list = await getUserHabits(user.id, testDb)

      expect(list.map((h) => h.name)).toEqual(['First', 'Second', 'Third'])
    })
  })

  describe('getUserHabitsWithRelations', () => {
    it('should return habits with all nested relations', async () => {
      await createHabit(
        {
          name: 'Complet',
          category: 'test',
          frequency: { type: 'daily' },
          timings: [{ time: '09:00' }],
        },
        user.id,
        testDb
      )

      const result = await getUserHabitsWithRelations(user.id, testDb)

      expect(result).toHaveLength(1)
      expect(result[0]?.frequency?.type).toBe('daily')
      expect(result[0]?.timings).toHaveLength(1)
    })

    it('should exclude archived habits', async () => {
      await createTestHabit(user.id, { name: 'Active' })
      const toArchive = await createTestHabit(user.id, { name: 'Archived' })

      await archiveHabit(toArchive.id, user.id, testDb)

      const result = await getUserHabitsWithRelations(user.id, testDb)

      expect(result).toHaveLength(1)
      expect(result[0]?.name).toBe('Active')
    })

    it('should return empty array for user with no habits', async () => {
      const result = await getUserHabitsWithRelations(user.id, testDb)
      expect(result).toEqual([])
    })
  })

  describe('updateHabit', () => {
    it('should update name and category', async () => {
      const habit = await createTestHabit(user.id, { name: 'Old', category: 'old' })

      const updated = await updateHabit(habit.id, user.id, { name: 'New', category: 'new' }, testDb)

      expect(updated.name).toBe('New')
      expect(updated.category).toBe('new')
    })

    it('should update only provided fields (partial update)', async () => {
      const habit = await createTestHabit(user.id, { name: 'Keep', category: 'original' })

      const updated = await updateHabit(habit.id, user.id, { name: 'Changed' }, testDb)

      expect(updated.name).toBe('Changed')
      expect(updated.category).toBe('original')
    })

    it('should update position', async () => {
      const habit = await createTestHabit(user.id)

      const updated = await updateHabit(habit.id, user.id, { position: 5 }, testDb)

      expect(updated.position).toBe(5)
    })

    it('should update the updatedAt timestamp', async () => {
      const habit = await createTestHabit(user.id)

      await new Promise((r) => setTimeout(r, 10))

      const updated = await updateHabit(habit.id, user.id, { name: 'Renamed' }, testDb)

      expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(
        new Date(habit.updatedAt).getTime()
      )
    })

    it('should throw habit_not_found for unknown id', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await updateHabit(fakeId, user.id, { name: 'Nope' }, testDb)
        throw new Error('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(HabitError)
        expect((error as HabitError).code).toBe('habit_not_found')
      }
    })

    it("should throw habit_not_found when updating another user's habit", async () => {
      const stranger = await createTestUser('stranger@test.com')
      const habit = await createTestHabit(stranger.id)

      try {
        await updateHabit(habit.id, user.id, { name: 'Hijack' }, testDb)
        throw new Error('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(HabitError)
        expect((error as HabitError).code).toBe('habit_not_found')
      }
    })
  })

  describe('archiveHabit', () => {
    it('should set archivedAt to a date', async () => {
      const habit = await createTestHabit(user.id)

      const archived = await archiveHabit(habit.id, user.id, testDb)

      expect(archived.archivedAt).not.toBeNull()
      expect(archived.archivedAt).toBeInstanceOf(Date)
    })

    it('should throw habit_not_found for unknown id', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await archiveHabit(fakeId, user.id, testDb)
        throw new Error('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(HabitError)
        expect((error as HabitError).code).toBe('habit_not_found')
      }
    })

    it("should throw habit_not_found when archiving another user's habit", async () => {
      const stranger = await createTestUser('stranger@test.com')
      const habit = await createTestHabit(stranger.id)

      try {
        await archiveHabit(habit.id, user.id, testDb)
        throw new Error('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(HabitError)
        expect((error as HabitError).code).toBe('habit_not_found')
      }
    })

    it('should throw habit_not_found when archiving an already archived habit', async () => {
      const habit = await createTestHabit(user.id)
      await archiveHabit(habit.id, user.id, testDb)

      try {
        await archiveHabit(habit.id, user.id, testDb)
        throw new Error('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(HabitError)
        expect((error as HabitError).code).toBe('habit_not_found')
      }
    })
  })

  describe('restoreHabit', () => {
    it('should clear archivedAt back to null', async () => {
      const habit = await createTestHabit(user.id)
      await archiveHabit(habit.id, user.id, testDb)

      const restored = await restoreHabit(habit.id, user.id, testDb)

      expect(restored.archivedAt).toBeNull()
    })

    it('should throw habit_not_found for unknown id', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await restoreHabit(fakeId, user.id, testDb)
        throw new Error('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(HabitError)
        expect((error as HabitError).code).toBe('habit_not_found')
      }
    })

    it("should throw habit_not_found when restoring another user's habit", async () => {
      const stranger = await createTestUser('stranger@test.com')
      const habit = await createTestHabit(stranger.id)
      await archiveHabit(habit.id, stranger.id, testDb)

      try {
        await restoreHabit(habit.id, user.id, testDb)
        throw new Error('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(HabitError)
        expect((error as HabitError).code).toBe('habit_not_found')
      }
    })
  })

  describe('deleteHabit', () => {
    it('should permanently remove the habit', async () => {
      const habit = await createTestHabit(user.id)

      await deleteHabit(habit.id, user.id, testDb)

      expect(getHabitById(habit.id, testDb)).rejects.toThrow(HabitError)
    })

    it('should cascade delete related data (schedule, timings, period)', async () => {
      const created = await createHabit(
        {
          name: 'Full delete',
          category: 'test',
          frequency: { type: 'daily' },
          timings: [{ time: '08:00' }],
          period: { startDate: '2025-01-01', endDate: '2025-12-31' },
        },
        user.id,
        testDb
      )

      await deleteHabit(created.id, user.id, testDb)

      expect(getHabitById(created.id, testDb)).rejects.toThrow(HabitError)
    })

    it('should throw habit_not_found for unknown id', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await deleteHabit(fakeId, user.id, testDb)
        throw new Error('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(HabitError)
        expect((error as HabitError).code).toBe('habit_not_found')
      }
    })

    it("should throw habit_not_found when deleting another user's habit", async () => {
      const stranger = await createTestUser('stranger@test.com')
      const habit = await createTestHabit(stranger.id)

      try {
        await deleteHabit(habit.id, user.id, testDb)
        throw new Error('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(HabitError)
        expect((error as HabitError).code).toBe('habit_not_found')
      }
    })
  })
})
