import type { TestClient } from '../../../tests/helpers/createTestClient'
import { login } from '../../../tests/helpers/login'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import { createTestAdminUser, createTestUser } from '../../../tests/helpers/test-factories'

// The three ban suites need the same pair: the actor being banned, plus the admin
// row that `user_bans.banned_by` points at. `makeActor` swaps in a privileged
// factory when the suite needs the actor to clear an upstream role gate first.
export async function seedBanActors(
  client: TestClient,
  makeActor: typeof createTestUser = createTestUser
) {
  const { rawEmail, rawPassword } = TEST_CREDENTIALS.toto
  const admin = TEST_CREDENTIALS.admin

  const user = await makeActor(rawEmail, rawPassword)
  const adminUser = await createTestAdminUser(admin.rawEmail, admin.rawPassword)

  return {
    userId: user.id,
    adminId: adminUser.id,
    token: await login(client, rawEmail, rawPassword),
  }
}
