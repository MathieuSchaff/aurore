import {
  createHabitSchema,
  dateRangeQuerySchema,
  frequencySchema,
  HTTP_STATUS,
  ok,
  periodSchema,
  reminderWithTimingSchema,
  reorderHabitsSchema,
  setProductsSchema,
  timingSchema,
  toggleCheckSchema,
  updateHabitSchema,
} from '@habit-tracker/shared'

import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../app-env'
import { getToday } from '../../utils/dates'
import { requireJwtAuth } from '../auth/middleware'
import {
  archiveHabit,
  createHabit,
  deleteHabit,
  getArchivedHabitsWithRelations,
  getCheckProducts,
  getHabitById,
  getHabitChecks,
  getHabitStats,
  getTodayHabits,
  getUserHabitsWithRelations,
  reorderHabits,
  restoreHabit,
  setHabitPeriod,
  setHabitProducts,
  setHabitReminders,
  setHabitTimings,
  toggleHabitCheck,
  updateHabit,
  updateHabitFrequency,
} from './service'

const idParam = z.object({ id: z.uuid() })

const getUserChecksQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
})

// ─── App + Handlers ──────────────────────────────────────────────────────────

const app = new Hono<AppEnv>()

app.use('*', requireJwtAuth)

export const habits = app

  // ── CRUD ─────────────────────────────────────────────────────────────────

  .get('/', async (c) => {
    const db = c.get('db')
    const userId = c.get('userId')
    const result = await getUserHabitsWithRelations(userId, db)
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .post('/', zValidator('json', createHabitSchema), async (c) => {
    const db = c.get('db')
    const input = c.req.valid('json')
    const userId = c.get('userId')
    const habit = await createHabit(input, userId, db)
    return c.json(ok(habit), HTTP_STATUS.CREATED)
  })

  .get('/archived', async (c) => {
    const db = c.get('db')
    const userId = c.get('userId')
    const result = await getArchivedHabitsWithRelations(userId, db)
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .patch('/reorder', zValidator('json', reorderHabitsSchema), async (c) => {
    const db = c.get('db')
    const userId = c.get('userId')
    const { habits } = c.req.valid('json')
    await reorderHabits(userId, habits, db)
    return c.body(null, 204)
  })

  .get('/today', zValidator('query', getUserChecksQuerySchema), async (c) => {
    const db = c.get('db')
    const userId = c.get('userId')
    const { date } = c.req.valid('query')
    const result = await getTodayHabits(userId, date, db)
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .get('/:id', zValidator('param', idParam), async (c) => {
    const db = c.get('db')
    const { id } = c.req.valid('param')
    const habit = await getHabitById(id, db)
    return c.json(ok(habit), HTTP_STATUS.OK)
  })

  .patch('/:id', zValidator('param', idParam), zValidator('json', updateHabitSchema), async (c) => {
    const db = c.get('db')
    const { id } = c.req.valid('param')
    const userId = c.get('userId')
    const input = c.req.valid('json')
    const habit = await updateHabit(id, userId, input, db)
    return c.json(ok(habit), HTTP_STATUS.OK)
  })

  .delete('/:id', zValidator('param', idParam), async (c) => {
    const db = c.get('db')
    const { id } = c.req.valid('param')
    const userId = c.get('userId')
    await deleteHabit(id, userId, db)
    return c.json(ok(null), HTTP_STATUS.OK)
  })

  .post('/:id/archive', zValidator('param', idParam), async (c) => {
    const db = c.get('db')
    const { id } = c.req.valid('param')
    const userId = c.get('userId')
    const habit = await archiveHabit(id, userId, db)
    return c.json(ok(habit), HTTP_STATUS.OK)
  })

  .post('/:id/restore', zValidator('param', idParam), async (c) => {
    const db = c.get('db')
    const { id } = c.req.valid('param')
    const userId = c.get('userId')
    const habit = await restoreHabit(id, userId, db)
    return c.json(ok(habit), HTTP_STATUS.OK)
  })

  // ── Today / Checks / Stats ─────────────────────────────────────────────

  .post(
    '/:id/check',
    zValidator('param', idParam),
    zValidator('json', toggleCheckSchema),
    async (c) => {
      const db = c.get('db')
      const { id } = c.req.valid('param')
      const userId = c.get('userId')
      const input = c.req.valid('json')
      const date = input.date ?? getToday()
      const result = await toggleHabitCheck(
        {
          habitId: id,
          userId,
          date,
          timingId: input.timingId,
          actualTime: input.actualTime,
          products: input.products,
        },
        db
      )
      return c.json(ok(result), HTTP_STATUS.OK)
    }
  )

  .get(
    '/:id/checks',
    zValidator('param', idParam),
    zValidator('query', dateRangeQuerySchema),
    async (c) => {
      const db = c.get('db')
      const { id } = c.req.valid('param')
      const { startDate, endDate } = c.req.valid('query')
      const checks = await getHabitChecks(id, startDate, endDate, db)
      return c.json(ok(checks), HTTP_STATUS.OK)
    }
  )

  .get(
    '/:id/stats',
    zValidator('param', idParam),
    zValidator('query', dateRangeQuerySchema),
    async (c) => {
      const db = c.get('db')
      const { id } = c.req.valid('param')
      const { startDate, endDate } = c.req.valid('query')
      const stats = await getHabitStats(id, startDate, endDate, db)
      return c.json(ok(stats), HTTP_STATUS.OK)
    }
  )

  .get(
    '/:id/check-products',
    zValidator('param', idParam),
    zValidator('query', dateRangeQuerySchema),
    async (c) => {
      const db = c.get('db')
      const { id } = c.req.valid('param')
      const userId = c.get('userId')
      const { startDate, endDate } = c.req.valid('query')
      const result = await getCheckProducts(id, userId, startDate, endDate, db)
      return c.json(ok(result), HTTP_STATUS.OK)
    }
  )

  // ── Sub-entity updates ─────────────────────────────────────────────────

  .put(
    '/:id/frequency',
    zValidator('param', idParam),
    zValidator('json', frequencySchema),
    async (c) => {
      const db = c.get('db')
      const { id } = c.req.valid('param')
      const frequency = c.req.valid('json')
      const result = await updateHabitFrequency(id, frequency, db)
      return c.json(ok(result), HTTP_STATUS.OK)
    }
  )

  .put(
    '/:id/timings',
    zValidator('param', idParam),
    zValidator('json', z.array(timingSchema).max(10)),
    async (c) => {
      const db = c.get('db')
      const { id } = c.req.valid('param')
      const timings = c.req.valid('json')
      const result = await setHabitTimings(id, timings, db)
      const mapped = result.map((t) => ({
        id: t.id,
        habitId: id,
        day: t.day,
        time: t.time,
        label: t.label,
        createdAt: t.createdAt,
      }))
      return c.json(ok(mapped), HTTP_STATUS.OK)
    }
  )

  .put(
    '/:id/reminders',
    zValidator('param', idParam),
    zValidator('json', z.array(reminderWithTimingSchema).max(20)),
    async (c) => {
      const db = c.get('db')
      const { id } = c.req.valid('param')
      const reminders = c.req.valid('json')
      const result = await setHabitReminders(id, reminders, db)
      const mapped = result.map((r) => ({
        id: r.id,
        timingId: r.timingId,
        beforeMinutes: r.beforeMinutes,
        createdAt: r.createdAt,
      }))
      return c.json(ok(mapped), HTTP_STATUS.OK)
    }
  )

  .put('/:id/period', zValidator('param', idParam), zValidator('json', periodSchema), async (c) => {
    const db = c.get('db')
    const { id } = c.req.valid('param')
    const period = c.req.valid('json')
    const result = await setHabitPeriod(id, period, db)
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .put(
    '/:id/products',
    zValidator('param', idParam),
    zValidator('json', setProductsSchema),
    async (c) => {
      const db = c.get('db')
      const { id } = c.req.valid('param')
      const userId = c.get('userId')
      const productsInput = c.req.valid('json')
      const result = await setHabitProducts(id, userId, productsInput, db)
      return c.json(ok(result), HTTP_STATUS.OK)
    }
  )
