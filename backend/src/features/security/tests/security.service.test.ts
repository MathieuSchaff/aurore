import { beforeEach, describe, expect, it } from 'bun:test'

import { securityEvents } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { cleanDatabase } from '../../../tests/helpers/db-cleaner'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { isUserBlocked, logSecurityEvent, type SecurityEventInput } from '../security.service'

let userId: string

const HIGH_EVENT = {
  severity: 'high',
  eventType: 'javascript_url',
  field: 'url',
  payload: 'javascript:alert(1)',
  route: '/products',
} satisfies Omit<SecurityEventInput, 'userId'>

function logEvent(overrides: Partial<SecurityEventInput> = {}) {
  return logSecurityEvent(testDb, { userId, ...HIGH_EVENT, ...overrides })
}

// isUserBlocked reads inside the request RLS transaction, so open a real one here
// instead of handing it the root test handle.
const checkBlocked = (id: string) => testDb.transaction((tx) => isUserBlocked(tx, id))

beforeEach(async () => {
  await cleanDatabase()
  const user = await createTestUser()
  userId = user.id
})

describe('logSecurityEvent', () => {
  it('inserts a high severity event', async () => {
    await logEvent()

    const rows = await testDb.select().from(securityEvents)
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ userId, severity: 'high', eventType: 'javascript_url' })
  })

  it('truncates payload to 200 chars', async () => {
    await logEvent({ payload: 'javascript:'.padEnd(300, 'x') })

    const [row] = await testDb.select().from(securityEvents)
    expect(row?.payload).toHaveLength(200)
    expect(row?.payload.startsWith('javascript:')).toBe(true)
  })
})

describe('isUserBlocked', () => {
  it('returns false with no events', async () => {
    expect(await checkBlocked(userId)).toBe(false)
  })

  it('returns false with 2 high events', async () => {
    await logEvent()
    await logEvent({ eventType: 'html_injection', field: 'inci', payload: '<script>' })

    expect(await checkBlocked(userId)).toBe(false)
  })

  it('returns true after 3 high events', async () => {
    for (let i = 0; i < 3; i++) await logEvent()

    expect(await checkBlocked(userId)).toBe(true)
  })

  it('does not count low severity events toward block threshold', async () => {
    for (let i = 0; i < 5; i++) {
      await logEvent({ severity: 'low', eventType: 'http_url', payload: 'http://example.com' })
    }

    expect(await checkBlocked(userId)).toBe(false)
  })

  it('does not count events from other users', async () => {
    const otherUser = await createTestUser('other@test.com', 'password123')

    for (let i = 0; i < 3; i++) await logEvent({ userId: otherUser.id })

    expect(await checkBlocked(userId)).toBe(false)
  })
})
