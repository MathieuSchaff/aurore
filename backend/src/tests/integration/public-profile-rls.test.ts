/**
 * Regression test: user_dermo_profiles_select_public + profiles_select_public
 * must let an anonymous app_runtime caller see public profiles but never leak
 * ones that are not public. Service-level tests bypass RLS (testDb = owner pool); this
 * file binds to the real app_runtime role so the policies are exercised.
 */
import { describe, expect, it } from 'bun:test'

import { eq } from 'drizzle-orm'

import { profiles, userDermoProfiles } from '../../db/schema/auth/users'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb } from '../helpers/app-runtime-db'
import { createTestUser } from '../helpers/test-factories'

const appRuntimeDb = await createAppRuntimeDb()

setupDbTests()

describe('public-surface RLS: anonymous app_runtime', () => {
  it('sees only public profiles and their dermo rows', async () => {
    const alice = await createTestUser('alice-rls@test.local', 'Azerty123!')
    const bob = await createTestUser('bob-rls@test.local', 'Azerty123!')

    // Admin-pool seeds: flip alice to public, leave bob private.
    await testDb
      .update(profiles)
      .set({ username: 'alice-pub', profilePublic: true })
      .where(eq(profiles.userId, alice.id))
    await testDb.update(profiles).set({ username: 'bob-priv' }).where(eq(profiles.userId, bob.id))

    await testDb.insert(userDermoProfiles).values([
      { userId: alice.id, skinTypes: ['peau-mixte'], fitzpatrickType: 3 },
      { userId: bob.id, skinTypes: ['peau-grasse'], fitzpatrickType: 2 },
    ])

    const visibleProfiles = await appRuntimeDb.select().from(profiles)
    expect(visibleProfiles.map((p) => p.userId)).toEqual([alice.id])
    expect(visibleProfiles[0]?.username).toBe('alice-pub')

    const visibleDermo = await appRuntimeDb.select().from(userDermoProfiles)
    expect(visibleDermo.map((d) => d.userId)).toEqual([alice.id])
    expect(visibleDermo[0]?.skinTypes).toEqual(['peau-mixte'])
  })

  // Regression: user_dermo_profiles_select_public must filter
  // p.forced_private_by_admin = FALSE so admin-forced privacy hides dermo
  // even when the user's own profile_public flag is still true.
  it('hides dermo when admin force-privates an otherwise public profile', async () => {
    const alice = await createTestUser('alice-fp-dermo@test.local', 'Azerty123!')

    await testDb
      .update(profiles)
      .set({ username: 'alice-fp', profilePublic: true })
      .where(eq(profiles.userId, alice.id))
    await testDb.insert(userDermoProfiles).values({
      userId: alice.id,
      skinTypes: ['peau-sensible'],
    })

    let visible = await appRuntimeDb.select().from(userDermoProfiles)
    expect(visible).toHaveLength(1)

    // Admin force-privates the profile. profilePublic stays true; the
    // forced_private_by_admin filter in the dermo policy must hide the row.
    await testDb
      .update(profiles)
      .set({ forcedPrivateByAdmin: true })
      .where(eq(profiles.userId, alice.id))

    visible = await appRuntimeDb.select().from(userDermoProfiles)
    expect(visible).toHaveLength(0)
  })

  it('hides dermo when the joined profile flips back to private', async () => {
    const alice = await createTestUser('alice-rls@test.local', 'Azerty123!')

    await testDb
      .update(profiles)
      .set({ username: 'alice-pub', profilePublic: true })
      .where(eq(profiles.userId, alice.id))
    await testDb.insert(userDermoProfiles).values({
      userId: alice.id,
      skinTypes: ['peau-sensible'],
    })

    let visible = await appRuntimeDb.select().from(userDermoProfiles)
    expect(visible).toHaveLength(1)

    await testDb.update(profiles).set({ profilePublic: false }).where(eq(profiles.userId, alice.id))

    visible = await appRuntimeDb.select().from(userDermoProfiles)
    expect(visible).toHaveLength(0)
  })
})
