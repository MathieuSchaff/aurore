import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { securityEvents } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { expectRequiresAuth, expectRoleMatrix } from '../../../tests/helpers/authz-matrix'
import {
  createTestEnv,
  type TestApp,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectOk } from '../../../tests/helpers/expectStatus'
import { setupAndLoginAdmin } from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import { createTestUser } from '../../../tests/helpers/test-factories'

const LIST_PATH = '/api/admin/security-events'

function eventRow(userId: string, severity: 'high' | 'low', route: string) {
  return {
    userId,
    severity,
    eventType: 'javascript_url',
    field: 'bio',
    payload: 'javascript:alert(1)',
    route,
  }
}

setupDbTests()

describe('Admin security events: GET list (admin-only)', () => {
  let app: TestApp
  let client: TestClient
  let userId: string
  let adminToken: string

  beforeAll(async () => {
    ;({ app, client } = await createTestEnv())
  })

  beforeEach(async () => {
    const user = await createTestUser()
    userId = user.id
    adminToken = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)
  })

  // Security feed is an ops surface, not content moderation, so a contributor is denied.
  describe('authz', () => {
    expectRequiresAuth(() => app, { method: 'GET', path: LIST_PATH })
    expectRoleMatrix(
      () => app,
      { method: 'GET', path: LIST_PATH },
      {
        user: HTTP_STATUS.FORBIDDEN,
        contributor: HTTP_STATUS.FORBIDDEN,
        admin: HTTP_STATUS.OK,
      }
    )
  })

  it('admin GETs security events newest-first', async () => {
    const old = new Date(Date.now() - 60_000).toISOString()
    const recent = new Date().toISOString()
    await testDb.insert(securityEvents).values([
      { ...eventRow(userId, 'low', '/old'), createdAt: old },
      { ...eventRow(userId, 'high', '/recent'), createdAt: recent },
    ])

    const body = await expectOk(
      client.admin['security-events'].$get({ query: {} }, withAuth(adminToken))
    )
    expect(body.items[0]?.route).toBe('/recent')
    expect(body.items[1]?.route).toBe('/old')
  })

  it('admin GET filters by severity=high', async () => {
    await testDb
      .insert(securityEvents)
      .values([eventRow(userId, 'high', '/h'), eventRow(userId, 'low', '/l')])

    const body = await expectOk(
      client.admin['security-events'].$get({ query: { severity: 'high' } }, withAuth(adminToken))
    )
    expect(body.items.length).toBe(1)
    expect(body.items[0]?.severity).toBe('high')
  })

  it('admin GET truncated payload is surfaced as-is', async () => {
    await testDb.insert(securityEvents).values(eventRow(userId, 'high', '/x'))

    const body = await expectOk(
      client.admin['security-events'].$get({ query: {} }, withAuth(adminToken))
    )
    expect(body.items[0]?.payload).toBe('javascript:alert(1)')
  })
})
