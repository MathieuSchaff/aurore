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

function authPost(app: Hono<AppEnv>, path: string, token: string, body: object) {
  return app.request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
}

function authGet(app: Hono<AppEnv>, path: string, token: string) {
  return app.request(path, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

async function createHabit(app: Hono<AppEnv>, token: string, name = 'Méditation') {
  const res = await authPost(app, '/habits', token, { name })
  const data = await res.json()
  return data.data as { id: string }
}

const TODAY = '2026-03-06'

// ── Tests ────────────────────────────────────────────────────────────

describe('Logs Routes', () => {
  let app: Hono<AppEnv>

  beforeEach(() => {
    app = createTestApp()
  })

  // ━━━ POST /logs/habit-check ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('POST /logs/habit-check', () => {
    it('should log a habit check without products', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPost(app, '/logs/habit-check', token, {
        habitId: habit.id,
        scheduledDate: TODAY,
        status: 'done',
      })

      expect(res.status).toBe(HTTP_STATUS.CREATED)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.status).toBe('done')
      expect(data.data.habitId).toBe(habit.id)
    })

    it('should log a skipped habit check', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPost(app, '/logs/habit-check', token, {
        habitId: habit.id,
        scheduledDate: TODAY,
        status: 'skipped',
      })

      expect(res.status).toBe(HTTP_STATUS.CREATED)
      const data = await res.json()
      expect(data.data.status).toBe('skipped')
    })

    it('should log a habit check with actualTime', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPost(app, '/logs/habit-check', token, {
        habitId: habit.id,
        scheduledDate: TODAY,
        status: 'done',
        actualTime: '08:30',
      })

      expect(res.status).toBe(HTTP_STATUS.CREATED)
      const data = await res.json()
      expect(data.data.actualTime).toBe('08:30')
    })

    it('should upsert on re-log same habit+date', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      await authPost(app, '/logs/habit-check', token, {
        habitId: habit.id,
        scheduledDate: TODAY,
        status: 'skipped',
      })
      const res = await authPost(app, '/logs/habit-check', token, {
        habitId: habit.id,
        scheduledDate: TODAY,
        status: 'done',
      })

      expect(res.status).toBe(HTTP_STATUS.CREATED)
      const data = await res.json()
      expect(data.data.status).toBe('done')
    })

    it('should reject invalid status (pending)', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPost(app, '/logs/habit-check', token, {
        habitId: habit.id,
        scheduledDate: TODAY,
        status: 'pending',
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject invalid scheduledDate format', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      const res = await authPost(app, '/logs/habit-check', token, {
        habitId: habit.id,
        scheduledDate: '06/03/2026',
        status: 'done',
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject missing required fields', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/logs/habit-check', token, {
        scheduledDate: TODAY,
        status: 'done',
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/logs/habit-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId: '00000000-0000-0000-0000-000000000001', scheduledDate: TODAY, status: 'done' }),
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  // ━━━ POST /logs/wellbeing ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('POST /logs/wellbeing', () => {
    it('should log a wellbeing metric', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/logs/wellbeing', token, {
        metric: 'energy',
        value: 4,
      })

      expect(res.status).toBe(HTTP_STATUS.CREATED)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.metric).toBe('energy')
      expect(Number(data.data.value)).toBe(4)
    })

    it('should log with all optional fields', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/logs/wellbeing', token, {
        metric: 'sleep',
        value: 7.5,
        unit: 'h',
        note: 'Bien dormi',
        loggedAt: new Date().toISOString(),
      })

      expect(res.status).toBe(HTTP_STATUS.CREATED)
      const data = await res.json()
      expect(data.data.metric).toBe('sleep')
      expect(Number(data.data.value)).toBe(7.5)
      expect(data.data.note).toBe('Bien dormi')
    })

    it('should accept all valid metric types', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const metrics = ['energy', 'sleep', 'fog', 'stress', 'mood', 'skin', 'pain'] as const

      for (const metric of metrics) {
        const res = await authPost(app, '/logs/wellbeing', token, { metric, value: 3 })
        expect(res.status).toBe(HTTP_STATUS.CREATED)
      }
    })

    it('should reject value above 100', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/logs/wellbeing', token, {
        metric: 'energy',
        value: 101,
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject value below 0', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/logs/wellbeing', token, {
        metric: 'energy',
        value: -1,
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject invalid metric', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/logs/wellbeing', token, {
        metric: 'happiness',
        value: 5,
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject missing metric', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/logs/wellbeing', token, { value: 5 })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/logs/wellbeing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric: 'energy', value: 4 }),
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  // ━━━ GET /logs/today ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('GET /logs/today', () => {
    it('should return empty today logs for a fresh user', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authGet(app, `/logs/today?date=${TODAY}`, token)

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.date).toBe(TODAY)
      expect(data.data.habitChecks).toEqual([])
      expect(data.data.wellbeingLogs).toEqual([])
    })

    it('should return today habit checks after logging', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const habit = await createHabit(app, token)

      await authPost(app, '/logs/habit-check', token, {
        habitId: habit.id,
        scheduledDate: TODAY,
        status: 'done',
      })

      const res = await authGet(app, `/logs/today?date=${TODAY}`, token)
      const data = await res.json()
      expect(data.data.habitChecks).toHaveLength(1)
      expect(data.data.habitChecks[0].status).toBe('done')
    })

    it('should return today wellbeing logs after logging', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      await authPost(app, '/logs/wellbeing', token, { metric: 'mood', value: 5 })

      const res = await authGet(app, `/logs/today?date=${TODAY}`, token)
      const data = await res.json()
      expect(data.data.wellbeingLogs).toHaveLength(1)
      expect(data.data.wellbeingLogs[0].metric).toBe('mood')
    })

    it('should reject missing date query param', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authGet(app, '/logs/today', token)

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject invalid date format', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authGet(app, '/logs/today?date=06-03-2026', token)

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should only return logs for the authenticated user', async () => {
      const tokenToto = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const tokenAlice = await setupAndLogin(app, TEST_CREDENTIALS.alice)

      const habitToto = await createHabit(app, tokenToto)
      await authPost(app, '/logs/habit-check', tokenToto, {
        habitId: habitToto.id,
        scheduledDate: TODAY,
        status: 'done',
      })

      const res = await authGet(app, `/logs/today?date=${TODAY}`, tokenAlice)
      const data = await res.json()
      expect(data.data.habitChecks).toEqual([])
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request(`/logs/today?date=${TODAY}`)
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })
})
