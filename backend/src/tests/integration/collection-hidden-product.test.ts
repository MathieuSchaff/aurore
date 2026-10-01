import { describe, expect, it } from 'bun:test'

import { eq } from 'drizzle-orm'
import { testClient } from 'hono/testing'

import { products, purchases, userProductReviews, userProducts } from '../../db/schema'
import { generateAccessToken } from '../../features/auth/jwt.utils'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb } from '../helpers/app-runtime-db'
import { createTestApp } from '../helpers/createTestApp'
import { withAuth } from '../helpers/createTestClient'
import { expectOk } from '../helpers/expectStatus'
import { JWT_SECRET } from '../helpers/secrets'
import { createTestProduct, createTestUser } from '../helpers/test-factories'

const runtime = await createAppRuntimeDb()
setupDbTests()

describe('collection after catalogue moderation', () => {
  it('preserves personal memory and allows mutations while the joined product is hidden', async () => {
    const user = await createTestUser()
    const hidden = await createTestProduct(user.id, { name: 'Hidden catalogue marker' })
    const visible = await createTestProduct(user.id, { name: 'Visible catalogue marker' })
    const entries = await testDb
      .insert(userProducts)
      .values([
        {
          userId: user.id,
          productId: hidden.id,
          status: 'avoided',
          comment: 'Personal memory marker',
        },
        { userId: user.id, productId: visible.id },
      ])
      .returning()
    const hiddenEntry = entries.find((entry) => entry.productId === hidden.id)
    const visibleEntry = entries.find((entry) => entry.productId === visible.id)
    if (!hiddenEntry || !visibleEntry) throw new Error('missing collection fixtures')
    await testDb
      .insert(userProductReviews)
      .values({ userProductId: hiddenEntry.id, comment: 'Personal review', tolerance: 2 })
    await testDb
      .insert(purchases)
      .values({ userProductId: hiddenEntry.id, purchasedAt: '2026-05-07', openedAt: '2026-05-08' })
    await testDb
      .update(products)
      .set({ moderationStatus: 'hidden' })
      .where(eq(products.id, hidden.id))
    const auth = withAuth(await generateAccessToken(user.id, 'user', JWT_SECRET))
    const client = testClient(await createTestApp({ anonDb: runtime })).api

    const list = await expectOk(client['user-products'].$get({}, auth))
    expect(list).toHaveLength(2)
    expect(list.find((entry) => entry.id === hiddenEntry.id)).toMatchObject({
      product: null,
      comment: 'Personal memory marker',
      review: { comment: 'Personal review' },
    })
    expect(JSON.stringify(list)).not.toContain(hidden.name)
    const embedded = list.find((entry) => entry.id === hiddenEntry.id)?.purchases
    const dedicated = await expectOk(
      client['user-products'][':id'].purchases.$get({ param: { id: hiddenEntry.id } }, auth)
    )
    expect(embedded).toEqual(dedicated)
    expect(embedded?.[0]?.purchasedAt).toBe('2026-05-07T00:00:00.000Z')
    expect(embedded?.[0]?.openedAt).toBe('2026-05-08T00:00:00.000Z')

    expect(
      (
        await client['user-products'][':id'].$patch(
          { param: { id: visibleEntry.id }, json: { status: 'avoided' } },
          auth
        )
      ).status
    ).toBe(200)
    expect(
      (
        await client['user-products'][':id'].review.$put(
          { param: { id: visibleEntry.id }, json: { tolerance: 2 } },
          auth
        )
      ).status
    ).toBe(200)
    const edited = await expectOk(
      client['user-products'][':id'].$patch(
        { param: { id: hiddenEntry.id }, json: { comment: 'Updated memory' } },
        auth
      )
    )
    expect(edited.comment).toBe('Updated memory')
    expect(
      (await client['user-products'][':id'].$delete({ param: { id: hiddenEntry.id } }, auth)).status
    ).toBe(200)
    expect(await expectOk(client['user-products'].$get({}, auth))).toHaveLength(1)
  })
})
