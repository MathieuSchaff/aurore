import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import {
  contentReports,
  discussionReplies,
  discussionThreads,
  ingredients,
  products,
  userProductReviews,
  userProducts,
} from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestClient,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectError, expectOk } from '../../../tests/helpers/expectStatus'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import {
  createTestAdminUser,
  createTestContributorUser,
  createTestUser,
} from '../../../tests/helpers/test-factories'

async function login(client: TestClient, email: string, password: string): Promise<string> {
  const res = await client.auth.login.$post({ json: { email, password } })
  const data = await res.json()
  if (!data.success) throw new Error('login failed in reports test setup')
  return data.data.accessToken
}

const ANY_TARGET = '019d0000-0000-7000-8000-00000000abc1'
const OTHER_TARGET = '019d0000-0000-7000-8000-00000000abc2'

setupDbTests()

describe('Content reports: user POST + admin GET/PATCH', () => {
  let client: TestClient
  let userId: string
  let adminId: string
  let contributorId: string
  let userToken: string
  let adminToken: string
  let contributorToken: string

  beforeAll(async () => {
    client = await createTestClient()
  })

  beforeEach(async () => {
    const toto = TEST_CREDENTIALS.toto
    const admin = TEST_CREDENTIALS.admin
    const contributor = TEST_CREDENTIALS.contributor
    const user = await createTestUser(toto.rawEmail, toto.rawPassword)
    const adminUser = await createTestAdminUser(admin.rawEmail, admin.rawPassword)
    const contributorUser = await createTestContributorUser(
      contributor.rawEmail,
      contributor.rawPassword
    )
    userId = user.id
    adminId = adminUser.id
    contributorId = contributorUser.id
    userToken = await login(client, toto.rawEmail, toto.rawPassword)
    adminToken = await login(client, admin.rawEmail, admin.rawPassword)
    contributorToken = await login(client, contributor.rawEmail, contributor.rawPassword)
  })

  afterEach(async () => {
    await testDb.delete(contentReports)
  })

  it('user POSTs a report and gets 201 with the row', async () => {
    const report = await expectOk(
      client.reports.$post(
        {
          json: { targetType: 'profile', targetId: userId, reason: 'spam advertising' },
        },
        withAuth(userToken)
      ),
      HTTP_STATUS.CREATED
    )

    expect(report).toMatchObject({
      reporterId: userId,
      targetType: 'profile',
      targetId: userId,
      reason: 'spam advertising',
      status: 'open',
      reviewedBy: null,
      reviewedAt: null,
    })
  })

  // ADR-0006: a catalogue sheet is « Signaler »-able like a review.
  it('user POSTs a report on a product sheet → 201', async () => {
    const [product] = await testDb
      .insert(products)
      .values({
        createdBy: userId,
        name: 'Produit à signaler',
        brand: 'Marque test',
        category: 'skincare',
        kind: 'serum',
        unit: 'pump',
        slug: 'produit-a-signaler',
      })
      .returning({ id: products.id })
    if (!product) throw new Error('product seed failed')

    const report = await expectOk(
      client.reports.$post(
        { json: { targetType: 'product', targetId: product.id, reason: 'fiche spam / pub' } },
        withAuth(userToken)
      ),
      HTTP_STATUS.CREATED
    )
    expect(report.targetType).toBe('product')
  })

  it('user POSTs a report on an ingredient sheet → 201', async () => {
    const [ingredient] = await testDb
      .insert(ingredients)
      .values({
        createdBy: userId,
        name: 'Ingrédient à signaler',
        slug: 'ingredient-a-signaler',
        type: 'skincare',
      })
      .returning({ id: ingredients.id })
    if (!ingredient) throw new Error('ingredient seed failed')

    const report = await expectOk(
      client.reports.$post(
        {
          json: { targetType: 'ingredient', targetId: ingredient.id, reason: 'fiche douteuse' },
        },
        withAuth(userToken)
      ),
      HTTP_STATUS.CREATED
    )
    expect(report.targetType).toBe('ingredient')
  })

  it('user POST rejects a missing target', async () => {
    const res = await client.reports.$post(
      {
        json: { targetType: 'product', targetId: ANY_TARGET, reason: 'fiche disparue' },
      },
      withAuth(userToken)
    )

    expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
  })

  it('user POSTs reports on a visible review, thread, and reply', async () => {
    const [product] = await testDb
      .insert(products)
      .values({
        createdBy: adminId,
        name: 'Produit avec contenu signalable',
        brand: 'Marque test',
        category: 'skincare',
        kind: 'serum',
        unit: 'pump',
        slug: 'produit-avec-contenu-signalable',
      })
      .returning({ id: products.id })
    if (!product) throw new Error('product seed failed')

    const [userProduct] = await testDb
      .insert(userProducts)
      .values({ userId: adminId, productId: product.id })
      .returning({ id: userProducts.id })
    if (!userProduct) throw new Error('user product seed failed')
    const [review] = await testDb
      .insert(userProductReviews)
      .values({ userProductId: userProduct.id, isPublic: true, comment: 'Avis public' })
      .returning({ id: userProductReviews.id })
    if (!review) throw new Error('review seed failed')

    const [thread] = await testDb
      .insert(discussionThreads)
      .values({ productId: product.id, authorId: adminId, title: 'Sujet', content: 'Contenu' })
      .returning({ id: discussionThreads.id })
    if (!thread) throw new Error('thread seed failed')
    const [reply] = await testDb
      .insert(discussionReplies)
      .values({ threadId: thread.id, authorId: adminId, content: 'Réponse' })
      .returning({ id: discussionReplies.id })
    if (!reply) throw new Error('reply seed failed')

    const targets = [
      { targetType: 'review' as const, targetId: review.id },
      { targetType: 'thread' as const, targetId: thread.id },
      { targetType: 'reply' as const, targetId: reply.id },
    ]
    for (const target of targets) {
      const report = await expectOk(
        client.reports.$post(
          { json: { ...target, reason: 'Contenu à modérer' } },
          withAuth(userToken)
        ),
        HTTP_STATUS.CREATED
      )
      expect(report).toMatchObject(target)
    }
  })

  it('user POST rejects whitespace-only reason', async () => {
    const res = await client.reports.$post(
      {
        json: { targetType: 'review', targetId: ANY_TARGET, reason: '   ' },
      },
      withAuth(userToken)
    )

    expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
  })

  it('admin GETs reports newest-first', async () => {
    const old = new Date(Date.now() - 60_000).toISOString()
    const recent = new Date().toISOString()
    await testDb.insert(contentReports).values([
      {
        reporterId: userId,
        targetType: 'review',
        targetId: ANY_TARGET,
        reason: 'old',
        createdAt: old,
      },
      {
        reporterId: userId,
        targetType: 'thread',
        targetId: OTHER_TARGET,
        reason: 'recent',
        createdAt: recent,
      },
    ])

    const list = await expectOk(client.admin.reports.$get({ query: {} }, withAuth(adminToken)))
    expect(list.items.length).toBeGreaterThanOrEqual(2)
    expect(list.items[0]?.reason).toBe('recent')
    expect(list.items[1]?.reason).toBe('old')
  })

  it('admin GET filters by status=resolved', async () => {
    await testDb.insert(contentReports).values([
      {
        reporterId: userId,
        targetType: 'review',
        targetId: ANY_TARGET,
        reason: 'open one',
      },
      {
        reporterId: userId,
        targetType: 'review',
        targetId: OTHER_TARGET,
        reason: 'resolved one',
        status: 'resolved',
        reviewedBy: adminId,
        reviewedAt: new Date().toISOString(),
      },
    ])

    const res = await client.admin.reports.$get(
      { query: { status: 'resolved' } },
      withAuth(adminToken)
    )
    const body = await res.json()
    if (!body.success) throw new Error('admin list (resolved) failed')
    expect(body.data.items.length).toBe(1)
    expect(body.data.items[0]?.reason).toBe('resolved one')
  })

  it('admin PATCHes a report to resolved with reviewedBy + reviewedAt', async () => {
    const [report] = await testDb
      .insert(contentReports)
      .values({
        reporterId: userId,
        targetType: 'review',
        targetId: ANY_TARGET,
        reason: 'to-resolve',
      })
      .returning({ id: contentReports.id })
    if (!report) throw new Error('report seed failed')

    const before = Date.now()
    const updated = await expectOk(
      client.admin.reports[':id'].$patch(
        { param: { id: report.id }, json: { status: 'resolved' } },
        withAuth(adminToken)
      )
    )
    expect(updated.status).toBe('resolved')
    expect(updated.reviewedBy).toBe(adminId)
    expect(updated.reviewedAt && Date.parse(updated.reviewedAt)).toBeGreaterThanOrEqual(before)
  })

  it('admin PATCH returns 404 on missing report', async () => {
    const ghost = '019d0000-0000-7000-8000-00000000bad0'
    const res = await client.admin.reports[':id'].$patch(
      { param: { id: ghost }, json: { status: 'resolved' } },
      withAuth(adminToken)
    )
    expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
  })

  it('non-admin GET /admin/reports → 403', async () => {
    const res = await client.admin.reports.$get({ query: {} }, withAuth(userToken))
    expect(res.status as number).toBe(HTTP_STATUS.FORBIDDEN)
  })

  it('non-admin PATCH /admin/reports/:id → 403', async () => {
    const [report] = await testDb
      .insert(contentReports)
      .values({
        reporterId: userId,
        targetType: 'review',
        targetId: ANY_TARGET,
        reason: 'unauthorized attempt',
      })
      .returning({ id: contentReports.id })
    if (!report) throw new Error('report seed failed')

    const res = await client.admin.reports[':id'].$patch(
      { param: { id: report.id }, json: { status: 'dismissed' } },
      withAuth(userToken)
    )
    expect(res.status as number).toBe(HTTP_STATUS.FORBIDDEN)
  })

  // ADR-0006: the report queue is owned by the moderator (contributor),
  // not admin-exclusively. List + resolve/dismiss open to admin∨contributor.
  it('contributor GETs the report queue → 200', async () => {
    const res = await client.admin.reports.$get({ query: {} }, withAuth(contributorToken))
    expect(res.status).toBe(HTTP_STATUS.OK)
  })

  it('contributor PATCHes a report to resolved → 200', async () => {
    const [report] = await testDb
      .insert(contentReports)
      .values({
        reporterId: userId,
        targetType: 'review',
        targetId: ANY_TARGET,
        reason: 'modo resolves',
      })
      .returning({ id: contentReports.id })
    if (!report) throw new Error('report seed failed')

    const updated = await expectOk(
      client.admin.reports[':id'].$patch(
        { param: { id: report.id }, json: { status: 'resolved' } },
        withAuth(contributorToken)
      )
    )
    expect(updated.status).toBe('resolved')
  })

  it('contributor PATCH returns 404 on missing report', async () => {
    const ghost = '019d0000-0000-7000-8000-00000000bad0'

    await expectError(
      client.admin.reports[':id'].$patch(
        { param: { id: ghost }, json: { status: 'resolved' } },
        withAuth(contributorToken)
      ),
      HTTP_STATUS.NOT_FOUND,
      'not_found'
    )
  })

  it('rejects a contributor decision after the report was escalated', async () => {
    const [report] = await testDb
      .insert(contentReports)
      .values({
        reporterId: userId,
        targetType: 'review',
        targetId: ANY_TARGET,
        reason: 'admin decision required',
        escalatedAt: new Date().toISOString(),
        escalatedBy: contributorId,
      })
      .returning({ id: contentReports.id })
    if (!report) throw new Error('report seed failed')

    await expectError(
      client.admin.reports[':id'].$patch(
        { param: { id: report.id }, json: { status: 'resolved' } },
        withAuth(contributorToken)
      ),
      HTTP_STATUS.FORBIDDEN,
      'forbidden'
    )
  })

  // ADR-0006: escalate-to-admin. Orthogonal to status: the report stays
  // open while escalated; escalatedBy records the moderator who handed it up.
  it('contributor escalates a report → escalatedAt + escalatedBy set, status stays open', async () => {
    const [report] = await testDb
      .insert(contentReports)
      .values({
        reporterId: userId,
        targetType: 'review',
        targetId: ANY_TARGET,
        reason: 'beyond my scope',
      })
      .returning({ id: contentReports.id })
    if (!report) throw new Error('report seed failed')

    const before = Date.now()
    const updated = await expectOk(
      client.admin.reports[':id'].escalate.$patch(
        { param: { id: report.id } },
        withAuth(contributorToken)
      )
    )
    expect(updated.escalatedBy).toBe(contributorId)
    expect(updated.escalatedAt && Date.parse(updated.escalatedAt)).toBeGreaterThanOrEqual(before)
    expect(updated.status).toBe('open')
  })

  it('admin can escalate a report', async () => {
    const [report] = await testDb
      .insert(contentReports)
      .values({
        reporterId: userId,
        targetType: 'review',
        targetId: ANY_TARGET,
        reason: 'admin escalates too',
      })
      .returning({ id: contentReports.id })
    if (!report) throw new Error('report seed failed')

    const updated = await expectOk(
      client.admin.reports[':id'].escalate.$patch(
        { param: { id: report.id } },
        withAuth(adminToken)
      )
    )
    expect(updated.escalatedBy).toBe(adminId)
  })

  it('escalate returns 404 on missing report', async () => {
    const ghost = '019d0000-0000-7000-8000-00000000bad1'
    const res = await client.admin.reports[':id'].escalate.$patch(
      { param: { id: ghost } },
      withAuth(contributorToken)
    )
    expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
  })

  it('non-moderator escalate → 403', async () => {
    const [report] = await testDb
      .insert(contentReports)
      .values({
        reporterId: userId,
        targetType: 'review',
        targetId: ANY_TARGET,
        reason: 'unauthorized escalate',
      })
      .returning({ id: contentReports.id })
    if (!report) throw new Error('report seed failed')

    const res = await client.admin.reports[':id'].escalate.$patch(
      { param: { id: report.id } },
      withAuth(userToken)
    )
    expect(res.status as number).toBe(HTTP_STATUS.FORBIDDEN)
  })

  it('admin GET filters escalated=true', async () => {
    await testDb.insert(contentReports).values([
      {
        reporterId: userId,
        targetType: 'review',
        targetId: ANY_TARGET,
        reason: 'plain open',
      },
      {
        reporterId: userId,
        targetType: 'thread',
        targetId: OTHER_TARGET,
        reason: 'escalated one',
        escalatedAt: new Date().toISOString(),
        escalatedBy: adminId,
      },
    ])

    const list = await expectOk(
      client.admin.reports.$get({ query: { escalated: 'true' } }, withAuth(adminToken))
    )
    expect(list.items.length).toBe(1)
    expect(list.items[0]?.reason).toBe('escalated one')
  })

  it('rejects the escalated queue for a contributor', async () => {
    await expectError(
      client.admin.reports.$get({ query: { escalated: 'true' } }, withAuth(contributorToken)),
      HTTP_STATUS.FORBIDDEN,
      'forbidden'
    )
  })

  it('excludes escalated reports from the contributor open queue', async () => {
    await testDb.insert(contentReports).values([
      {
        reporterId: userId,
        targetType: 'review',
        targetId: ANY_TARGET,
        reason: 'plain open',
      },
      {
        reporterId: userId,
        targetType: 'thread',
        targetId: OTHER_TARGET,
        reason: 'handed to admin',
        escalatedAt: new Date().toISOString(),
        escalatedBy: contributorId,
      },
    ])

    const list = await expectOk(
      client.admin.reports.$get({ query: { status: 'open' } }, withAuth(contributorToken))
    )

    expect(list.items.map((report) => report.reason)).toEqual(['plain open'])
  })

  // status + escalated compose with AND: an escalated-but-resolved report must be
  // excluded from the open+escalated view (only the open escalated one matches).
  it('admin GET combines status=open AND escalated=true', async () => {
    await testDb.insert(contentReports).values([
      {
        reporterId: userId,
        targetType: 'review',
        targetId: ANY_TARGET,
        reason: 'open + escalated',
        escalatedAt: new Date().toISOString(),
        escalatedBy: adminId,
      },
      {
        reporterId: userId,
        targetType: 'thread',
        targetId: OTHER_TARGET,
        reason: 'resolved + escalated',
        status: 'resolved',
        reviewedBy: adminId,
        reviewedAt: new Date().toISOString(),
        escalatedAt: new Date().toISOString(),
        escalatedBy: adminId,
      },
    ])

    const list = await expectOk(
      client.admin.reports.$get(
        { query: { status: 'open', escalated: 'true' } },
        withAuth(adminToken)
      )
    )
    expect(list.items.length).toBe(1)
    expect(list.items[0]?.reason).toBe('open + escalated')
  })
})
