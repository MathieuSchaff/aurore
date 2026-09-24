import { beforeEach, describe, expect, it } from 'bun:test'

import { DrizzleQueryError, eq, sql } from 'drizzle-orm'
import pino from 'pino'

import { products } from '../../../db/schema'
import { logger } from '../../../lib/logger'
import { testDb } from '../../../tests/db.test.config'
import { cleanDatabase } from '../../../tests/helpers/db-cleaner'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { createProduct } from '../../products/service'
import {
  AUTOTAG_SKIP_EVENT_KIND,
  buildAutoTagSkipLog,
  recordAutoTagSkip,
  writeTagsForProductFailSoft,
} from '../write'
import { createAutoTagProduct } from './db-helpers'

const FAKE_PRODUCT_ID = '00000000-0000-7000-8000-000000000001'

describe('recordAutoTagSkip', () => {
  it('builds the frozen event name + structured context for Grafana logs', () => {
    const err = new Error('analyzeINCI exploded on garbage input')
    const log = buildAutoTagSkipLog(FAKE_PRODUCT_ID, { operation: 'create', userId: 'u1' }, err)

    expect(log).toMatchObject({
      event: AUTOTAG_SKIP_EVENT_KIND,
      productId: FAKE_PRODUCT_ID,
      operation: 'create',
      userId: 'u1',
      err,
    })
    expect(log).not.toHaveProperty('cause')
  })

  it('reports non-Error throws without serializing their contents', () => {
    const log = buildAutoTagSkipLog(
      FAKE_PRODUCT_ID,
      { operation: 'update', userId: 'u1' },
      'thrown-as-string'
    )

    expect(log).toMatchObject({
      cause: 'Non-Error thrown',
      operation: 'update',
    })
    expect(log).not.toHaveProperty('err')
  })

  it('keeps SQL parameters out of the actual Pino output', () => {
    const secret = 'SYNTHETIC_PRIVATE_AUTOTAG_PARAMETER'
    const error = new DrizzleQueryError('select $1', [secret], new Error('Query failed'))
    const stream = Object.getOwnPropertyDescriptor(logger, pino.symbols.streamSym)
    if (!stream) throw new Error('Pino output stream is unavailable')
    const level = logger.level
    let output = ''

    try {
      Object.defineProperty(logger, pino.symbols.streamSym, {
        value: { write: (line: string) => (output += line) },
      })
      logger.level = 'warn'
      recordAutoTagSkip(FAKE_PRODUCT_ID, { operation: 'update', userId: 'u1' }, error)
    } finally {
      Object.defineProperty(logger, pino.symbols.streamSym, stream)
      logger.level = level
    }

    expect(output).not.toContain(secret)
    const event: unknown = JSON.parse(output)
    expect(event).toMatchObject({
      event: AUTOTAG_SKIP_EVENT_KIND,
      msg: AUTOTAG_SKIP_EVENT_KIND,
      productId: FAKE_PRODUCT_ID,
      operation: 'update',
      userId: 'u1',
      err: { type: 'DrizzleQueryError', message: 'Database query failed' },
    })
    expect(event).not.toHaveProperty('cause')
  })

  it('keeps the fail-soft reporter non-throwing', () => {
    expect(() =>
      recordAutoTagSkip(
        FAKE_PRODUCT_ID,
        { operation: 'create', userId: 'u1' },
        new Error('same site')
      )
    ).not.toThrow()
  })
})

const writeFailSoft = (
  productId: string,
  meta: Parameters<typeof writeTagsForProductFailSoft>[2]
) => testDb.transaction((tx) => writeTagsForProductFailSoft(tx, productId, meta))

describe('writeTagsForProductFailSoft', () => {
  beforeEach(async () => {
    await cleanDatabase()
  })

  it('commits the product when an optional tag lookup fails in SQL', async () => {
    const user = await createTestUser()
    const locked = Promise.withResolvers<void>()
    const release = Promise.withResolvers<void>()
    const blocker = testDb.transaction(async (tx) => {
      await tx.execute(sql`LOCK TABLE brand_certifications IN ACCESS EXCLUSIVE MODE`)
      locked.resolve()
      await release.promise
    })
    await locked.promise

    try {
      const product = await testDb.transaction(async (tx) => {
        await tx.execute(sql`SET LOCAL lock_timeout = '100ms'`)
        return createProduct(
          user.id,
          'admin',
          {
            name: 'Retained serum',
            brand: 'Lab',
            category: 'skincare',
            kind: 'serum',
            unit: 'pump',
          },
          tx
        )
      })
      const persisted = await testDb
        .select({ id: products.id })
        .from(products)
        .where(eq(products.id, product.id))
      expect(persisted).toEqual([{ id: product.id }])
    } finally {
      release.resolve()
      await blocker
    }
  })

  it('does not throw when the orchestrator succeeds on a healthy product', async () => {
    const user = await createTestUser()
    const product = await createAutoTagProduct(user.id, { name: 'Test Serum' })

    await expect(
      writeFailSoft(product.id, {
        operation: 'create',
        userId: user.id,
      })
    ).resolves.toBeUndefined()
  })

  it('does not throw when the product does not exist (writeTagsForProduct returns early)', async () => {
    const user = await createTestUser()
    await expect(
      writeFailSoft(FAKE_PRODUCT_ID, {
        operation: 'update',
        userId: user.id,
      })
    ).resolves.toBeUndefined()
  })
})
