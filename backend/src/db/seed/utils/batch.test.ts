import { beforeEach, describe, expect, it } from 'bun:test'

import { DrizzleQueryError, like } from 'drizzle-orm'

import { createProduct } from '../../../features/products/service'
import { testDb } from '../../../tests/db.test.config'
import { captureError } from '../../../tests/helpers/capture-error'
import { cleanDatabase } from '../../../tests/helpers/db-cleaner'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { withAdminRls } from '../../rls'
import { productTagTypes } from '../../schema'
import { productTagData } from '../data/tags'
import { seedBatch } from './batch'

const RICH_INCI =
  'Aqua, Niacinamide, Retinol, Glycerin, Tocopherol, Phenoxyethanol, Hyaluronic Acid'

describe('seedBatch: transaction safety', () => {
  beforeEach(async () => {
    await cleanDatabase()
    await testDb.insert(productTagTypes).values(productTagData)
  })

  it.each(['drizzle', 'driver-cause'] as const)(
    'propagates the first %s failure, skips the next item and rolls back',
    async (source) => {
      const visited: number[] = []
      let originalError: unknown
      const error = await captureError(() =>
        testDb.transaction((tx) =>
          seedBatch(
            'probe tags',
            [1, 1, 2],
            async (item) => {
              visited.push(item)
              try {
                await tx.insert(productTagTypes).values({
                  slug: `batch-sql-${item}`,
                  label: `Probe ${item}`,
                  tagType: 'concern',
                })
              } catch (cause) {
                originalError =
                  source === 'driver-cause' && cause instanceof DrizzleQueryError
                    ? new Error('Seed callback failed', {
                        cause: new Error('Insert failed', { cause: cause.cause }),
                      })
                    : cause
                throw originalError
              }
            },
            String
          )
        )
      )

      expect(error).toBeInstanceOf(Error)
      expect(error).toBe(originalError)
      expect(visited).toEqual([1, 1])
      const persisted = await testDb
        .select()
        .from(productTagTypes)
        .where(like(productTagTypes.slug, 'batch-sql-%'))
      expect(persisted).toEqual([])
    }
  )

  it('creates every item when batched under a shared transaction', async () => {
    const user = await createTestUser()
    const items = Array.from({ length: 8 }, (_, i) => ({
      name: `Serum ${i}`,
      brand: 'Lab',
      kind: 'serum' as const,
      unit: 'pump' as const,
      category: 'skincare' as const,
      inci: RICH_INCI,
    }))

    // seedBatch runs its items inside the seed's single outer transaction (one
    // connection). Fanning them out concurrently makes each createProduct open a
    // nested tx (a SAVEPOINT) on that shared connection; Bun's SQL pipelines the
    // statements and Drizzle's nested-tx counter races, so a RELEASE kills another
    // item's savepoint, giving `savepoint "sN" does not exist` and the rest cascade.

    // withAdminRls reproduces the exact outer-tx + SET LOCAL admin combo the seed
    // uses (see seed-core).
    const result = await withAdminRls((tx) =>
      seedBatch(
        'produits',
        items,
        (p) => createProduct(user.id, 'admin', p, tx),
        (p) => p.name
      )
    )

    expect(result.failed).toEqual([])
    expect(result.success).toBe(items.length)
  })
})

describe('seedBatch: error classification', () => {
  it.each(['code', 'errno'])(
    'propagates SQLSTATE in %s before processing the next item',
    async (key) => {
      const sqlError = Object.assign(new Error('Duplicate entry'), { [key]: '23505' })
      const visited: number[] = []
      const error = await captureError(() =>
        seedBatch(
          'items',
          [1, 2],
          async (item) => {
            visited.push(item)
            throw sqlError
          },
          String,
          true
        )
      )

      expect(error).toBe(sqlError)
      expect(visited).toEqual([1])
    }
  )

  it.each([
    ['optional', false],
    ['critical', true],
  ] as const)('continues ordinary failures when the batch is %s', async (_label, critical) => {
    const visited: number[] = []
    const businessError = new Error('Unsupported item')
    businessError.cause = businessError
    const run = () =>
      seedBatch(
        'items',
        [1, 2, 3],
        async (item) => {
          visited.push(item)
          if (item === 2) throw businessError
        },
        String,
        critical
      )

    if (critical) {
      const error = await captureError(run)
      expect(error).toEqual(new Error('Seed interrompu : items contient des erreurs critiques'))
    } else {
      expect(await run()).toEqual({
        success: 2,
        failed: [{ item: '2', reason: 'Unsupported item' }],
        total: 3,
      })
    }
    expect(visited).toEqual([1, 2, 3])
  })
})
