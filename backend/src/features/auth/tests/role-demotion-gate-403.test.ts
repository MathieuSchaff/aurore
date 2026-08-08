import { beforeAll, beforeEach, describe, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { users } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestEnv,
  type TestApp,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectError } from '../../../tests/helpers/expectStatus'
import { login } from '../../../tests/helpers/login'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import { createTestContributorUser } from '../../../tests/helpers/test-factories'

// Demotion does not revoke the access token (~15min TTL), so a freshly demoted
// contributor still carries role:'contributor' in its JWT claim. The gates must
// source the role from the DB, else the demoted user keeps catalog/moderation
// powers until the next refresh.
const ANY_UUID = '019d0000-0000-7000-8000-00000000abcd'

async function expectForbidden(res: { status: number; json: () => Promise<unknown> }) {
  await expectError(res, HTTP_STATUS.FORBIDDEN, 'forbidden')
}

setupDbTests()

describe('Role gates read the fresh DB role, not the stale JWT claim', () => {
  let app: TestApp
  let client: TestClient
  let token: string

  beforeAll(async () => {
    ;({ app, client } = await createTestEnv())
  })

  beforeEach(async () => {
    const { rawEmail, rawPassword } = TEST_CREDENTIALS.toto
    const user = await createTestContributorUser(rawEmail, rawPassword)
    // Token minted while still contributor: this is the stale claim under test.
    token = await login(client, rawEmail, rawPassword)
    // Demote after the token was issued (simulates demoteToUser while the token is still valid).
    await testDb.update(users).set({ role: 'user' }).where(eq(users.id, user.id))
  })

  it('requireContentModerator: demoted user is 403 on GET /admin/moderation/catalog', async () => {
    const res = await app.request('/api/admin/moderation/catalog', withAuth(token))
    await expectForbidden(res)
  })

  it('requireCatalogWrite: demoted user is 403 on PATCH /products/:id/quality', async () => {
    const res = await app.request(`/api/products/${ANY_UUID}/quality`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: '{}',
    })
    await expectForbidden(res)
  })
})
