import { describe, expect, it } from 'bun:test'

import type { UserPreferences } from '@aurore/shared'

import { sql } from 'drizzle-orm'

import { userPreferences } from '../../db/schema/auth/user-preferences'
import { jwtAuthRoutes } from '../../features/auth/routes'
import { profileRoute } from '../../features/profile/routes'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb } from '../helpers/app-runtime-db'
import { expectOk } from '../helpers/expectStatus'
import { createRlsApp, loginViaRlsApp } from '../helpers/rls-app'
import { createTestUser } from '../helpers/test-factories'

const runtime = await createAppRuntimeDb()
setupDbTests()

describe('concurrent preference PATCHes', () => {
  it.each([false, true])(
    'preserves both deltas when a preferences row exists: %s',
    async (existing) => {
      const email = 'parallel-preferences@seed.local'
      const password = 'Passphrase123!'
      const user = await createTestUser(email, password)
      if (existing) {
        await testDb.insert(userPreferences).values({
          userId: user.id,
          criteriaWeights: {
            tolerance: 1,
            efficacy: 1,
            sensoriality: 7,
            stability: 1,
            mixability: 1,
            valueForMoney: 1,
          },
        })
      }
      const app = createRlsApp(runtime)
        .route('/api/auth', jwtAuthRoutes)
        .route('/api/profile', profileRoute)
      const token = await loginViaRlsApp(app, email, password, '/api/auth')
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      const ready = Promise.withResolvers<void>()
      const release = Promise.withResolvers<void>()
      const blocker = testDb.transaction(async (tx) => {
        await tx.execute(sql`LOCK TABLE ${userPreferences} IN SHARE MODE`)
        ready.resolve()
        await release.promise
      })
      await Promise.race([ready.promise, blocker])
      const requests = [{ tolerance: 4 }, { efficacy: 5 }].map((criteriaWeights) =>
        app.request('/api/profile/preferences', {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ criteriaWeights }),
        })
      )
      try {
        const deadline = Date.now() + 3000
        while (true) {
          const [row] = await testDb.execute(sql`
          SELECT count(*)::int AS count FROM pg_stat_activity
          WHERE datname = current_database() AND wait_event_type = 'Lock'
            AND query ILIKE '%insert into "user_preferences"%'
        `)
          if (Number(row?.count) === 2) break
          if (Date.now() >= deadline)
            throw new Error('both PATCHes did not reach the write barrier')
          await Bun.sleep(10)
        }
        release.resolve()
        await blocker
        const responses = await Promise.all(requests)
        expect(responses.map((response) => response.status)).toEqual([200, 200])
        const saved = await expectOk<UserPreferences>(
          app.request('/api/profile/preferences', { headers })
        )
        expect(saved.criteriaWeights).toEqual({
          tolerance: 4,
          efficacy: 5,
          sensoriality: existing ? 7 : 1,
          stability: 1,
          mixability: 1,
          valueForMoney: 1,
        })
      } finally {
        release.resolve()
        await Promise.allSettled([blocker, ...requests])
      }
    }
  )
})
