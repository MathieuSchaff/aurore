import {
  createHabitSchema,
  dateRangeQuerySchema,
  err,
  errorToStatus,
  frequencySchema,
  HTTP_STATUS,
  habitErrorMapping,
  ok,
  periodSchema,
  reminderSchema,
  timingSchema,
  toggleCheckSchema,
  updateHabitSchema,
} from '@habit-tracker/shared'

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import type { AppEnv } from '../../app-env'
import { getToday } from '../../utils/dates'
import { requireJwtAuth } from '../auth/middleware'
import {
  archiveHabit,
  createHabit,
  deleteHabit,
  getHabitById,
  getHabitChecks,
  getHabitStats,
  getTodayHabits,
  getUserHabitsWithRelations,
  HabitError,
  restoreHabit,
  setHabitPeriod,
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

app.onError((error, c) => {
  if (error instanceof HabitError) {
    return c.json(err(error.code, error.details), errorToStatus(error.code, habitErrorMapping))
  }
  console.error('Unexpected error:', error)
  return c.json(err('server_error'), HTTP_STATUS.INTERNAL_SERVER_ERROR)
})

export const habits = app

  // ── CRUD ─────────────────────────────────────────────────────────────────

  .get('/', async (c) => {
    const userId = c.get('userId')
    const result = await getUserHabitsWithRelations(userId)
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .post('/', zValidator('json', createHabitSchema), async (c) => {
    const input = c.req.valid('json')
    const userId = c.get('userId')
    const habit = await createHabit(input, userId)
    return c.json(ok(habit), HTTP_STATUS.CREATED)
  })

  .get('/today', zValidator('query', getUserChecksQuerySchema), async (c) => {
    const userId = c.get('userId')
    const { date } = c.req.valid('query')
    const result = await getTodayHabits(userId, date)
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .get('/:id', zValidator('param', idParam), async (c) => {
    const { id } = c.req.valid('param')
    const habit = await getHabitById(id)
    return c.json(ok(habit), HTTP_STATUS.OK)
  })

  .patch('/:id', zValidator('param', idParam), zValidator('json', updateHabitSchema), async (c) => {
    const { id } = c.req.valid('param')
    const userId = c.get('userId')
    const input = c.req.valid('json')
    const habit = await updateHabit(id, userId, input)
    return c.json(ok(habit), HTTP_STATUS.OK)
  })

  .delete('/:id', zValidator('param', idParam), async (c) => {
    const { id } = c.req.valid('param')
    const userId = c.get('userId')
    await deleteHabit(id, userId)
    return c.json(ok(null), HTTP_STATUS.OK)
  })

  .post('/:id/archive', zValidator('param', idParam), async (c) => {
    const { id } = c.req.valid('param')
    const userId = c.get('userId')
    const habit = await archiveHabit(id, userId)
    return c.json(ok(habit), HTTP_STATUS.OK)
  })

  .post('/:id/restore', zValidator('param', idParam), async (c) => {
    const { id } = c.req.valid('param')
    const userId = c.get('userId')
    const habit = await restoreHabit(id, userId)
    return c.json(ok(habit), HTTP_STATUS.OK)
  })

  // ── Today / Checks / Stats ─────────────────────────────────────────────

  .post('/:id/check', zValidator('param', idParam), zValidator('json', toggleCheckSchema), async (c) => {
    const { id } = c.req.valid('param')
    const userId = c.get('userId')
    const input = c.req.valid('json')
    const date = input.date ?? getToday()
    const result = await toggleHabitCheck({
      habitId: id,
      userId,
      date,
      timingId: input.timingId,
      actualTime: input.actualTime,
    })
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .get('/:id/checks', zValidator('param', idParam), zValidator('query', dateRangeQuerySchema), async (c) => {
    const { id } = c.req.valid('param')
    const { startDate, endDate } = c.req.valid('query')
    const checks = await getHabitChecks(id, startDate, endDate)
    return c.json(ok(checks), HTTP_STATUS.OK)
  })

  .get('/:id/stats', zValidator('param', idParam), zValidator('query', dateRangeQuerySchema), async (c) => {
    const { id } = c.req.valid('param')
    const { startDate, endDate } = c.req.valid('query')
    const stats = await getHabitStats(id, startDate, endDate)
    return c.json(ok(stats), HTTP_STATUS.OK)
  })

  // ── Sub-entity updates ─────────────────────────────────────────────────

  .put('/:id/frequency', zValidator('param', idParam), zValidator('json', frequencySchema), async (c) => {
    const { id } = c.req.valid('param')
    const frequency = c.req.valid('json')
    const result = await updateHabitFrequency(id, frequency)
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .put('/:id/timings', zValidator('param', idParam), zValidator('json', z.array(timingSchema).max(10)), async (c) => {
    const { id } = c.req.valid('param')
    const timings = c.req.valid('json')
    const result = await setHabitTimings(id, timings)
    const mapped = result.map((t) => ({
      id: t.id,
      habitId: id,
      day: t.day,
      time: t.time,
      label: t.label,
      createdAt: t.createdAt,
    }))
    return c.json(ok(mapped), HTTP_STATUS.OK)
  })

  .put('/:id/reminders', zValidator('param', idParam), zValidator('json', z.array(reminderSchema).max(5)), async (c) => {
    const { id } = c.req.valid('param')
    const reminders = c.req.valid('json')
    const result = await setHabitReminders(id, reminders)
    const mapped = result.map((r) => ({
      id: r.id,
      habitId: id,
      beforeMinutes: r.beforeMinutes,
      createdAt: r.createdAt,
    }))
    return c.json(ok(mapped), HTTP_STATUS.OK)
  })

  .put('/:id/period', zValidator('param', idParam), zValidator('json', periodSchema), async (c) => {
    const { id } = c.req.valid('param')
    const period = c.req.valid('json')
    const result = await setHabitPeriod(id, period)
    return c.json(ok(result), HTTP_STATUS.OK)
  })
