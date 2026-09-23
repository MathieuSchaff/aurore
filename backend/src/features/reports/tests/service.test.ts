import { beforeEach, describe, expect, it } from 'bun:test'

import { eq, sql } from 'drizzle-orm'

import { contentReports, products } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { captureError } from '../../../tests/helpers/capture-error'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { ReportError } from '../report-error'
import { createReport, escalateReport, resolveReport } from '../service'

setupDbTests()

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

let reporterId: string
let productId: string

beforeEach(async () => {
  const reporter = await createTestUser('reporter-lock@test.local', 'Azerty123!')
  reporterId = reporter.id
  const [product] = await testDb
    .insert(products)
    .values({
      createdBy: reporterId,
      name: 'Reported product',
      brand: 'Test brand',
      category: 'skincare',
      kind: 'serum',
      unit: 'pump',
      slug: 'reported-product',
    })
    .returning({ id: products.id })
  if (!product) throw new Error('product seed failed')
  productId = product.id
})

describe('reports service', () => {
  const createOpenReport = () =>
    testDb.transaction((tx) =>
      createReport(tx, {
        reporterId,
        body: { targetType: 'product', targetId: productId, reason: 'Incorrect content' },
      })
    )

  it.each(['resolved', 'dismissed'] as const)(
    'rejects further transitions after a report is %s',
    async (status) => {
      const report = await createOpenReport()
      const previous = await testDb.transaction((tx) =>
        resolveReport(tx, { id: report.id, reviewerId: reporterId, reviewerRole: 'admin', status })
      )
      const other = await createTestUser('other-reviewer@test.local')

      for (const nextStatus of ['resolved', 'dismissed'] as const) {
        const error = await captureError(() =>
          testDb.transaction((tx) =>
            resolveReport(tx, {
              id: report.id,
              reviewerId: other.id,
              reviewerRole: 'admin',
              status: nextStatus,
            })
          )
        )
        expect(error).toBeInstanceOf(ReportError)
        expect(error).toMatchObject({ code: 'report_transition_conflict' })
      }
      const error = await captureError(() =>
        testDb.transaction((tx) => escalateReport(tx, { id: report.id, moderatorId: other.id }))
      )
      expect(error).toBeInstanceOf(ReportError)
      expect(error).toMatchObject({ code: 'report_transition_conflict' })
      expect(
        await testDb.select().from(contentReports).where(eq(contentReports.id, report.id))
      ).toEqual([previous])
    }
  )

  it('preserves escalation attribution when another moderator repeats it', async () => {
    const report = await createOpenReport()
    const previous = await testDb.transaction((tx) =>
      escalateReport(tx, { id: report.id, moderatorId: reporterId })
    )
    const other = await createTestUser('other-escalator@test.local')
    const error = await captureError(() =>
      testDb.transaction((tx) => escalateReport(tx, { id: report.id, moderatorId: other.id }))
    )

    expect(error).toBeInstanceOf(ReportError)
    expect(error).toMatchObject({ code: 'report_transition_conflict' })
    expect(
      await testDb.select().from(contentReports).where(eq(contentReports.id, report.id))
    ).toEqual([previous])
  })

  it('allows an admin to resolve an escalated open report', async () => {
    const report = await createOpenReport()
    await testDb.transaction((tx) => escalateReport(tx, { id: report.id, moderatorId: reporterId }))
    const result = await testDb.transaction((tx) =>
      resolveReport(tx, {
        id: report.id,
        reviewerId: reporterId,
        reviewerRole: 'admin',
        status: 'resolved',
      })
    )
    expect(result).toMatchObject({ status: 'resolved', escalatedBy: reporterId })
  })

  it.each(['resolve', 'escalate'] as const)(
    'commits only one concurrent %s transition',
    async (operation) => {
      const report = await createOpenReport()
      const other = await createTestUser('concurrent-reviewer@test.local')
      const locked = deferred()
      const release = deferred()
      const blocker = testDb.transaction(async (tx) => {
        await tx
          .select({ id: contentReports.id })
          .from(contentReports)
          .where(eq(contentReports.id, report.id))
          .for('update')
        locked.resolve()
        await release.promise
      })
      await locked.promise
      const applicationName = `report-${report.id}`
      const attempts = [reporterId, other.id].map((reviewerId, index) =>
        testDb.transaction(async (tx) => {
          await tx.execute(sql`SELECT set_config('application_name', ${applicationName}, true)`)
          return operation === 'resolve'
            ? resolveReport(tx, {
                id: report.id,
                reviewerId,
                reviewerRole: 'admin',
                status: index === 0 ? 'resolved' : 'dismissed',
              })
            : escalateReport(tx, { id: report.id, moderatorId: reviewerId })
        })
      )
      try {
        const deadline = Date.now() + 3_000
        let waiting = 0
        while (Date.now() < deadline) {
          const [row] = await testDb.execute<{ count: number }>(sql`
            SELECT count(*)::int AS count FROM pg_stat_activity
            WHERE datname = current_database()
              AND application_name = ${applicationName}
              AND wait_event_type = 'Lock'
          `)
          waiting = row?.count ?? 0
          if (waiting === 2) break
          await Bun.sleep(10)
        }
        expect(waiting).toBe(2)
        release.resolve()
        const results = await Promise.allSettled(attempts)
        const winner = results.find((result) => result.status === 'fulfilled')
        const loser = results.find((result) => result.status === 'rejected')
        if (!winner) throw new Error('No report transition committed')
        expect(loser).toMatchObject({
          status: 'rejected',
          reason: { code: 'report_transition_conflict' },
        })
        expect(
          await testDb.select().from(contentReports).where(eq(contentReports.id, report.id))
        ).toEqual([winner.value])
      } finally {
        release.resolve()
        await Promise.allSettled([blocker, ...attempts])
      }
    },
    10_000
  )

  it('holds the target while creating its polymorphic reference', async () => {
    const created = deferred()
    const release = deferred()
    const writer = testDb.transaction(async (tx) => {
      await createReport(tx, {
        reporterId,
        body: { targetType: 'product', targetId: productId, reason: 'Incorrect content' },
      })
      created.resolve()
      await release.promise
    })
    await created.promise

    try {
      await expect(
        testDb.transaction(async (tx) => {
          await tx.execute(sql`SET LOCAL lock_timeout = '100ms'`)
          await tx.delete(products).where(eq(products.id, productId))
        })
      ).rejects.toThrow()
    } finally {
      release.resolve()
      await writer
    }
  })
})
