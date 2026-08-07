import { eq } from 'drizzle-orm'

import { profiles } from '../../../db/schema/auth/users'
import { testDb } from '../../../tests/db.test.config'
import type { TestApp } from '../../../tests/helpers/createTestClient'
import { authPatch, setupAndLogin } from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import { createTestUser } from '../../../tests/helpers/test-factories'

// Owner carrying every maskable field, with all privacy flags still off: each
// caller opens only the flags its own case is about, so an unopened flag that
// leaks data fails the test instead of reading as an empty column.
export async function seedProfileOwner(app: TestApp, username: string) {
  const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
  await authPatch(app, '/api/profile', token, {
    username,
    bio: 'My bio',
    avatarUrl: 'https://example.com/me.png',
    links: [{ label: 'IG', url: 'https://instagram.com/me' }],
  })
  await authPatch(app, '/api/profile/dermo', token, {
    skinTypes: ['peau-mixte'],
    fitzpatrickType: 3,
    skinConcerns: ['rosacee'],
  })
  return token
}

// The public reviews/posts trails gate on the username plus the two
// profile-level privacy columns, so those three make the whole author fixture.
export async function seedPublicAuthor(
  username: string,
  { profilePublic = true, forcedPrivateByAdmin = false } = {}
) {
  const owner = await createTestUser(`${username}@social.test`, 'Azerty123!')
  await testDb
    .update(profiles)
    .set({ username, profilePublic, forcedPrivateByAdmin })
    .where(eq(profiles.userId, owner.id))
  return owner
}
