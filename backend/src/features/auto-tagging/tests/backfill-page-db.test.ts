import { describe, expect, it } from 'bun:test'

import { setupDbTests } from '../../../tests/db-setup'
import { createTestAdminUser, createTestProduct } from '../../../tests/helpers/test-factories'
import { fetchEligibleProductPage } from '../runners/audit/db'

setupDbTests()

describe('fetchEligibleProductPage', () => {
  it('walks the real eligible-product query in stable id order', async () => {
    const admin = await createTestAdminUser()
    const created = []
    for (const name of ['Cursor A', 'Cursor B', 'Cursor C']) {
      created.push(await createTestProduct(admin.id, { name }))
    }

    const first = await fetchEligibleProductPage({ afterId: null, limit: 2, slug: null })
    const second = await fetchEligibleProductPage({
      afterId: first.at(-1)?.id ?? null,
      limit: 2,
      slug: null,
    })

    expect([...first, ...second].map((product) => product.id)).toEqual(
      created.map((product) => product.id).sort()
    )
  })
})
