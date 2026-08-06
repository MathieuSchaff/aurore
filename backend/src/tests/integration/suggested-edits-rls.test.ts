import { beforeEach, describe, expect, it } from 'bun:test'

import { sql } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db/index'
import { suggestedEdits } from '../../db/schema'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
import { createTestUser } from '../helpers/test-factories'

const appRuntimeDb = await createAppRuntimeDb()

setupDbTests()

function withRls<T>(role: string, userId: string, fn: (tx: DatabaseTransaction) => Promise<T>) {
  return withRlsAs(appRuntimeDb, role, userId, fn)
}

describe('suggested_edits RLS', () => {
  let proposerId: string
  let otherUserId: string

  beforeEach(async () => {
    const proposer = await createTestUser('prop@toto.com', 'Azerty123!')
    const other = await createTestUser('other@toto.com', 'Azerty123!')
    proposerId = proposer.id
    otherUserId = other.id
  })

  async function seedEdit(ownerId: string, proposedValue: string) {
    const [edit] = await testDb
      .insert(suggestedEdits)
      .values({
        proposerId: ownerId,
        targetType: 'product',
        targetId: ownerId,
        field: 'name',
        proposedValue,
      })
      .returning({ id: suggestedEdits.id })
    if (!edit) throw new Error('seed failed')
    return edit.id
  }

  it("a proposer reads back their own pending edit but not another user's", async () => {
    // targetId is polymorphic (no FK), so reuse user UUIDs as dummy target IDs.
    await testDb.insert(suggestedEdits).values([
      {
        proposerId,
        targetType: 'product',
        targetId: proposerId,
        field: 'name',
        proposedValue: 'mine',
      },
      {
        proposerId: otherUserId,
        targetType: 'product',
        targetId: otherUserId,
        field: 'name',
        proposedValue: 'theirs',
      },
    ])
    const rows = await withRls('user', proposerId, (tx) => tx.select().from(suggestedEdits))
    expect(rows.length).toBe(1)
    expect(rows[0]?.proposedValue).toBe('mine')
  })

  // moderationPolicies adds contributor SELECT on all rows, which validates the key
  // design decision: without it a contributor would see 0 rows from their queue.
  it('a contributor sees the whole queue (moderationPolicies)', async () => {
    await testDb.insert(suggestedEdits).values([
      {
        proposerId,
        targetType: 'product',
        targetId: proposerId,
        field: 'name',
        proposedValue: 'a',
      },
      {
        proposerId: otherUserId,
        targetType: 'product',
        targetId: otherUserId,
        field: 'name',
        proposedValue: 'b',
      },
    ])
    const rows = await withRls('contributor', otherUserId, (tx) => tx.select().from(suggestedEdits))
    expect(rows.length).toBe(2)
  })

  it('a contributor can UPDATE (review) any row', async () => {
    const editId = await seedEdit(proposerId, 'x')

    await withRls('contributor', otherUserId, (tx) =>
      tx.update(suggestedEdits).set({ status: 'rejected' }).where(sql`id = ${editId}`)
    )

    const [after] = await testDb.select({ status: suggestedEdits.status }).from(suggestedEdits)
    expect(after?.status).toBe('rejected')
  })

  it("a plain user cannot UPDATE another user's edit (0 rows affected)", async () => {
    const editId = await seedEdit(proposerId, 'x')

    const res = await withRls('user', otherUserId, (tx) =>
      tx
        .update(suggestedEdits)
        .set({ status: 'rejected' })
        .where(sql`id = ${editId}`)
        .returning({ id: suggestedEdits.id })
    )
    // RLS silently filters the row: 0 rows updated, no error.
    expect(res.length).toBe(0)
  })
})
