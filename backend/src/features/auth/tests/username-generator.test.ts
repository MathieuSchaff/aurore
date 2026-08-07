import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'bun:test'

import type { Email, HashedPassword } from '@aurore/shared'

import { profiles } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { getProfile } from '../../profile'
import { createProfile, createUser } from '../user.utils'
import { generateUniqueUsername } from '../username-generator'

setupDbTests()

const HANDLE_RE = /^[a-z]+-[a-z]+-\d+$/

// createUser/createProfile/generateUniqueUsername run inside the signup tx, so open a
// real one here instead of handing them the root test handle.
const genUsername = () => testDb.transaction((tx) => generateUniqueUsername(tx))

async function newUser() {
  const email = `gen-${randomUUID()}@example.com` as Email
  const passwordHash = (await Bun.password.hash('Secret123!')) as HashedPassword
  return testDb.transaction((tx) => createUser(tx, { email, passwordHash }))
}

describe('username-generator', () => {
  it('returns a friendly, URL-safe handle under 32 chars', async () => {
    const handle = await genUsername()
    expect(handle).toMatch(HANDLE_RE)
    expect(handle.length).toBeLessThanOrEqual(32)
  })

  it('createProfile assigns a non-null pseudonym', async () => {
    const user = await newUser()
    await testDb.transaction((tx) => createProfile(tx, user.id))
    const profile = await testDb.transaction((tx) => getProfile(tx, user.id))
    expect(profile?.username).toMatch(HANDLE_RE)
  })

  it('skips an already-taken handle', async () => {
    const taken = await genUsername()
    const user = await newUser()
    await testDb.insert(profiles).values({ userId: user.id, username: taken })
    for (let i = 0; i < 40; i++) {
      expect(await genUsername()).not.toBe(taken)
    }
  })
})
