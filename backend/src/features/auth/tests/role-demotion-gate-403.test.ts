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
import { ANY_UUID, authDelete, authPatch } from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import {
  createTestAdminUser,
  createTestContributorUser,
} from '../../../tests/helpers/test-factories'

// Demotion does not revoke the access token (~15min TTL), so a freshly demoted
// contributor still carries role:'contributor' in its JWT claim. The gates must
// source the role from the DB, else the demoted user keeps catalog/moderation
// powers until the next refresh.

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
    const res = await authPatch(app, `/api/products/${ANY_UUID}/quality`, token, {})
    await expectForbidden(res)
  })
})

// requireAdmin reads the context role, which withRlsContext overwrites with the DB row:
// a demoted admin must lose admin routes before its token expires
describe('requireAdmin reads the fresh DB role, not the stale JWT claim', () => {
  let app: TestApp
  let client: TestClient
  let token: string

  beforeAll(async () => {
    ;({ app, client } = await createTestEnv())
  })

  beforeEach(async () => {
    const { rawEmail, rawPassword } = TEST_CREDENTIALS.alice
    const admin = await createTestAdminUser(rawEmail, rawPassword)
    token = await login(client, rawEmail, rawPassword)
    await testDb.update(users).set({ role: 'user' }).where(eq(users.id, admin.id))
  })

  it('demoted admin is 403 on DELETE /products/:id', async () => {
    const res = await authDelete(app, `/api/products/${ANY_UUID}`, token)
    await expectForbidden(res)
  })
})
