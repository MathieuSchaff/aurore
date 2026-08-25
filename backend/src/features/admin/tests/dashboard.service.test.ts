import { describe, expect, it } from 'bun:test'

import { inArray } from 'drizzle-orm'

import {
  contentReports,
  discussionReplies,
  discussionThreads,
  profiles,
  roleRequests,
  userBans,
  userProductReviews,
  userProducts,
} from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestProduct,
  createTestUser,
  type TestUser,
} from '../../../tests/helpers/test-factories'
import { getAdminDashboard } from '../dashboard.service'

setupDbTests()

describe('getAdminDashboard', () => {
  it('counts each workload with its own status predicate', async () => {
    const users: TestUser[] = []
    for (let index = 0; index < 8; index += 1) {
      users.push(await createTestUser(`dashboard-${index}@test.local`, 'Azerty123!'))
    }
    const [actor, ...requesters] = users
    if (!actor) throw new Error('dashboard fixture has no actor')
    const rejectedRequester = users[7]
    if (!rejectedRequester) throw new Error('dashboard fixture has no rejected requester')

    await testDb.insert(contentReports).values([
      {
        reporterId: actor.id,
        targetType: 'profile',
        targetId: actor.id,
        reason: 'open',
      },
      {
        reporterId: actor.id,
        targetType: 'profile',
        targetId: actor.id,
        reason: 'resolved',
        status: 'resolved',
      },
    ])

    const future = new Date(Date.now() + 60_000).toISOString()
    const past = new Date(Date.now() - 60_000).toISOString()
    await testDb.insert(userBans).values([
      { userId: actor.id, scope: 'global', bannedBy: actor.id },
      { userId: actor.id, scope: 'product_edit', bannedBy: actor.id, expiresAt: future },
      { userId: actor.id, scope: 'ingredient_edit', bannedBy: actor.id, expiresAt: past },
    ])

    const products: Awaited<ReturnType<typeof createTestProduct>>[] = []
    for (let index = 0; index < 4; index += 1) {
      products.push(await createTestProduct(actor.id, { name: `Dashboard product ${index}` }))
    }
    const discussionProduct = products[0]
    if (!discussionProduct) throw new Error('dashboard fixture has no product')
    const ownedProducts = await testDb
      .insert(userProducts)
      .values(products.map((product) => ({ userId: actor.id, productId: product.id })))
      .returning({ id: userProducts.id })
    await testDb.insert(userProductReviews).values(
      ownedProducts.map(({ id }, index) => ({
        userProductId: id,
        moderationStatus: index < 3 ? ('hidden' as const) : ('visible' as const),
      }))
    )

    const threads = await testDb
      .insert(discussionThreads)
      .values([
        ...Array.from({ length: 4 }, (_, index) => ({
          productId: discussionProduct.id,
          authorId: actor.id,
          title: `Hidden ${index}`,
          content: 'Hidden thread',
          moderationStatus: 'hidden' as const,
        })),
        {
          productId: discussionProduct.id,
          authorId: actor.id,
          title: 'Visible',
          content: 'Visible thread',
          moderationStatus: 'visible' as const,
        },
      ])
      .returning({ id: discussionThreads.id })
    if (!threads[0]) throw new Error('dashboard fixture has no thread')
    await testDb.insert(discussionReplies).values([
      ...Array.from({ length: 5 }, (_, index) => ({
        threadId: threads[0].id,
        authorId: actor.id,
        content: `Hidden reply ${index}`,
        moderationStatus: 'hidden' as const,
      })),
      {
        threadId: threads[0].id,
        authorId: actor.id,
        content: 'Visible reply',
        moderationStatus: 'visible' as const,
      },
    ])

    await testDb
      .update(profiles)
      .set({ forcedPrivateByAdmin: true })
      .where(
        inArray(
          profiles.userId,
          requesters.slice(0, 6).map((user) => user.id)
        )
      )
    await testDb.insert(roleRequests).values([
      ...users.slice(0, 7).map((user, index) => ({
        userId: user.id,
        motivation: `Pending request ${index}`,
        status: 'pending' as const,
      })),
      {
        userId: rejectedRequester.id,
        motivation: 'Rejected request',
        status: 'rejected' as const,
        rejectionReason: 'Insufficient',
        reviewedBy: actor.id,
        reviewedAt: new Date().toISOString(),
      },
    ])

    const dashboard = await testDb.transaction((tx) => getAdminDashboard(tx))

    expect(dashboard).toEqual({
      openReports: 1,
      activeBans: 2,
      hiddenReviews: 3,
      hiddenThreads: 4,
      hiddenReplies: 5,
      forcedPrivateProfiles: 6,
      pendingRoleRequests: 7,
    })
  })
})
