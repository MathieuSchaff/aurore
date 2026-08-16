import { beforeEach, describe, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'
import type { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { users } from '../../db/schema'
import { jwtAuthRoutes } from '../../features/auth/routes'
import { ingredientRoutes } from '../../features/ingredients/routes'
import { productsFeature } from '../../features/products'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb } from '../helpers/app-runtime-db'
import { expectError } from '../helpers/expectStatus'
import { createRlsApp, loginViaRlsApp } from '../helpers/rls-app'
import { authPatch } from '../helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../helpers/test-credentials'
import {
  createTestContributorUser,
  createTestIngredient,
  createTestProduct,
  createTestUser,
} from '../helpers/test-factories'

const appRuntimeDb = await createAppRuntimeDb()

setupDbTests()

// PATCH /products/:id and /ingredients/:id cannot carry requireCatalogWrite: the author of
// an unverified submission must keep editing it. Their only gate is the update policy, so
// the suite runs on the app_runtime pool, where policies actually fire
function buildApp(): Hono<AppEnv> {
  return createRlsApp(appRuntimeDb)
    .route('/auth', jwtAuthRoutes)
    .route('', productsFeature)
    .route('/ingredients', ingredientRoutes)
}

describe('Demoted contributor loses catalog writes before its token expires', () => {
  let app: Hono<AppEnv>
  let token: string
  let productId: string
  let ingredientId: string

  beforeEach(async () => {
    app = buildApp()

    const { rawEmail, rawPassword } = TEST_CREDENTIALS.toto
    const demoted = await createTestContributorUser(rawEmail, rawPassword)
    token = await loginViaRlsApp(app, rawEmail, rawPassword)
    await testDb.update(users).set({ role: 'user' }).where(eq(users.id, demoted.id))

    const owner = await createTestUser(
      TEST_CREDENTIALS.alice.rawEmail,
      TEST_CREDENTIALS.alice.rawPassword
    )
    // Seeded as 'admin' so both rows land verified: the policy's owner clause cannot fire
    // and the role clause stays the only gate
    const product = await createTestProduct(owner.id, { name: 'Sérum de contrôle' }, 'admin')
    const ingredient = await createTestIngredient(
      owner.id,
      { name: 'Ingrédient de contrôle' },
      'admin'
    )
    productId = product.id
    ingredientId = ingredient.id
  })

  it('PATCH /products/:id owned by someone else is 403', async () => {
    const res = await authPatch(app, `/products/${productId}`, token, {
      name: 'Renommé après rétrogradation',
    })
    await expectError(res, HTTP_STATUS.FORBIDDEN, 'unauthorized_access')
  })

  it('PATCH /ingredients/:id owned by someone else is 403', async () => {
    const res = await authPatch(app, `/ingredients/${ingredientId}`, token, {
      name: 'Renommé après rétrogradation',
    })
    await expectError(res, HTTP_STATUS.FORBIDDEN, 'unauthorized_access')
  })
})
