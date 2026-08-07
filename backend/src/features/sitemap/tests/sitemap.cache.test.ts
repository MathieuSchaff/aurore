import { beforeEach, describe, expect, it } from 'bun:test'

import type { Database } from '../../../db'
import { getSitemapXml, resetSitemapCache } from '../service'

// The two guards below are invisible from the route: both paths end on a 200 with
// the same XML. Only a stub db can count the builds and make one of them fail.
function createStubDb({ failing = false } = {}) {
  let selectCount = 0

  const query = () => {
    const rows = failing ? Promise.reject(new Error('db down')) : Promise.resolve([])
    return Object.assign(rows, { where: () => rows })
  }

  const db = {
    select: () => {
      selectCount += 1
      return { from: () => query() }
    },
  } as unknown as Database

  return { db, selectsRun: () => selectCount }
}

const SELECTS_PER_BUILD = 3

describe('Sitemap cache', () => {
  beforeEach(() => {
    resetSitemapCache()
  })

  it('collapses a concurrent burst into a single build', async () => {
    const { db, selectsRun } = createStubDb()

    const [first, second] = await Promise.all([getSitemapXml(db), getSitemapXml(db)])

    expect(selectsRun()).toBe(SELECTS_PER_BUILD)
    expect(second.xml).toBe(first.xml)
  })

  it('rebuilds after a failed build instead of serving it for the whole TTL', async () => {
    const failing = createStubDb({ failing: true })
    const healthy = createStubDb()

    await expect(getSitemapXml(failing.db)).rejects.toThrow('db down')

    const { xml } = await getSitemapXml(healthy.db)

    expect(healthy.selectsRun()).toBe(SELECTS_PER_BUILD)
    expect(xml).toContain('/about</loc>')
  })
})
