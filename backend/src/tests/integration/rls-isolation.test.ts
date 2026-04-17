import { afterAll, beforeEach, describe, expect, it } from 'bun:test'
import { SQL } from 'bun'

import { testDb } from '../db.test.config'
import { tasks } from '../../db/schema/tasks/tasks'
import { createTestUser } from '../helpers/test-factories'

// appRuntimePool is shared across tests, closed once at the end.
const appRuntimePool = new SQL(process.env.APP_DATABASE_URL!)

afterAll(async () => {
  await appRuntimePool.close()
})

describe('RLS — tasks tenant isolation', () => {
  // Re-seeded before each test because the global beforeEach (setup.ts) cleans the DB.
  let userA: { id: string }
  let userB: { id: string }
  let taskOfA: { id: string }

  beforeEach(async () => {
    // Global beforeEach already ran cleanDatabase, so we just seed fresh data.
    userA = await createTestUser('rls-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-b@test.local', 'Azerty123!')

    const [inserted] = await testDb
      .insert(tasks)
      .values({ userId: userA.id, title: 'A private task', status: 'inbox' })
      .returning()
    taskOfA = inserted!
  })

  it('raw app_runtime query with user B context cannot see user A task', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM tasks`
    })
    const ids = (rows as Array<{ id: string }>).map((r) => r.id)
    expect(ids).not.toContain(taskOfA.id)
  })

  it('raw app_runtime query with user A context sees user A task', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userA.id}, true)`
      return tx`SELECT id FROM tasks WHERE id = ${taskOfA.id}::uuid`
    })
    expect((rows as Array<{ id: string }>).map((r) => r.id)).toEqual([taskOfA.id])
  })

  it('raw app_runtime query with NO user context sees zero rows', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      return tx`SELECT id FROM tasks`
    })
    expect((rows as Array<{ id: string }>).length).toBe(0)
  })

  it('app_runtime cannot INSERT a task for another user (WITH CHECK enforcement)', async () => {
    let threw = false
    try {
      await appRuntimePool.begin(async (tx) => {
        await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
        await tx`INSERT INTO tasks (id, user_id, title, status) VALUES (gen_random_uuid(), ${userA.id}::uuid, 'B forges for A', 'inbox')`
      })
    } catch {
      threw = true
    }
    expect(threw).toBe(true)
  })
})
