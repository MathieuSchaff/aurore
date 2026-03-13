import { beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@habit-tracker/shared'

import type { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { TEST_CREDENTIALS } from '../helpers/test-credentials'
import { createTestUser } from '../helpers/test-factories'
import { createTestApp } from './createTestApp'

// ── Helpers ──────────────────────────────────────────────────────────

async function loginAndGetToken(app: Hono<AppEnv>, email: string, password: string) {
  const res = await app.request('/auth/mobile/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!data.success) throw new Error('Login failed in helper')
  return data.data.accessToken as string
}

async function setupAndLogin(app: Hono<AppEnv>, creds: { rawEmail: string; rawPassword: string }) {
  await createTestUser(creds.rawEmail, creds.rawPassword)
  return loginAndGetToken(app, creds.rawEmail, creds.rawPassword)
}

function authGet(app: Hono<AppEnv>, path: string, token: string) {
  return app.request(path, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

function authPost(app: Hono<AppEnv>, path: string, token: string, body: object) {
  return app.request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
}

function authPatch(app: Hono<AppEnv>, path: string, token: string, body: object) {
  return app.request(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
}

function authPut(app: Hono<AppEnv>, path: string, token: string, body: object) {
  return app.request(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
}

function authDelete(app: Hono<AppEnv>, path: string, token: string) {
  return app.request(path, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

async function createHabit(app: Hono<AppEnv>, token: string, overrides?: object) {
  const res = await authPost(app, '/habits', token, { name: 'Méditation', ...overrides })
  const data = await res.json()
  return data.data as { id: string; name: string }
}

const TODAY = '2026-03-06'

// ── Tests ────────────────────────────────────────────────────────────

describe('Habits routes', () => {
  let app: Hono<AppEnv>

  beforeEach(() => {
    app = createTestApp()
  })

  // ━━━ POST /habits ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('POST /habits', () => {
    it('should create a habit', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/habits', token, { name: 'Drink water' })

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

      const res = await authPost(app, '/habits', token, {})

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Drink water' }),
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  // ━━━ GET /habits ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

      await createHabit(app, token, { name: 'Méditation' })
      await createHabit(app, token, { name: 'Sport' })

      const res = await authGet(app, '/habits', token)
      const data = await res.json()
      expect(data.data).toHaveLength(2)
    })

    it('should only return habits for the authenticated user', async () => {
      const tokenToto = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const tokenAlice = await setupAndLogin(app, TEST_CREDENTIALS.alice)

      await createHabit(app, tokenToto, { name: 'Toto habit' })

      const res = await authGet(app, '/habits', tokenAlice)
      const data = await res.json()
      expect(data.data).toEqual([])
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits')
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  // ━━━ GET /habits/today ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('GET /habits/today', () => {
    it('should return today habits list', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      await createHabit(app, token)

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

  // ━━━ GET /habits/:id ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('GET /habits/:id', () => {
    it('should return a habit by id', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token, { name: 'Lecture' })

      const res = await authGet(app, `/habits/${habit.id}`, token)

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.data.id).toBe(habit.id)
      expect(data.data.name).toBe('Lecture')
    })

    it('should reject invalid UUID', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authGet(app, '/habits/not-a-uuid', token)

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001')
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  // ━━━ PATCH /habits/:id ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('PATCH /habits/:id', () => {
    it('should update a habit name', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPatch(app, `/habits/${habit.id}`, token, { name: 'Yoga' })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.data.name).toBe('Yoga')
    })

    it('should reject invalid UUID', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPatch(app, '/habits/not-a-uuid', token, { name: 'Yoga' })

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

  // ━━━ DELETE /habits/:id ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('DELETE /habits/:id', () => {
    it('should delete a habit', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authDelete(app, `/habits/${habit.id}`, token)

      expect(res.status).toBe(HTTP_STATUS.OK)
    })

    it('should no longer appear in list after deletion', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      await authDelete(app, `/habits/${habit.id}`, token)

      const res = await authGet(app, '/habits', token)
      const data = await res.json()
      expect(data.data).toEqual([])
    })

    it('should reject invalid UUID', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authDelete(app, '/habits/not-a-uuid', token)

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001', {
        method: 'DELETE',
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  // ━━━ POST /habits/:id/archive & /restore ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('POST /habits/:id/archive', () => {
    it('should archive a habit', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPost(app, `/habits/${habit.id}/archive`, token, {})

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should reject invalid UUID', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/habits/not-a-uuid/archive', token, {})

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
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
      const habit = await createHabit(app, token)

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

  // ━━━ POST /habits/:id/check ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('POST /habits/:id/check', () => {
    it('should toggle a habit check to done', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPost(app, `/habits/${habit.id}/check`, token, { date: TODAY })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should toggle off on second check (same date)', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      await authPost(app, `/habits/${habit.id}/check`, token, { date: TODAY })
      const res = await authPost(app, `/habits/${habit.id}/check`, token, { date: TODAY })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should reject invalid UUID', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/habits/not-a-uuid/check', token, { date: TODAY })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
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

  // ━━━ GET /habits/:id/checks ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('GET /habits/:id/checks', () => {
    it('should return empty checks for new habit', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authGet(app, `/habits/${habit.id}/checks?startDate=${TODAY}&endDate=${TODAY}`, token)

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(Array.isArray(data.data)).toBe(true)
    })

    it('should return checks after toggle', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      await authPost(app, `/habits/${habit.id}/check`, token, { date: TODAY })

      const res = await authGet(app, `/habits/${habit.id}/checks?startDate=${TODAY}&endDate=${TODAY}`, token)
      const data = await res.json()
      expect(data.data.length).toBeGreaterThanOrEqual(1)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001/checks')
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  // ━━━ GET /habits/:id/stats ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('GET /habits/:id/stats', () => {
    it('should return stats for a habit', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authGet(app, `/habits/${habit.id}/stats?startDate=${TODAY}&endDate=${TODAY}`, token)

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/habits/00000000-0000-0000-0000-000000000001/stats')
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  // ━━━ PUT /habits/:id/frequency ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('PUT /habits/:id/frequency', () => {
    it('should set habit frequency', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPut(app, `/habits/${habit.id}/frequency`, token, {
        type: 'daily',
      })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should reject invalid UUID', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPut(app, '/habits/not-a-uuid/frequency', token, { type: 'daily' })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
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

  // ━━━ PUT /habits/:id/timings ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('PUT /habits/:id/timings', () => {
    it('should set habit timings', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPut(app, `/habits/${habit.id}/timings`, token, [
        { time: '08:00', day: null, label: 'Matin' },
      ])

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
    })

    it('should clear timings with empty array', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPut(app, `/habits/${habit.id}/timings`, token, [])

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.data).toEqual([])
    })

    it('should reject more than 10 timings', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPut(
        app,
        `/habits/${habit.id}/timings`,
        token,
        Array.from({ length: 11 }, () => ({ time: '08:00', day: null, label: 'x' }))
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

  // ━━━ PUT /habits/:id/reminders ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('PUT /habits/:id/reminders', () => {
    it('should set habit reminders', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPut(app, `/habits/${habit.id}/reminders`, token, [
        { beforeMinutes: 15 },
      ])

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should reject more than 5 reminders', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPut(
        app,
        `/habits/${habit.id}/reminders`,
        token,
        Array.from({ length: 6 }, () => ({ beforeMinutes: 10 }))
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

  // ━━━ PUT /habits/:id/period ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('PUT /habits/:id/period', () => {
    it('should set habit period', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPut(app, `/habits/${habit.id}/period`, token, {
        startDate: TODAY,
      })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should reject invalid UUID', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPut(app, '/habits/not-a-uuid/period', token, { startDate: TODAY })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
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
})
