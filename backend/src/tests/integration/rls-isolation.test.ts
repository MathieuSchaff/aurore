import { afterAll, beforeEach, describe, expect, it } from 'bun:test'
import { SQL } from 'bun'

import { userBans } from '../../db/schema/auth/user-bans'
import { userPreferences } from '../../db/schema/auth/user-preferences'
import { profiles, userDermoProfiles } from '../../db/schema/auth/users'
import {
  habitChecks,
  habitPeriods,
  habitProducts,
  habitReminders,
  habitSchedules,
  habits,
  habitTimings,
} from '../../db/schema/habits/habits'
import { habitCheckProducts, wellbeingLogs } from '../../db/schema/habits/logs'
import { ingredients } from '../../db/schema/ingredients/ingredients'
import { userIngredientAnalysisScore } from '../../db/schema/ingredients/user-ingredient-analysis-score'
import { products } from '../../db/schema/products/products'
import { purchases } from '../../db/schema/products/purchases'
import { userProductReviews, userProducts } from '../../db/schema/products/user-products'
import { subtasks, tasks } from '../../db/schema/tasks/tasks'
import { testDb } from '../db.test.config'
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

describe('RLS — habits tenant isolation', () => {
  let userA: { id: string }
  let userB: { id: string }
  let habitOfA: { id: string }

  beforeEach(async () => {
    userA = await createTestUser('rls-habits-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-habits-b@test.local', 'Azerty123!')

    const [inserted] = await testDb
      .insert(habits)
      .values({ userId: userA.id, name: 'A private habit', category: 'health' })
      .returning()
    habitOfA = inserted!
  })

  it('raw app_runtime query with user B context cannot see user A habit', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM habits`
    })
    const ids = (rows as Array<{ id: string }>).map((r) => r.id)
    expect(ids).not.toContain(habitOfA.id)
  })

  it('raw app_runtime query with user A context sees user A habit', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userA.id}, true)`
      return tx`SELECT id FROM habits WHERE id = ${habitOfA.id}::uuid`
    })
    expect((rows as Array<{ id: string }>).map((r) => r.id)).toEqual([habitOfA.id])
  })

  it('raw app_runtime query with NO user context sees zero rows', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      return tx`SELECT id FROM habits`
    })
    expect((rows as Array<{ id: string }>).length).toBe(0)
  })

  it('app_runtime cannot INSERT a habit for another user (WITH CHECK enforcement)', async () => {
    let threw = false
    try {
      await appRuntimePool.begin(async (tx) => {
        await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
        await tx`INSERT INTO habits (id, user_id, name, category) VALUES (gen_random_uuid(), ${userA.id}::uuid, 'B forges for A', 'health')`
      })
    } catch {
      threw = true
    }
    expect(threw).toBe(true)
  })
})

describe('RLS — habit_checks tenant isolation', () => {
  let userA: { id: string }
  let userB: { id: string }
  let habitCheckOfA: { id: string }

  beforeEach(async () => {
    userA = await createTestUser('rls-hc-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-hc-b@test.local', 'Azerty123!')

    // Need a parent habit first (owned by userA, bypassing RLS via testDb superuser)
    const [parentHabit] = await testDb
      .insert(habits)
      .values({ userId: userA.id, name: 'Parent habit', category: 'health' })
      .returning()

    const [inserted] = await testDb
      .insert(habitChecks)
      .values({
        userId: userA.id,
        habitId: parentHabit!.id,
        scheduledDate: '2026-01-01',
        status: 'pending',
      })
      .returning()
    habitCheckOfA = inserted!
  })

  it('raw app_runtime query with user B context cannot see user A habit_check', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM habit_checks`
    })
    const ids = (rows as Array<{ id: string }>).map((r) => r.id)
    expect(ids).not.toContain(habitCheckOfA.id)
  })
})

describe('RLS — wellbeing_logs tenant isolation', () => {
  let userA: { id: string }
  let userB: { id: string }
  let logOfA: { id: string }

  beforeEach(async () => {
    userA = await createTestUser('rls-wl-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-wl-b@test.local', 'Azerty123!')

    const [inserted] = await testDb
      .insert(wellbeingLogs)
      .values({ userId: userA.id, metric: 'energy', value: '7' })
      .returning()
    logOfA = inserted!
  })

  it('raw app_runtime query with user B context cannot see user A wellbeing_log', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM wellbeing_logs`
    })
    const ids = (rows as Array<{ id: string }>).map((r) => r.id)
    expect(ids).not.toContain(logOfA.id)
  })
})

describe('RLS — user_products tenant isolation', () => {
  let userA: { id: string }
  let userB: { id: string }
  let userProductOfA: { id: string }

  beforeEach(async () => {
    userA = await createTestUser('rls-up-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-up-b@test.local', 'Azerty123!')

    // Insert a product (public catalogue record owned by userA)
    const [product] = await testDb
      .insert(products)
      .values({
        createdBy: userA.id,
        name: 'Test Product RLS',
        brand: 'Brand',
        unit: 'ml',
        slug: `test-product-rls-${userA.id}`,
      })
      .returning()

    const [inserted] = await testDb
      .insert(userProducts)
      .values({ userId: userA.id, productId: product!.id, status: 'in_stock' })
      .returning()
    userProductOfA = inserted!
  })

  it('raw app_runtime query with user B context cannot see user A user_product', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM user_products`
    })
    const ids = (rows as Array<{ id: string }>).map((r) => r.id)
    expect(ids).not.toContain(userProductOfA.id)
  })
})

describe('RLS — user_ingredient_analysis_score tenant isolation', () => {
  let userA: { id: string }
  let userB: { id: string }
  let scoreOfA: { id: string }

  beforeEach(async () => {
    userA = await createTestUser('rls-uias-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-uias-b@test.local', 'Azerty123!')

    // Insert an ingredient (public catalogue record owned by userA)
    const [ingredient] = await testDb
      .insert(ingredients)
      .values({
        createdBy: userA.id,
        name: 'Test Ingredient RLS',
        slug: `test-ing-rls-${userA.id}`,
      })
      .returning()

    const [inserted] = await testDb
      .insert(userIngredientAnalysisScore)
      .values({ userId: userA.id, ingredientId: ingredient!.id })
      .returning()
    scoreOfA = inserted!
  })

  it('raw app_runtime query with user B context cannot see user A ingredient score', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM user_ingredient_analysis_score`
    })
    const ids = (rows as Array<{ id: string }>).map((r) => r.id)
    expect(ids).not.toContain(scoreOfA.id)
  })
})

describe('RLS — user_preferences tenant isolation', () => {
  let userA: { id: string }
  let userB: { id: string }

  beforeEach(async () => {
    userA = await createTestUser('rls-pref-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-pref-b@test.local', 'Azerty123!')
  })

  it('raw app_runtime query with user B context cannot see user A preferences', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT user_id FROM user_preferences`
    })
    const ids = (rows as Array<{ user_id: string }>).map((r) => r.user_id)
    expect(ids).not.toContain(userA.id)
  })
})

describe('RLS — profiles tenant isolation', () => {
  let userA: { id: string }
  let userB: { id: string }

  beforeEach(async () => {
    userA = await createTestUser('rls-prof-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-prof-b@test.local', 'Azerty123!')
  })

  it('raw app_runtime query with user B context cannot see user A profile', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT user_id FROM profiles`
    })
    const ids = (rows as Array<{ user_id: string }>).map((r) => r.user_id)
    expect(ids).not.toContain(userA.id)
  })
})

describe('RLS — user_dermo_profiles tenant isolation', () => {
  let userA: { id: string }
  let userB: { id: string }

  beforeEach(async () => {
    userA = await createTestUser('rls-dermo-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-dermo-b@test.local', 'Azerty123!')

    // Insert a dermo profile for userA
    await testDb.insert(userDermoProfiles).values({ userId: userA.id })
  })

  it('raw app_runtime query with user B context cannot see user A dermo profile', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT user_id FROM user_dermo_profiles`
    })
    const ids = (rows as Array<{ user_id: string }>).map((r) => r.user_id)
    expect(ids).not.toContain(userA.id)
  })
})

describe('RLS — user_bans tenant isolation', () => {
  let userA: { id: string }
  let userB: { id: string }
  let banOfA: { id: string }

  beforeEach(async () => {
    userA = await createTestUser('rls-ban-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-ban-b@test.local', 'Azerty123!')

    // userB bans userA (banned_by = userB)
    const [inserted] = await testDb
      .insert(userBans)
      .values({
        userId: userA.id,
        bannedBy: userB.id,
        scope: 'product_edit',
        reason: 'test ban',
      })
      .returning()
    banOfA = inserted!
  })

  it('raw app_runtime query with user B context cannot see user A ban record', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM user_bans`
    })
    const ids = (rows as Array<{ id: string }>).map((r) => r.id)
    expect(ids).not.toContain(banOfA.id)
  })
})

describe('RLS — subtasks (owned via tasks)', () => {
  let userA: { id: string }
  let userB: { id: string }
  let childId: string

  beforeEach(async () => {
    userA = await createTestUser('rls-sub-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-sub-b@test.local', 'Azerty123!')

    const [parent] = await testDb
      .insert(tasks)
      .values({ userId: userA.id, title: 'A parent task', status: 'inbox' })
      .returning()
    const [child] = await testDb
      .insert(subtasks)
      .values({ taskId: parent!.id, title: 'A subtask', order: 0 })
      .returning()
    childId = child!.id
  })

  it('user B cannot see user A subtask via app_runtime pool', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM subtasks WHERE id = ${childId}::uuid`
    })
    expect((rows as Array<{ id: string }>).length).toBe(0)
  })
})

describe('RLS — habit_products (owned via habits)', () => {
  let userA: { id: string }
  let userB: { id: string }
  let childId: string

  beforeEach(async () => {
    userA = await createTestUser('rls-hp-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-hp-b@test.local', 'Azerty123!')

    const [parent] = await testDb
      .insert(habits)
      .values({ userId: userA.id, name: 'A habit', category: 'health' })
      .returning()
    const [product] = await testDb
      .insert(products)
      .values({
        createdBy: userA.id,
        name: 'Test RLS HP',
        brand: 'Brand',
        unit: 'ml',
        slug: `rls-hp-${userA.id}`,
      })
      .returning()
    const [child] = await testDb
      .insert(habitProducts)
      .values({ habitId: parent!.id, productId: product!.id })
      .returning()
    childId = child!.id
  })

  it('user B cannot see user A habit_product via app_runtime pool', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM habit_products WHERE id = ${childId}::uuid`
    })
    expect((rows as Array<{ id: string }>).length).toBe(0)
  })
})

describe('RLS — habit_schedules (owned via habits)', () => {
  let userA: { id: string }
  let userB: { id: string }
  let childId: string

  beforeEach(async () => {
    userA = await createTestUser('rls-hs-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-hs-b@test.local', 'Azerty123!')

    const [parent] = await testDb
      .insert(habits)
      .values({ userId: userA.id, name: 'A habit', category: 'health' })
      .returning()
    const [child] = await testDb
      .insert(habitSchedules)
      .values({ habitId: parent!.id, frequency: 'daily' })
      .returning()
    childId = child!.id
  })

  it('user B cannot see user A habit_schedule via app_runtime pool', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM habit_schedules WHERE id = ${childId}::uuid`
    })
    expect((rows as Array<{ id: string }>).length).toBe(0)
  })
})

describe('RLS — habit_periods (owned via habits)', () => {
  let userA: { id: string }
  let userB: { id: string }
  let childId: string

  beforeEach(async () => {
    userA = await createTestUser('rls-hperiod-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-hperiod-b@test.local', 'Azerty123!')

    const [parent] = await testDb
      .insert(habits)
      .values({ userId: userA.id, name: 'A habit', category: 'health' })
      .returning()
    const [child] = await testDb
      .insert(habitPeriods)
      .values({ habitId: parent!.id, startDate: '2026-01-01', endDate: '2026-12-31' })
      .returning()
    childId = child!.id
  })

  it('user B cannot see user A habit_period via app_runtime pool', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM habit_periods WHERE id = ${childId}::uuid`
    })
    expect((rows as Array<{ id: string }>).length).toBe(0)
  })
})

describe('RLS — habit_timings (owned via habits → habit_schedules)', () => {
  let userA: { id: string }
  let userB: { id: string }
  let childId: string

  beforeEach(async () => {
    userA = await createTestUser('rls-ht-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-ht-b@test.local', 'Azerty123!')

    const [habit] = await testDb
      .insert(habits)
      .values({ userId: userA.id, name: 'A habit', category: 'health' })
      .returning()
    const [schedule] = await testDb
      .insert(habitSchedules)
      .values({ habitId: habit!.id, frequency: 'daily' })
      .returning()
    const [child] = await testDb
      .insert(habitTimings)
      .values({ scheduleId: schedule!.id, time: '08:00' })
      .returning()
    childId = child!.id
  })

  it('user B cannot see user A habit_timing via app_runtime pool', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM habit_timings WHERE id = ${childId}::uuid`
    })
    expect((rows as Array<{ id: string }>).length).toBe(0)
  })
})

describe('RLS — habit_reminders (owned via habits → habit_schedules → habit_timings)', () => {
  let userA: { id: string }
  let userB: { id: string }
  let childId: string

  beforeEach(async () => {
    userA = await createTestUser('rls-hr-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-hr-b@test.local', 'Azerty123!')

    const [habit] = await testDb
      .insert(habits)
      .values({ userId: userA.id, name: 'A habit', category: 'health' })
      .returning()
    const [schedule] = await testDb
      .insert(habitSchedules)
      .values({ habitId: habit!.id, frequency: 'daily' })
      .returning()
    const [timing] = await testDb
      .insert(habitTimings)
      .values({ scheduleId: schedule!.id, time: '08:00' })
      .returning()
    const [child] = await testDb
      .insert(habitReminders)
      .values({ timingId: timing!.id, beforeMinutes: 60 })
      .returning()
    childId = child!.id
  })

  it('user B cannot see user A habit_reminder via app_runtime pool', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM habit_reminders WHERE id = ${childId}::uuid`
    })
    expect((rows as Array<{ id: string }>).length).toBe(0)
  })
})

describe('RLS — habit_check_products (owned via habit_checks)', () => {
  let userA: { id: string }
  let userB: { id: string }
  let childId: string

  beforeEach(async () => {
    userA = await createTestUser('rls-hcp-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-hcp-b@test.local', 'Azerty123!')

    const [habit] = await testDb
      .insert(habits)
      .values({ userId: userA.id, name: 'A habit', category: 'health' })
      .returning()
    const [product] = await testDb
      .insert(products)
      .values({
        createdBy: userA.id,
        name: 'Test RLS HCP',
        brand: 'Brand',
        unit: 'ml',
        slug: `rls-hcp-${userA.id}`,
      })
      .returning()
    const [habitProduct] = await testDb
      .insert(habitProducts)
      .values({ habitId: habit!.id, productId: product!.id })
      .returning()
    const [check] = await testDb
      .insert(habitChecks)
      .values({
        userId: userA.id,
        habitId: habit!.id,
        scheduledDate: '2026-01-01',
        status: 'pending',
      })
      .returning()
    const [child] = await testDb
      .insert(habitCheckProducts)
      .values({
        checkId: check!.id,
        habitProductId: habitProduct!.id,
        productId: product!.id,
      })
      .returning()
    childId = child!.id
  })

  it('user B cannot see user A habit_check_product via app_runtime pool', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM habit_check_products WHERE id = ${childId}::uuid`
    })
    expect((rows as Array<{ id: string }>).length).toBe(0)
  })
})

describe('RLS — user_product_reviews (owned via user_products)', () => {
  let userA: { id: string }
  let userB: { id: string }
  let childId: string

  beforeEach(async () => {
    userA = await createTestUser('rls-upr-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-upr-b@test.local', 'Azerty123!')

    const [product] = await testDb
      .insert(products)
      .values({
        createdBy: userA.id,
        name: 'Test RLS UPR',
        brand: 'Brand',
        unit: 'ml',
        slug: `rls-upr-${userA.id}`,
      })
      .returning()
    const [userProduct] = await testDb
      .insert(userProducts)
      .values({ userId: userA.id, productId: product!.id, status: 'in_stock' })
      .returning()
    const [child] = await testDb
      .insert(userProductReviews)
      .values({ userProductId: userProduct!.id })
      .returning()
    childId = child!.id
  })

  it('user B cannot see user A user_product_review via app_runtime pool', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM user_product_reviews WHERE id = ${childId}::uuid`
    })
    expect((rows as Array<{ id: string }>).length).toBe(0)
  })
})

describe('RLS — FORCE RLS and admin bypass', () => {
  let userA: { id: string }
  let userB: { id: string }
  let taskOfA: { id: string }

  beforeEach(async () => {
    userA = await createTestUser('rls-force-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-force-b@test.local', 'Azerty123!')

    const [inserted] = await testDb
      .insert(tasks)
      .values({ userId: userA.id, title: 'A private task for FORCE RLS', status: 'inbox' })
      .returning()
    taskOfA = inserted!
  })

  it('FORCE ROW LEVEL SECURITY is set on tasks in pg_class', async () => {
    // Verifies the DDL was applied — superuser connections still bypass RLS by Postgres design,
    // but FORCE RLS ensures non-superuser table owners cannot bypass policies.
    const pool = new SQL(process.env.APP_DATABASE_URL!)
    try {
      const rows = await pool`SELECT relforcerowsecurity FROM pg_class WHERE relname = 'tasks'`
      expect((rows as Array<{ relforcerowsecurity: boolean }>)[0]?.relforcerowsecurity).toBe(true)
    } finally {
      await pool.close()
    }
  })

  it('admin role sees cross-tenant rows via app.role=admin', async () => {
    const pool = new SQL(process.env.APP_DATABASE_URL!)
    try {
      const rows = await pool.begin(async (tx) => {
        await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
        await tx`SELECT set_config('app.role', 'admin', true)`
        return tx`SELECT id FROM tasks WHERE id = ${taskOfA.id}::uuid`
      })
      expect((rows as Array<{ id: string }>).map((r) => r.id)).toEqual([taskOfA.id])
    } finally {
      await pool.close()
    }
  })

  it('rows stay filtered if app.role is unset', async () => {
    const pool = new SQL(process.env.APP_DATABASE_URL!)
    try {
      const rows = await pool.begin(async (tx) => {
        await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
        // Do NOT set app.role
        return tx`SELECT id FROM tasks`
      })
      expect((rows as Array<{ id: string }>).map((r) => r.id)).not.toContain(taskOfA.id)
    } finally {
      await pool.close()
    }
  })
})

describe('RLS — purchases (owned via user_products)', () => {
  let userA: { id: string }
  let userB: { id: string }
  let childId: string

  beforeEach(async () => {
    userA = await createTestUser('rls-purch-a@test.local', 'Azerty123!')
    userB = await createTestUser('rls-purch-b@test.local', 'Azerty123!')

    const [product] = await testDb
      .insert(products)
      .values({
        createdBy: userA.id,
        name: 'Test RLS Purch',
        brand: 'Brand',
        unit: 'ml',
        slug: `rls-purch-${userA.id}`,
      })
      .returning()
    const [userProduct] = await testDb
      .insert(userProducts)
      .values({ userId: userA.id, productId: product!.id, status: 'in_stock' })
      .returning()
    const [child] = await testDb
      .insert(purchases)
      .values({ userProductId: userProduct!.id, purchasedAt: '2026-01-01' })
      .returning()
    childId = child!.id
  })

  it('user B cannot see user A purchase via app_runtime pool', async () => {
    const rows = await appRuntimePool.begin(async (tx) => {
      await tx`SELECT set_config('app.user_id', ${userB.id}, true)`
      return tx`SELECT id FROM purchases WHERE id = ${childId}::uuid`
    })
    expect((rows as Array<{ id: string }>).length).toBe(0)
  })
})
