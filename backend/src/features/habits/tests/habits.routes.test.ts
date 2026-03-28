import { beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@habit-tracker/shared'

import type { Hono } from 'hono'

import type { AppEnv } from '../../../app-env'
import { createTestApp } from '../../../tests/helpers/createTestApp'
import {
  authDelete,
  authGet,
  authPatch,
  authPost,
  authPut,
  setupAndLogin,
} from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'

const TODAY = '2026-03-06'

describe('Habits routes', () => {
  let app: Hono<AppEnv>

  beforeEach(async () => {
    app = await createTestApp()
  })

  async function createHabit(token: string, overrides?: object) {
    const res = await authPost(app, '/habits', token, {
      name: 'Méditation',
      category: 'health',
      ...overrides,
    })
    const data = await res.json()
    return data.data as { id: string; name: string }
  }

  describe('POST /habits', () => {
    it('should create a habit', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/habits', token, { name: 'Drink water', category: 'health' })

      expect(res.status).toBe(HTTP_STATUS.CREATED)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('Drink water')
    })

    it('should create a habit with all fields', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/habits', token, {
        name: 'Skincare',
        description: 'Morning routine',
        category: 'wellness',
      })

      expect(res.status).toBe(HTTP_STATUS.CREATED)
      const data = await res.json()
      expect(data.data.name).toBe('Skincare')
    })

    it('should reject missing name', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/habits', token, { category: 'health' })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Drink water', category: 'health' }),
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('GET /habits', () => {
    it('should return empty list for new user', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authGet(app, '/habits', token)

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.data).toEqual([])
    })

    it('should return created habits', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      await createHabit(token, { name: 'Méditation' })
      await createHabit(token, { name: 'Sport' })

      const res = await authGet(app, '/habits', token)
      const data = await res.json()
      expect(data.data).toHaveLength(2)
    })

    it('should only return habits for the authenticated user', async () => {
      const tokenToto = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const tokenAlice = await setupAndLogin(app, TEST_CREDENTIALS.alice)

      await createHabit(tokenToto, { name: 'Toto habit' })

      const res = await authGet(app, '/habits', tokenAlice)
      const data = await res.json()
      expect(data.data).toEqual([])
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits')
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('GET /habits/today', () => {
    it('should return today habits list', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      await createHabit(token)

      const res = await authGet(app, `/habits/today?date=${TODAY}`, token)

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(Array.isArray(data.data)).toBe(true)
    })

    it('should accept request without date param', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authGet(app, '/habits/today', token)

      expect(res.status).toBe(HTTP_STATUS.OK)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/today')
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('GET /habits/:id', () => {
    it('should return a habit by id', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token, { name: 'Lecture' })

      const res = await authGet(app, `/habits/${habit.id}`, token)

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.data.id).toBe(habit.id)
      expect(data.data.name).toBe('Lecture')
    })

    it('should reject invalid UUID', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await app.request('/habits/not-a-uuid', {
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001')
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('PATCH /habits/:id', () => {
    it('should update a habit name', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      const res = await authPatch(app, `/habits/${habit.id}`, token, { name: 'Yoga' })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.data.name).toBe('Yoga')
    })

    it('should reject invalid UUID', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await app.request('/habits/not-a-uuid', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: 'Yoga' }),
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Yoga' }),
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('DELETE /habits/:id', () => {
    it('should delete a habit', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      const res = await authDelete(app, `/habits/${habit.id}`, token)

      expect(res.status).toBe(HTTP_STATUS.OK)
    })

    it('should no longer appear in list after deletion', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      await authDelete(app, `/habits/${habit.id}`, token)

      const res = await authGet(app, '/habits', token)
      const data = await res.json()
      expect(data.data).toEqual([])
    })

    it('should reject invalid UUID', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await app.request('/habits/not-a-uuid', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001', {
        method: 'DELETE',
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('POST /habits/:id/archive', () => {
    it('should archive a habit', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      const res = await authPost(app, `/habits/${habit.id}/archive`, token, {})

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001/archive', {
        method: 'POST',
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('POST /habits/:id/restore', () => {
    it('should restore an archived habit', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      await authPost(app, `/habits/${habit.id}/archive`, token, {})
      const res = await authPost(app, `/habits/${habit.id}/restore`, token, {})

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001/restore', {
        method: 'POST',
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('GET /habits/archived', () => {
    it('should return empty list when no archived habits', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authGet(app, '/habits/archived', token)

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.data).toEqual([])
    })

    it('should return archived habits', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      await authPost(app, `/habits/${habit.id}/archive`, token, {})
      const res = await authGet(app, '/habits/archived', token)

      const data = await res.json()
      expect(data.data).toHaveLength(1)
      expect(data.data[0].id).toBe(habit.id)
    })

    it('should not include active habits', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      await createHabit(token)

      const res = await authGet(app, '/habits/archived', token)
      const data = await res.json()
      expect(data.data).toEqual([])
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/archived')
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('PATCH /habits/reorder', () => {
    it('should reorder habits', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const h1 = await createHabit(token, { name: 'First' })
      const h2 = await createHabit(token, { name: 'Second' })

      const res = await authPatch(app, '/habits/reorder', token, {
        habits: [
          { id: h1.id, position: 1 },
          { id: h2.id, position: 0 },
        ],
      })

      expect(res.status).toBe(204)
    })

    it('should reject if habit does not belong to user', async () => {
      const tokenToto = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const tokenAlice = await setupAndLogin(app, TEST_CREDENTIALS.alice)
      const h = await createHabit(tokenToto)

      const res = await authPatch(app, '/habits/reorder', tokenAlice, {
        habits: [{ id: h.id, position: 0 }],
      })

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habits: [] }),
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('POST /habits/:id/check', () => {
    it('should toggle a habit check to done', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      const res = await authPost(app, `/habits/${habit.id}/check`, token, { date: TODAY })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should toggle off on second check (same date)', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      await authPost(app, `/habits/${habit.id}/check`, token, { date: TODAY })
      const res = await authPost(app, `/habits/${habit.id}/check`, token, { date: TODAY })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: TODAY }),
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('GET /habits/:id/checks', () => {
    it('should return empty checks for new habit', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      const res = await authGet(
        app,
        `/habits/${habit.id}/checks?startDate=${TODAY}&endDate=${TODAY}`,
        token
      )

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(Array.isArray(data.data)).toBe(true)
    })

    it('should return checks after toggle', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      await authPost(app, `/habits/${habit.id}/check`, token, { date: TODAY })

      const res = await authGet(
        app,
        `/habits/${habit.id}/checks?startDate=${TODAY}&endDate=${TODAY}`,
        token
      )
      const data = await res.json()
      expect(data.data.length).toBeGreaterThanOrEqual(1)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001/checks')
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('GET /habits/:id/stats', () => {
    it('should return stats for a habit', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      const res = await authGet(
        app,
        `/habits/${habit.id}/stats?startDate=${TODAY}&endDate=${TODAY}`,
        token
      )

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001/stats')
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('PUT /habits/:id/frequency', () => {
    it('should set habit frequency', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      const res = await authPut(app, `/habits/${habit.id}/frequency`, token, {
        type: 'daily',
      })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001/frequency', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'daily' }),
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('PUT /habits/:id/timings', () => {
    it('should set habit timings', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)
      await authPut(app, `/habits/${habit.id}/frequency`, token, { type: 'daily' })

      const res = await authPut(app, `/habits/${habit.id}/timings`, token, [
        { time: '08:00', label: 'Matin' },
      ])

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
    })

    it('should clear timings with empty array', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)
      await authPut(app, `/habits/${habit.id}/frequency`, token, { type: 'daily' })

      const res = await authPut(app, `/habits/${habit.id}/timings`, token, [])

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.data).toEqual([])
    })

    it('should reject more than 10 timings', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      const res = await authPut(
        app,
        `/habits/${habit.id}/timings`,
        token,
        Array.from({ length: 11 }, () => ({ time: '08:00', label: 'x' }))
      )

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001/timings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([]),
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('PUT /habits/:id/reminders', () => {
    it('should set reminders with timingId', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      await authPut(app, `/habits/${habit.id}/frequency`, token, { type: 'daily' })

      const timingsRes = await authPut(app, `/habits/${habit.id}/timings`, token, [
        { time: '08:00', label: 'Matin' },
      ])
      const timingsData = await timingsRes.json()
      const timingId = timingsData.data[0].id

      const res = await authPut(app, `/habits/${habit.id}/reminders`, token, [
        { timingId, beforeMinutes: 15 },
      ])

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].timingId).toBe(timingId)
    })

    it('should reject reminder with invalid timingId', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)
      await authPut(app, `/habits/${habit.id}/frequency`, token, { type: 'daily' })
      await authPut(app, `/habits/${habit.id}/timings`, token, [{ time: '08:00' }])

      const res = await authPut(app, `/habits/${habit.id}/reminders`, token, [
        { timingId: '019746ab-0000-7000-8000-000000000099', beforeMinutes: 15 },
      ])

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)
    })

    it('should reject more than 20 reminders', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      const res = await authPut(
        app,
        `/habits/${habit.id}/reminders`,
        token,
        Array.from({ length: 21 }, () => ({
          timingId: '00000000-0000-0000-0000-000000000001',
          beforeMinutes: 10,
        }))
      )

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001/reminders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([]),
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('PUT /habits/:id/period', () => {
    it('should set habit period', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      const res = await authPut(app, `/habits/${habit.id}/period`, token, {
        startDate: TODAY,
        endDate: '2026-12-31',
      })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001/period', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: TODAY }),
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('PUT /habits/:id/products', () => {
    it('should set products on a habit', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      const res = await authPut(app, `/habits/${habit.id}/products`, token, [])

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.data).toEqual([])
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([]),
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('GET /habits/:id/check-products', () => {
    it('should return empty when no check products', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      const res = await authGet(
        app,
        `/habits/${habit.id}/check-products?startDate=${TODAY}&endDate=${TODAY}`,
        token
      )

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.data).toEqual([])
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request(
        '/habits/00000000-0000-0000-0000-000000000001/check-products?startDate=2026-01-01&endDate=2026-12-31'
      )
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('POST /habits/:id/check with products', () => {
    it('should accept check with empty products array', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      const res = await authPost(app, `/habits/${habit.id}/check`, token, {
        date: TODAY,
        products: [],
      })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.data.checked).toBe(true)
    })

    it('should still work without products (backward compat)', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(token)

      const res = await authPost(app, `/habits/${habit.id}/check`, token, {
        date: TODAY,
      })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.data.checked).toBe(true)
    })
  })
})
